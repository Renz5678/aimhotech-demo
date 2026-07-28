import React from 'react';

export default function PatientCard({ patient, riskCategory, lastScreeningDate, onSelect }) {
  const getRiskColor = (risk) => {
    if(risk === 'elevated') return 'bg-[#B0523F] text-white';
    if(risk === 'moderate') return 'bg-[#C79A3C] text-white';
    return 'bg-[#4C7A5A] text-white';
  };

  return (
    <div onClick={onSelect} className="bg-surface-container p-3 rounded-2xl flex items-center gap-3 card-shadow-1 active:scale-[0.98] transition-transform cursor-pointer">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${riskCategory ? getRiskColor(riskCategory) : 'bg-primary/20 text-primary'}`}>
        {patient.firstName[0]}{patient.lastName[0]}
      </div>
      <div className="flex-1">
        <div className="font-bold text-on-surface">{patient.firstName} {patient.lastName}</div>
        <div className="text-xs font-mono text-secondary">{patient.id}</div>
        {lastScreeningDate && <div className="text-xs text-secondary mt-1">Last: {lastScreeningDate}</div>}
      </div>
      {riskCategory && (
        <div className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${getRiskColor(riskCategory)}`}>
          {riskCategory.charAt(0).toUpperCase() + riskCategory.slice(1)}
        </div>
      )}
    </div>
  );
}
