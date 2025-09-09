import { Routes, Route } from 'react-router-dom';
import App from '../App';
import Landing from '../pages/Landing';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/app" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}
