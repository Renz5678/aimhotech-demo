"use client";

import React, { useState } from 'react';
import { Settings as SettingsIcon, LogOut, User, Shield, Moon, Sun } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { currentRole, isDarkMode, toggleDarkMode, currentUserName, currentUserEmail } = useAdminStore();
  const [timeout, setTimeoutVal] = useState('15m');
  
  const roleLabels: Record<string, string> = {
    'barangay_health_worker': 'Barangay Health Worker',
    'rhu_physician': 'RHU Physician',
    'doh_regional_officer': 'DOH Regional Officer',
    'super_admin': 'Super Admin'
  };

  const roleLabel = roleLabels[currentRole] || 'Admin';

  const handleLogout = async () => {
    await useAdminStore.getState().signOut();
    router.push('/login');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[#A3B18B]" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 shadow-sm">
            <h2 className="text-[14px] font-bold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#6B7566]" /> Profile
            </h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center text-xl font-bold uppercase">
                {currentUserName ? currentUserName.split(' ').map(w => w[0]).slice(0,2).join('') : 'A'}
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{currentUserName || 'Admin User'}</div>
                <div className="text-[13px] text-[#6B7566]">{roleLabel} · DOH Region IV-A</div>
              </div>
            </div>

            <button className="px-4 py-2 rounded-lg border border-[#D8D5CC] bg-white text-[#6B7566] text-[13px] font-semibold hover:bg-[#F1EEE7] transition-colors">
              Edit profile
            </button>
          </div>

          <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 shadow-sm">
            <h2 className="text-[14px] font-bold text-foreground mb-4 flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#6B7566]" /> Appearance
            </h2>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-foreground">Dark Mode</div>
                <div className="text-[11.5px] text-[#6B7566] mt-0.5">Toggle dark theme for the dashboard</div>
              </div>
              <button 
                onClick={toggleDarkMode}
                className="w-12 h-6 rounded-full bg-[#E4E1D8] relative transition-colors duration-300"
                style={{ backgroundColor: isDarkMode ? '#4C7A5A' : '#E4E1D8' }}
              >
                <div 
                  className="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300"
                  style={{ transform: `translateX(${isDarkMode ? '28px' : '4px'})` }}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 shadow-sm">
            <h2 className="text-[14px] font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#6B7566]" /> Session Security
            </h2>
            
            <div className="mb-5">
              <label className="block text-xs font-semibold mb-1.5 text-foreground">Auto sign-out</label>
              <select 
                value={timeout}
                onChange={(e) => setTimeoutVal(e.target.value)}
                className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-[13px] bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
              >
                <option value="5m">After 5 minutes idle</option>
                <option value="15m">After 15 minutes idle</option>
                <option value="30m">After 30 minutes idle</option>
                <option value="never">Never</option>
              </select>
              <p className="text-[11px] text-[#6B7566] mt-2">Required by DOH data privacy standards for administrative terminals.</p>
            </div>

            <div className="pt-5 border-t border-[#F1EEE7]">
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 rounded-lg border border-[#B0523F] bg-white text-[#B0523F] text-[13.5px] font-semibold hover:bg-[#B0523F0D] transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out completely
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
