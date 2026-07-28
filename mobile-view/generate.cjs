const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.resolve('/home/scarecrow/dev/aimhotech/mobile-view/src', file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

const append = (file, content) => {
  const fullPath = path.resolve('/home/scarecrow/dev/aimhotech/mobile-view/src', file);
  fs.appendFileSync(fullPath, '\n' + content.trim() + '\n');
}

// TASK 1: index.css
append('index.css', `
@keyframes slideInRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ripple { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
.page-enter { animation: slideInRight 0.25s ease-out; }
.bottom-sheet { animation: slideInUp 0.3s ease-out; }
.card-shadow-1 { box-shadow: 0 1px 3px rgba(30,58,47,0.08), 0 1px 2px rgba(30,58,47,0.06); }
.card-shadow-2 { box-shadow: 0 4px 12px rgba(30,58,47,0.12), 0 2px 4px rgba(30,58,47,0.08); }
.otp-box { width: 44px; height: 52px; border: 2px solid var(--outline-variant); border-radius: 12px; text-align: center; font-size: 24px; font-weight: 700; background: var(--surface-container-lowest); color: var(--on-surface); }
.otp-box:focus { border-color: var(--primary); outline: none; }
.bt-ripple { position: relative; }
.bt-ripple::before, .bt-ripple::after { content: ''; position: absolute; inset: -20px; border-radius: 50%; border: 2px solid var(--primary); animation: ripple 1.5s ease-out infinite; }
.bt-ripple::after { animation-delay: 0.5s; }
`);

// TASK 2: useMobileStore
write('store/useMobileStore.js', `
import { create } from 'zustand';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';

export const useMobileStore = create((set, get) => ({
  currentMode: 'patient',
  selectedPatientId: 'QC-097-00310',
  language: 'en',
  screeningStep: 0,
  pairedDevices: [],
  syncQueueCount: 3,
  isOnline: true,
  hasCapturedVitals: false,
  isSynced: false,
  vitalsSession: null,
  notifications: [
    { id: 'N1', title: 'New AI Brain Flag', body: 'Rosalinda Buenaventura flagged as elevated risk', read: false, timestamp: new Date(Date.now()-300000).toISOString() },
    { id: 'N2', title: 'Referral Update', body: 'Eduardo Santos referral to St. Luke\\'s created', read: false, timestamp: new Date(Date.now()-600000).toISOString() },
    { id: 'N3', title: 'Sync Complete', body: '14 records uploaded to AI Brain', read: true, timestamp: new Date(Date.now()-900000).toISOString() },
  ],

  setMode: (mode) => set({ currentMode: mode }),
  setLanguage: (lang) => set({ language: lang }),
  selectPatient: (id) => set({ selectedPatientId: id }),
  clearPatient: () => set({ selectedPatientId: null }),
  pairDevice: (deviceId) => set((s) => ({ pairedDevices: [...s.pairedDevices, deviceId] })),
  unpairDevice: (deviceId) => set((s) => ({ pairedDevices: s.pairedDevices.filter((d) => d !== deviceId) })),
  setVitalsSession: (vitals) => set({ vitalsSession: vitals }),
  clearVitalsSession: () => set({ vitalsSession: null }),
  submitVitals: () => {
    useLiveDemoStore.getState().triggerLiveSync();
    set({ hasCapturedVitals: true, screeningStep: 3 });
  },
  syncToBrain: () => set({ isSynced: true, syncQueueCount: 0 }),
  toggleOnline: () => set((s) => ({ isOnline: !s.isOnline })),
  markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  setScreeningStep: (step) => set({ screeningStep: step }),
}));
`);

// TASK 3: i18n
write('i18n/strings.js', `
export const strings = {
  en: {
    appName: 'AImhotech',
    tagline: 'Empowering Community Health',
    loginPatient: 'Patient',
    loginWorker: 'Health Worker',
    newHere: 'New here? Register',
    enterPhone: 'Enter phone number',
    enterOTP: 'Enter 6-digit code sent to',
    otpSent: 'Code sent to',
    verify: 'Verify',
    home: 'Home',
    myHealth: 'My Health',
    visits: 'Visits',
    settings: 'Settings',
    riskStatus: 'Risk Status',
    upcomingVisit: 'Upcoming Visit',
    healthTip: 'Health Tip',
    communityInsight: 'Community Insight',
    stationOverview: 'Station Overview',
    todayActivity: 'Today\\'s Activity',
    screeningsCompleted: 'Screenings',
    referralsMade: 'Referrals',
    beginScreening: 'Begin Screening',
    pairDevices: 'Pair Devices',
    captureVitals: 'Capture Vitals',
    riskAssessment: 'Risk Assessment',
    scanning: 'Scanning...',
    devicesPaired: 'Devices Paired',
    continueToVitals: 'Continue to Vitals',
    analyzeRisk: 'Analyze Risk',
    provisional: 'Provisional — On-Device AI',
    elevatedRisk: 'Elevated Risk',
    doneAndSave: 'Done (Save to Device)',
    createReferral: 'Create Referral',
    synced: 'Synced',
    pending: 'Pending',
    syncNow: 'Sync Now',
    dataConsent: 'Data Consent',
    consentBody: 'I consent to my data being collected.'
  },
  fil: {
    appName: 'AImhotech',
    tagline: 'Nagpapalakas ng Kalusugan sa Komunidad',
    loginPatient: 'Pasyente',
    loginWorker: 'Health Worker',
    newHere: 'Bago rito? Mag-rehistro',
    enterPhone: 'Ipasok ang numero ng telepono',
    enterOTP: 'Ipasok ang 6-digit code na ipinadala sa',
    otpSent: 'Code na ipinadala sa',
    verify: 'I-verify',
    home: 'Home',
    myHealth: 'Aking Kalusugan',
    visits: 'Mga Pagbisita',
    settings: 'Mga Setting',
    riskStatus: 'Status ng Panganib',
    upcomingVisit: 'Nakatakdang Pagbisita',
    healthTip: 'Tip sa Kalusugan',
    communityInsight: 'Pang-unawa sa Komunidad',
    stationOverview: 'Pangkalahatang-ideya ng Istasyon',
    todayActivity: 'Aktibidad Ngayon',
    screeningsCompleted: 'Mga Screening',
    referralsMade: 'Mga Referral',
    beginScreening: 'Simulan ang Screening',
    pairDevices: 'I-pair ang mga Device',
    captureVitals: 'Kuhanan ng Vitals',
    riskAssessment: 'Pagsusuri ng Panganib',
    scanning: 'Nag-i-scan...',
    devicesPaired: 'Mga Device na Naka-pair',
    continueToVitals: 'Magpatuloy sa Vitals',
    analyzeRisk: 'Suriin ang Panganib',
    provisional: 'Pansamantala — On-Device AI',
    elevatedRisk: 'Mataas na Panganib',
    doneAndSave: 'Tapos Na (I-save sa Device)',
    createReferral: 'Gumawa ng Referral',
    synced: 'Na-sync',
    pending: 'Nakabinbin',
    syncNow: 'I-sync Ngayon',
    dataConsent: 'Pahintulot sa Data',
    consentBody: 'Sumasang-ayon ako na makolekta ang aking data.'
  }
};
`);

write('hooks/useLanguage.js', `
import { strings } from '../i18n/strings';
import { useMobileStore } from '../store/useMobileStore';

export function useLanguage() {
  const language = useMobileStore((s) => s.language);
  const t = (key) => strings[language]?.[key] ?? strings.en[key] ?? key;
  return { t, language };
}
`);

// TASK 4: Login
write('pages/auth/Login.jsx', `
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
        <div className={\`absolute inset-0 transition-transform duration-300 \${step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}\`}>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setMode('patient')}
              className={\`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 \${mode === 'patient' ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container'}\`}
            >
              <span className="material-symbols-outlined text-4xl text-primary">person</span>
              <span className="font-semibold text-on-surface">{t('loginPatient')}</span>
            </button>
            <button
              onClick={() => setMode('worker')}
              className={\`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 \${mode === 'worker' ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container'}\`}
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
        <div className={\`absolute inset-0 transition-transform duration-300 \${step === 2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}\`}>
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
`);
