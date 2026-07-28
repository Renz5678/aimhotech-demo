"use client";

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

export type RiskLevel = 'Low' | 'Moderate' | 'Elevated';

export interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const config = {
    Low: { color: '#4C7A5A', bg: '#EDF2EE', icon: CheckCircle },
    Moderate: { color: '#C79A3C', bg: '#FDF6E3', icon: AlertTriangle },
    Elevated: { color: '#B0523F', bg: '#FDECE8', icon: AlertCircle },
  };

  const { color, bg, icon: Icon } = config[level] || config.Low;

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${className}`}
      style={{ backgroundColor: bg, color: color }}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
      {level}
    </span>
  );
};
