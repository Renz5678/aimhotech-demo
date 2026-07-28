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
