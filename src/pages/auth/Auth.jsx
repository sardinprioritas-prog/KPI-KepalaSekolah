import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, ShieldCheck, BarChart3, School,
  ChevronLeft, Lock, Mail, ArrowRight, AlertCircle
} from 'lucide-react';
import { supabase } from '../../services/supabase';

const PORTALS = [
  {
    id: 'kepsek',
    label: 'Portal Kepala Sekolah',
    desc: 'Input logbook mingguan & pantau capaian KPI kinerja sekolah Anda',
    icon: GraduationCap,
    color: 'indigo',
    route: '/kepsek',
    btnClass: 'btn-indigo',
    iconBg: 'rgba(99,102,241,0.15)',
    iconBorder: 'rgba(99,102,241,0.3)',
    iconColor: '#818cf8',
  },
  {
    id: 'verifikator',
    label: 'Portal Verifikator',
    desc: 'Validasi & verifikasi logbook kepala sekolah di wilayah binaan',
    icon: ShieldCheck,
    color: 'emerald',
    route: '/verifikator',
    btnClass: 'btn-emerald',
    iconBg: 'rgba(16,185,129,0.15)',
    iconBorder: 'rgba(16,185,129,0.3)',
    iconColor: '#34d399',
  },
  {
    id: 'eksekutif',
    label: 'Portal Eksekutif',
    desc: 'Visualisasi strategis, analytics & cetak laporan rekomendasi',
    icon: BarChart3,
    color: 'purple',
    route: '/eksekutif',
    btnClass: 'btn-purple',
    iconBg: 'rgba(168,85,247,0.15)',
    iconBorder: 'rgba(168,85,247,0.3)',
    iconColor: '#c084fc',
    full: true,
  },
];

export default function Auth() {
  const navigate = useNavigate();
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const portal = PORTALS.find(p => p.id === selectedPortal);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Login dengan Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError('Email atau password salah. Coba lagi.');
      setLoading(false);
      return;
    }

    // 2. Cek role dari tabel profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      setError('Profil pengguna tidak ditemukan. Hubungi administrator.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // 3. Verifikasi role sesuai portal yang dipilih
    if (profile.role !== selectedPortal) {
      setError(`Akun ini bukan ${portal.label}. Silakan pilih portal yang sesuai.`);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // 4. Navigasi ke halaman sesuai role
    navigate(portal.route);
  };

  return (
    <div className="auth-page">
      {/* Hero */}
      <div className="auth-hero animate-fade-in">
        <div className="auth-logo-wrap">
          <School size={36} color="#818cf8" />
        </div>
        <h1 className="auth-title">
          <span className="text-gradient">SI-KAPAL</span>
        </h1>
        <p className="auth-subtitle">
          Sistem Informasi Kinerja Kepala Sekolah — platform monitoring KPI
          terintegrasi Cabang Dinas Wilayah III Bone
        </p>
      </div>

      {/* Portal Cards */}
      <div className="auth-portals">
        {PORTALS.map((p, i) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              className={`portal-card portal-card-${p.color} ${p.full ? 'portal-card-full' : ''} animate-fade-in`}
              style={{ animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
              onClick={() => { setSelectedPortal(p.id); setError(''); setEmail(''); setPassword(''); }}
            >
              <div className="portal-icon-wrap" style={{ background: p.iconBg, border: `1px solid ${p.iconBorder}` }}>
                <Icon size={26} color={p.iconColor} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="portal-card-title">{p.label}</div>
                <div className="portal-card-desc">{p.desc}</div>
              </div>
              <ArrowRight size={18} color={p.iconColor} style={{ opacity: 0.6, flexShrink: 0 }} />
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="auth-footer animate-fade-in animate-delay-3">
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
        Cabang Dinas Pendidikan Wilayah III Bone &nbsp;·&nbsp; Provinsi Sulawesi Selatan
      </div>

      {/* Login Modal */}
      {selectedPortal && portal && (
        <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedPortal(null)}>
          <div className="login-modal">
            <button className="back-btn" onClick={() => setSelectedPortal(null)}>
              <ChevronLeft size={16} /> Kembali ke portal
            </button>

            <div className="login-modal-header">
              <div className="login-modal-icon" style={{ background: portal.iconBg, border: `1px solid ${portal.iconBorder}` }}>
                <portal.icon size={24} color={portal.iconColor} />
              </div>
              <div>
                <div className="label-xs" style={{ color: portal.iconColor, marginBottom: 4 }}>Masuk ke</div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18 }}>{portal.label}</div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, padding: '12px 14px', marginBottom: 20, fontSize: 13, color: '#f87171'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className={`form-control focus-${portal.color}`}
                    style={{ paddingLeft: 40 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`${portal.id}1@sikapal.id`}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className={`form-control focus-${portal.color}`}
                    style={{ paddingLeft: 40 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`btn ${portal.btnClass} w-full`}
                style={{ padding: '13px', fontSize: 15, borderRadius: 12 }}
                disabled={loading}
              >
                {loading ? 'Memverifikasi...' : `Masuk ke ${portal.label}`}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-subtle)' }}>
              Demo: gunakan email &amp; password dari <code style={{ color: 'var(--text-muted)' }}>seed.sql</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
