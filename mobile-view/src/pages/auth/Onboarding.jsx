import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useMobileStore } from '../../store/useMobileStore';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const setLanguage = useMobileStore(s => s.setLanguage);

  return (
    <div className="flex flex-col min-h-screen bg-surface p-6 page-enter relative overflow-hidden">
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full text-sm font-bold ${language === 'en' ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}`}>EN</button>
        <button onClick={() => setLanguage('fil')} className={`px-3 py-1 rounded-full text-sm font-bold ${language === 'fil' ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}`}>FIL</button>
      </div>
      
      <div className="flex justify-center gap-2 mb-8">
        {[1,2,3].map(i => (
          <div key={i} className={`h-2 w-12 rounded-full transition-colors ${step === i ? 'bg-primary' : 'bg-outline-variant'}`} />
        ))}
      </div>

      <div className="relative flex-1">
        <div className={`absolute inset-0 transition-transform duration-300 ${step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-6xl text-primary mb-4">health_and_safety</span>
            <h1 className="text-2xl font-bold mb-4">What is AImhotech?</h1>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary">check_circle</span><p>AI-powered early detection</p></div>
            <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary">check_circle</span><p>Seamless clinic referrals</p></div>
            <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary">check_circle</span><p>Community health insights</p></div>
          </div>
        </div>

        <div className={`absolute inset-0 transition-transform duration-300 ${step === 2 ? 'translate-x-0 opacity-100' : step < 2 ? 'translate-x-full opacity-0 pointer-events-none' : '-translate-x-full opacity-0 pointer-events-none'}`}>
          <h2 className="text-2xl font-bold mb-6">What data do we collect?</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl"><span className="material-symbols-outlined text-primary">blood_pressure</span><p className="font-semibold">Blood Pressure</p></div>
            <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl"><span className="material-symbols-outlined text-primary">monitor_heart</span><p className="font-semibold">Heart Rate</p></div>
            <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl"><span className="material-symbols-outlined text-primary">location_on</span><p className="font-semibold">Location Data (Barangay)</p></div>
          </div>
          <details className="bg-surface-container p-4 rounded-xl">
            <summary className="font-bold text-primary cursor-pointer">What happens to my data?</summary>
            <p className="mt-2 text-sm text-secondary">Your data is stored securely and only shared with authorized health workers for your care.</p>
          </details>
        </div>

        <div className={`absolute inset-0 transition-transform duration-300 ${step === 3 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="text-center mb-6">
            <span className="material-symbols-outlined text-5xl text-primary mb-2">shield</span>
            <h2 className="text-2xl font-bold">Your Rights</h2>
          </div>
          <ul className="list-disc pl-6 space-y-2 mb-8 text-secondary">
            <li>You can withdraw consent at any time.</li>
            <li>You can request deletion of your data.</li>
            <li>Your data will never be sold.</li>
          </ul>
          <div className="bg-surface-container p-4 rounded-xl flex items-center gap-3">
            <input type="checkbox" className="w-6 h-6 rounded border-2 border-primary" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <label className="font-bold text-sm" onClick={() => setConsent(!consent)}>{t('consentBody')}</label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-auto pt-6">
        {step > 1 && (
          <button className="flex-1 py-4 border-2 border-outline-variant rounded-xl font-bold text-secondary" onClick={() => setStep(step - 1)}>Back</button>
        )}
        {step < 3 ? (
          <button className="flex-2 w-full bg-primary text-white py-4 rounded-xl font-bold" onClick={() => setStep(step + 1)}>Next</button>
        ) : (
          <button className="flex-2 w-full bg-primary text-white py-4 rounded-xl font-bold disabled:opacity-50" disabled={!consent} onClick={() => navigate('/login')}>Submit</button>
        )}
      </div>
    </div>
  );
}
