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
          <div className="bg-amber-100 rounded-2xl p-4 flex justify-between items-center card-shadow-1 cursor-pointer" onClick={() => navigate('/worker/sync')}>
            <div>
              <div className="text-amber-800 font-bold flex items-center gap-1"><span className="material-symbols-outlined">sync_problem</span> {syncQueueCount} pending</div>
            </div>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95">View & Sync</button>
          </div>
        ) : (
          <div className="bg-green-100 rounded-2xl p-4 flex justify-between items-center card-shadow-1 cursor-pointer" onClick={() => navigate('/worker/sync')}>
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
