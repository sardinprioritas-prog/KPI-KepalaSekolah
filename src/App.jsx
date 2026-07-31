import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import AppLayout from './components/layout/AppLayout';

// Kepsek Pages
import KepsekDashboard from './pages/kepsek/Dashboard';
import WeeklyLogbookForm from './pages/kepsek/WeeklyLogbookForm';
import Leaderboard from './pages/kepsek/Leaderboard';

// Verifikator Pages
import ValidationPanel from './pages/verifikator/ValidationPanel';

// Eksekutif Pages
import AnalyticsDashboard from './pages/eksekutif/AnalyticsDashboard';
import RecommendationReport from './pages/eksekutif/RecommendationReport';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />

      {/* Kepsek Routes */}
      <Route path="/kepsek" element={<AppLayout allowedRole="kepsek" />}>
        <Route index element={<KepsekDashboard />} />
        <Route path="logbook" element={<WeeklyLogbookForm />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>

      {/* Verifikator Routes */}
      <Route path="/verifikator" element={<AppLayout allowedRole="verifikator" />}>
        <Route index element={<ValidationPanel />} />
      </Route>

      {/* Eksekutif Routes */}
      <Route path="/eksekutif" element={<AppLayout allowedRole="eksekutif" />}>
        <Route index element={<AnalyticsDashboard />} />
        <Route path="rekomendasi" element={<RecommendationReport />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;
