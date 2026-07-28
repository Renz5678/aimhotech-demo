"use client";

import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, trend, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    
    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplayValue(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 bg-white transition-all hover:shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">{title}</p>
          <h3 className="text-4xl font-bold tracking-tight" style={{ color: '#1E3A2F' }}>
            {displayValue.toLocaleString()}
          </h3>
          {trend && (
            <p className={`text-sm mt-3 font-medium flex items-center ${trend.isPositive ? 'text-[#4C7A5A]' : 'text-[#B0523F]'}`}>
              <span className={`inline-block mr-1 rounded-full px-1.5 py-0.5 text-xs ${trend.isPositive ? 'bg-[#4C7A5A]/10' : 'bg-[#B0523F]/10'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              from last month
            </p>
          )}
        </div>
        <div className="p-3.5 rounded-xl shadow-inner" style={{ backgroundColor: '#F9F8F6' }}>
          <Icon className="w-6 h-6" style={{ color: '#A3B18B' }} />
        </div>
      </div>
    </div>
  );
};
