import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout({ allowedRole }) {
  // Simple check for role from localStorage
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/auth" />;
  }

  const user = JSON.parse(userStr);
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/auth" />;
  }

  const getRoleLabel = () => {
    switch (user.role) {
      case 'kepsek': return 'Kepala Sekolah';
      case 'verifikator': return 'Tim Verifikator';
      case 'eksekutif': return 'Kepala Dinas';
      default: return 'User';
    }
  };

  return (
    <div className="app-container">
      <Sidebar role={user.role} />
      
      <main className="main-content">
        <header className="topbar">
          <div>
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-muted)' }}>
              Selamat datang kembali,
            </h2>
            <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '500' }}>
              Mode: {getRoleLabel()}
            </div>
          </div>
          
          <div className="user-profile">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Drs. H. Andi Admin</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cabdis Wilayah III Bone</div>
            </div>
            <div className="avatar">A</div>
          </div>
        </header>

        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
