import { MOCK_LEADERBOARD, PILLARS } from '../../services/mockData';
import { Bar, Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { AlertTriangle } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  RadialLinearScale, PointElement, LineElement, Filler
);

export default function AnalyticsDashboard() {
  const barData = {
    labels: MOCK_LEADERBOARD.map(u => u.name),
    datasets: [
      {
        label: 'Skor KPI Keseluruhan',
        data: MOCK_LEADERBOARD.map(u => u.score),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  const radarData = {
    labels: PILLARS.map(p => p.name),
    datasets: [
      {
        label: 'Rata-rata Cabdis',
        data: [85, 70, 90, 60, 50],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#94a3b8', font: { size: 11 } },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Executive Analytics</h1>
          <p className="text-muted">Pantau keseluruhan kinerja Kepala Sekolah Wilayah III Bone.</p>
        </div>
      </div>

      <div className="glass-panel mb-8 border-l-4" style={{ borderLeftColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
        <div className="flex items-center gap-4">
          <AlertTriangle color="var(--danger)" size={24} />
          <div>
            <h3 style={{ fontSize: '16px', color: 'var(--danger)' }}>Red Flag Indicator</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Terdapat 1 Kepala Sekolah yang tidak mengisi logbook selama 2 minggu berturut-turut (Andi Mappanyukki - SMAN 5 Bone).</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Distribusi Skor KPI</h3>
          <Bar data={barData} options={barOptions} height={200} />
        </div>
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Kekuatan 5 Pilar (Rata-rata)</h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
