import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const ROLE_CONFIG = {
  kepsek: {
    label: 'Kepala Sekolah',
    sublabel: 'Cabdis Wilayah III Bone',
    avatarGradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    initial: 'K',
    titleColor: '#818cf8',
  },
  verifikator: {
    label: 'Pengawas / Verifikator',
    sublabel: 'Cabdis Wilayah III Bone',
    avatarGradient: 'linear-gradient(135deg, #10b981, #34d399)',
    initial: 'V',
    titleColor: '#34d399',
  },
  eksekutif: {
    label: 'Kepala Dinas',
    sublabel: 'Dinas Pendidikan Prov. Sulsel',
    avatarGradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
    initial: 'E',
    titleColor: '#c084fc',
  },
};

export default function AppLayout({ allowedRole }) {
  const userStr = localStorage.getItem('user');

  if (!userStr) return <Navigate to="/auth" />;

  const user = JSON.parse(userStr);

  if (allowedRole && user.role !== allowedRole) return <Navigate to="/auth" />;

  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.kepsek;

  return (
    <div className="app-container">
      <Sidebar role={user.role} />

      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div>
            <div className="topbar-title">Selamat datang kembali,</div>
            <div
              className="topbar-role"
              style={{
                background: config.avatarGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {config.label}
            </div>
          </div>

          <div className="user-profile">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Demo User</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {config.sublabel}
              </div>
            </div>
            <div
              className="avatar"
              style={{ background: config.avatarGradient }}
            >
              {config.initial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
