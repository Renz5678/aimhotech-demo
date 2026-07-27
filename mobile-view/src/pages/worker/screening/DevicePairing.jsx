import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DevicePairing() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Pair Devices" subtitle="Step 1 of 3" showBack onBack={() => navigate('/worker/lookup')} />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap">
        
        <div className="text-center mb-xl">
          <span className="material-symbols-outlined text-[48px] text-primary mb-sm pulse-soft">bluetooth_searching</span>
          <h2 className="text-primary font-headline-md text-xl mb-xs">
            {scanning ? "Scanning for devices..." : "Devices Paired"}
          </h2>
          <p className="text-on-surface-variant font-body-md text-sm">
            Make sure the Microlife BP monitor is turned on.
          </p>
        </div>

        {!scanning && (
          <Card className="flex items-center gap-md bg-secondary-container/20 border-secondary">
            <span className="material-symbols-outlined text-secondary">check_circle</span>
            <div className="flex-1">
              <h4 className="text-primary font-headline-sm text-base">Microlife B6 Connect</h4>
              <p className="text-on-surface-variant font-label-sm">Connected successfully</p>
            </div>
          </Card>
        )}

      </main>

      <div className="w-full p-md bg-surface-container-lowest border-t border-outline-variant z-40">
        <Button 
          disabled={scanning}
          onClick={() => navigate('/worker/screening/vitals')}
        >
          Continue to Vitals
        </Button>
      </div>
    </div>
  );
}
