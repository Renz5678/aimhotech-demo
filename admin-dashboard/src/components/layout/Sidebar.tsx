"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, AlertTriangle, FileText, CheckSquare, BarChart3, Settings, Brain } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useDemoStore } from '@/store/useDemoStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname() || '/';
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Patient Registry', path: '/patients', icon: Users },
    { name: 'Risk Queue', path: '/risk-queue', icon: AlertTriangle, hasBadge: true },
    { name: 'Referrals', path: '/referrals', icon: FileText },
    { name: 'Clinical Validation', path: '/clinical-validation', icon: CheckSquare },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'AI Brain & IFA', path: '/ai-brain', icon: Brain },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const riskFlags = useDemoStore((state: any) => state.riskFlags || []);
  const activeRisks = riskFlags.length;

  return (
    <aside className="h-full flex flex-col shadow-xl z-20 shrink-0 bg-[#1E3A2F] w-[216px]">
      <div className="flex items-center h-20 px-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#132820] flex items-center justify-center text-white font-bold shadow-sm relative">
            <span className="text-xl">+</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">AImhotech</span>
            <span className="text-white/50 text-[10px] font-bold tracking-wider">WEB ADMIN</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col space-y-1">
        {navItems.map(item => {
          const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] ${
                isActive 
                  ? 'bg-white/10 text-white border-[#A3B18B]' 
                  : 'text-white/60 border-transparent hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.hasBadge && activeRisks > 0 && (
                <span className="bg-[#B0523F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeRisks}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 bg-[#1E3A2F]">
        <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">VIEWING AS</div>
        <select className="w-full bg-white/5 border border-white/10 rounded text-xs text-white p-1.5 outline-none mb-3">
          <option>RHU Physician</option>
          <option>Super Admin</option>
          <option>DOH Officer</option>
          <option>BHW</option>
        </select>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            AR
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-sm font-medium truncate">Dr. Amelia Reyes</span>
            <span className="text-white/50 text-xs truncate">RHU Physician</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
