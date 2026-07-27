import React from 'react';

export default function RiskBadge({ level }) {
  const config = {
    low: {
      color: "bg-[#4C7A5A] text-white", // Deep sage-green
      label: "Low Risk",
      icon: "check_circle"
    },
    moderate: {
      color: "bg-[#C79A3C] text-white", // Warm amber
      label: "Moderate Risk",
      icon: "warning"
    },
    elevated: {
      color: "bg-[#B0523F] text-white", // Muted terracotta
      label: "Elevated Risk",
      icon: "error"
    }
  };

  const current = config[level?.toLowerCase()] || config.low;

  return (
    <span className={`px-sm py-1 rounded-full text-label-sm font-label-sm flex items-center gap-xs w-max ${current.color}`}>
      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        {current.icon}
      </span>
      {current.label}
    </span>
  );
}
