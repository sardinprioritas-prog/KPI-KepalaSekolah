import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PILLARS } from '../../services/mockData';
import { submitLogbook } from '../../services/logbookService';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function WeeklyLogbookForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    week_number: new Date().getDay() === 0
      ? Math.ceil(new Date().getDate() / 7)
      : Math.ceil(new Date().getDate() / 7),
    pillar_id: '',
    description: '',
    evidence_url: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: submitError } = await submitLogbook({
      pillar_id: Number(form.pillar_id),
      week_number: Number(form.week_number),
      year: new Date().getFullYear(),
      description: form.description,
      evidence_url: form.evidence_url,
    });

    if (submitError) {
      setError(submitError.message || 'Gagal mengirim laporan. Coba lagi.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/kepsek'), 2000);
  };

  if (success) {
    return (
      <div className="glass-panel text-center animate-fade-in" style={{ padding: '60px 20px', maxWidth: 500, margin: '0 auto' }}>
        <CheckCircle size={64} color="#34d399" style={{ margin: '0 auto 24px' }} />
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Laporan Berhasil Dikirim!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Logbook Anda telah masuk ke antrean verifikasi Cabdis.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Isi Logbook Mingguan</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pilih pilar kebijakan dan laporkan aktivitas Anda minggu ini.</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px' }}>
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 24, fontSize: 13, color: '#f87171'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 mb-4" style={{ gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Minggu Ke-</label>
              <input
                type="number"
                name="week_number"
                className="form-control focus-indigo"
                value={form.week_number}
                onChange={handleChange}
                min={1} max={52}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tahun</label>
              <input
                type="number"
                className="form-control focus-indigo"
                defaultValue={new Date().getFullYear()}
                readOnly
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pilar Kebijakan</label>
            <select
              name="pillar_id"
              className="form-control focus-indigo"
              value={form.pillar_id}
              onChange={handleChange}
              required
              style={{ cursor: 'pointer' }}
            >
              <option value="">-- Pilih Pilar Kebijakan --</option>
              {PILLARS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.id}. {p.name} (Bobot: {p.weight}%)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Kegiatan</label>
            <textarea
              name="description"
              className="form-control focus-indigo"
              rows={4}
              placeholder="Jelaskan secara singkat kegiatan yang telah dilakukan..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-8">
            <label className="form-label">Bukti Fisik (URL Dokumen / Google Drive)</label>
            <div className="flex items-center gap-4">
              <input
                type="url"
                name="evidence_url"
                className="form-control focus-indigo"
                placeholder="https://drive.google.com/file/d/..."
                value={form.evidence_url}
                onChange={handleChange}
                required
              />
              <button type="button" className="btn btn-secondary flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                <UploadCloud size={18} />
                Upload
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/kepsek')}>
              Batal
            </button>
            <button type="submit" className="btn btn-indigo" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
