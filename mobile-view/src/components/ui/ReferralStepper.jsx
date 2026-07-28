import React from 'react';

export default function ReferralStepper({ steps, currentStepIndex, timestamps }) {
  return (
    <div className="flex justify-between items-start w-full relative pt-2">
      <div className="absolute top-5 left-4 right-4 h-1 bg-outline-variant -z-10 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} />
      </div>
      
      {steps.map((step, i) => {
        const isCompleted = i < currentStepIndex;
        const isCurrent = i === currentStepIndex;
        const isFuture = i > currentStepIndex;
        
        return (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 bg-surface border-2 transition-colors ${isCompleted ? 'border-primary bg-primary text-white' : isCurrent ? 'border-primary' : 'border-outline-variant'}`}>
              {isCompleted ? <span className="material-symbols-outlined text-[16px] font-bold">check</span> : isCurrent ? <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" /> : <div className="w-2.5 h-2.5 bg-outline-variant rounded-full" />}
            </div>
            <div className={`text-xs font-bold ${isCompleted || isCurrent ? 'text-primary' : 'text-secondary'}`}>{step}</div>
            {timestamps && timestamps[i] && <div className="text-[10px] text-secondary mt-1">{timestamps[i]}</div>}
          </div>
        );
      })}
    </div>
  );
}
