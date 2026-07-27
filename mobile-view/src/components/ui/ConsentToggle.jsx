import React from 'react';
import Card from './Card';

export default function ConsentToggle({ 
  title = "Data Sharing Consent", 
  description = "I agree to share my health data with AImhotech to improve my care and track my risk over time.",
  checked,
  onChange 
}) {
  return (
    <Card className="flex items-start gap-md">
      <div className="flex-1">
        <h4 className="text-primary font-headline-sm text-[16px] mb-xs">{title}</h4>
        <p className="text-on-surface-variant font-body-md text-sm">{description}</p>
      </div>
      
      {/* Custom Switch / Toggle */}
      <div 
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
          checked ? 'bg-secondary' : 'bg-surface-container-highest'
        }`}
        onClick={() => onChange(!checked)}
      >
        <div 
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </Card>
  );
}
