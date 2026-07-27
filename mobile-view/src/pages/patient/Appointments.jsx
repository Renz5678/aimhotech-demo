import React from 'react';
import TopBar from '../../components/layout/TopBar';
import BottomNavigation from '../../components/layout/BottomNavigation';
import Card from '../../components/ui/Card';

import { useDemoStore } from '../../store/useDemoStore';

export default function Appointments() {
  const { isReferredOnDashboard, simulateDashboardReferral, referrals } = useDemoStore();

  // For the demo, filter to the live referral if it exists
  const liveReferral = referrals.find(r => r.id.includes("LIVE"));

  return (
    <div className="flex flex-col h-full w-full relative">
      <TopBar title="Visits" showNotification />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap">
        <div className="flex justify-between items-center">
          <h2 className="text-primary font-headline-sm text-lg">My Referrals</h2>
          <button 
            onClick={simulateDashboardReferral}
            className="text-primary text-sm font-bold flex items-center gap-1 active:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh
          </button>
        </div>

        {liveReferral ? (
          <Card className="bg-white border-2 border-primary text-primary shadow-sm">
            <div className="flex justify-between items-start mb-sm">
              <h3 className="font-headline-sm">Referral Created</h3>
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                Referred
              </span>
            </div>
            <p className="font-body-md mb-2 text-[#24291F]">
              You have been referred to <strong>St. Luke's Medical Center - QC</strong> for specialized care.
            </p>
            <p className="text-xs text-primary/70">
              Created on {new Date(liveReferral.createdAt).toLocaleDateString()}
            </p>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-lg text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] opacity-20 mb-sm">event_available</span>
              <p className="font-body-md">No active referrals or appointments at this time.</p>
            </div>
          </Card>
        )}

      </main>
      <BottomNavigation mode="patient" />
    </div>
  );
}
