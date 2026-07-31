import { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from '../../services/supabase';

const ROLE_CONFIG = {
  kepsek: {
    label: 'Kepala Sekolah',
    avatarGradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    initial: 'K',
  },
  verifikator: {
    label: 'Pengawas / Verifikator',
    avatarGradient: 'linear-gradient(135deg, #10b981, #34d399)',
    initial: 'V',
  },
  eksekutif: {
    label: 'Kepala Dinas',
    avatarGradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
    initial: 'E',
  },
};

export default function AppLayout({ allowedRole }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*, schools(*)')
        .eq('id', user.id)
        .single();

      if (!prof || (allowedRole && prof.role !== allowedRole)) {
        await supabase.auth.signOut();
        navigate('/auth');
        return;
      }

      setProfile(prof);
      setLoading(false);
    };

    init();

    // Listen untuk perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') navigate('/auth');
    });

    return () => subscription.unsubscribe();
  }, [allowedRole, navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.2)',
          borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Memuat...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const config = ROLE_CONFIG[profile?.role] || ROLE_CONFIG.kepsek;
  const schoolName = profile?.schools?.name || 'Cabdis Wilayah III Bone';

  return (
    <div className="app-container">
      <Sidebar role={profile?.role} />

      <main className="main-content">
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
              {profile?.full_name || config.label}
            </div>
          </div>

          <div className="user-profile">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{config.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{schoolName}</div>
            </div>
            <div className="avatar" style={{ background: config.avatarGradient }}>
              {(profile?.full_name?.[0] || config.initial).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="animate-fade-in">
          <Outlet context={{ profile }} />
        </div>
      </main>
    </div>
  );
}
