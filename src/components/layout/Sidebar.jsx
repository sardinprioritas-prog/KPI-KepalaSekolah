import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  School, LayoutDashboard, FileText, BarChart3,
  CheckSquare, LogOut, Award, ShieldCheck, GraduationCap
} from 'lucide-react';
import { supabase } from '../../services/supabase';

const ROLE_CONFIG = {
  kepsek: {
    color: '#818cf8',
    accentClass: 'active-indigo',
    iconBg: 'rgba(99,102,241,0.15)',
    iconBorder: 'rgba(99,102,241,0.3)',
    iconColor: '#818cf8',
    logoGradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    label: 'Kepala Sekolah',
    Icon: GraduationCap,
  },
  verifikator: {
    color: '#34d399',
    accentClass: 'active-emerald',
    iconBg: 'rgba(16,185,129,0.15)',
    iconBorder: 'rgba(16,185,129,0.3)',
    iconColor: '#34d399',
    logoGradient: 'linear-gradient(135deg, #10b981, #34d399)',
    label: 'Verifikator',
    Icon: ShieldCheck,
  },
  eksekutif: {
    color: '#c084fc',
    accentClass: 'active-purple',
    iconBg: 'rgba(168,85,247,0.15)',
    iconBorder: 'rgba(168,85,247,0.3)',
    iconColor: '#c084fc',
    logoGradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
    label: 'Eksekutif',
    Icon: BarChart3,
  },
};

export default function Sidebar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.kepsek;
  const RoleIcon = config.Icon;

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
        { path: '/eksekutif', icon: BarChart3, label: 'Executive Analytics' },
        { path: '/eksekutif/rekomendasi', icon: FileText, label: 'Cetak Rekomendasi' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div
          className="sidebar-logo-icon"
          style={{
            background: config.iconBg,
            border: `1px solid ${config.iconBorder}`,
          }}
        >
          <School size={22} color={config.iconColor} />
        </div>
        <span
          style={{
            background: config.logoGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SI-KAPAL
        </span>
      </div>

      {/* Role Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 12px',
          borderRadius: 10,
          background: config.iconBg,
          border: `1px solid ${config.iconBorder}`,
          marginBottom: 24,
        }}
      >
        <RoleIcon size={15} color={config.iconColor} />
        <span style={{ fontSize: 12, fontWeight: 600, color: config.iconColor }}>
          {config.label}
        </span>
      </div>

      {/* Nav Section Label */}
      <div className="sidebar-section-label">Menu Utama</div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? config.accentClass : ''}`}
            >
              <Icon size={18} color={isActive ? config.iconColor : 'currentColor'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider + Logout */}
      <div>
        <div className="sidebar-divider" />
        <button className="nav-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
