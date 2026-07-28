import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useMobileStore } from '../../store/useMobileStore';
import ConsentToggle from '../../components/ui/ConsentToggle';

export default function Onboarding() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const setLanguage = useMobileStore(s => s.setLanguage);
  
  const [step, setStep] = useState(1);
  const [consentChecked, setConsentChecked] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-surface page-enter relative overflow-hidden p-8 text-center">
      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        
        {/* Step 1 */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ${step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center mb-10 card-shadow-2 relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-[32px] animate-ping opacity-75 duration-1000" />
            <span className="material-symbols-outlined text-white text-5xl relative z-10">spa</span>
          </div>

          <h1 className="text-[28px] font-bold text-primary mb-4 leading-tight tracking-tight">
            Your health record,<br />in one place
          </h1>
          
          <p className="text-secondary mb-10 text-[15px] leading-relaxed">
            Kaya mo 'to! AImhotech keeps your check-ups from the barangay kiosk, RHU, and hospitals together — so you never start from zero.
          </p>

          <div className="flex w-full bg-surface-container rounded-2xl p-1 mb-8 shadow-inner border border-outline-variant/30">
            <button 
              onClick={() => setLanguage('en')} 
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${language === 'en' ? 'bg-primary text-white card-shadow-1 scale-100' : 'text-secondary hover:bg-surface-container-high scale-95'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('fil')} 
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${language === 'fil' ? 'bg-primary text-white card-shadow-1 scale-100' : 'text-secondary hover:bg-surface-container-high scale-95'}`}
            >
              Filipino
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ${step === 2 ? 'translate-x-0 opacity-100' : step < 2 ? 'translate-x-full opacity-0 pointer-events-none' : '-translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="w-24 h-24 bg-tertiary-container rounded-[32px] flex items-center justify-center mb-10 card-shadow-2">
            <span className="material-symbols-outlined text-on-tertiary-container text-5xl">monitoring</span>
          </div>

          <h1 className="text-[28px] font-bold text-primary mb-4 leading-tight tracking-tight">
            A gentle early warning
          </h1>
          
          <p className="text-secondary mb-10 text-[15px] leading-relaxed">
            After each check-up, smart software looks at your numbers and quietly flags anything worth a doctor’s attention — even without internet at the station.
          </p>
        </div>

        {/* Step 3 */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ${step === 3 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="w-24 h-24 bg-secondary-container rounded-[32px] flex items-center justify-center mb-10 card-shadow-2">
            <span className="material-symbols-outlined text-on-secondary-container text-5xl">shield_lock</span>
          </div>

          <h1 className="text-[28px] font-bold text-primary mb-4 leading-tight tracking-tight">
            Your data, your say
          </h1>
          
          <p className="text-secondary mb-8 text-[15px] leading-relaxed">
            We only record your check-up results with your permission, keep them encrypted, and share them only with the health workers caring for you. You can say no or change your mind anytime.
          </p>
          
          <div className="w-full text-left">
            <ConsentToggle 
              title="I agree — record my health data"
              description="What happens to my data?"
              checked={consentChecked}
              onChange={setConsentChecked}
            />
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="w-full mt-auto pt-6 space-y-4">
        {step < 3 ? (
          <button 
            onClick={() => setStep(step + 1)}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg card-shadow-1 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            disabled={!consentChecked}
            className={`w-full py-4 rounded-2xl font-bold text-lg card-shadow-1 transition-all ${consentChecked ? 'bg-primary text-white hover:scale-[1.02] active:scale-[0.98]' : 'bg-surface-container text-on-surface-variant opacity-50'}`}
          >
            {consentChecked ? 'Get Started' : 'Turn on consent to continue'}
          </button>
        )}
        <button 
          onClick={() => navigate('/login')}
          className="w-full py-3 text-secondary font-semibold hover:text-primary transition-colors text-sm"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}
