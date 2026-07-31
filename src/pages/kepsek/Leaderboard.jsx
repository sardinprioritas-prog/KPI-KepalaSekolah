import { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/profileService';
import { Award, Trophy, Loader2 } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: 'var(--text-muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Memuat data...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Peringkat Kinerja</h1>
        <p style={{ color: 'var(--text-muted)' }}>Kompetisi sehat antar Kepala Sekolah di Cabdis Wilayah III Bone.</p>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {leaderboard.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Award size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Belum ada data leaderboard.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Peringkat</th>
                <th>Nama Kepala Sekolah</th>
                <th>Asal Sekolah</th>
                <th style={{ textAlign: 'center' }}>Laporan</th>
                <th style={{ textAlign: 'right' }}>Skor KPI</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id}>
                  <td style={{ textAlign: 'center' }}>
                    {index === 0 ? <Trophy size={22} color="#fbbf24" style={{ margin: '0 auto' }} />
                     : index === 1 ? <Trophy size={22} color="#94a3b8" style={{ margin: '0 auto' }} />
                     : index === 2 ? <Trophy size={22} color="#b45309" style={{ margin: '0 auto' }} />
                     : <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</span>}
                  </td>
                  <td style={{ fontWeight: 600 }}>{user.full_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{user.school_name || '—'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {user.approved_count}/{user.total_count}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 20, color: '#818cf8' }}>
                    {user.score}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {user.score >= 75 ? <span className="badge badge-emerald">Dipertahankan</span>
                     : user.score >= 50 ? <span className="badge badge-warning">Dievaluasi</span>
                     : <span className="badge badge-danger">Pergantian</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
