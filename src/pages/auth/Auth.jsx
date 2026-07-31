import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, BarChart3, School, ChevronLeft, Lock, User, ArrowRight } from 'lucide-react';

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
    accentColor: '#6366f1',
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
    accentColor: '#10b981',
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
    accentColor: '#a855f7',
    full: true,
  },
];

export default function Auth() {
  const navigate = useNavigate();
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [username, setUsername] = useState('demo@sikapal.id');
  const [password, setPassword] = useState('password');

  const portal = PORTALS.find(p => p.id === selectedPortal);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ role: selectedPortal }));
    navigate(portal.route);
  };

  return (
    <div className="auth-page">
      {/* Hero Header */}
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
              onClick={() => setSelectedPortal(p.id)}
            >
              <div
                className="portal-icon-wrap"
                style={{
                  background: p.iconBg,
                  border: `1px solid ${p.iconBorder}`,
                }}
              >
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
        <div
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#10b981', boxShadow: '0 0 8px #10b981'
          }}
        />
        Cabang Dinas Pendidikan Wilayah III Bone &nbsp;·&nbsp; Provinsi Sulawesi Selatan
      </div>

      {/* Login Modal */}
      {selectedPortal && portal && (
        <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedPortal(null)}>
          <div className="login-modal">
            {/* Back button */}
            <button className="back-btn" onClick={() => setSelectedPortal(null)}>
              <ChevronLeft size={16} />
              Kembali ke portal
            </button>

            {/* Modal Header */}
            <div className="login-modal-header">
              <div
                className="login-modal-icon"
                style={{ background: portal.iconBg, border: `1px solid ${portal.iconBorder}` }}
              >
                {<portal.icon size={24} color={portal.iconColor} />}
              </div>
              <div>
                <div className="label-xs" style={{ color: portal.iconColor, marginBottom: 4 }}>
                  Masuk ke
                </div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18 }}>
                  {portal.label}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email / NIP</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    className={`form-control focus-${portal.color}`}
                    style={{ paddingLeft: 40 }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan NIP atau Email"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    className={`form-control focus-${portal.color}`}
                    style={{ paddingLeft: 40 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`btn ${portal.btnClass} w-full`}
                style={{ padding: '13px', fontSize: 15, borderRadius: 12 }}
              >
                Masuk ke {portal.label}
                <ArrowRight size={17} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-subtle)' }}>
              Mode demo — gunakan data default yang sudah terisi
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
