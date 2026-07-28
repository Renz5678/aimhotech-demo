"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, AlertTriangle, FileText, 
  CheckSquare, BarChart, ShieldAlert, Settings, UserCircle,
  Menu, ChevronLeft
} from 'lucide-react';
// Import the custom store (adjust path as necessary)
import { useAdminStore } from '@/store/useAdminStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname() || '/';
  const [collapsed, setCollapsed] = useState(false);
  const role = useAdminStore((state: any) => state.role || 'admin');
  
  const mainLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Registry', path: '/registry', icon: Users },
    { name: 'Risk', path: '/risk', icon: AlertTriangle },
    { name: 'Referrals', path: '/referrals', icon: FileText },
    { name: 'Validation', path: '/validation', icon: CheckSquare },
    { name: 'Reports', path: '/reports', icon: BarChart },
  ];

  const adminLinks = [
    { name: 'Admin Console', path: '/admin', icon: ShieldAlert },
  ];

  const bottomLinks = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Role Switch', path: '/role-switch', icon: UserCircle },
  ];

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname.startsWith(item.path);
    return (
      <Link 
        href={item.path}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1.5 font-medium ${
          isActive 
            ? 'bg-[#A3B18B]/20 text-[#F9F8F6] border-l-4 border-[#A3B18B] shadow-sm' 
            : 'text-[#F9F8F6]/70 hover:bg-[#A3B18B]/10 hover:text-[#F9F8F6] border-l-4 border-transparent'
        }`}
        title={collapsed ? item.name : undefined}
      >
        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#A3B18B]' : ''}`} />
        {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
      </Link>
    );
  };

  return (
    <aside 
      className={`h-screen flex flex-col transition-all duration-300 relative shadow-xl z-20`}
      style={{ backgroundColor: '#1E3A2F', width: collapsed ? '88px' : '280px' }}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-[#A3B18B]/10">
        {!collapsed && (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A3B18B] to-[#4C7A5A] flex items-center justify-center text-[#F9F8F6] font-bold shadow-sm">
              AI
            </div>
            <span className="text-[#F9F8F6] font-bold text-xl tracking-tight">AImhotech</span>
          </div>
        )}
        {collapsed && (
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A3B18B] to-[#4C7A5A] flex items-center justify-center text-[#F9F8F6] font-bold shadow-sm mx-auto">
             AI
           </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`text-[#F9F8F6]/50 hover:text-[#F9F8F6] p-1.5 rounded-lg hover:bg-[#A3B18B]/20 transition-colors ${collapsed ? 'absolute -right-4 top-6 bg-[#1E3A2F] border border-[#A3B18B]/20 rounded-full shadow-md z-30' : ''}`}
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col space-y-8 custom-scrollbar">
        {/* Main Section */}
        <div>
          {!collapsed && <p className="px-4 text-[10px] font-bold text-[#A3B18B] uppercase tracking-widest mb-3 opacity-80">Platform</p>}
          <nav>
            {mainLinks.map(item => <NavLink key={item.path} item={item} />)}
          </nav>
        </div>

        {/* Admin Section */}
        {role === 'super_admin' && (
          <div>
            {!collapsed && <p className="px-4 text-[10px] font-bold text-[#A3B18B] uppercase tracking-widest mb-3 opacity-80">Administration</p>}
            <nav>
              {adminLinks.map(item => <NavLink key={item.path} item={item} />)}
            </nav>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-[#A3B18B]/10 bg-[#1E3A2F]">
         <nav>
           {bottomLinks.map(item => <NavLink key={item.path} item={item} />)}
         </nav>
      </div>
    </aside>
  );
};
