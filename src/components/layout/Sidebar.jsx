import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ship, LayoutDashboard, FileText, BarChart2, CheckSquare, LogOut, Award } from 'lucide-react';

export default function Sidebar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const getNavItems = () => {
    if (role === 'kepsek') {
      return [
        { path: '/kepsek', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/kepsek/logbook', icon: FileText, label: 'Isi Logbook' },
        { path: '/kepsek/leaderboard', icon: Award, label: 'Peringkat Sekolah' },
      ];
    }
    if (role === 'verifikator') {
      return [
        { path: '/verifikator', icon: CheckSquare, label: 'Validasi Logbook' },
      ];
    }
    if (role === 'eksekutif') {
      return [
        { path: '/eksekutif', icon: BarChart2, label: 'Executive Analytics' },
        { path: '/eksekutif/rekomendasi', icon: FileText, label: 'Cetak Rekomendasi' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', borderRadius: '8px', width: '40px', height: '40px' }}>
          <Ship size={24} color="white" />
        </div>
        <span className="text-gradient">SI-KAPAL</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <button 
          onClick={handleLogout}
          className="nav-item" 
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
