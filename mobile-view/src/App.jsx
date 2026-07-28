import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MobileContainer from './components/layout/MobileContainer';
import BottomNavigation from './components/layout/BottomNavigation';
import { useMobileStore } from './store/useMobileStore';

import Login from './pages/auth/Login';
import Onboarding from './pages/auth/Onboarding';

// Patient Pages
import PatientHome from './pages/patient/PatientHome';
import HealthHistory from './pages/patient/HealthHistory';
import Appointments from './pages/patient/Appointments';
import PatientSettings from './pages/patient/PatientSettings';

// Worker Pages
import WorkerHome from './pages/worker/WorkerHome';
import PatientLookup from './pages/worker/PatientLookup';
import DevicePairing from './pages/worker/screening/DevicePairing';
import VitalsCapture from './pages/worker/screening/VitalsCapture';
import RiskResult from './pages/worker/screening/RiskResult';
import WorkerSettings from './pages/worker/WorkerSettings';

const AppContent = () => {
  const location = useLocation();
  const mode = useMobileStore(s => s.mode);
  
  // Don't show bottom nav on auth screens
  const showNav = !['/login', '/onboarding', '/'].includes(location.pathname);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/patient/home" element={<PatientHome />} />
          <Route path="/patient/history" element={<HealthHistory />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/settings" element={<PatientSettings />} />

          <Route path="/worker/home" element={<WorkerHome />} />
          <Route path="/worker/lookup" element={<PatientLookup />} />
          <Route path="/worker/screening/device" element={<DevicePairing />} />
          <Route path="/worker/screening/vitals" element={<VitalsCapture />} />
          <Route path="/worker/screening/result" element={<RiskResult />} />
          <Route path="/worker/settings" element={<WorkerSettings />} />
        </Routes>
      </div>
      {showNav && <BottomNavigation mode={mode} />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <MobileContainer>
        <AppContent />
      </MobileContainer>
    </Router>
  );
}
