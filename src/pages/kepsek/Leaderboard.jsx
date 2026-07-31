import { MOCK_LEADERBOARD } from '../../services/mockData';
import { Award, Trophy } from 'lucide-react';

export default function Leaderboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Peringkat Kinerja (Leaderboard)</h1>
        <p className="text-muted">Kompetisi sehat antar Kepala Sekolah di Cabdis Wilayah III Bone.</p>
      </div>

      <div className="grid grid-cols-1">
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Peringkat</th>
                <th>Nama Kepala Sekolah</th>
                <th>Asal Sekolah</th>
                <th style={{ textAlign: 'right' }}>Total Skor KPI</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD.sort((a, b) => b.score - a.score).map((user, index) => (
                <tr key={user.id}>
                  <td style={{ textAlign: 'center' }}>
                    {index === 0 ? (
                      <Trophy size={24} color="#fbbf24" style={{ margin: '0 auto' }} />
                    ) : index === 1 ? (
                      <Trophy size={24} color="#94a3b8" style={{ margin: '0 auto' }} />
                    ) : index === 2 ? (
                      <Trophy size={24} color="#b45309" style={{ margin: '0 auto' }} />
                    ) : (
                      <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{index + 1}</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{user.name}</div>
                  </td>
                  <td className="text-muted">{user.school}</td>
                  <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>
                    {user.score}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {user.score >= 85 ? (
                      <span className="badge badge-success">Dipertahankan</span>
                    ) : user.score >= 65 ? (
                      <span className="badge badge-warning">Dievaluasi</span>
                    ) : (
                      <span className="badge badge-danger">Pergantian</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
