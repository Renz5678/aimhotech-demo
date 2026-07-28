import React, { useState } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import { useMobileStore } from '../../store/useMobileStore';

export default function Appointments() {
  const referrals = useLiveDemoStore(s => s.referrals);
  const facilities = useLiveDemoStore(s => s.facilities);
  const selectedPatientId = useMobileStore(s => s.selectedPatientId);
  const liveReferral = useLiveDemoStore(s => s.liveReferral);
  const triggerRef = useLiveDemoStore(s => s.hydrateFromSupabase);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleJoin = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  const activeReferral = referrals.find(r => r.patientId === selectedPatientId) || liveReferral;
  const displayReferral = activeReferral || {
    id: 'REF-2231',
    status: 'referred',
    destinationFacilityId: 'San Isidro Rural Health Unit',
    statusHistory: [
      { timestamp: new Date(Date.now() - 86400000).toISOString() },
      { timestamp: new Date().toISOString() }
    ]
  };
  
  const facilityName = facilities.find(f => f.id === displayReferral?.destinationFacilityId)?.name || displayReferral?.destinationLabel || 'Health Facility';
  
  const statusToStage = { 'flagged': 0, 'referred': 1, 'seen': 2, 'resolved': 3 };
  const currentStage = statusToStage[displayReferral.status] ?? 0;

  return (
    <div className="bg-background text-on-background min-h-screen">
      <header className="flex flex-col px-edge_margin pt-xl pb-md w-full bg-background sticky top-0 z-50">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwrKaiS5zL_9Pck5qBv1Y7tpWR1b4xht0iXKxnbePyQkcD6dx6AuNx-9mkXNr8q9SW3t7ClkMyvMqH_tck0I2TeLteLdErok2wb6GQD3VFtpAnNZ2avLwTRKEuf8Ae82tVGXrr9eJoeQSmtfv_m_Qpikj7nUCvW-OmCmPq0lIJgn0fPFPKr9GkWb7qyRSpuBemrcGRT0Vc7wuAXBooTX4K0NL7f7ZQlJEMKzTSXeOQOadkF0DmmF73pawrUPgnVAbvygioGS87XKQ"/>
            </div>
            <h1 className="text-headline-md font-headline-md text-primary">Appointments</h1>
          </div>
          <div className="flex items-center px-3 py-1 bg-secondary-container rounded-full gap-1.5 transition-all active:scale-95 duration-200 cursor-pointer" onClick={() => { triggerRef(); }}>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-label-sm font-label-sm text-on-secondary-container">{referrals.filter(r => r.patientId === selectedPatientId && r.status !== 'resolved').length} pending</span>
          </div>
        </div>
      </header>
      <main className="px-edge_margin pb-32 space-y-stack_gap">
        <div className="bg-surface-container-lowest rounded-[24px] p-lg card-shadow border border-outline-variant/30 shadow-[0_4px_12px_rgba(30,58,47,0.04)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1">Referral Case</p>
              <h2 className="text-headline-sm font-headline-sm text-primary">{displayReferral.id}</h2>
            </div>
            <span className="px-3 py-1 bg-secondary-container/50 text-on-secondary-container text-label-sm font-label-sm rounded-lg uppercase tracking-wide">
              {displayReferral.status === 'referred' ? 'In Progress' : displayReferral.status}
            </span>
          </div>
          
          <div className="relative flex justify-between items-start mb-8 px-2">
            <div className="absolute left-0 right-0 top-5 h-[2px] bg-surface-container-highest z-0 mx-8"></div>
            <div className="absolute left-0 top-5 h-[2px] bg-primary-container z-0 mx-8" style={{width: `${currentStage * 33}%`}}></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${currentStage >= 0 ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline'} flex items-center justify-center`}>
                {currentStage > 0 ? <span className="material-symbols-outlined !text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span> : <span className="text-body-lg font-headline-sm">1</span>}
              </div>
              <span className={`text-label-sm font-label-sm ${currentStage >= 0 ? 'text-primary font-bold' : 'text-outline'}`}>Flagged</span>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${currentStage >= 1 ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline'} flex items-center justify-center`}>
                {currentStage > 1 ? <span className="material-symbols-outlined !text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span> : <span className="text-body-lg font-headline-sm">2</span>}
              </div>
              <span className={`text-label-sm font-label-sm ${currentStage >= 1 ? 'text-primary font-bold' : 'text-outline'}`}>Referred</span>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${currentStage >= 2 ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline'} flex items-center justify-center`}>
                {currentStage > 2 ? <span className="material-symbols-outlined !text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span> : <span className="text-body-lg font-headline-sm">3</span>}
              </div>
              <span className={`text-label-sm font-label-sm ${currentStage >= 2 ? 'text-primary font-bold' : 'text-outline'}`}>Seen</span>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${currentStage >= 3 ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline'} flex items-center justify-center`}>
                {currentStage > 3 ? <span className="material-symbols-outlined !text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span> : <span className="text-body-lg font-headline-sm">4</span>}
              </div>
              <span className={`text-label-sm font-label-sm ${currentStage >= 3 ? 'text-primary font-bold' : 'text-outline'}`}>Resolved</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-md space-y-md mb-lg border border-outline-variant/20">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg text-primary-container">
                <span className="material-symbols-outlined">health_and_safety</span>
              </div>
              <div>
                <h3 className="text-body-lg font-headline-sm text-primary leading-tight">{facilityName}</h3>
                <p className="text-body-md font-body-md text-on-surface-variant">Primary Clinical Care Center</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-2 border-t border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline !text-[20px]">calendar_today</span>
                <span className="text-body-md font-body-md text-on-surface">Tue, Aug 4 • 9:00 AM</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline !text-[20px]">person</span>
                <span className="text-body-md font-body-md text-on-surface">Dra. Reyes • Specialist</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline !text-[20px]">medical_services</span>
                <span className="text-body-md font-body-md text-on-surface">Blood pressure follow-up</span>
              </div>
            </div>
          </div>

          <button onClick={handleJoin} className="w-full h-[56px] bg-primary-container text-white rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-primary-container/90 shadow-[0_8px_24px_rgba(30,58,47,0.15)]">
            <span className="material-symbols-outlined !text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>videocam</span>
            <span className="font-headline-sm text-body-lg">Join video consult</span>
          </button>
        </div>

        <section className="space-y-md">
          <div className="flex justify-between items-center">
            <h3 className="text-headline-sm font-headline-sm text-primary">Upcoming Appointments</h3>
            <button className="text-primary font-label-sm text-label-sm">View All</button>
          </div>
          
          {referrals.filter(r => r.patientId === selectedPatientId && r.id !== displayReferral.id).map(r => (
            <div key={r.id} className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20 flex gap-4 items-center transition-all active:scale-[0.99] cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex flex-col items-center justify-center text-on-secondary-container">
                <span className="text-label-sm font-bold"></span>
                <span className="text-[10px] uppercase font-bold">TBA</span>
              </div>
              <div className="flex-grow">
                <h4 className="text-body-lg font-bold text-primary">{r.id}</h4>
                <p className="text-body-md text-on-surface-variant">{facilities.find(f => f.id === r.destinationFacilityId)?.name || r.destinationLabel || 'Health Facility'}</p>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          ))}
        </section>
      </main>

      {/* Video Call Overlays */}
      {connecting && (
        <div className="absolute inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col items-center shadow-[0_4px_12px_rgba(30,58,47,0.04)]">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-3">refresh</span>
            <div className="font-bold text-lg text-primary">Connecting to Video...</div>
            <div className="text-on-surface-variant text-sm mt-1">Please wait for Dra. Reyes</div>
          </div>
        </div>
      )}
      {connected && (
        <div className="absolute inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center p-4 page-enter">
          <div className="flex-1 flex flex-col items-center justify-center text-white text-xl">
            <div className="w-24 h-24 bg-surface-container/20 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl">videocam</span>
            </div>
            <div className="font-bold mb-2">Video feed active</div>
            <div className="text-sm text-white/60">Connected securely</div>
          </div>
          <button onClick={() => setConnected(false)} className="bg-error hover:bg-error/90 text-white w-full py-4 rounded-xl font-bold mb-8 transition-colors">
            End Call
          </button>
        </div>
      )}
    </div>
  );
}
