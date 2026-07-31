import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PILLARS } from '../../services/mockData';
import { getMyLogbooks, getMyLogbookSummary } from '../../services/logbookService';
import { FileText, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

export default function KepsekDashboard() {
  const [logbooks, setLogbooks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [logbookRes, summaryRes] = await Promise.all([
        getMyLogbooks(),
        getMyLogbookSummary(),
      ]);
      setLogbooks(logbookRes.data);
      setSummary(summaryRes);
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Dashboard Kinerja</h1>
          <p style={{ color: 'var(--text-muted)' }}>Pantau progres laporan logbook mingguan Anda.</p>
        </div>
        <Link to="/kepsek/logbook" className="btn btn-indigo">
          <FileText size={18} />
          Isi Logbook Minggu Ini
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 mb-8">
        <div className="glass-panel flex items-center gap-4">
          <div style={{ background: 'rgba(99,102,241,0.12)', padding: '16px', borderRadius: '12px', flexShrink: 0 }}>
            <FileText size={24} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>{summary.total}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Total Laporan</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4">
          <div style={{ background: 'rgba(16,185,129,0.12)', padding: '16px', borderRadius: '12px', flexShrink: 0 }}>
            <CheckCircle size={24} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#34d399' }}>{summary.approved}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Disetujui</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4">
          <div style={{ background: 'rgba(245,158,11,0.12)', padding: '16px', borderRadius: '12px', flexShrink: 0 }}>
            <Clock size={24} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fbbf24' }}>{summary.pending}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Menunggu Validasi</div>
          </div>
        </div>
      </div>

      {/* Tabel Riwayat */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px', fontFamily: 'Outfit' }}>Riwayat Logbook</h2>
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {logbooks.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Belum ada logbook. Mulai isi logbook minggu ini!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Minggu Ke</th>
                <th>Pilar Kebijakan</th>
                <th>Deskripsi Singkat</th>
                <th>Status</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {logbooks.map(log => {
                const pillar = log.pillars || PILLARS.find(p => p.id === log.pillar_id);
                return (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600 }}>Minggu {log.week_number}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: pillar?.color, flexShrink: 0 }} />
                        {pillar?.name}
                      </span>
                    </td>
                    <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)' }}>
                      {log.description}
                    </td>
                    <td>
                      {log.status === 'approved' && <span className="badge badge-emerald">Disetujui</span>}
                      {log.status === 'pending'  && <span className="badge badge-warning">Pending</span>}
                      {log.status === 'rejected' && <span className="badge badge-danger">Ditolak</span>}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.feedback || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
