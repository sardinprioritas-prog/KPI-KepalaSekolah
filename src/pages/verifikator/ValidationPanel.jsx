import { useState } from 'react';
import { PILLARS, MOCK_LOGBOOKS } from '../../services/mockData';
import { CheckSquare, XCircle, ExternalLink } from 'lucide-react';

export default function ValidationPanel() {
  const [logbooks, setLogbooks] = useState(MOCK_LOGBOOKS.filter(l => l.status === 'pending'));

  const handleAction = (id, action) => {
    // In a real app, this would call Supabase update
    setLogbooks(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Panel Validasi</h1>
        <p className="text-muted">Periksa dan validasi laporan mingguan dari Kepala Sekolah.</p>
      </div>

      {logbooks.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <CheckSquare size={64} color="var(--success)" style={{ margin: '0 auto 24px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '20px', color: 'var(--text-muted)' }}>Tidak ada laporan yang menunggu validasi.</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {logbooks.map(log => {
            const pillar = PILLARS.find(p => p.id === log.pillar_id);
            return (
              <div key={log.id} className="glass-panel flex flex-col gap-4">
                <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Kepala Sekolah ID: {log.kepsek_id}</h3>
                    <div className="text-muted" style={{ fontSize: '14px' }}>Laporan Minggu {log.week_number}</div>
                  </div>
                  <span className="badge badge-warning">Menunggu Validasi</span>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Pilar Kebijakan
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: pillar?.color }}></span>
                    {pillar?.name} (Bobot: {pillar?.weight}%)
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Deskripsi Kegiatan
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                    {log.description}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Bukti Fisik
                  </div>
                  <a href={log.evidence_url} target="_blank" rel="noreferrer" className="btn btn-secondary flex items-center gap-2" style={{ display: 'inline-flex' }}>
                    <ExternalLink size={16} /> Buka Dokumen Bukti
                  </a>
                </div>

                <div className="flex gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => handleAction(log.id, 'approve')} className="btn btn-success flex-1">
                    <CheckSquare size={18} /> Approve & Berikan Poin
                  </button>
                  <button onClick={() => handleAction(log.id, 'reject')} className="btn btn-danger flex-1">
                    <XCircle size={18} /> Reject (Kembalikan)
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
