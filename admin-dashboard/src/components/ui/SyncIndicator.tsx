"use client";

import React from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export interface SyncIndicatorProps {
  pendingCount: number;
  isSyncing?: boolean;
  className?: string;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({ pendingCount, isSyncing = false, className = '' }) => {
  const isAllSynced = pendingCount === 0;

  return (
    <div className={`flex items-center space-x-2 text-sm font-semibold px-3 py-1.5 rounded-full ${isSyncing ? 'bg-blue-50' : isAllSynced ? 'bg-[#EDF2EE]' : 'bg-[#FDF6E3]'} ${className}`}>
      {isSyncing ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-blue-700">Syncing...</span>
        </>
      ) : isAllSynced ? (
        <>
          <Cloud className="w-4 h-4" style={{ color: '#4C7A5A' }} />
          <span style={{ color: '#4C7A5A' }}>All synced</span>
        </>
      ) : (
        <>
          <CloudOff className="w-4 h-4" style={{ color: '#C79A3C' }} />
          <span style={{ color: '#C79A3C' }}>{pendingCount} pending</span>
        </>
      )}
    </div>
  );
};
