import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import BottomNavigation from '../../components/layout/BottomNavigation';
import SyncStatusBadge from '../../components/ui/SyncStatusBadge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { useDemoStore } from '../../store/useDemoStore';

export default function WorkerHome() {
  const navigate = useNavigate();
  const { isSynced, hasCapturedVitals, syncToBrain } = useDemoStore();

  return (
    <div className="flex flex-col h-full w-full relative">
      <TopBar 
        title="San Isidro Kiosk" 
        subtitle="Health Worker Mode"
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCzHG_xKgYuvHPrajWtThD6dDk9l96CDEP_g_s0wr2zAnYp4nydj9zWjOsaC57aMf5wjiUp4TnVMyz5pXoTzJMCF2Yqfy2erQzVXgOd1gZQDTdFClNXlrZatFurykwdoFhHYXsyXHoTowlv5l20XxlHp9sUpacLt0t0UaBPBzUePFJpCJae80guqjgxZCa2S-alDjeMnr_TPM8lMOrSJc9I4Coz3EXspYNIty__U_QW6R7kcBViGrRBxoFL2EjPGqwEs0wpY4JcCjE"
      />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap">
        
        <div className="flex justify-between items-center mb-md">
          <h2 className="text-primary font-headline-sm text-lg">Station Overview</h2>
          <div className="flex items-center gap-2">
            {!isSynced && hasCapturedVitals && (
              <Button size="sm" onClick={syncToBrain} className="bg-secondary text-white py-1 px-3 text-xs">
                Sync Now
              </Button>
            )}
            <SyncStatusBadge status={isSynced ? "synced" : "pending"} />
          </div>
        </div>

        <Card className="text-center p-xl bg-primary text-on-primary border-none mb-xl shadow-md">
          <span className="material-symbols-outlined text-[48px] text-primary-container mb-sm">person_add</span>
          <h3 className="font-headline-sm mb-sm text-white">Start New Screening</h3>
          <p className="font-body-md text-primary-container/80 mb-lg text-sm">
            Lookup a patient or pair devices to begin.
          </p>
          <Button variant="surface" onClick={() => navigate('/worker/lookup')} className="font-bold">
            Begin Screening
          </Button>
        </Card>

        <Card>
          <h3 className="text-primary font-headline-sm mb-xs">Today's Activity</h3>
          <div className="flex justify-between items-center py-sm border-b border-outline-variant">
            <span className="text-on-surface-variant font-body-md">Screenings Completed</span>
            <span className="text-primary font-label-sm">12</span>
          </div>
          <div className="flex justify-between items-center py-sm">
            <span className="text-on-surface-variant font-body-md">Referrals Made</span>
            <span className="text-primary font-label-sm">2</span>
          </div>
        </Card>

      </main>
      <BottomNavigation mode="worker" />
    </div>
  );
}
