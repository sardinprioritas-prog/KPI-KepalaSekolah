import { useState, useEffect } from 'react';
import { PILLARS } from '../../services/mockData';
import { getPendingLogbooks, updateLogbookStatus } from '../../services/logbookService';
import { CheckSquare, XCircle, ExternalLink, Loader2, MessageSquare } from 'lucide-react';

export default function ValidationPanel() {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data } = await getPendingLogbooks();
    setLogbooks(data);
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    setProcessing(id + status);
    const { error } = await updateLogbookStatus(id, status, feedback[id] || '');
    if (!error) {
      setLogbooks(prev => prev.filter(l => l.id !== id));
    }
    setProcessing(null);
  };

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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Panel Validasi</h1>
          <p style={{ color: 'var(--text-muted)' }}>Periksa dan validasi laporan mingguan dari Kepala Sekolah.</p>
        </div>
        {logbooks.length > 0 && (
          <span className="badge badge-warning" style={{ fontSize: 14, padding: '6px 14px' }}>
            {logbooks.length} Menunggu
          </span>
        )}
      </div>

      {logbooks.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <CheckSquare size={64} color="#34d399" style={{ margin: '0 auto 24px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
            Semua laporan sudah tervalidasi. 🎉
          </h2>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {logbooks.map(log => {
            const pillar = log.pillars || PILLARS.find(p => p.id === log.pillar_id);
            const kepsekName = log.profiles?.full_name || `Kepsek ID: ${log.kepsek_id.slice(0, 8)}`;
            const schoolName = log.profiles?.schools?.name || '—';

            return (
              <div key={log.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div className="flex justify-between items-start" style={{ paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: 4 }}>{kepsekName}</h3>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {schoolName} · Laporan Minggu {log.week_number}/{log.year}
                    </div>
                  </div>
                  <span className="badge badge-warning">Menunggu Validasi</span>
                </div>

                {/* Pilar */}
                <div>
                  <div className="label-xs" style={{ marginBottom: 6 }}>Pilar Kebijakan</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: pillar?.color }} />
                    {pillar?.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Bobot: {pillar?.weight}%)</span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <div className="label-xs" style={{ marginBottom: 6 }}>Deskripsi Kegiatan</div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px 16px', borderRadius: 10, fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>
                    {log.description}
                  </div>
                </div>

                {/* Bukti */}
                <div>
                  <div className="label-xs" style={{ marginBottom: 6 }}>Bukti Fisik</div>
                  <a href={log.evidence_url} target="_blank" rel="noreferrer"
                     className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ExternalLink size={15} /> Buka Dokumen Bukti
                  </a>
                </div>

                {/* Feedback */}
                <div>
                  <div className="label-xs" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={12} />
                    Catatan Verifikasi (Opsional)
                  </div>
                  <textarea
                    className="form-control focus-emerald"
                    rows={2}
                    placeholder="Tulis catatan atau feedback untuk Kepala Sekolah..."
                    value={feedback[log.id] || ''}
                    onChange={e => setFeedback(prev => ({ ...prev, [log.id]: e.target.value }))}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4" style={{ paddingTop: 4 }}>
                  <button
                    onClick={() => handleAction(log.id, 'approved')}
                    className="btn btn-emerald"
                    style={{ flex: 1 }}
                    disabled={processing === log.id + 'approved'}
                  >
                    <CheckSquare size={18} />
                    {processing === log.id + 'approved' ? 'Memproses...' : 'Approve & Berikan Poin'}
                  </button>
                  <button
                    onClick={() => handleAction(log.id, 'rejected')}
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                    disabled={processing === log.id + 'rejected'}
                  >
                    <XCircle size={18} />
                    {processing === log.id + 'rejected' ? 'Memproses...' : 'Tolak & Kembalikan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
