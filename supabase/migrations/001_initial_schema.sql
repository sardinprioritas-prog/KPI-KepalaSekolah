-- ============================================================
-- KPI Kepala Sekolah — Initial Database Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable pgcrypto untuk password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── TABEL SEKOLAH ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schools (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  npsn          text UNIQUE,
  cabdis_region text NOT NULL DEFAULT 'Wilayah III Bone',
  address       text,
  created_at    timestamptz DEFAULT now()
);

-- ─── TABEL PILAR KPI ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pillars (
  id     integer PRIMARY KEY,
  name   text    NOT NULL,
  weight integer NOT NULL CHECK (weight > 0 AND weight <= 100),
  color  text    NOT NULL
);

-- ─── TABEL PROFIL USER ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name  text NOT NULL,
  nip        text,
  role       text NOT NULL CHECK (role IN ('kepsek', 'verifikator', 'eksekutif')),
  school_id  uuid REFERENCES public.schools,
  created_at timestamptz DEFAULT now()
);

-- ─── TABEL LOGBOOK ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.logbooks (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kepsek_id      uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  pillar_id      integer NOT NULL REFERENCES public.pillars,
  week_number    integer NOT NULL CHECK (week_number BETWEEN 1 AND 52),
  year           integer NOT NULL DEFAULT EXTRACT(year FROM now()),
  description    text NOT NULL,
  evidence_url   text NOT NULL,
  status         text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback       text DEFAULT '',
  verifikator_id uuid REFERENCES public.profiles,
  verified_at    timestamptz,
  created_at     timestamptz DEFAULT now()
);

-- ─── VIEW LEADERBOARD ─────────────────────────────────────
CREATE OR REPLACE VIEW public.kepsek_leaderboard
WITH (security_invoker = false) AS
SELECT
  p.id,
  p.full_name,
  s.name                                                    AS school_name,
  COUNT(l.id)                                               AS total_count,
  COUNT(l.id) FILTER (WHERE l.status = 'approved')          AS approved_count,
  COUNT(l.id) FILTER (WHERE l.status = 'pending')           AS pending_count,
  ROUND(
    COALESCE(
      COUNT(l.id) FILTER (WHERE l.status = 'approved')::numeric
      / GREATEST(COUNT(l.id)::numeric, 1) * 100,
      0
    )
  )                                                         AS score
FROM public.profiles p
LEFT JOIN public.schools s  ON s.id = p.school_id
LEFT JOIN public.logbooks l ON l.kepsek_id = p.id
WHERE p.role = 'kepsek'
GROUP BY p.id, p.full_name, s.name
ORDER BY score DESC;

-- ─── ROW LEVEL SECURITY ───────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillars  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logbooks ENABLE ROW LEVEL SECURITY;

-- Profiles: semua authenticated user bisa baca
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Schools: semua authenticated user bisa baca
CREATE POLICY "schools_select" ON public.schools
  FOR SELECT USING (auth.role() = 'authenticated');

-- Pillars: semua authenticated user bisa baca
CREATE POLICY "pillars_select" ON public.pillars
  FOR SELECT USING (auth.role() = 'authenticated');

-- Logbooks: kepsek lihat milik sendiri; verifikator & eksekutif lihat semua
CREATE POLICY "logbooks_select" ON public.logbooks
  FOR SELECT USING (
    auth.uid() = kepsek_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('verifikator', 'eksekutif')
    )
  );

-- Logbooks: hanya kepsek yang bisa insert logbooknya sendiri
CREATE POLICY "logbooks_insert_kepsek" ON public.logbooks
  FOR INSERT WITH CHECK (
    auth.uid() = kepsek_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'kepsek'
    )
  );

-- Logbooks: verifikator bisa update status
CREATE POLICY "logbooks_update_verifikator" ON public.logbooks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'verifikator'
    )
  );

-- ─── TRIGGER: AUTO-CREATE PROFILE SAAT USER BARU ──────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'kepsek')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant view access
GRANT SELECT ON public.kepsek_leaderboard TO authenticated;
GRANT SELECT ON public.kepsek_leaderboard TO anon;
