import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileContainer from './components/layout/MobileContainer';
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

export default function App() {
  return (
    <Router>
      <MobileContainer>
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
      </MobileContainer>
    </Router>
  );
}
