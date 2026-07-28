import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileStore } from '../../store/useMobileStore';
import { useLanguage } from '../../hooks/useLanguage';

export default function Login() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('patient');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const setStoreMode = useMobileStore(s => s.setMode);
  const { t } = useLanguage();

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleVerify = () => {
    setStoreMode(mode);
    navigate(mode === 'patient' ? '/patient/home' : '/worker/home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface p-6 page-enter relative overflow-hidden">
      <div className="text-center mt-12 mb-8">
        <h1 className="text-4xl font-bold text-primary">{t('appName')}</h1>
        <p className="text-secondary">{t('tagline')}</p>
      </div>

      <div className="relative w-full h-full flex-1">
        {/* Step 1 */}
        <div className={`absolute inset-0 transition-transform duration-300 ${step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setMode('patient')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${mode === 'patient' ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-4xl text-primary">person</span>
              <span className="font-semibold text-on-surface">{t('loginPatient')}</span>
            </button>
            <button
              onClick={() => setMode('worker')}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${mode === 'worker' ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-4xl text-primary">medical_services</span>
              <span className="font-semibold text-on-surface">{t('loginWorker')}</span>
            </button>
          </div>
          <input
            type="tel"
            placeholder={t('enterPhone')}
            className="w-full p-4 rounded-xl border-2 border-outline-variant mb-6 text-lg focus:border-primary focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg mb-6 card-shadow-1 active:scale-95 transition-transform"
            onClick={() => setStep(2)}
            disabled={!phone}
          >
            Continue
          </button>
          <div className="text-center">
            <button className="text-primary font-semibold">{t('newHere')}</button>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`absolute inset-0 transition-transform duration-300 ${step === 2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <button onClick={() => setStep(1)} className="mb-6 flex items-center text-primary font-semibold">
            <span className="material-symbols-outlined mr-1">arrow_back</span> Back
          </button>
          <h2 className="text-xl font-bold mb-2">{t('enterOTP')}</h2>
          <p className="text-secondary mb-8">{phone}</p>
          <div className="flex justify-between mb-8">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => otpRefs.current[i] = el}
                type="text"
                maxLength={1}
                className="otp-box"
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
              />
            ))}
          </div>
          <button
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg mb-6 card-shadow-1 active:scale-95 transition-transform disabled:opacity-50"
            disabled={otp.some(d => !d)}
            onClick={handleVerify}
          >
            {t('verify')}
          </button>
          <div className="text-center">
            <button className="text-primary font-semibold">Resend Code</button>
          </div>
        </div>
      </div>
    </div>
  );
}
