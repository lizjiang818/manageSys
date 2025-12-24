import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { OrganizationPage } from './pages/OrganizationPage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/organization'} replace /> : <Login />} />
      <Route
        path="/organization"
        element={
          <ProtectedRoute requiredRole="user">
            <OrganizationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/organization') : '/login'} replace />} />
    </Routes>
  );
}
