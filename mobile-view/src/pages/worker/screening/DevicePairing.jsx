import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import { useMobileStore } from '../../../store/useMobileStore';
import { useLanguage } from '../../../hooks/useLanguage';

export default function DevicePairing() {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(true);
  const [showManual, setShowManual] = useState(false);
  const navigate = useNavigate();
  const pairDevice = useMobileStore(s => s.pairDevice);

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    pairDevice('Microlife B6 Connect');
    pairDevice('Bionime iFree');
    navigate('/worker/screening/vitals');
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title={t('newScreening')} showBack onBack={() => navigate('/worker/screening/confirm')} />
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-6 page-enter">
        <div>
          <h2 className="text-secondary font-bold text-xs tracking-widest uppercase mb-1">{t('step2Of4')}</h2>
          <h1 className="text-2xl font-bold text-primary">{t('pairDevices')}</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {scanning ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="bt-ripple w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-5xl text-primary">bluetooth_searching</span>
              </div>
              <h2 className="text-xl font-bold text-on-surface">{t('scanningForDevices')}</h2>
              <p className="text-secondary mt-2">{t('ensureDevicesOn')}</p>
            </div>
          ) : (
            <div className="w-full flex-1">
              <h2 className="text-xl font-bold text-on-surface mb-6 text-left">{t('devicesFound')}</h2>
              <div className="space-y-4 text-left">
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-4">
                  <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                  <div><div className="font-bold">Microlife B6 Connect</div><div className="text-sm text-green-700">DEV-MLB6-1001</div></div>
                </div>
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-4">
                  <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                  <div><div className="font-bold">Bionime iFree</div><div className="text-sm text-green-700">DEV-BION-2001</div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-surface border-t border-outline-variant/30">
        <button 
          onClick={handleContinue}
          disabled={scanning}
          className={`w-full py-4 rounded-2xl font-bold transition-all ${!scanning ? 'bg-primary text-white card-shadow-1 active:scale-95' : 'bg-surface-container text-secondary opacity-50'}`}
        >
          {!scanning ? t('continueToVitals') : t('pairDevices')}
        </button>
        <div className="text-center mt-4">
          <button onClick={() => setShowManual(true)} className="text-primary font-bold">{t('enterManually')}</button>
        </div>
      </div>

      {showManual && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-surface w-full p-6 rounded-t-3xl bottom-sheet">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manual Entry</h2>
              <button onClick={() => setShowManual(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4 mb-6">
              <input type="number" placeholder="Systolic (mmHg)" className="w-full border-2 border-outline-variant p-3 rounded-xl focus:border-primary focus:outline-none" />
              <input type="number" placeholder="Diastolic (mmHg)" className="w-full border-2 border-outline-variant p-3 rounded-xl focus:border-primary focus:outline-none" />
            </div>
            <button onClick={() => { setShowManual(false); handleContinue(); }} className="w-full bg-primary text-white py-4 rounded-xl font-bold">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
