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

  // If liveReferral exists, use it. Otherwise, use a mock so the UI is always visible matching the screenshot.
  const displayReferral = liveReferral || {
    id: 'REF-2231',
    status: 'referred',
    destinationFacilityId: 'San Isidro Rural Health Unit',
    statusHistory: [
      { timestamp: new Date(Date.now() - 86400000).toISOString() }, // yesterday
      { timestamp: new Date().toISOString() } // today
    ]
  };

  const getStepIndex = (status) => {
    if (status === 'flagged') return 0;
    if (status === 'referred') return 1;
    if (status === 'seen') return 2;
    if (status === 'resolved') return 3;
    return 1;
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Appointments" rightIcon="refresh" onRightClick={() => { triggerRef(); alert('Refreshed referrals'); }} />
      <div className="flex-1 overflow-y-auto p-4 pb-24 page-enter">
        
        {/* Referral Card from Screenshot */}
        <div className="bg-surface-container-lowest rounded-[32px] p-6 card-shadow-1 border border-outline-variant/30 mb-8 mt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-on-surface text-lg">Referral {displayReferral.id}</h3>
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-orange-200">
              In Progress
            </div>
          </div>
          
          <div className="mb-8 px-2">
            <ReferralStepper 
              steps={['Flagged', 'Referred', 'Seen', 'Resolved']} 
              currentStepIndex={getStepIndex(displayReferral.status)}
              timestamps={displayReferral.statusHistory?.map(h => new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})) || []}
            />
          </div>

          <div className="bg-surface-container p-4 rounded-2xl mb-6">
            <h4 className="font-bold text-on-surface mb-1 text-[15px]">{displayReferral.destinationFacilityId}</h4>
            <p className="text-sm text-secondary leading-relaxed">
              Tue, Aug 4, 9:00 AM · Dra. Reyes · Blood pressure follow-up
            </p>
          </div>

          <button onClick={handleJoin} className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform card-shadow-1">
            <span className="material-symbols-outlined text-[20px]">play_arrow</span> Join video consult
          </button>
        </div>

        {/* Other Appointments (Optional, kept for functionality) */}
        {appointments.length > 0 && (
          <div>
            <h3 className="font-bold text-on-surface mb-3 px-1">Other Appointments</h3>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {connecting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-3xl flex flex-col items-center card-shadow-2">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-3">refresh</span>
            <div className="font-bold text-lg">Connecting to Video...</div>
            <div className="text-secondary text-sm mt-1">Please wait for Dra. Reyes</div>
          </div>
        </div>
      )}
      {connected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 page-enter">
          <div className="flex-1 flex flex-col items-center justify-center text-white text-xl">
            <div className="w-24 h-24 bg-surface-container/20 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl">videocam</span>
            </div>
            <div className="font-bold mb-2">Video feed active</div>
            <div className="text-sm text-white/60">Connected securely</div>
          </div>
          <button onClick={() => setConnected(false)} className="bg-red-500 hover:bg-red-600 text-white w-full py-4 rounded-2xl font-bold mb-8 transition-colors">
            End Call
          </button>
        </div>
      )}
    </div>
  );
}
