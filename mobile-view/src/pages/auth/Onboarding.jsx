import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useMobileStore } from '../../store/useMobileStore';

export default function Onboarding() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const setLanguage = useMobileStore(s => s.setLanguage);

  return (
    <div className="flex flex-col min-h-screen bg-surface page-enter relative overflow-hidden items-center justify-center p-6 text-center">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        
        {/* Animated App Icon Wrapper */}
        <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center mb-10 card-shadow-2 relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-[32px] animate-ping opacity-75 duration-1000" />
          <span className="material-symbols-outlined text-white text-5xl relative z-10">temp_preferences_custom</span>
        </div>

        {/* Hero Copy */}
        <h1 className="text-[28px] font-bold text-primary mb-4 leading-tight tracking-tight">
          Your health record,<br />in one place
        </h1>
        
        <p className="text-secondary mb-10 text-[15px] leading-relaxed">
          Kaya mo 'to! AImhotech keeps your check-ups from the barangay kiosk, RHU, and hospitals together — so you never start from zero.
        </p>

        {/* Language Toggle */}
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

      {/* Footer Actions */}
      <div className="w-full max-w-sm mx-auto mt-auto pt-6 space-y-4">
        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg card-shadow-1 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          Next
        </button>
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
