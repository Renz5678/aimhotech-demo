import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import BottomNavigation from '../../components/layout/BottomNavigation';
import Button from '../../components/ui/Button';

export default function WorkerSettings() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Settings" />
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap">
        <Button variant="secondary" onClick={() => navigate('/login')}>
          Log Out
        </Button>
      </main>
      <BottomNavigation mode="worker" />
    </div>
  );
}
