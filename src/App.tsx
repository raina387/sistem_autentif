import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { ToastProvider } from './components/Toast';
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const GuruDashboard = lazy(() => import('./pages/GuruDashboard').then(m => ({ default: m.GuruDashboard })));
const SiswaDashboard = lazy(() => import('./pages/SiswaDashboard').then(m => ({ default: m.SiswaDashboard })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const RoleRoute = ({ children, allow }: { children: React.ReactNode; allow: Array<'admin' | 'guru' | 'siswa'> }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'guru') {
    return <GuruDashboard />;
  } else if (user?.role === 'siswa') {
    return <SiswaDashboard />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <DataProvider>
        <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">Memuat...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <RoleRoute allow={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/guru"
              element={
                <RoleRoute allow={['guru', 'admin']}>
                  <GuruDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/siswa"
              element={
                <RoleRoute allow={['siswa', 'admin']}>
                  <SiswaDashboard />
                </RoleRoute>
              }
            />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;

