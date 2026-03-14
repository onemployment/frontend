import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import App from '../App';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AppShell from '../components/layout/AppShell';
import HomePage from '../pages/HomePage';
import ResumeBuilderPage from '../pages/ResumeBuilderPage';

export function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="resume-builder" element={<ResumeBuilderPage />} />
        </Route>
      </Route>
      <Route path="*" element={<App />} />
    </Routes>
  );
}
