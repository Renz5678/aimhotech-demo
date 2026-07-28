import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MobileContainer from './components/layout/MobileContainer';
import BottomNav from './components/layout/BottomNav';
import { useMobileStore } from './store/useMobileStore';

import Login from './pages/auth/Login';
import Onboarding from './pages/auth/Onboarding';

// Patient Pages
import PatientHome from './pages/patient/PatientHome';
import HealthHistory from './pages/patient/HealthHistory';
import Appointments from './pages/patient/Appointments';
import PatientSettings from './pages/patient/PatientSettings';
import GabayChat from './pages/patient/GabayChat';

// Worker Pages
import WorkerHome from './pages/worker/WorkerHome';
import PatientLookup from './pages/worker/PatientLookup';
import DevicePairing from './pages/worker/screening/DevicePairing';
import VitalsCapture from './pages/worker/screening/VitalsCapture';
import RiskResult from './pages/worker/screening/RiskResult';
import WorkerSettings from './pages/worker/WorkerSettings';
import ConfirmPatient from './pages/worker/screening/ConfirmPatient';
import WorkerSync from './pages/worker/WorkerSync';

/** Redirects to /login if there is no active authenticated session */
const ProtectedRoute = ({ children }) => {
  const currentUserId = useMobileStore(s => s.currentUserId);
  if (!currentUserId) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useMobileStore(s => s.currentMode);

  // Don't show bottom nav on auth / full-screen screens
  const isAuthRoute = ['/login', '/onboarding', '/'].includes(location.pathname);
  const isGabayRoute = location.pathname === '/patient/gabay';
  const isWorkerScreening = location.pathname.startsWith('/worker/screening');
  const showNav = !isAuthRoute && !isGabayRoute && !isWorkerScreening;
  const showFab = mode === 'patient' && !isAuthRoute && !isGabayRoute;

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className={`flex-1 overflow-y-auto relative ${showNav ? 'pb-20' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected patient routes */}
          <Route path="/patient/home"         element={<ProtectedRoute><PatientHome /></ProtectedRoute>} />
          <Route path="/patient/history"      element={<ProtectedRoute><HealthHistory /></ProtectedRoute>} />
          <Route path="/patient/health-history" element={<ProtectedRoute><HealthHistory /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/patient/settings"     element={<ProtectedRoute><PatientSettings /></ProtectedRoute>} />
          <Route path="/patient/gabay"        element={<ProtectedRoute><GabayChat /></ProtectedRoute>} />

          {/* Protected worker routes */}
          <Route path="/worker/home"                  element={<ProtectedRoute><WorkerHome /></ProtectedRoute>} />
          <Route path="/worker/lookup"                element={<ProtectedRoute><PatientLookup /></ProtectedRoute>} />
          <Route path="/worker/sync"                  element={<ProtectedRoute><WorkerSync /></ProtectedRoute>} />
          <Route path="/worker/screening/confirm"     element={<ProtectedRoute><ConfirmPatient /></ProtectedRoute>} />
          <Route path="/worker/screening/device"      element={<ProtectedRoute><DevicePairing /></ProtectedRoute>} />
          <Route path="/worker/screening/vitals"      element={<ProtectedRoute><VitalsCapture /></ProtectedRoute>} />
          <Route path="/worker/screening/result"      element={<ProtectedRoute><RiskResult /></ProtectedRoute>} />
          <Route path="/worker/settings"              element={<ProtectedRoute><WorkerSettings /></ProtectedRoute>} />
        </Routes>
      </div>

      {showNav && <BottomNav mode={mode} />}

      {showFab && (
        <button
          onClick={() => navigate('/patient/gabay')}
          className="absolute bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center card-shadow-2 hover:scale-105 active:scale-95 transition-transform z-40"
        >
          <span className="material-symbols-outlined text-3xl">auto_awesome</span>
        </button>
      )}
    </div>
  );
};

import { ToastProvider } from './components/ui/ToastContext';

export default function App() {
  return (
    <Router>
      <MobileContainer>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </MobileContainer>
    </Router>
  );
}
