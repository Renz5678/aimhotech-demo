"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, User, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { SyncIndicator } from '../ui/SyncIndicator';

export const Header: React.FC = () => {
  const pathname = usePathname() || '/dashboard';
  const { role, notifications, pendingSync } = useAdminStore((state: any) => ({
    role: state.role || 'admin',
    notifications: state.notifications || [],
    pendingSync: state.pendingSync || 0
  }));
  const [showNotifications, setShowNotifications] = useState(false);

  const paths = pathname.split('/').filter(Boolean);

  return (
    <header className="shrink-0 h-20 border-b border-[#E4E1D8] bg-[#F9F8F6] flex items-center justify-between px-8 z-10 shadow-sm">
      {/* Breadcrumbs / Title */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-sm font-medium text-gray-500">
          <span className="hover:text-gray-800 cursor-pointer transition-colors">Home</span>
          {paths.map((p, i) => (
            <React.Fragment key={p}>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
              <span className={`capitalize ${i === paths.length - 1 ? 'font-bold text-[#1E3A2F]' : 'hover:text-gray-800 cursor-pointer transition-colors'}`}>
                {p.replace('-', ' ')}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <SyncIndicator pendingCount={pendingSync} />
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded-full transition-all"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#B0523F] rounded-full border-2 border-[#F9F8F6]"></span>
            )}
          </button>
          
          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 transform origin-top-right transition-all">
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

        {/* User Profile */}
        <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-[#1E3A2F]">Admin User</span>
            <span 
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1" 
              style={{ backgroundColor: '#EDF2EE', color: '#4C7A5A' }}
            >
              {role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A2F] to-[#2A4D3E] flex items-center justify-center text-[#F9F8F6] shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
