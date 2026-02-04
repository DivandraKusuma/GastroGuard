import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Layout } from './components/Layout';

// Pages
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DailyLog from './pages/DailyLog';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Report from './pages/Report';

import AuthPage from './pages/AuthPage';

// Helper for Protected Routes
// Logic:
// 1. If not logged in -> Redirect to /auth
// 2. If logged in but not onboarded -> Redirect to /onboarding (unless we are already there)
// 3. If onboarded -> Allow access
const PrivateRoute = ({ children, requireOnboarding = true }: { children: React.ReactNode, requireOnboarding?: boolean }) => {
  const { user, session, authLoading } = useUser();
  const location = window.location.pathname;

  // 0. Show Loading while checking session
  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid #f3f3f3', borderTop: '4px solid var(--color-primary)',
          borderRadius: '50%', animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 1. Check Session
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Check Onboarding
  if (requireOnboarding && !user.isOnboarded && location !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      {/* Onboarding only needs Session, doesn't need to be already onboarded */}
      <Route path="/onboarding" element={
        <PrivateRoute requireOnboarding={false}>
          <Onboarding />
        </PrivateRoute>
      } />

      <Route element={<Layout />}>
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/log" element={<PrivateRoute><DailyLog /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}
