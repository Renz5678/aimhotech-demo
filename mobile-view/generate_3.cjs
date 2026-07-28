const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.resolve('/home/scarecrow/dev/aimhotech/mobile-view/src', file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

// TASK 10: WorkerHome
write('pages/worker/WorkerHome.jsx', `
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { useMobileStore } from '../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';
import NotificationBell from '../../components/ui/NotificationBell';

export default function WorkerHome() {
  const navigate = useNavigate();
  const { syncQueueCount, isSynced, syncToBrain, pairedDevices } = useMobileStore();
  const patients = useLiveDemoStore(s => s.patients).slice(0,3);

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="San Isidro Kiosk" subtitle="Health Worker Mode" rightElement={<NotificationBell />} />
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 page-enter">
        
        <div className="bg-surface-container rounded-2xl p-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary">kiosk_terminal</span>
          <div>
            <div className="font-bold text-lg">BHS-QC-097</div>
            <div className="text-secondary text-sm">Liza Marasigan</div>
          </div>
        </div>

        {syncQueueCount > 0 ? (
          <div className="bg-amber-100 rounded-2xl p-4 flex justify-between items-center card-shadow-1">
            <div>
              <div className="text-amber-800 font-bold flex items-center gap-1"><span className="material-symbols-outlined">sync_problem</span> {syncQueueCount} pending</div>
            </div>
            <button onClick={syncToBrain} className="bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95">Sync Now</button>
          </div>
        ) : (
          <div className="bg-green-100 rounded-2xl p-4 flex justify-between items-center card-shadow-1">
            <div className="text-green-800 font-bold flex items-center gap-1"><span className="material-symbols-outlined">cloud_done</span> All synced ✔</div>
            <div className="text-green-700 text-sm">Just now</div>
          </div>
        )}

        <button onClick={() => navigate('/worker/lookup')} className="w-full bg-primary text-white rounded-2xl p-6 text-left card-shadow-2 active:scale-95 transition-transform flex items-center justify-between">
          <div>
            <span className="material-symbols-outlined text-4xl mb-2">person_add</span>
            <h2 className="text-2xl font-bold">New Patient Screening</h2>
          </div>
          <span className="material-symbols-outlined text-3xl">arrow_forward</span>
        </button>

        <div>
          <h3 className="font-bold text-on-surface mb-3 px-1">Today's Activity</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-surface-container rounded-xl py-3 card-shadow-1"><div className="text-2xl font-bold text-primary">12</div><div className="text-xs text-secondary font-semibold">Screenings</div></div>
            <div className="bg-surface-container rounded-xl py-3 card-shadow-1"><div className="text-2xl font-bold text-primary">2</div><div className="text-xs text-secondary font-semibold">Referrals</div></div>
            <div className="bg-surface-container rounded-xl py-3 card-shadow-1"><div className="text-2xl font-bold text-primary">9</div><div className="text-xs text-secondary font-semibold">Synced</div></div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-on-surface mb-3 px-1 flex justify-between">Recent Patients <button className="text-primary text-sm">View All</button></h3>
          <div className="space-y-3">
            {patients.map(p => (
              <div key={p.id} className="bg-surface-container p-3 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">{p.firstName[0]}{p.lastName[0]}</div>
                <div className="flex-1">
                  <div className="font-bold">{p.firstName} {p.lastName}</div>
                  <div className="text-xs text-secondary">{p.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-on-surface mb-3 px-1">Device Status</h3>
          {pairedDevices.length > 0 ? (
            <div className="space-y-2">
              {pairedDevices.map(d => (
                <div key={d} className="bg-surface-container p-3 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">bluetooth_connected</span>
                  <div className="font-bold">{d}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container p-4 rounded-xl flex flex-col items-center justify-center text-secondary border-2 border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-3xl mb-1">bluetooth_searching</span>
              <p className="text-sm font-semibold">No devices paired</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
`);

// TASK 11: PatientLookup
write('pages/worker/PatientLookup.jsx', `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { useMobileStore } from '../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';
import QRScanModal from '../../components/ui/QRScanModal';
import PatientCard from '../../components/ui/PatientCard';
import OfflineBanner from '../../components/ui/OfflineBanner';

export default function PatientLookup() {
  const [search, setSearch] = useState('');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const { selectPatient, isOnline } = useMobileStore();
  const allPatients = useLiveDemoStore(s => s.patients);
  const riskFlags = useLiveDemoStore(s => s.riskFlags);

  const handleScan = (id) => {
    setShowQR(false);
    setSearch('Maria Dela Cruz');
  };

  const onSelect = (id) => {
    selectPatient(id);
    navigate('/worker/screening/device');
  };

  const filtered = search ? allPatients.filter(p => (p.firstName + ' ' + p.lastName).toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())) : allPatients.slice(0,3);

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Patient Lookup" showBack onBack={() => navigate('/worker/home')} />
      <OfflineBanner isOnline={isOnline} />
      
      <div className="p-4 bg-surface z-10 sticky top-0 border-b border-outline-variant/30 shadow-sm">
        <div className="flex gap-2">
          <div className="flex-1 bg-surface-container rounded-xl flex items-center px-3 border border-outline-variant focus-within:border-primary">
            <span className="material-symbols-outlined text-secondary">search</span>
            <input type="text" placeholder="Search name or ID" className="w-full bg-transparent p-3 focus:outline-none" value={search} onChange={e=>setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')}><span className="material-symbols-outlined text-secondary">close</span></button>}
          </div>
          <button onClick={() => setShowQR(true)} className="bg-primary text-white p-3 rounded-xl card-shadow-1">
            <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 page-enter">
        {!search && <h3 className="font-bold text-secondary text-sm uppercase px-1 mb-2">Recent Patients</h3>}
        {filtered.length > 0 ? (
          filtered.map(p => {
            const risk = riskFlags.find(r => r.patientId === p.id && r.status === 'confirmed');
            return (
              <PatientCard key={p.id} patient={p} riskCategory={risk?.riskCategory} lastScreeningDate="Oct 14, 2023" onSelect={() => onSelect(p.id)} />
            );
          })
        ) : (
          <div className="text-center py-12 flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-secondary/30 mb-4">person_search</span>
            <p className="text-secondary font-bold mb-6">No patient found</p>
            <button className="bg-primary/10 text-primary border-2 border-primary px-6 py-3 rounded-xl font-bold">Enroll New Patient</button>
          </div>
        )}
      </div>

      {showQR && <QRScanModal isOpen={showQR} onClose={() => setShowQR(false)} onScan={handleScan} />}
    </div>
  );
}
`);

// TASK 12: DevicePairing
write('pages/worker/screening/DevicePairing.jsx', `
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import { useMobileStore } from '../../../store/useMobileStore';

export default function DevicePairing() {
  const [scanning, setScanning] = useState(true);
  const [showManual, setShowManual] = useState(false);
  const navigate = useNavigate();
  const pairDevice = useMobileStore(s => s.pairDevice);

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    pairDevice('Microlife B6 Connect');
    pairDevice('Bionime iFree');
    navigate('/worker/screening/vitals');
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Pair Devices" subtitle="Step 1 of 3" showBack onBack={() => navigate(-1)} />
      
      <div className="flex justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-outline-variant" />
        <div className="w-2 h-2 rounded-full bg-outline-variant" />
      </div>

      <div className="flex-1 flex flex-col items-center p-6 text-center page-enter">
        {scanning ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bt-ripple w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-5xl text-primary">bluetooth_searching</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface">Scanning for devices...</h2>
            <p className="text-secondary mt-2">Ensure devices are turned on.</p>
          </div>
        ) : (
          <div className="w-full flex-1">
            <h2 className="text-xl font-bold text-on-surface mb-6 text-left">Devices Found</h2>
            <div className="space-y-4 text-left">
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-4">
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                <div><div className="font-bold">Microlife B6 Connect</div><div className="text-sm text-green-700">DEV-MLB6-1001</div></div>
              </div>
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-4">
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                <div><div className="font-bold">Bionime iFree</div><div className="text-sm text-green-700">DEV-BION-2001</div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-surface">
        <button onClick={handleContinue} disabled={scanning} className="w-full bg-primary text-white py-4 rounded-xl font-bold disabled:opacity-50 active:scale-95">Continue to Vitals</button>
        <div className="text-center mt-4">
          <button onClick={() => setShowManual(true)} className="text-primary font-bold">Enter Manually</button>
        </div>
      </div>

      {showManual && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-surface w-full p-6 rounded-t-3xl bottom-sheet">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manual Entry</h2>
              <button onClick={() => setShowManual(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4 mb-6">
              <input type="number" placeholder="Systolic (mmHg)" className="w-full border-2 border-outline-variant p-3 rounded-xl focus:border-primary focus:outline-none" />
              <input type="number" placeholder="Diastolic (mmHg)" className="w-full border-2 border-outline-variant p-3 rounded-xl focus:border-primary focus:outline-none" />
            </div>
            <button onClick={() => { setShowManual(false); handleContinue(); }} className="w-full bg-primary text-white py-4 rounded-xl font-bold">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
`);

// TASK 13: VitalsCapture
write('pages/worker/screening/VitalsCapture.jsx', `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import { useMobileStore } from '../../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';

export default function VitalsCapture() {
  const navigate = useNavigate();
  const { selectedPatientId, setVitalsSession } = useMobileStore();
  const patients = useLiveDemoStore(s => s.patients);
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const [showConfirm, setShowConfirm] = useState(true);

  const handleAnalyze = () => {
    setVitalsSession({ bpSystolic: 164, bpDiastolic: 99, heartRate: 88, glucose: 128 });
    navigate('/worker/screening/result');
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Capture Vitals" subtitle="Step 2 of 3" showBack onBack={() => navigate(-1)} />
      
      <div className="flex justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-outline-variant" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 page-enter pb-24">
        
        <div className="bg-surface-container p-3 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">{patient.firstName[0]}{patient.lastName[0]}</div>
          <div><div className="font-bold">{patient.firstName} {patient.lastName}</div><div className="text-xs text-secondary">{patient.id}</div></div>
        </div>

        <div className="bg-amber-100 border border-amber-300 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold mb-1"><span className="material-symbols-outlined">warning</span> Device detected possible AFIB</div>
          <details className="text-amber-800 text-sm mt-2"><summary className="cursor-pointer font-semibold">Learn more</summary><p className="mt-1">Irregular heartbeat detected during measurement. This requires physician review.</p></details>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-red-50 border-2 border-red-200 rounded-2xl p-5 card-shadow-1">
            <div className="flex justify-between items-start mb-2">
              <div className="text-red-800 font-bold">Blood Pressure</div>
              <span className="material-symbols-outlined text-primary">bluetooth</span>
            </div>
            <div className="text-4xl font-black text-red-700">164<span className="text-2xl text-red-500 font-bold">/99</span></div>
            <div className="text-sm text-red-600 mt-1">mmHg</div>
            <div className="mt-4 bg-white/50 text-xs font-semibold px-2 py-1 rounded inline-block">From Microlife B6</div>
          </div>

          <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="text-secondary font-bold text-sm mb-1">Heart Rate</div>
            <div className="text-2xl font-bold">88 <span className="text-sm font-normal">bpm</span></div>
            <div className="mt-2 bg-surface text-xs font-semibold px-2 py-1 rounded inline-block">From Microlife B6</div>
          </div>

          <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="text-secondary font-bold text-sm mb-1">Glucose</div>
            <div className="text-2xl font-bold">128 <span className="text-sm font-normal">mg/dL</span></div>
            <div className="mt-2 bg-surface text-xs font-semibold px-2 py-1 rounded inline-block">From Bionime iFree</div>
          </div>

          <div className="col-span-2 bg-surface-container rounded-2xl p-4 card-shadow-1 flex gap-4">
            <div className="flex-1"><label className="text-xs font-bold text-secondary">Height (cm)</label><input type="number" defaultValue="165" className="w-full bg-surface border border-outline-variant p-2 rounded mt-1 font-bold" /></div>
            <div className="flex-1"><label className="text-xs font-bold text-secondary">Weight (kg)</label><input type="number" defaultValue="70" className="w-full bg-surface border border-outline-variant p-2 rounded mt-1 font-bold" /></div>
            <div className="flex-1 flex flex-col justify-end"><div className="text-xs text-secondary font-bold">BMI</div><div className="font-bold text-lg">25.7</div></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-outline-variant/30">
        <button onClick={handleAnalyze} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg active:scale-95 card-shadow-1">Analyze Risk</button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2">Unusual Reading Detected</h2>
            <p className="text-secondary mb-6">BP 164/99 mmHg is very high. Please confirm or re-measure.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border-2 border-outline-variant rounded-xl font-bold text-secondary">Re-measure</button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`);

// TASK 14: RiskResult
write('pages/worker/screening/RiskResult.jsx', `
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import { useMobileStore } from '../../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';

export default function RiskResult() {
  const navigate = useNavigate();
  const { submitVitals, selectedPatientId } = useMobileStore();
  const triggerRef = useLiveDemoStore(s => s.createReferral);
  const [mounted, setMounted] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleCreateReferral = () => {
    triggerRef(selectedPatientId || 'QC-097-00310', 'FLAG-001', 'FAC-001');
    alert('Referral created successfully');
    navigate('/worker/home');
  };

  const handleDone = () => {
    submitVitals();
    navigate('/worker/home');
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Risk Assessment" subtitle="Step 3 of 3" />
      
      <div className="flex justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="bg-[#B0523F]/10 px-4 py-2 flex items-center justify-center gap-2 text-[#B0523F] font-bold text-sm mx-4 rounded-lg mb-4">
        <span className="material-symbols-outlined">bolt</span> Provisional — On-Device AI
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className={\`bg-white border-2 border-[#B0523F] rounded-2xl p-6 text-center card-shadow-2 transition-all duration-500 \${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}\`}>
          <span className="material-symbols-outlined text-6xl text-[#B0523F] mb-2">error</span>
          <h2 className="text-3xl font-black text-[#B0523F] mb-1">Elevated Risk</h2>
          <div className="text-secondary font-bold text-sm bg-surface px-3 py-1 rounded-full inline-block">78% Confidence</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-amber-600">warning</span>
          <div>
            <h3 className="font-bold text-amber-900 mb-1">AI Recommendation</h3>
            <p className="text-sm text-amber-800">Recommend immediate referral for physician review based on severely elevated blood pressure and detected AFIB.</p>
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
          <h3 className="font-bold mb-3 text-on-surface">Recorded Vitals</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div><div className="text-xs text-secondary">BP</div><div className="font-bold text-red-600">164/99 mmHg</div></div>
            <div><div className="text-xs text-secondary">HR</div><div className="font-bold">88 bpm</div></div>
            <div><div className="text-xs text-secondary">Glucose</div><div className="font-bold">128 mg/dL</div></div>
            <div><div className="text-xs text-secondary">AFIB</div><div className="font-bold text-red-600">Detected</div></div>
          </div>
        </div>

        <div className="bg-amber-100 p-3 rounded-xl flex items-center gap-2 text-amber-800 text-sm font-semibold justify-center">
          <span className="material-symbols-outlined text-lg">cloud_sync</span> Will sync to AI Brain when online
        </div>
      </div>

      <div className="p-4 bg-surface border-t border-outline-variant/30 flex gap-3">
        <button onClick={handleDone} className="flex-1 py-4 border-2 border-primary text-primary rounded-xl font-bold">Done (Save)</button>
        <button onClick={() => setShowBottomSheet(true)} className="flex-1 py-4 bg-primary text-white rounded-xl font-bold card-shadow-1">Create Referral</button>
      </div>

      {showBottomSheet && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-surface w-full p-6 rounded-t-3xl bottom-sheet">
            <h2 className="text-xl font-bold mb-4">Select Facility</h2>
            <div className="space-y-3 mb-6">
              {['St. Luke\\'s Medical Center', 'East Avenue Medical Center', 'QC General Hospital'].map((f, i) => (
                <div key={i} className={\`p-4 rounded-xl border-2 flex items-center gap-3 \${i === 0 ? 'border-primary bg-primary/10' : 'border-outline-variant'}\`}>
                  <input type="radio" name="fac" checked={i===0} readOnly className="w-5 h-5 accent-primary" />
                  <span className="font-bold">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBottomSheet(false)} className="flex-1 py-4 border-2 border-outline-variant rounded-xl font-bold">Cancel</button>
              <button onClick={handleCreateReferral} className="flex-2 w-full bg-primary text-white py-4 rounded-xl font-bold">Confirm Referral</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`);

// TASK 15: WorkerSettings
write('pages/worker/WorkerSettings.jsx', `
import React from 'react';
import TopBar from '../../components/layout/TopBar';
import { useMobileStore } from '../../store/useMobileStore';

export default function WorkerSettings() {
  const { pairedDevices, unpairDevice, isSynced, syncToBrain } = useMobileStore();

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Settings" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 page-enter">
        
        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Health Worker Info</h3>
          <div className="bg-surface-container rounded-xl p-4 space-y-3">
            <div className="flex justify-between"><span className="text-secondary">Name</span><span className="font-bold">Liza Marasigan</span></div>
            <div className="flex justify-between"><span className="text-secondary">Role</span><span className="font-bold">BHW</span></div>
            <div className="flex justify-between"><span className="text-secondary">Station</span><span className="font-bold">San Isidro BHS</span></div>
            <div className="flex justify-between"><span className="text-secondary">ID</span><span className="font-mono bg-surface px-2 py-1 rounded">HW-097-001</span></div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Device Management</h3>
          <div className="bg-surface-container rounded-xl p-2 space-y-2">
            {pairedDevices.length > 0 ? pairedDevices.map(d => (
              <div key={d} className="flex justify-between items-center p-3 bg-surface rounded-lg border border-outline-variant">
                <span className="font-bold text-sm">{d}</span>
                <button onClick={() => unpairDevice(d)} className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded">Unpair</button>
              </div>
            )) : <div className="p-4 text-center text-secondary text-sm font-semibold">No paired devices.</div>}
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Sync Settings</h3>
          <div className="bg-surface-container rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="font-bold mb-1">Status: {isSynced ? 'Synced' : 'Pending'}</div>
              <div className="text-xs text-secondary">Auto-sync enabled when online</div>
            </div>
            <button onClick={syncToBrain} className="bg-primary text-white px-4 py-2 rounded font-bold text-sm">Force Sync</button>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Security & App</h3>
          <div className="bg-surface-container rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">App Lock (PIN)</span>
              <input type="checkbox" defaultChecked className="w-6 h-6 accent-primary" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Language</span>
              <span className="text-primary font-bold">English</span>
            </div>
            <div className="pt-2 border-t border-outline-variant">
              <div className="text-xs text-secondary mb-1">Station ID: BHS-QC-097</div>
              <div className="text-xs text-secondary">Kiosk ID: K-01</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
`);

// TASK 16: Components
write('components/ui/ReferralStepper.jsx', `
import React from 'react';

export default function ReferralStepper({ steps, currentStepIndex, timestamps }) {
  return (
    <div className="flex justify-between items-start w-full relative pt-2">
      <div className="absolute top-5 left-4 right-4 h-1 bg-outline-variant -z-10 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: \`\${(currentStepIndex / (steps.length - 1)) * 100}%\` }} />
      </div>
      
      {steps.map((step, i) => {
        const isCompleted = i < currentStepIndex;
        const isCurrent = i === currentStepIndex;
        const isFuture = i > currentStepIndex;
        
        return (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className={\`w-7 h-7 rounded-full flex items-center justify-center mb-2 bg-surface border-2 transition-colors \${isCompleted ? 'border-primary bg-primary text-white' : isCurrent ? 'border-primary' : 'border-outline-variant'}\`}>
              {isCompleted ? <span className="material-symbols-outlined text-[16px] font-bold">check</span> : isCurrent ? <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" /> : <div className="w-2.5 h-2.5 bg-outline-variant rounded-full" />}
            </div>
            <div className={\`text-xs font-bold \${isCompleted || isCurrent ? 'text-primary' : 'text-secondary'}\`}>{step}</div>
            {timestamps && timestamps[i] && <div className="text-[10px] text-secondary mt-1">{timestamps[i]}</div>}
          </div>
        );
      })}
    </div>
  );
}
`);

write('components/ui/PatientCard.jsx', `
import React from 'react';

export default function PatientCard({ patient, riskCategory, lastScreeningDate, onSelect }) {
  const getRiskColor = (risk) => {
    if(risk === 'elevated') return 'bg-[#B0523F] text-white';
    if(risk === 'moderate') return 'bg-[#C79A3C] text-white';
    return 'bg-[#4C7A5A] text-white';
  };

  return (
    <div onClick={onSelect} className="bg-surface-container p-3 rounded-2xl flex items-center gap-3 card-shadow-1 active:scale-[0.98] transition-transform cursor-pointer">
      <div className={\`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg \${riskCategory ? getRiskColor(riskCategory) : 'bg-primary/20 text-primary'}\`}>
        {patient.firstName[0]}{patient.lastName[0]}
      </div>
      <div className="flex-1">
        <div className="font-bold text-on-surface">{patient.firstName} {patient.lastName}</div>
        <div className="text-xs font-mono text-secondary">{patient.id}</div>
        {lastScreeningDate && <div className="text-xs text-secondary mt-1">Last: {lastScreeningDate}</div>}
      </div>
      {riskCategory && (
        <div className={\`px-2 py-1 rounded text-xs font-bold shadow-sm \${getRiskColor(riskCategory)}\`}>
          {riskCategory.charAt(0).toUpperCase() + riskCategory.slice(1)}
        </div>
      )}
    </div>
  );
}
`);

write('components/ui/OfflineBanner.jsx', `
import React from 'react';

export default function OfflineBanner({ isOnline }) {
  if (isOnline) return null;
  return (
    <div className="bg-amber-100 text-amber-900 px-4 py-2 flex items-center justify-center gap-2 text-sm font-bold w-full animate-[slideInUp_0.3s_ease-out]">
      <span className="material-symbols-outlined text-[18px]">wifi_off</span>
      Offline — showing cached data
    </div>
  );
}
`);

write('components/ui/QRScanModal.jsx', `
import React, { useEffect } from 'react';

export default function QRScanModal({ isOpen, onClose, onScan }) {
  useEffect(() => {
    if(isOpen) {
      const t = setTimeout(() => onScan('QC-097-00310'), 1500);
      return () => clearTimeout(t);
    }
  }, [isOpen, onScan]);

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
      <button onClick={onClose} className="absolute top-6 left-6 text-white"><span className="material-symbols-outlined text-3xl">close</span></button>
      
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg animate-pulse" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg animate-pulse" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg animate-pulse" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg animate-pulse" />
        <div className="absolute inset-0 bg-primary/10" />
      </div>
      
      <h2 className="text-white text-xl font-bold animate-pulse">Scanning...</h2>
      <p className="text-white/60 text-sm mt-2">Align QR code within the frame</p>
    </div>
  );
}
`);

write('components/ui/NotificationBell.jsx', `
import React, { useState } from 'react';
import { useMobileStore } from '../../store/useMobileStore';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, markAllNotificationsRead } = useMobileStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative p-2">
        <span className="material-symbols-outlined text-primary">notifications</span>
        {unread > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-surface" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50">
          <div className="bg-surface w-full h-[80vh] rounded-t-3xl bottom-sheet flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-outline-variant">
              <h2 className="text-xl font-bold">Notifications</h2>
              <button onClick={() => setOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-bold text-secondary">{unread} Unread</span>
              {unread > 0 && <button onClick={markAllNotificationsRead} className="text-sm font-bold text-primary">Mark all read</button>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map(n => (
                <div key={n.id} className={\`p-4 rounded-xl flex gap-3 \${!n.read ? 'bg-primary/5 border border-primary/20' : 'bg-surface-container'}\`}>
                  {!n.read && <div className="w-2 h-2 mt-2 bg-primary rounded-full shrink-0" />}
                  <div>
                    <div className={\`font-bold \${!n.read ? 'text-on-surface' : 'text-secondary'}\`}>{n.title}</div>
                    <div className="text-sm text-secondary mt-1">{n.body}</div>
                    <div className="text-xs text-secondary/70 mt-2">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`);

// TASK 17: App.jsx
write('App.jsx', `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileContainer from './components/layout/MobileContainer';
import Login from './pages/auth/Login';
import Onboarding from './pages/auth/Onboarding';

// Patient Pages
import PatientHome from './pages/patient/PatientHome';
import HealthHistory from './pages/patient/HealthHistory';
import Appointments from './pages/patient/Appointments';
import PatientSettings from './pages/patient/PatientSettings';

// Worker Pages
import WorkerHome from './pages/worker/WorkerHome';
import PatientLookup from './pages/worker/PatientLookup';
import DevicePairing from './pages/worker/screening/DevicePairing';
import VitalsCapture from './pages/worker/screening/VitalsCapture';
import RiskResult from './pages/worker/screening/RiskResult';
import WorkerSettings from './pages/worker/WorkerSettings';

export default function App() {
  return (
    <Router>
      <MobileContainer>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/patient/home" element={<PatientHome />} />
          <Route path="/patient/history" element={<HealthHistory />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/settings" element={<PatientSettings />} />

          <Route path="/worker/home" element={<WorkerHome />} />
          <Route path="/worker/lookup" element={<PatientLookup />} />
          <Route path="/worker/screening/device" element={<DevicePairing />} />
          <Route path="/worker/screening/vitals" element={<VitalsCapture />} />
          <Route path="/worker/screening/result" element={<RiskResult />} />
          <Route path="/worker/settings" element={<WorkerSettings />} />
        </Routes>
      </MobileContainer>
    </Router>
  );
}
`);
