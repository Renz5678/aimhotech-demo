import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import { useMobileStore } from '../../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../../packages/shared/src/store/useLiveDemoStore.ts';
import PatientCard from '../../../components/ui/PatientCard';

export default function ConfirmPatient() {
  const navigate = useNavigate();
  const { selectedPatientId } = useMobileStore();
  const allPatients = useLiveDemoStore(s => s.patients);
  const patient = allPatients.find(p => p.id === selectedPatientId);

  if (!patient) {
    return (
      <div className="flex flex-col h-full bg-surface">
        <TopBar title="Confirm Patient" showBack onBack={() => navigate('/worker/lookup')} />
        <div className="flex-1 p-4 flex items-center justify-center text-secondary">
          No patient selected.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="New Screening" showBack onBack={() => navigate('/worker/lookup')} />
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-6 page-enter">
        
        <div>
          <h2 className="text-secondary font-bold text-xs tracking-widest uppercase mb-1">Step 1 of 4</h2>
          <h1 className="text-2xl font-bold text-primary">Confirm patient</h1>
        </div>

        <PatientCard patient={patient} />

        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-green-600 mt-1">check_circle</span>
          <div>
            <div className="font-bold text-green-900">Consent on file</div>
            <div className="text-green-800 text-sm">Recorded Mar 3, 2026, reconfirmable anytime</div>
          </div>
        </div>

      </div>
      
      <div className="p-4 bg-surface border-t border-outline-variant/30 space-y-3">
        <button 
          onClick={() => navigate('/worker/lookup')}
          className="w-full bg-surface-container text-on-surface py-4 rounded-2xl font-bold active:scale-95 transition-transform"
        >
          Choose a different patient
        </button>
        <button 
          onClick={() => navigate('/worker/screening/device')}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold card-shadow-1 active:scale-95 transition-transform"
        >
          Confirm & continue
        </button>
      </div>
    </div>
  );
}
