"use client";

import React from 'react';
import { Check } from 'lucide-react';

export type LifecycleStatus = 'Flagged' | 'Referred' | 'Seen' | 'Resolved';

const steps: LifecycleStatus[] = ['Flagged', 'Referred', 'Seen', 'Resolved'];

export interface StatusStepperProps {
  currentStatus: LifecycleStatus;
  className?: string;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus, className = '' }) => {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className={`flex items-center w-full ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const color = isCompleted || isCurrent ? '#1E3A2F' : '#E5E7EB'; // Forest Green for active
        const textColor = isCompleted || isCurrent ? '#1E3A2F' : '#9CA3AF';

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300"
                style={{ 
                  borderColor: color,
                  backgroundColor: isCompleted ? '#1E3A2F' : isCurrent ? '#F9F8F6' : '#FFFFFF'
                }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span style={{ color: isCurrent ? '#1E3A2F' : '#9CA3AF' }} className="text-sm font-semibold">
                    {index + 1}
                  </span>
                )}
              </div>
              <span className="mt-2 text-xs font-medium" style={{ color: textColor }}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 transition-colors duration-300" style={{ backgroundColor: color }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
