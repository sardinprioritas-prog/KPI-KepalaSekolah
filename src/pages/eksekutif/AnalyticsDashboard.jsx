import { useState, useEffect } from 'react';
import { PILLARS } from '../../services/mockData';
import { getAnalyticsStats, getLeaderboard, getLogbooksByPillar } from '../../services/profileService';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler
} from 'chart.js';
import { AlertTriangle, Users, FileText, Clock, CheckCircle, Loader2 } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  RadialLinearScale, PointElement, LineElement, Filler
);

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [pillarData, setPillarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, lbRes, pillarRes] = await Promise.all([
        getAnalyticsStats(),
        getLeaderboard(),
        getLogbooksByPillar(),
      ]);
      setStats(statsRes);
      setLeaderboard(lbRes.data);
      setPillarData(pillarRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: 'var(--text-muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Memuat analytics...
      </div>
    );
  }

  // Hitung distribusi logbook per pilar
  const pillarCounts = PILLARS.map(p => ({
    ...p,
    count: pillarData.filter(l => l.pillar_id === p.id).length,
  }));

  const barData = {
    labels: leaderboard.map(u => u.full_name?.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      label: 'Skor KPI',
      data: leaderboard.map(u => u.score),
      backgroundColor: leaderboard.map((_, i) =>
        i === 0 ? 'rgba(99,102,241,0.9)'
        : i === 1 ? 'rgba(168,85,247,0.8)'
        : 'rgba(99,102,241,0.4)'
      ),
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` Skor: ${ctx.raw}` } }
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } }
    }
  };

  const radarData = {
    labels: PILLARS.map(p => p.name.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      label: 'Rata-rata Cabdis',
      data: pillarCounts.map(p => p.count),
      backgroundColor: 'rgba(168,85,247,0.15)',
      borderColor: 'rgba(168,85,247,0.8)',
      borderWidth: 2,
      pointBackgroundColor: '#a855f7',
    }]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        grid: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: { color: '#94a3b8', font: { size: 11 } },
        ticks: { display: false },
      }
    },
    plugins: { legend: { display: false } }
  };

  // Kepsek dengan skor rendah (red flag)
  const redFlags = leaderboard.filter(u => u.total_count === 0 || u.score < 40);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Executive Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pantau keseluruhan kinerja Kepala Sekolah Wilayah III Bone.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 mb-8">
        <div className="stat-card flex items-center gap-3">
          <div style={{ background: 'rgba(99,102,241,0.1)', padding: 12, borderRadius: 10 }}>
            <Users size={20} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.kepsekTotal ?? '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Kepala Sekolah</div>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: 12, borderRadius: 10 }}>
            <CheckCircle size={20} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.approvedTotal ?? '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Laporan Disetujui</div>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: 12, borderRadius: 10 }}>
            <Clock size={20} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.pendingTotal ?? '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Menunggu Validasi</div>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div style={{ background: 'rgba(168,85,247,0.1)', padding: 12, borderRadius: 10 }}>
            <FileText size={20} color="#c084fc" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.logbookTotal ?? '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Laporan</div>
          </div>
        </div>
      </div>

      {/* Red Flag */}
      {redFlags.length > 0 && (
        <div className="glass-panel mb-8" style={{ borderLeft: '3px solid #ef4444', background: 'rgba(239,68,68,0.04)' }}>
          <div className="flex items-center gap-4">
            <AlertTriangle color="#ef4444" size={22} />
            <div>
              <h3 style={{ fontSize: '15px', color: '#f87171', marginBottom: 4 }}>Red Flag Indicator</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {redFlags.length} Kepala Sekolah belum memiliki laporan logbook yang mencukupi:
                {' '}<strong style={{ color: '#fbbf24' }}>{redFlags.map(u => u.full_name?.split(' ').slice(0, 2).join(' ')).join(', ')}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-2">
        <div className="glass-panel">
          <h3 style={{ fontSize: '16px', marginBottom: 20, fontFamily: 'Outfit' }}>Distribusi Skor KPI</h3>
          {leaderboard.length > 0
            ? <Bar data={barData} options={barOptions} height={220} />
            : <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Belum ada data</div>}
        </div>
        <div className="glass-panel">
          <h3 style={{ fontSize: '16px', marginBottom: 20, fontFamily: 'Outfit' }}>Kekuatan 5 Pilar (Distribusi)</h3>
          <div style={{ height: 280, display: 'flex', justifyContent: 'center' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
