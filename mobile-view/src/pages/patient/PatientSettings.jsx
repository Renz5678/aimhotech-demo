import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileStore } from '../../store/useMobileStore';
import { useLanguage } from '../../hooks/useLanguage';

export default function PatientSettings() {
  const { t, language } = useLanguage();
  const setLanguage = useMobileStore(s => s.setLanguage);
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <header className="fixed top-0 left-0 w-full z-50 bg-background flex flex-col px-edge_margin pt-xl pb-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-cover" alt="Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsLzpl7NwQELatlWhheuogSLcAOQPUDj6-hKFI2MBz3p3o5vHl7Bvic5K8s81nhWBeMifuWAslNfadqhPGMI88rzrOBvneNnjj4qJ5_Pn9ilLhWvxDsjBcfEQBsCFfZe7MCImC8ODZAcorNp17StDJzGvV2nWEfgiUGHjPQ8Z21SInj-yofkJX1baZDo50OX9grf77dVBSWi3ZAFqccMOgSZ8lf1TH17vB-5haFAzoxmqjVGv-nHwgUNg_x7JAihy0nTxDZfN4iK4"/>
            </div>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Barangay San Isidro</span>
          </div>
          <div className="bg-secondary-container px-sm py-xs rounded-full flex items-center gap-xs">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="font-label-sm text-label-sm text-on-secondary-container">3 pending</span>
          </div>
        </div>
        <h1 className="mt-lg font-display-lg text-display-lg text-primary">{t('settings')}</h1>
      </header>
      
      <main className="pt-[160px] px-edge_margin space-y-stack_gap">
        <section className="space-y-sm">
          <div className="flex items-center gap-xs px-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">translate</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{t('language')}</h3>
          </div>
          <div className="bg-surface-container-lowest p-base rounded-xl border border-outline-variant flex gap-base shadow-[0_4px_12px_rgba(30,58,47,0.04)]">
            <button 
              onClick={() => setLanguage('en')}
              className={`flex-1 py-md rounded-lg font-body-lg text-body-lg transition-all active:scale-95 duration-150 ${language === 'en' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              {t('english')}
            </button>
            <button 
              onClick={() => setLanguage('fil')}
              className={`flex-1 py-md rounded-lg font-body-lg text-body-lg transition-all active:scale-95 duration-150 ${language === 'fil' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              {t('filipino')}
            </button>
          </div>
        </section>

        <section className="space-y-sm">
          <div className="flex items-center gap-xs px-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">shield_person</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Privacy &amp; Data</h3>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(30,58,47,0.04)] space-y-md">
            <div className="flex justify-between items-start">
              <div className="space-y-xs">
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  You agreed to health data recording on <span className="font-bold text-primary">Mar 3, 2026</span>.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
                  You can review or withdraw this anytime — data capture stops immediately.
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/onboarding')} className="w-full py-md px-lg rounded-xl border border-secondary text-secondary font-body-lg text-body-lg hover:bg-secondary-container transition-all flex items-center justify-center gap-sm active:scale-[0.98] duration-200">
              <span className="material-symbols-outlined text-[20px]">description</span>
              Review my consent
            </button>
          </div>
        </section>

        <section className="space-y-sm">
          <div className="flex items-center gap-xs px-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{t('notifications')}</h3>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(30,58,47,0.04)] overflow-hidden">
            <div className="flex items-center justify-between p-lg hover:bg-surface-container-low transition-colors duration-200">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">analytics</span>
                </div>
                <span className="font-body-lg text-body-lg text-primary">{t('riskAlerts')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-12 h-7 bg-surface-container-highest rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 after:shadow-sm peer-checked:bg-primary-container peer-checked:after:translate-x-[20px]"></div>
              </label>
            </div>
            <div className="h-[1px] bg-outline-variant mx-lg"></div>
            <div className="flex items-center justify-between p-lg hover:bg-surface-container-low transition-colors duration-200">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">event_note</span>
                </div>
                <span className="font-body-lg text-body-lg text-primary">{t('appointmentReminders')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-12 h-7 bg-surface-container-highest rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 after:shadow-sm peer-checked:bg-primary-container peer-checked:after:translate-x-[20px]"></div>
              </label>
            </div>
          </div>
        </section>

        <section className="space-y-sm">
          <div className="flex items-center gap-xs px-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">help</span>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Support</h3>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(30,58,47,0.04)] flex flex-col items-center justify-center text-center gap-xs active:scale-95 transition-transform duration-200 cursor-pointer">
              <span className="material-symbols-outlined text-secondary text-[28px]">chat_bubble</span>
              <span className="font-body-md text-body-md text-primary">Help Center</span>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(30,58,47,0.04)] flex flex-col items-center justify-center text-center gap-xs active:scale-95 transition-transform duration-200 cursor-pointer">
              <span className="material-symbols-outlined text-secondary text-[28px]">logout</span>
              <span className="font-body-md text-body-md text-primary">Sign Out</span>
            </div>
          </div>
        </section>

        <div className="py-xl flex flex-col items-center gap-xs opacity-40">
          <span className="font-technical-id text-technical-id">v2.4.0-stable</span>
          <span className="font-technical-id text-technical-id text-[10px]">AImhotech Digital Health Alliance</span>
        </div>
      </main>

      {/* Consent modal (if triggered in a real app logic) */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest p-6 rounded-2xl w-full max-w-sm shadow-[0_4px_12px_rgba(30,58,47,0.04)]">
            <h2 className="text-xl font-bold mb-4 text-primary">{t('withdrawConsentTitle')}</h2>
            <p className="text-secondary mb-6">{t('withdrawConsentDesc')}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConsent(false)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold text-on-surface-variant">{t('cancel')}</button>
              <button onClick={() => setShowConsent(false)} className="flex-1 py-3 bg-error text-white rounded-xl font-bold">{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
