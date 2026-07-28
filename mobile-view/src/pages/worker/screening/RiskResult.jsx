import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import { useMobileStore } from '../../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../../packages/shared/src/store/useLiveDemoStore.ts';
import { useLanguage } from '../../../hooks/useLanguage';

export default function RiskResult() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { submitVitals, selectedPatientId } = useMobileStore();
  const triggerRef = useLiveDemoStore(s => s.createReferral);
  const [mounted, setMounted] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleCreateReferral = () => {
    triggerRef(selectedPatientId || 'QC-097-00310', 'FLAG-001', 'FAC-001');
    alert('Referral created successfully');
    navigate('/worker/home');
  };

  const handleDone = () => {
    submitVitals();
    navigate('/worker/home');
  };

  return (
    <div className="flex flex-col h-full bg-surface relative">
      <TopBar title={t('newScreening')} showBack onBack={() => navigate(-1)} />
      
      <div className="flex justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 page-enter">
        <div>
          <h2 className="text-secondary font-bold text-xs tracking-widest uppercase mb-1">{t('step4Of4')}</h2>
          <h1 className="text-2xl font-bold text-primary">{t('riskAssessment')}</h1>
        </div>

        <div className="bg-[#B0523F]/10 px-4 py-2 flex items-center justify-center gap-2 text-[#B0523F] font-bold text-sm rounded-lg mb-4">
          <span className="material-symbols-outlined">bolt</span> {t('provisional')}
        </div>
        <div className={`bg-white border-2 border-[#B0523F] rounded-2xl p-6 text-center card-shadow-2 transition-all duration-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <span className="material-symbols-outlined text-6xl text-[#B0523F] mb-2">error</span>
          <h2 className="text-3xl font-black text-[#B0523F] mb-1">{t('elevatedRisk')}</h2>
          <div className="text-secondary font-bold text-sm bg-surface px-3 py-1 rounded-full inline-block">78% {t('confidence')}</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-amber-600">warning</span>
          <div>
            <h3 className="font-bold text-amber-900 mb-1">{t('aiRec')}</h3>
            <p className="text-sm text-amber-800">{t('aiRecDesc')}</p>
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
          <h3 className="font-bold mb-3 text-on-surface">{t('recordedVitals')}</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div><div className="text-xs text-secondary">BP</div><div className="font-bold text-red-600">164/99 mmHg</div></div>
            <div><div className="text-xs text-secondary">HR</div><div className="font-bold">88 bpm</div></div>
            <div><div className="text-xs text-secondary">{t('glucose')}</div><div className="font-bold">128 mg/dL</div></div>
            <div><div className="text-xs text-secondary">AFIB</div><div className="font-bold text-red-600">Detected</div></div>
          </div>
        </div>

        <div className="bg-amber-100 p-3 rounded-xl flex items-center gap-2 text-amber-800 text-sm font-semibold justify-center">
          <span className="material-symbols-outlined text-lg">cloud_sync</span> {t('willSync')}
        </div>
      </div>

      <div className="p-4 bg-surface border-t border-outline-variant/30 space-y-3">
        <button onClick={() => setShowBottomSheet(true)} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg active:scale-95 card-shadow-1 transition-transform">{t('createReferral')}</button>
        <button onClick={() => navigate('/worker/home')} className="w-full bg-surface-container text-on-surface py-4 rounded-xl font-bold active:scale-95 transition-transform">{t('doneAndSave')}</button>
      </div>

      {showBottomSheet && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-surface w-full p-6 rounded-t-3xl shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{t('selectFacility')}</h2>
            <div className="space-y-3 mb-6">
              {['St. Luke\'s Medical Center', 'East Avenue Medical Center', 'QC General Hospital'].map((f, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 flex items-center gap-3 ${i === 0 ? 'border-primary bg-primary/10' : 'border-outline-variant'}`}>
                  <input type="radio" name="fac" checked={i===0} readOnly className="w-5 h-5 accent-primary" />
                  <span className="font-bold">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBottomSheet(false)} className="flex-1 py-4 border-2 border-outline-variant rounded-xl font-bold">{t('cancel')}</button>
              <button onClick={handleCreateReferral} className="flex-[2] w-full bg-primary text-white py-4 rounded-xl font-bold">{t('confirmReferral')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
