import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../components/layout/TopBar';
import VitalsInputCard from '../../../components/ui/VitalsInputCard';
import Button from '../../../components/ui/Button';

import { useDemoStore } from '../../../store/useDemoStore';

export default function VitalsCapture() {
  const navigate = useNavigate();
  const { submitVitals } = useDemoStore();

  const handleAnalyze = () => {
    submitVitals();
    navigate('/worker/screening/result');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Capture Vitals" subtitle="Step 2 of 3" showBack onBack={() => navigate('/worker/screening/device')} />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap pb-[100px]">
        
        {/* Hardcoded for Maria Dela Cruz Live Demo */}
        <VitalsInputCard 
          label="Blood Pressure" 
          value="164/99" 
          unit="mmHg" 
          icon="favorite" 
          source="device" 
        />

        <VitalsInputCard 
          label="Heart Rate" 
          value="88" 
          unit="bpm" 
          icon="monitor_heart" 
          source="device" 
        />
        
        <div className="bg-error-container/20 border border-error/50 p-4 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-error">warning</span>
          <p className="text-sm font-body-sm text-on-surface-variant">Device flagged possible Atrial Fibrillation (AFIB) during reading.</p>
        </div>

      </main>

      <div className="w-full p-md bg-surface-container-lowest border-t border-outline-variant z-40">
        <Button 
          onClick={handleAnalyze}
        >
          Analyze Risk
        </Button>
      </div>
    </div>
  );
}
