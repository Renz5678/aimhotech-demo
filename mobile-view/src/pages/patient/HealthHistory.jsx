import React from 'react';
import TopBar from '../../components/layout/TopBar';
import BottomNavigation from '../../components/layout/BottomNavigation';
import Card from '../../components/ui/Card';

export default function HealthHistory() {
  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title="My Health" showNotification />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap">
        <Card>
          <h3 className="text-primary font-headline-sm mb-sm">History & Trends</h3>
          <p className="text-on-surface-variant font-body-md">
            This is where the chronological screening list and vitals trends will go.
          </p>
        </Card>
      </main>
      <BottomNavigation mode="patient" />
    </div>
  );
}
