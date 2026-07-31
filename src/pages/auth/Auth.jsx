import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react'; // Menggunakan ikon Ship untuk logo SI-KAPAL

export default function Auth() {
  const navigate = useNavigate();
  const [role, setRole] = useState('kepsek');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login by saving role to localStorage
    localStorage.setItem('user', JSON.stringify({ role }));
    
    if (role === 'kepsek') navigate('/kepsek');
    if (role === 'verifikator') navigate('/verifikator');
    if (role === 'eksekutif') navigate('/eksekutif');
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--primary-glow)', borderRadius: '50%', marginBottom: '16px' }}>
            <Ship size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>SI-KAPAL</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sistem Informasi Kinerja Kepala Sekolah</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Masuk Sebagai</label>
            <select 
              className="form-control" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="kepsek">Kepala Sekolah</option>
              <option value="verifikator">Pengawas / Cabdis (Verifikator)</option>
              <option value="eksekutif">Kadisdik (Eksekutif)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email / NIP (Demo)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Masukkan NIP" 
              defaultValue="demo@sikapal.id"
            />
          </div>

          <div className="form-group mb-8">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              defaultValue="password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ padding: '12px' }}>
            Masuk ke Sistem
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Cabang Dinas Wilayah III Bone
        </div>
      </div>
    </div>
  );
}
