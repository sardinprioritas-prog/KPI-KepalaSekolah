import { supabase } from './supabase';

/** Ambil leaderboard kepsek dari view */
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('kepsek_leaderboard')
    .select('*')
    .order('score', { ascending: false });
  return { data: data || [], error };
}

/** Ambil statistik agregat untuk dashboard eksekutif */
export async function getAnalyticsStats() {
  const [kepsekRes, logbookRes, pendingRes, approvedRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'kepsek'),
    supabase.from('logbooks').select('*', { count: 'exact', head: true }),
    supabase.from('logbooks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('logbooks').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
  ]);

  return {
    kepsekTotal: kepsekRes.count || 0,
    logbookTotal: logbookRes.count || 0,
    pendingTotal: pendingRes.count || 0,
    approvedTotal: approvedRes.count || 0,
  };
}

/** Ambil distribusi logbook per pilar (untuk chart radar) */
export async function getLogbooksByPillar() {
  const { data, error } = await supabase
    .from('logbooks')
    .select('pillar_id, status, pillars(name, weight)')
    .eq('status', 'approved');
  return { data: data || [], error };
}

/** Ambil kepsek yang tidak aktif (>= 2 minggu tanpa logbook) */
export async function getInactiveKepsek() {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const { data, error } = await supabase
    .from('kepsek_leaderboard')
    .select('*')
    .lt('total_count', 1);

  return { data: data || [], error };
}
