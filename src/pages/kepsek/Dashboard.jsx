import { Link } from 'react-router-dom';
import { PILLARS, MOCK_LOGBOOKS } from '../../services/mockData';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export default function KepsekDashboard() {
  const approvedLogbooks = MOCK_LOGBOOKS.filter(l => l.status === 'approved').length;
  const pendingLogbooks = MOCK_LOGBOOKS.filter(l => l.status === 'pending').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Dashboard Kinerja</h1>
          <p className="text-muted">Pantau progres laporan logbook mingguan Anda.</p>
        </div>
        <Link to="/kepsek/logbook" className="btn btn-primary">
          <FileText size={18} />
          Isi Logbook Minggu Ini
        </Link>
      </div>

      <div className="grid grid-cols-3 mb-8">
        <div className="glass-panel flex items-center gap-4">
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '12px' }}>
            <FileText size={24} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{MOCK_LOGBOOKS.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Laporan</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4">
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px' }}>
            <CheckCircle size={24} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{approvedLogbooks}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Disetujui</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4">
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '12px' }}>
            <Clock size={24} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{pendingLogbooks}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Menunggu Validasi</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Riwayat Logbook</h2>
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Minggu Ke</th>
              <th>Pilar Kebijakan</th>
              <th>Deskripsi Singkat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGBOOKS.map(log => {
              const pillar = PILLARS.find(p => p.id === log.pillar_id);
              return (
                <tr key={log.id}>
                  <td>Minggu {log.week_number}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pillar?.color }}></span>
                      {pillar?.name}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.description}
                  </td>
                  <td>
                    {log.status === 'approved' ? (
                      <span className="badge badge-success">Disetujui</span>
                    ) : log.status === 'pending' ? (
                      <span className="badge badge-warning">Pending</span>
                    ) : (
                      <span className="badge badge-danger">Ditolak</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
