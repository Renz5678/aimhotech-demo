import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import BottomNavigation from '../../components/layout/BottomNavigation';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function PatientLookup() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Lookup Patient" showBack onBack={() => navigate('/worker/home')} />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap">
        
        <div className="flex flex-col gap-sm mb-lg">
          <input 
            type="text" 
            placeholder="Search by Patient ID or Name"
            className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm font-body-md text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <Card onClick={() => navigate('/worker/screening/device')} className="hover:bg-surface-container-low cursor-pointer">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-primary-fixed-dim">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h4 className="text-primary font-headline-sm text-base">Maria (Test Patient)</h4>
              <p className="text-on-surface-variant font-label-sm">ID: 0917-123-4567</p>
            </div>
          </div>
        </Card>

      </main>
      <BottomNavigation mode="worker" />
    </div>
  );
}
