import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { useMobileStore } from '../../store/useMobileStore';
import { useLanguage } from '../../hooks/useLanguage';
import { supabase } from '../../../../packages/shared/src/lib/supabase';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';

export default function WorkerSync() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { syncQueueCount, isSynced, syncToBrain, hasCapturedVitals, vitalsSession, currentUserId } = useMobileStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    for (let i = 0; i < syncQueueCount; i++) {
      await supabase.from('screenings').insert([{
        patient_id: 'BGY-041-00217',
        health_worker_id: currentUserId || 'WORKER-1',
        vitals: vitalsSession,
        timestamp: new Date().toISOString()
      }]);
      setSyncProgress(i + 1);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    useLiveDemoStore.getState().hydrateFromSupabase();
    syncToBrain();
    setIsSyncing(false);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title={t('syncStatus')} showBack onBack={() => navigate('/worker/home')} />
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-6 page-enter pb-24">
        
        {syncQueueCount > 0 ? (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center card-shadow-1">
            <span className="material-symbols-outlined text-5xl text-amber-500 mb-2">cloud_off</span>
            <h2 className="text-2xl font-black text-amber-900 mb-1">{syncQueueCount} {t('itemsWaiting')}</h2>
            <div className="text-amber-800 text-sm font-semibold mb-6">{t('lastSync')} 7:42 AM</div>
            
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                isSyncing ? 'bg-amber-300 text-amber-700' : 'bg-amber-600 text-white card-shadow-1 active:scale-95'
              }`}
            >
              <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
              {isSyncing ? `Syncing... ${syncProgress}/${syncQueueCount}` : t('syncNow')}
            </button>
            {isSyncing && (
              <div className="w-full bg-amber-200 h-2 mt-4 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full transition-all duration-300" style={{ width: `${(syncProgress / syncQueueCount) * 100}%` }}></div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center card-shadow-1">
            <span className="material-symbols-outlined text-5xl text-green-500 mb-2">cloud_done</span>
            <h2 className="text-2xl font-black text-green-900 mb-1">{t('allSynced')}</h2>
            <div className="text-green-800 text-sm font-semibold">{t('allSyncedDesc')}</div>
          </div>
        )}

        {syncQueueCount > 0 && (
          <div>
            <h3 className="font-bold text-secondary text-sm tracking-widest uppercase mb-3 px-1">{t('waitingToSync')} ({syncQueueCount})</h3>
            <div className="space-y-3">
              {[...Array(syncQueueCount)].map((_, i) => (
                <div key={i} className="bg-surface-container rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">health_and_safety</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-on-surface">{t('screeningRecord')}</div>
                    <div className="text-secondary text-sm">{t('vitalsQueued')}</div>
                  </div>
                  <div className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded">{t('ready')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
