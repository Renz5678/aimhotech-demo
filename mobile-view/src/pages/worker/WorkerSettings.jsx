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
