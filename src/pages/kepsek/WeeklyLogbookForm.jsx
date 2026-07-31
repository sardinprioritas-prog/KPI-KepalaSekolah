import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PILLARS } from '../../services/mockData';
import { UploadCloud, CheckCircle } from 'lucide-react';

export default function WeeklyLogbookForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/kepsek'), 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="glass-panel text-center animate-fade-in" style={{ padding: '60px 20px' }}>
        <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 24px' }} />
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Laporan Berhasil Dikirim!</h2>
        <p className="text-muted">Laporan mingguan Anda telah masuk ke antrean verifikasi Cabdis.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Isi Logbook Mingguan</h1>
        <p className="text-muted">Pilih pilar kebijakan dan laporkan aktivitas Anda minggu ini.</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Minggu Ke-</label>
            <input type="number" className="form-control" defaultValue={3} required />
          </div>

          <div className="form-group">
            <label className="form-label">Pilar Kebijakan</label>
            <select className="form-control" required style={{ cursor: 'pointer' }}>
              <option value="">-- Pilih Pilar Kebijakan --</option>
              {PILLARS.map(p => (
                <option key={p.id} value={p.id}>{p.id}. {p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Kegiatan</label>
            <textarea 
              className="form-control" 
              rows={4} 
              placeholder="Jelaskan secara singkat kegiatan yang telah dilakukan..."
              required
            ></textarea>
          </div>

          <div className="form-group mb-8">
            <label className="form-label">Bukti Fisik (URL Dokumen / Foto / Google Drive)</label>
            <div className="flex items-center gap-4">
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://drive.google.com/..." 
                required 
              />
              <button type="button" className="btn btn-secondary flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                <UploadCloud size={18} />
                Atau Upload
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/kepsek')}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
