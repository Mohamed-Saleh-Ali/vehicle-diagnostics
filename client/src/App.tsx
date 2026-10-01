import { Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import ComingSoon from './components/ComingSoon';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<ComingSoon title="Parts catalog" note="search and filter workshop parts by category." />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Logged in */}
        <Route element={<ProtectedLayout />}>
          <Route path="diagnose" element={<ComingSoon title="AI diagnosis" note="describe a symptom, get a structured first diagnosis." />} />
          <Route path="diagnoses" element={<ComingSoon title="My diagnoses" note="your saved diagnoses in one place." />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
