import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileStore } from '../../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../../packages/shared/src/store/useLiveDemoStore';
import { useLanguage } from '../../../hooks/useLanguage';

export default function ConfirmPatient() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { selectedPatientId } = useMobileStore();
  const allPatients = useLiveDemoStore(s => s.patients);
  const patient = allPatients.find(p => p.id === selectedPatientId) || allPatients[0];

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">{t('noPatientFound')}</h1>
          <button onClick={() => navigate('/worker/lookup')} className="px-4 py-2 bg-primary text-white rounded">Back</button>
        </div>
      </div>
    );
  }

  const names = patient.name.split(' ');
  const initials = names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '');

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden font-ibm-plex">
      <div className="px-6 pt-4 pb-2 flex justify-between items-center text-on-surface/80">
        <span className="font-data-sm text-data-sm">9:30</span>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-[18px]">signal_cellular_4_bar</span>
          <span className="material-symbols-outlined text-[18px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center relative">
            <span className="material-symbols-outlined text-white text-[24px]">health_and_safety</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-fixed rounded-full border-2 border-primary-container"></div>
          </div>
          <span className="font-title-sm text-title-sm font-semibold text-primary">Health Worker</span>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container/30 px-3 py-1.5 rounded-full border border-secondary-fixed">
          <div className="w-2 h-2 rounded-full bg-[#8B9D77] inline-block"></div>
          <span className="font-label-caps text-label-caps text-on-secondary-fixed-variant">3 pending</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="mt-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant">NEW SCREENING • STEP 1 OF 4</span>
          </div>
          <div className="grid grid-cols-4 gap-2 h-1.5 w-full">
            <div className="bg-primary rounded-full"></div>
            <div className="bg-surface-container-highest rounded-full"></div>
            <div className="bg-surface-container-highest rounded-full"></div>
            <div className="bg-surface-container-highest rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/worker/lookup')}
            className="w-10 h-10 rounded-xl bg-white border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors layered-shadow"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-display-lg text-[28px] font-bold text-primary">Confirm patient</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 layered-shadow mb-6 border border-white/50 relative overflow-hidden">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center border-4 border-white shadow-sm">
              <span className="font-headline-md text-primary font-bold">{initials}</span>
            </div>
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md text-primary mb-1">{patient.name}</h2>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
                <span>{patient.id}</span>
                <span className="opacity-30">•</span>
                <span>{patient.age || 58}</span>
                <span className="opacity-30">•</span>
                <span>{patient.gender || 'F'}</span>
                <span className="opacity-30">•</span>
                <span>last seen Jul 12</span>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary-container/15 rounded-xl p-4 flex items-start gap-3 border border-secondary-container/40">
            <div className="bg-secondary text-white rounded-full p-0.5 flex items-center justify-center mt-0.5">
              <span className="material-symbols-outlined text-[16px] font-bold" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
            </div>
            <div className="flex flex-col">
              <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant leading-snug">
                <span className="font-semibold">Consent on file</span> — recorded Mar 3, 2026, reconfirmable anytime
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/worker/lookup')}
          className="w-full py-4 px-6 rounded-2xl border-2 border-secondary/20 font-title-sm text-title-sm text-secondary hover:bg-secondary-container/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">person_search</span>
          Choose a different patient
        </button>
        
        <div className="absolute -right-20 -bottom-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pt-10 pointer-events-none">
        <button 
          onClick={() => navigate('/worker/screening/device')}
          className="w-full bg-primary text-white py-5 px-8 rounded-[20px] font-title-sm text-title-sm font-semibold flex items-center justify-center shadow-lg hover:bg-primary-container transition-all active:scale-[0.97] pointer-events-auto"
        >
          Confirm & continue
          <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
        </button>
        <div className="mt-6 flex justify-center">
          <div className="w-32 h-1 bg-on-surface/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
