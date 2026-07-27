import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import Card from '../../../components/ui/Card';
import RiskBadge from '../../../components/ui/RiskBadge';
import Button from '../../../components/ui/Button';

export default function RiskResult() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Risk Assessment" subtitle="Step 3 of 3" />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap pb-[100px]">
        
        <div className="flex flex-col items-center justify-center py-xl text-center relative">
          <div className="absolute top-0 bg-secondary/10 text-secondary border border-secondary px-3 py-1 rounded-full text-xs font-bold mb-4 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
            Provisional — On-Device
          </div>
          
          <div className="mt-8">
            <RiskBadge level="high" />
          </div>
          <h2 className="text-error font-display-lg text-[28px] mt-md mb-xs">Elevated Risk</h2>
          <p className="text-on-surface-variant font-body-md px-lg">
            Likely referral required. Confirm once synced with AI Brain.
          </p>
        </div>

        <Card>
          <h3 className="text-primary font-headline-sm mb-xs">Recorded Vitals</h3>
          <div className="flex justify-between py-sm border-b border-outline-variant">
            <span className="text-on-surface-variant">BP</span>
            <span className="font-bold text-error">164/99 mmHg</span>
          </div>
          <div className="flex justify-between py-sm border-b border-outline-variant">
            <span className="text-on-surface-variant">HR</span>
            <span className="font-bold">88 bpm</span>
          </div>
          <div className="flex justify-between py-sm text-error">
            <span className="text-error font-medium">AFIB</span>
            <span className="font-bold">Detected</span>
          </div>
        </Card>

      </main>

      <div className="w-full p-md bg-surface-container-lowest border-t border-outline-variant z-40 flex flex-col gap-sm">
        <Button onClick={() => navigate('/worker/home')}>
          Done (Save to Device)
        </Button>
      </div>
    </div>
  );
}
