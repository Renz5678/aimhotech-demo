import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useDemoStore } from './store/useDemoStore'
import { useMobileStore } from './store/useMobileStore'
import { useLiveDemoStore } from '../../packages/shared/src/store/useLiveDemoStore'
import { supabase } from '../../packages/shared/src/lib/supabase'
import { ToastProvider } from './components/ui/ToastContext';

// Initialize Supabase integration
useDemoStore.getState().hydrateFromSupabase();
useDemoStore.getState().setupRealtime();
useLiveDemoStore.getState().hydrateFromSupabase();
useLiveDemoStore.getState().setupRealtime();

// Check existing session — auto-restore login state
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    const meta = session.user.user_metadata ?? {};
    const userId = meta.userId ?? session.user.id;
    const role = meta.role ?? 'patient';
    const name = meta.name ?? session.user.email?.split('@')[0] ?? 'User';
    useMobileStore.getState().setCurrentUser(userId, role, name);
    useLiveDemoStore.getState().setCurrentUser(userId, role);
    if (role === 'barangay_health_worker') {
      useMobileStore.getState().setMode('worker');
      // For BHW, also set the patient selection from first patient
    } else if (role === 'patient') {
      useMobileStore.getState().setMode('patient');
      if (userId) useMobileStore.getState().selectPatient(userId);
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
