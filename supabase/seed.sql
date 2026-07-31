-- ============================================================
-- KPI Kepala Sekolah — Seed Data Demo
-- Jalankan SETELAH 001_initial_schema.sql
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── 1. PILAR KPI ─────────────────────────────────────────
INSERT INTO public.pillars (id, name, weight, color) VALUES
  (1, 'Peningkatan Mutu Pembelajaran',  25, '#6366f1'),
  (2, 'Penguatan Karakter Siswa',        20, '#a855f7'),
  (3, 'Peningkatan Kompetensi Guru',     20, '#10b981'),
  (4, 'Tata Kelola Sekolah',             20, '#f59e0b'),
  (5, 'Digitalisasi Pendidikan',         15, '#ef4444')
ON CONFLICT (id) DO NOTHING;

-- ─── 2. SEKOLAH ───────────────────────────────────────────
INSERT INTO public.schools (id, name, npsn, cabdis_region) VALUES
  ('11111111-1111-1111-1111-111111111111', 'SMAN 1 Bone',  '40300001', 'Wilayah III Bone'),
  ('22222222-2222-2222-2222-222222222222', 'SMKN 2 Bone',  '40300002', 'Wilayah III Bone'),
  ('33333333-3333-3333-3333-333333333333', 'SMAN 3 Bone',  '40300003', 'Wilayah III Bone'),
  ('44444444-4444-4444-4444-444444444444', 'SMAN 5 Bone',  '40300005', 'Wilayah III Bone')
ON CONFLICT (id) DO NOTHING;

-- ─── 3. USER DEMO (auth.users) ────────────────────────────
-- Password semua akun: sikapal123
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  is_super_admin, confirmation_token, recovery_token
)
VALUES
  -- Kepala Sekolah 1
  (
    '00000000-0000-0000-0000-000000000000',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'authenticated', 'authenticated',
    'kepsek1@sikapal.id',
    crypt('sikapal123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Drs. Ahmad Dahlan, M.Pd","role":"kepsek"}',
    now(), now(), false, '', ''
  ),
  -- Kepala Sekolah 2
  (
    '00000000-0000-0000-0000-000000000000',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'authenticated', 'authenticated',
    'kepsek2@sikapal.id',
    crypt('sikapal123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Hj. Siti Aminah, M.Pd","role":"kepsek"}',
    now(), now(), false, '', ''
  ),
  -- Kepala Sekolah 3
  (
    '00000000-0000-0000-0000-000000000000',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'authenticated', 'authenticated',
    'kepsek3@sikapal.id',
    crypt('sikapal123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Budi Santoso, S.Pd","role":"kepsek"}',
    now(), now(), false, '', ''
  ),
  -- Verifikator / Pengawas
  (
    '00000000-0000-0000-0000-000000000000',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'authenticated', 'authenticated',
    'verifikator@sikapal.id',
    crypt('sikapal123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Pengawas Cabdis III","role":"verifikator"}',
    now(), now(), false, '', ''
  ),
  -- Eksekutif / Kadisdik
  (
    '00000000-0000-0000-0000-000000000000',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'authenticated', 'authenticated',
    'kadisdik@sikapal.id',
    crypt('sikapal123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Dr. H. Kepala Dinas","role":"eksekutif"}',
    now(), now(), false, '', ''
  )
ON CONFLICT (id) DO NOTHING;

-- ─── 4. UPDATE PROFILE dengan school_id ───────────────────
UPDATE public.profiles SET
  school_id = '11111111-1111-1111-1111-111111111111',
  nip = '197001011995031001'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

UPDATE public.profiles SET
  school_id = '22222222-2222-2222-2222-222222222222',
  nip = '197205152000122002'
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

UPDATE public.profiles SET
  school_id = '33333333-3333-3333-3333-333333333333',
  nip = '198303202009021003'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- ─── 5. LOGBOOK CONTOH ────────────────────────────────────
INSERT INTO public.logbooks (kepsek_id, pillar_id, week_number, year, description, evidence_url, status, feedback, verifikator_id, verified_at)
VALUES
  -- Ahmad Dahlan — Approved
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 1, 2026,
   'Melaksanakan supervisi akademik terhadap 5 guru pada minggu pertama semester',
   'https://drive.google.com/file/d/example1', 'approved',
   'Bukti sangat lengkap, pertahankan kinerja!',
   'dddddddd-dddd-dddd-dddd-dddddddddddd', now() - interval '5 days'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 2, 2026,
   'Mengadakan workshop peningkatan kompetensi guru dalam penggunaan media digital',
   'https://drive.google.com/file/d/example2', 'approved',
   'Kegiatan sangat relevan dan terdokumentasi dengan baik.',
   'dddddddd-dddd-dddd-dddd-dddddddddddd', now() - interval '3 days'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 3, 2026,
   'Mengaktifkan platform Merdeka Mengajar (PMM) untuk seluruh guru',
   'https://drive.google.com/file/d/example3', 'pending', '', null, null),

  -- Siti Aminah — Mixed
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 1, 2026,
   'Melaksanakan kegiatan penguatan profil pelajar Pancasila melalui projek P5',
   'https://drive.google.com/file/d/example4', 'approved',
   'Dokumentasi lengkap dan kegiatan berdampak.',
   'dddddddd-dddd-dddd-dddd-dddddddddddd', now() - interval '4 days'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 4, 2, 2026,
   'Rapat koordinasi dengan komite sekolah untuk penyusunan RKAS tahun ajaran baru',
   'https://drive.google.com/file/d/example5', 'pending', '', null, null),

  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 3, 2026,
   'Pelaksanaan try out persiapan ujian nasional untuk kelas XII',
   'https://drive.google.com/file/d/example6', 'pending', '', null, null),

  -- Budi Santoso — Sedikit laporan (red flag)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 4, 1, 2026,
   'Penyusunan jadwal piket guru dan pengelolaan administrasi sekolah',
   'https://drive.google.com/file/d/example7', 'rejected',
   'Bukti fisik tidak tersedia, mohon upload ulang dokumen pendukung.',
   'dddddddd-dddd-dddd-dddd-dddddddddddd', now() - interval '6 days')
ON CONFLICT DO NOTHING;
