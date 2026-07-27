import React from 'react';
import Card from './Card';

export default function VitalsInputCard({ 
  label, 
  value, 
  unit, 
  icon, 
  source = 'manual' // 'manual' or 'device'
}) {
  return (
    <Card className="flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-xs mb-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-xs">
        <span className="text-primary font-display-lg text-[40px] leading-none">
          {value || '--'}
        </span>
        <span className="text-on-surface-variant font-body-md text-body-md">
          {unit}
        </span>
      </div>

      {source === 'device' && (
        <div className="absolute top-md right-md flex items-center gap-1 text-secondary">
          <span className="material-symbols-outlined text-[16px]">bluetooth</span>
          <span className="font-label-sm text-[10px] uppercase">Paired</span>
        </div>
      )}
    </Card>
  );
}
