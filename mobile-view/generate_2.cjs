const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.resolve('/home/scarecrow/dev/aimhotech/mobile-view/src', file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

// TASK 5: Onboarding
write('pages/auth/Onboarding.jsx', `
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
        <button onClick={() => setLanguage('en')} className={\`px-3 py-1 rounded-full text-sm font-bold \${language === 'en' ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}\`}>EN</button>
        <button onClick={() => setLanguage('fil')} className={\`px-3 py-1 rounded-full text-sm font-bold \${language === 'fil' ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}\`}>FIL</button>
      </div>
      
      <div className="flex justify-center gap-2 mb-8">
        {[1,2,3].map(i => (
          <div key={i} className={\`h-2 w-12 rounded-full transition-colors \${step === i ? 'bg-primary' : 'bg-outline-variant'}\`} />
        ))}
      </div>

      <div className="relative flex-1">
        <div className={\`absolute inset-0 transition-transform duration-300 \${step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}\`}>
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

        <div className={\`absolute inset-0 transition-transform duration-300 \${step === 2 ? 'translate-x-0 opacity-100' : step < 2 ? 'translate-x-full opacity-0 pointer-events-none' : '-translate-x-full opacity-0 pointer-events-none'}\`}>
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

        <div className={\`absolute inset-0 transition-transform duration-300 \${step === 3 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}\`}>
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
`);

// TASK 6: PatientHome
write('pages/patient/PatientHome.jsx', `
import React, { useState, useEffect } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';
import TopBar from '../../components/layout/TopBar';

export default function PatientHome() {
  const [scrolled, setScrolled] = useState(false);
  const healthTips = useLiveDemoStore(s => s.healthTips);
  const tip = healthTips[0];

  useEffect(() => {
    const onScroll = (e) => setScrolled(e.target.scrollTop > 10);
    const el = document.getElementById('scroll-container');
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  // Dummy sparkline points
  const sparkline = "M0,25 L20,20 L40,22 L60,10 L80,15";

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar 
        title="Good morning, Rosalinda!" 
        subtitle="San Isidro, Quezon City" 
        rightIcon="notifications"
        scrolled={scrolled}
      />
      <div id="scroll-container" className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 page-enter">
        {/* Risk Card */}
        <div className="bg-primary text-white rounded-2xl p-5 card-shadow-2 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-primary-100 text-sm font-semibold mb-1">Current Risk Status</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                Elevated Risk <span className="text-sm bg-white/20 px-2 py-1 rounded-full text-white">78% conf</span>
              </div>
            </div>
            <div className="bg-[#B0523F] px-3 py-1 rounded-full text-sm font-bold shadow-sm">Elevated</div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-primary-100 text-sm">Last BP</div>
              <div className="text-xl font-bold">142/90</div>
            </div>
            <svg viewBox="0 0 80 30" className="w-20 h-8 opacity-80 overflow-visible">
              <path d={sparkline} fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Appointment Card */}
        <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-on-surface"><span className="material-symbols-outlined text-primary">calendar_month</span> Upcoming Visit</h3>
          <div className="flex gap-4">
            <div className="bg-primary/10 rounded-xl p-3 text-center min-w-[70px]">
              <div className="text-primary font-bold text-lg">Oct</div>
              <div className="text-primary font-black text-2xl">14</div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold text-lg text-on-surface">St. Luke's Medical Center</div>
              <div className="text-secondary font-semibold text-sm">9:00 AM • Cardiology Consult</div>
            </div>
          </div>
        </div>

        {/* Health Tip */}
        <div className="bg-surface-container rounded-xl p-4 border-l-4 border-secondary flex gap-4 items-start">
          <span className="material-symbols-outlined text-secondary text-3xl">lightbulb</span>
          <div>
            <h4 className="font-bold text-on-surface mb-1">{tip?.title || 'Tip'}</h4>
            <p className="text-sm text-secondary leading-snug">{tip?.description || ''}</p>
          </div>
        </div>

        {/* Goals */}
        <div className="flex gap-4">
          <div className="flex-1 bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-primary">directions_walk</span> <span className="font-bold">Steps</span></div>
            <div className="text-2xl font-black text-primary">5,432</div>
          </div>
          <div className="flex-1 bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-blue-500">water_drop</span> <span className="font-bold">Water</span></div>
            <div className="text-xl font-black">6/8 <span className="text-sm text-secondary">gl</span></div>
            <div className="h-2 bg-outline-variant rounded-full mt-2 overflow-hidden"><div className="h-full bg-blue-500 w-3/4 rounded-full" /></div>
          </div>
        </div>

        {/* Community Insight */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">groups</span>
          <p className="text-sm font-semibold text-on-surface">In San Isidro: 18% elevated risk this month. Stay proactive!</p>
        </div>
      </div>
    </div>
  );
}
`);

// TASK 7: HealthHistory
write('pages/patient/HealthHistory.jsx', `
import React, { useState } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';
import TopBar from '../../components/layout/TopBar';

export default function HealthHistory() {
  const [filter, setFilter] = useState('all');
  const screenings = useLiveDemoStore(s => s.screenings.filter(sc => sc.patientId === 'QC-097-00214'));

  // SVG Chart data
  const chartPoints = "M0,70 L20,40 L40,60 L60,30 L80,50 L100,20";

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="My Health" />
      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
        {['All', 'Blood Pressure', 'Glucose'].map(f => (
          <button key={f} onClick={() => setFilter(f.toLowerCase())} className={\`px-4 py-1.5 rounded-full whitespace-nowrap font-bold text-sm transition-colors \${filter === f.toLowerCase() ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}\`}>{f}</button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pt-0 pb-24 space-y-6 page-enter">
        <div className="bg-surface-container rounded-2xl p-5 card-shadow-1">
          <h3 className="font-bold mb-4 text-on-surface">Vitals Summary</h3>
          <div className="grid grid-cols-3 gap-2 text-center mb-6">
            <div><div className="text-xs text-secondary mb-1">Risk</div><div className="font-bold text-[#B0523F]">Elevated</div></div>
            <div className="border-l border-r border-outline-variant"><div className="text-xs text-secondary mb-1">Latest BP</div><div className="font-bold text-on-surface">142/90</div></div>
            <div><div className="text-xs text-secondary mb-1">Glucose</div><div className="font-bold text-on-surface">105</div></div>
          </div>
          <svg viewBox="0 0 100 80" className="w-full h-20 overflow-visible" preserveAspectRatio="none">
            <path d={chartPoints} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-on-surface px-1">Screening Timeline</h3>
          {screenings.length === 0 && <div className="text-center text-secondary py-8">No screenings found.</div>}
          {screenings.map((sc, i) => {
            const isHighBP = sc.vitals.bpSystolic > 140;
            const isHighGlucose = sc.vitals.glucose > 100;
            return (
              <div key={sc.id} className="bg-surface-container rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-sm text-secondary">{new Date(sc.timestamp).toLocaleDateString()}</div>
                  <div className="bg-[#B0523F]/10 text-[#B0523F] px-2 py-0.5 rounded text-xs font-bold">{sc.calculatedRiskScore > 0.5 ? 'Elevated' : 'Low'}</div>
                </div>
                <div className="flex justify-between items-center bg-surface p-3 rounded-xl border border-outline-variant">
                  <div className="flex-1">
                    <div className="text-xs text-secondary">BP</div>
                    <div className={\`font-bold \${isHighBP ? 'text-[#B0523F]' : 'text-on-surface'}\`}>{sc.vitals.bpSystolic}/{sc.vitals.bpDiastolic}</div>
                  </div>
                  <div className="flex-1 border-l border-outline-variant pl-3">
                    <div className="text-xs text-secondary">Glucose</div>
                    <div className={\`font-bold \${isHighGlucose ? 'text-amber-600' : 'text-on-surface'}\`}>{sc.vitals.glucose}</div>
                  </div>
                  <div className="flex-1 border-l border-outline-variant pl-3">
                    <div className="text-xs text-secondary">HR</div>
                    <div className="font-bold text-on-surface">{sc.vitals.heartRate}</div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary bg-primary/10 self-start px-2 py-1 rounded">Source: {sc.deviceSource}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
`);

// TASK 8: Appointments
write('pages/patient/Appointments.jsx', `
import React, { useState } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';
import TopBar from '../../components/layout/TopBar';
import ReferralStepper from '../../components/ui/ReferralStepper';

export default function Appointments() {
  const liveReferral = useLiveDemoStore(s => s.liveReferral);
  const triggerRef = useLiveDemoStore(s => s.simulateDashboardReferral);
  const appointments = useLiveDemoStore(s => s.appointments.filter(a => a.patientId === 'QC-097-00214'));
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleJoin = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Visits" rightIcon="refresh" onRightClick={() => { triggerRef(); alert('Refreshed referrals'); }} />
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 page-enter">
        
        {liveReferral && (
          <div>
            <h3 className="font-bold text-on-surface mb-3 px-1">My Referrals</h3>
            <div className="bg-surface-container rounded-2xl p-5 card-shadow-1">
              <div className="font-bold text-lg mb-1">{liveReferral.destinationFacilityId}</div>
              <div className="text-sm text-secondary mb-4">Referral ID: {liveReferral.id}</div>
              <ReferralStepper 
                steps={['Flagged', 'Referred', 'Seen', 'Resolved']} 
                currentStepIndex={liveReferral.status === 'flagged' ? 0 : liveReferral.status === 'referred' ? 1 : 2}
                timestamps={liveReferral.statusHistory?.map(h => new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))}
              />
            </div>
          </div>
        )}

        <div>
          <h3 className="font-bold text-on-surface mb-3 px-1">Upcoming Appointments</h3>
          {appointments.length === 0 && <div className="text-center text-secondary py-4">No upcoming appointments.</div>}
          <div className="space-y-3">
            {appointments.map(a => (
              <div key={a.id} className="bg-surface-container rounded-2xl p-4 border border-outline-variant">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span> {new Date(a.date).toLocaleDateString()} {a.time}
                  </div>
                  <div className="text-xs font-bold text-secondary bg-surface px-2 py-1 rounded">{a.type}</div>
                </div>
                <div className="font-bold text-lg">{a.facilityId}</div>
                {a.videoConsultUrl && (
                  <button onClick={handleJoin} className="mt-3 w-full bg-primary text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">videocam</span> Join Video Consult
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {connecting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl flex flex-col items-center">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-2">refresh</span>
            <div className="font-bold">Connecting to Video...</div>
          </div>
        </div>
      )}
      {connected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
          <div className="flex-1 flex items-center justify-center text-white text-xl">Video feed active</div>
          <button onClick={() => setConnected(false)} className="bg-red-500 text-white w-full py-4 rounded-xl font-bold mb-4">End Call</button>
        </div>
      )}
    </div>
  );
}
`);

// TASK 9: PatientSettings
write('pages/patient/PatientSettings.jsx', `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { useMobileStore } from '../../store/useMobileStore';

export default function PatientSettings() {
  const { language, setLanguage } = useMobileStore();
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Settings" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 page-enter">
        
        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Language</h3>
          <div className="bg-surface-container rounded-xl flex overflow-hidden">
            <button onClick={() => setLanguage('en')} className={\`flex-1 py-3 font-bold \${language === 'en' ? 'bg-primary text-white' : ''}\`}>English</button>
            <button onClick={() => setLanguage('fil')} className={\`flex-1 py-3 font-bold \${language === 'fil' ? 'bg-primary text-white' : ''}\`}>Filipino</button>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Notifications</h3>
          <div className="bg-surface-container rounded-xl p-2 space-y-2">
            {['Risk Alerts', 'Appointment Reminders', 'Referral Updates'].map(item => (
              <div key={item} className="flex justify-between items-center p-2">
                <span className="font-semibold">{item}</span>
                <input type="checkbox" defaultChecked className="toggle w-10 h-6" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Consent</h3>
          <div className="bg-surface-container rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Data Sharing</span>
              <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded">Enabled</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/onboarding')} className="flex-1 py-2 border-2 border-primary text-primary rounded-xl font-bold">Review</button>
              <button onClick={() => setShowConsent(true)} className="flex-1 py-2 bg-red-100 text-red-600 rounded-xl font-bold">Withdraw</button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Account</h3>
          <div className="bg-surface-container rounded-xl p-4 space-y-3">
            <div className="flex justify-between"><span className="text-secondary">Name</span><span className="font-bold">Rosalinda Buenaventura</span></div>
            <div className="flex justify-between"><span className="text-secondary">ID</span><span className="font-mono bg-surface px-2 py-1 rounded">QC-097-00214</span></div>
            <div className="flex justify-between"><span className="text-secondary">Barangay</span><span className="font-bold">San Isidro</span></div>
            <div className="flex justify-between"><span className="text-secondary">Member Since</span><span className="font-bold">Oct 2023</span></div>
          </div>
        </section>

        <div className="text-center text-sm text-secondary pt-4">
          <p>AImhotech v1.0.0</p>
          <a href="#" className="text-primary font-bold">Privacy Policy</a>
        </div>
      </div>

      {showConsent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Withdraw Consent?</h2>
            <p className="text-secondary mb-6">This will stop syncing your health data. Are you sure?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConsent(false)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold">Cancel</button>
              <button onClick={() => setShowConsent(false)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`);
