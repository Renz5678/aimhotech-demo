import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileStore } from '../../store/useMobileStore';
import { useLanguage } from '../../hooks/useLanguage';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';

export default function Login() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('patient');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const setStoreMode = useMobileStore(s => s.setMode);
  const { t } = useLanguage();

  const [timeLeft, setTimeLeft] = useState(45);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
  };
  
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const startTimer = () => {
    setTimeLeft(45);
    setTimerRunning(true);
  };

  const handleSendCode = () => {
    setStep(2);
    startTimer();
    setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
    }, 100);
  };

  const handleVerify = () => {
    setStoreMode(mode);
    navigate(mode === 'patient' ? '/patient/home' : '/worker/home');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface p-base sm:p-md font-['Figtree',sans-serif]">
      {/* Mobile Container Emulator */}
      <div className="relative w-full max-w-[412px] h-[892px] bg-surface overflow-hidden shadow-2xl flex flex-col sm:rounded-[40px] sm:border-[8px] sm:border-primary">
        
        {/* Status Bar */}
        <div className="flex justify-between items-center px-edge_margin pt-sm pb-xs bg-surface text-on-surface">
          <span className="font-label-sm text-[12px] font-semibold">9:30</span>
          <div className="flex gap-xs items-center">
            <span className="material-symbols-outlined text-[18px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[18px]">wifi</span>
            <span className="material-symbols-outlined text-[18px]">battery_5_bar</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col px-edge_margin pt-xl relative">
          {/* Logo Section */}
          <div className="mb-xl">
            <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-on-primary-container text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            </div>
          </div>

          {/* LOGIN SCREEN */}
          <div className={`flex flex-col h-full absolute inset-0 pt-[104px] px-edge_margin transition-all duration-300 ${step === 1 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <header className="mb-xl">
              <h1 className="font-display-lg text-[32px] font-extrabold text-primary mb-xs">Welcome back</h1>
              <p className="font-body-lg text-[16px] text-on-surface-variant">Sign in with your {mode === 'patient' ? 'Patient' : 'Worker'} ID and mobile number.</p>
            </header>

            <div className="flex gap-xs mb-xl bg-surface-container-low p-1 rounded-xl">
              <button
                onClick={() => setMode('patient')}
                className={`flex-1 py-3 rounded-lg font-label-sm text-[12px] font-semibold transition-all ${mode === 'patient' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
              >
                Patient
              </button>
              <button
                onClick={() => setMode('worker')}
                className={`flex-1 py-3 rounded-lg font-label-sm text-[12px] font-semibold transition-all ${mode === 'worker' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
              >
                Worker
              </button>
            </div>

            <div className="space-y-4">
              {/* ID Input */}
              <div className="space-y-1">
                <label className="font-label-sm text-[12px] font-semibold text-on-surface-variant ml-1" htmlFor="user-id">{mode === 'patient' ? 'Patient' : 'Worker'} ID</label>
                <div className="relative">
                  <input 
                    id="user-id"
                    className="w-full h-14 px-4 bg-white border border-outline-variant rounded-xl font-['IBM_Plex_Mono'] text-[13px] text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none" 
                    placeholder="XXX-XXX-XXXXX" 
                    type="text" 
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Number Input */}
              <div className="space-y-1">
                <label className="font-label-sm text-[12px] font-semibold text-on-surface-variant ml-1" htmlFor="mobile-number">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="w-20 h-14 px-4 flex items-center justify-center bg-surface-container-low border border-outline-variant rounded-xl font-body-lg text-[16px] text-on-surface-variant">
                    +63
                  </div>
                  <input 
                    id="mobile-number"
                    className="flex-1 h-14 px-4 bg-white border border-outline-variant rounded-xl font-body-lg text-[16px] text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none" 
                    placeholder="Phone number" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSendCode}
                disabled={!phone}
                className="w-full h-[56px] bg-primary text-white font-headline-sm text-[20px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">message</span>
                Text me a code
              </button>
            </div>
            
            <div className="mt-auto mb-8 text-center">
              <p className="font-body-md text-[14px] text-on-surface-variant">
                New here? <button onClick={() => navigate('/onboarding')} className="text-secondary font-bold hover:underline">Start enrollment</button>
              </p>
            </div>
          </div>

          {/* OTP SCREEN */}
          <div className={`flex flex-col h-full absolute inset-0 pt-[104px] px-edge_margin transition-all duration-300 ${step === 2 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <header className="mb-8">
              <div className="mb-4">
                <button 
                  onClick={() => setStep(1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-primary">arrow_back</span>
                </button>
              </div>
              <h1 className="font-display-lg text-[32px] font-extrabold text-primary mb-2">Verify your identity</h1>
              <p className="font-body-lg text-[16px] text-on-surface-variant">We've sent a 6-digit code to <span className="font-bold">+63 {phone || '••• ••• 4127'}</span></p>
            </header>

            <div className="space-y-8">
              {/* 6-digit OTP Inputs */}
              <div className="flex justify-between gap-1 sm:gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => otpRefs.current[i] = el}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 bg-white border border-outline-variant rounded-xl text-center font-display-lg text-[24px] font-bold text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>

              <div className="text-center">
                {timeLeft > 0 ? (
                  <div className="font-body-md text-[14px] text-on-surface-variant flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    Resend code in <span className="font-bold tabular-nums">{minutes}:{seconds < 10 ? '0' : ''}{seconds}</span>
                  </div>
                ) : (
                  <button onClick={startTimer} className="text-secondary font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    Resend now
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleVerify}
                disabled={otp.some(d => !d)}
                className="w-full h-[56px] bg-primary text-white font-headline-sm text-[20px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">verified_user</span>
                Verify & login
              </button>
            </div>

            {/* Bento-style information card for security reassurance */}
            <div className="mt-8 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary-container rounded-lg">
                  <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div>
                  <h4 className="font-label-sm text-[12px] font-semibold text-primary uppercase">Secure Encryption</h4>
                  <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Your health data is protected with end-to-end clinical encryption standards.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation Shell (Filter Applied: Transactional Hidden) */}
        <footer className="mt-auto px-edge_margin pb-8 pt-4 flex items-center justify-between border-t border-outline-variant/20 bg-surface z-20 relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container text-[16px]">help</span>
            </div>
            <span className="font-label-sm text-[12px] font-semibold text-on-surface-variant">Need help?</span>
          </div>
          <div className="text-xs font-['IBM_Plex_Mono'] text-on-surface-variant/40">v2.4.0 (PROD)</div>
        </footer>

        {/* Bottom Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 rounded-full z-20"></div>
      </div>
    </div>
  );
}
