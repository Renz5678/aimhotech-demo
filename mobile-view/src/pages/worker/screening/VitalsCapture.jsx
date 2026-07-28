import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import { useMobileStore } from '../../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../../packages/shared/src/store/useLiveDemoStore';
import { useLanguage } from '../../../hooks/useLanguage';

export default function VitalsCapture() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { selectedPatientId, setVitalsSession } = useMobileStore();
  const patients = useLiveDemoStore(s => s.patients);
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const [bp, setBp] = useState({ systolic: 164, diastolic: 99 });
  const [heartRate, setHeartRate] = useState(88);
  const [glucose, setGlucose] = useState(128);
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(70);
  const [syncing, setSyncing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const bmi = weight && height ? (weight / ((height / 100) ** 2)).toFixed(1) : '—';

  const handleAnalyze = async () => {
    setSyncing(true);
    const vitals = { bpSystolic: bp.systolic, bpDiastolic: bp.diastolic, heartRate, glucose, afibFlag: true, height, weight };
    setVitalsSession(vitals);
    // Trigger Supabase sync via shared store
    const { triggerLiveSync } = useLiveDemoStore.getState();
    await triggerLiveSync(vitals, selectedPatientId);
    setSyncing(false);
    navigate('/worker/screening/result');
  };

  return (
    <div className="flex flex-col h-full bg-surface relative">
      <TopBar title={t('newScreening')} showBack onBack={() => navigate(-1)} />
      
      <div className="flex justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-outline-variant" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 page-enter">
        
        <div>
          <h2 className="text-secondary font-bold text-xs tracking-widest uppercase mb-1">{t('step3Of4')}</h2>
          <h1 className="text-2xl font-bold text-primary">{t('captureVitals')}</h1>
        </div>

        <div className="bg-surface-container p-3 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
            {patient.name.split(' ')[0][0]}{patient.name.split(' ').length > 1 ? patient.name.split(' ').pop()[0] : ''}
          </div>
          <div><div className="font-bold">{patient.name}</div><div className="text-xs text-secondary">{patient.id}</div></div>
        </div>

        <div className="bg-amber-100 border border-amber-300 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold mb-1"><span className="material-symbols-outlined">warning</span> Device detected possible AFIB</div>
          <details className="text-amber-800 text-sm mt-2"><summary className="cursor-pointer font-semibold">Learn more</summary><p className="mt-1">Irregular heartbeat detected during measurement. This requires physician review.</p></details>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-red-50 border-2 border-red-200 rounded-2xl p-5 card-shadow-1">
            <div className="flex justify-between items-start mb-2">
              <div className="text-red-800 font-bold">Blood Pressure</div>
              <span className="material-symbols-outlined text-primary">bluetooth</span>
            </div>
            <div className="text-4xl font-black text-red-700">{bp.systolic}<span className="text-2xl text-red-500 font-bold">/{bp.diastolic}</span></div>
            <div className="text-sm text-red-600 mt-1">mmHg</div>
            <div className="mt-4 bg-white/50 text-xs font-semibold px-2 py-1 rounded inline-block">From Microlife B6</div>
          </div>

          <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="text-secondary font-bold text-sm mb-1">Heart Rate</div>
            <div className="text-2xl font-bold">{heartRate} <span className="text-sm font-normal">bpm</span></div>
            <div className="mt-2 bg-surface text-xs font-semibold px-2 py-1 rounded inline-block">From Microlife B6</div>
          </div>

          <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="text-secondary font-bold text-sm mb-1">Glucose</div>
            <div className="text-2xl font-bold">{glucose} <span className="text-sm font-normal">mg/dL</span></div>
            <div className="mt-2 bg-surface text-xs font-semibold px-2 py-1 rounded inline-block">From Bionime iFree</div>
          </div>

          <div className="col-span-2 bg-surface-container rounded-2xl p-4 card-shadow-1 flex gap-4">
            <div className="flex-1"><label className="text-xs font-bold text-secondary">Height (cm)</label><input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-surface border border-outline-variant p-2 rounded mt-1 font-bold" /></div>
            <div className="flex-1"><label className="text-xs font-bold text-secondary">Weight (kg)</label><input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full bg-surface border border-outline-variant p-2 rounded mt-1 font-bold" /></div>
            <div className="flex-1 flex flex-col justify-end"><div className="text-xs text-secondary font-bold">BMI</div><div className="font-bold text-lg">{bmi}</div></div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-surface border-t border-outline-variant/30">
        <button onClick={handleAnalyze} disabled={syncing} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg active:scale-95 card-shadow-1 transition-transform disabled:opacity-50 disabled:active:scale-100">{t('analyzeRisk')}</button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-3xl w-[90%] max-w-[340px] shadow-2xl flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-3">warning</span>
            <h2 className="text-xl font-bold mb-2 text-on-surface">Unusual Reading Detected</h2>
            <p className="text-secondary mb-6 leading-relaxed">BP <strong className="text-red-600">164/99 mmHg</strong> is very high with possible AFIB. Please confirm or re-measure.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border-2 border-outline-variant rounded-xl font-bold text-secondary active:scale-95 transition-transform">Re-measure</button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold card-shadow-1 active:scale-95 transition-transform">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {syncing && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined animate-spin text-white text-5xl">sync</span>
          <div className="text-white font-bold text-lg">Syncing to AI Brain...</div>
          <div className="text-white/70 text-sm">Uploading vitals securely</div>
        </div>
      )}
    </div>
  );
}
