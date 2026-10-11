import { Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import AdminLayout from './layouts/AdminLayout';
import CatalogPage from './pages/CatalogPage';
import PartDetailsPage from './pages/PartDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiagnosePage from './pages/DiagnosePage';
import DiagnosesPage from './pages/DiagnosesPage';
import DiagnosisDetailsPage from './pages/DiagnosisDetailsPage';
import ManagePartsPage from './pages/ManagePartsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route index element={<CatalogPage />} />
        <Route path="parts/:id" element={<PartDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Logged in */}
        <Route element={<ProtectedLayout />}>
          <Route path="diagnose" element={<DiagnosePage />} />
          <Route path="diagnoses" element={<DiagnosesPage />} />
          <Route path="diagnoses/:id" element={<DiagnosisDetailsPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<AdminLayout />}>
          <Route path="admin/parts" element={<ManagePartsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
