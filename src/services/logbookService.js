import { supabase } from './supabase';

/** ─── KEPSEK ─────────────────────────────────────────── */

/** Ambil logbook milik kepsek yang sedang login */
export async function getMyLogbooks() {
  const { data, error } = await supabase
    .from('logbooks')
    .select('*, pillars(*)')
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

/** Kirim logbook baru */
export async function submitLogbook({ pillar_id, week_number, year, description, evidence_url }) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('logbooks')
    .insert({
      kepsek_id: user.id,
      pillar_id: Number(pillar_id),
      week_number: Number(week_number),
      year: year || new Date().getFullYear(),
      description,
      evidence_url,
      status: 'pending',
    })
    .select()
    .single();
  return { data, error };
}

/** Ringkasan logbook untuk dashboard kepsek */
export async function getMyLogbookSummary() {
  const { data, error } = await supabase
    .from('logbooks')
    .select('status');

  if (error) return { total: 0, approved: 0, pending: 0, rejected: 0 };

  const total = data.length;
  const approved = data.filter(l => l.status === 'approved').length;
  const pending = data.filter(l => l.status === 'pending').length;
  const rejected = data.filter(l => l.status === 'rejected').length;

  return { total, approved, pending, rejected };
}

/** ─── VERIFIKATOR ────────────────────────────────────── */

/** Ambil semua logbook pending untuk divalidasi */
export async function getPendingLogbooks() {
  const { data, error } = await supabase
    .from('logbooks')
    .select(`
      *,
      pillars(*),
      profiles!kepsek_id(full_name, nip, schools(name))
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  return { data: data || [], error };
}

/** Approve atau reject logbook */
export async function updateLogbookStatus(id, status, feedback = '') {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('logbooks')
    .update({
      status,
      feedback,
      verifikator_id: user.id,
      verified_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/** ─── EKSEKUTIF ──────────────────────────────────────── */

/** Ambil semua logbook (eksekutif) */
export async function getAllLogbooks() {
  const { data, error } = await supabase
    .from('logbooks')
    .select(`
      *,
      pillars(*),
      profiles!kepsek_id(full_name, schools(name))
    `)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}
