import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileStore } from '../../store/useMobileStore';
import { useLanguage } from '../../hooks/useLanguage';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import { supabase } from '../../../../packages/shared/src/lib/supabase';
import { useToast } from '../../components/ui/ToastContext';

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
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const applySession = (user) => {
    const meta = user.user_metadata ?? {};
    const userId = meta.userId ?? user.id;
    const role = meta.role ?? 'patient';
    const name = meta.name ?? user.email?.split('@')[0] ?? 'User';
    useMobileStore.getState().setCurrentUser(userId, role, name);
    useLiveDemoStore.getState().setCurrentUser(userId, role);
    if (role === 'barangay_health_worker') {
      setStoreMode('worker');
      navigate('/worker/home');
    } else {
      setStoreMode('patient');
      if (userId) useMobileStore.getState().selectPatient(userId);
      navigate('/patient/home');
    }
  };

  const handleSendCode = async () => {
    if (!id) return;
    setIsSubmitting(true);
    if (navigator.vibrate) navigator.vibrate(50);

    if (mode === 'worker') {
      // Workers use email + password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: id,
        password: phone,
      });
      setIsSubmitting(false);
      if (error || !data.user) {
        addToast(error?.message ?? 'Invalid credentials. Try again.', 'error');
        return;
      }
      addToast('Welcome back!', 'success');
      applySession(data.user);
      return;
    }

    // Patient mode — demo shortcut: BGY-041-00217 uses password auth
    if (id === 'BGY-041-00217') {
      // Skip OTP, go straight to step 2 which will do password login on verify
      addToast('Code sent! (Demo: any 6 digits work)', 'success');
      setStep(2);
      startTimer();
      setTimeout(() => { if (otpRefs.current[0]) otpRefs.current[0].focus(); }, 100);
      setIsSubmitting(false);
      return;
    }

    // General patient: send OTP via email
    const { error } = await supabase.auth.signInWithOtp({
      email: id + '@patient.aimhotech.io',
      options: { shouldCreateUser: false },
    });
    setIsSubmitting(false);
    if (error) {
      addToast('Patient ID not found. Try BGY-041-00217', 'error');
      return;
    }
    addToast('Verification code sent!', 'success');
    setStep(2);
    startTimer();
    setTimeout(() => { if (otpRefs.current[0]) otpRefs.current[0].focus(); }, 100);
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

    // Demo patient: use password auth
    if (id === 'BGY-041-00217') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'maria.santos@patient.aimhotech.io',
        password: 'PatientDemo2026!',
      });
      setIsSubmitting(false);
      if (error || !data.user) {
        addToast('Login failed. Check credentials.', 'error');
        return;
      }
      addToast('Welcome, Maria!', 'success');
      applySession(data.user);
      return;
    }

    // OTP verification for general patients
    const { data, error } = await supabase.auth.verifyOtp({
      email: id + '@patient.aimhotech.io',
      token: otp.join(''),
      type: 'email',
    });
    setIsSubmitting(false);
    if (error || !data.user) {
      addToast('Incorrect code. Try again.', 'error');
      return;
    }
    addToast('Login successful!', 'success');
    applySession(data.user);
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
              <p className="font-body-lg text-[16px] text-on-surface-variant">
                {mode === 'patient' ? 'Enter your Patient ID and phone number.' : 'Enter your work email and password.'}
              </p>
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
              {/* ID / Email Input */}
              <div className="space-y-1">
                <label className="font-label-sm text-[12px] font-semibold text-on-surface-variant ml-1" htmlFor="user-id">
                  {mode === 'patient' ? 'Patient ID' : 'Work Email'}
                </label>
                <input 
                  id="user-id"
                  className="w-full h-14 px-4 bg-white border border-outline-variant rounded-xl font-['IBM_Plex_Mono'] text-[13px] text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none" 
                  placeholder={mode === 'patient' ? 'BGY-041-00217' : 'a.reyes@rhu.gov.ph'}
                  type={mode === 'worker' ? 'email' : 'text'}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              {/* Password / Phone Input */}
              <div className="space-y-1">
                <label className="font-label-sm text-[12px] font-semibold text-on-surface-variant ml-1" htmlFor="second-field">
                  {mode === 'patient' ? 'Mobile Number' : 'Password'}
                </label>
                {mode === 'patient' ? (
                  <div className="flex gap-2">
                    <div className="w-20 h-14 px-4 flex items-center justify-center bg-surface-container-low border border-outline-variant rounded-xl font-body-lg text-[16px] text-on-surface-variant">
                      +63
                    </div>
                    <input 
                      id="second-field"
                      className="flex-1 h-14 px-4 bg-white border border-outline-variant rounded-xl font-body-lg text-[16px] text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none" 
                      placeholder="Phone number" 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                ) : (
                  <input 
                    id="second-field"
                    className="w-full h-14 px-4 bg-white border border-outline-variant rounded-xl font-body-lg text-[16px] text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none" 
                    placeholder="••••••••" 
                    type="password"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                )}
              </div>

              {mode === 'worker' && (
                <div className="text-xs text-on-surface-variant bg-surface-container-low rounded-xl p-3 border border-outline-variant/30">
                  Demo: <code className="font-mono">m.delacruz@brgy.gov.ph</code> · <code className="font-mono">AimhoDemo2026!</code>
                </div>
              )}
              {mode === 'patient' && (
                <div className="text-xs text-on-surface-variant bg-surface-container-low rounded-xl p-3 border border-outline-variant/30">
                  Demo Patient ID: <code className="font-mono">BGY-041-00217</code>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSendCode}
                disabled={!id || isSubmitting || (mode === 'patient' && !phone && id !== 'BGY-041-00217')}
                className="w-full h-[56px] bg-primary text-white font-headline-sm text-[20px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-all duration-200 disabled:opacity-50 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : mode === 'patient' ? (
                  <>
                    <span className="material-symbols-outlined">message</span>
                    Text me a code
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">login</span>
                    Sign in
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-auto mb-8 text-center">
              <p className="font-body-md text-[14px] text-on-surface-variant">
                New here? <button onClick={() => navigate('/onboarding')} className="text-secondary font-bold hover:underline">Start enrollment</button>
              </p>
            </div>
          </div>

          {/* OTP SCREEN (Patient mode only) */}
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
              <p className="font-body-lg text-[16px] text-on-surface-variant">We've sent a 6-digit code to <span className="font-bold">Patient ID {id}</span></p>
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
                disabled={otp.some(d => !d) || isSubmitting}
                className="w-full h-[56px] bg-primary text-white font-headline-sm text-[20px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">verified_user</span>
                    Verify &amp; login
                  </>
                )}
              </button>
            </div>

            {/* Security info card */}
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

        {/* Bottom Navigation Shell */}
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
