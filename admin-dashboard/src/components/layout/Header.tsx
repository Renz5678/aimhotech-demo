"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';

export const Header: React.FC = () => {
  const pathname = usePathname() || '/dashboard';
  const { notifications } = useAdminStore((state: any) => ({
    notifications: state.notifications || [],
  }));
  const [showNotifications, setShowNotifications] = useState(false);
  const [datetime, setDatetime] = useState('Sat, Jul 26 2026 • 09:41 PHT');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const format = new Intl.DateTimeFormat('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(now);
      setDatetime(`${format} PHT`);
    };
    updateTime();
    const int = setInterval(updateTime, 60000);
    return () => clearInterval(int);
  }, []);

  const titleMap: Record<string, string> = {
    '/': 'Population Health Dashboard',
    '/patients': 'Patient Registry',
    '/risk-queue': 'Risk Queue',
    '/referrals': 'Referral Management',
    '/clinical-validation': 'Clinical Validation',
    '/reports': 'Reports & Analytics',
    '/settings': 'Settings'
  };

  const title = titleMap[pathname] || 'Dashboard';

  return (
    <header className="shrink-0 h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-[#1E3A2F]">{title}</h1>
        {pathname === '/' && (
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 font-medium border border-gray-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#4C7A5A]"></div>
            RHU Malanday • 8 stations
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-xs text-gray-500 font-mono tracking-wide">
          {datetime}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B0523F] rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-[#1E3A2F]">Notifications</h3>
                <span className="text-xs bg-[#A3B18B]/20 text-[#1E3A2F] font-bold px-2 py-0.5 rounded-full">{notifications.length}</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n: any, i: number) => (
                    <div key={i} className="px-5 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex gap-3 items-start">
                      <div className="mt-0.5 rounded-full bg-blue-50 p-1.5">
                        <Bell className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{n.message || n.text || 'New alert generated.'}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Just now</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center flex flex-col items-center justify-center text-gray-400">
                    <CheckCircle2 className="w-8 h-8 mb-2 text-gray-200" />
                    <p className="text-sm font-medium">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
