import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavigation({ mode = 'patient' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavItems = () => {
    if (mode === 'patient') {
      return [
        { path: '/patient/home', icon: 'home', label: 'Home' },
        { path: '/patient/history', icon: 'favorite', label: 'My Health' },
        { path: '/patient/appointments', icon: 'event_note', label: 'Visits' },
        { path: '/patient/settings', icon: 'settings', label: 'Settings' },
      ];
    } else {
      return [
        { path: '/worker/home', icon: 'home', label: 'Home' },
        { path: '/worker/lookup', icon: 'search', label: 'Lookup' },
        { path: '/worker/screening/device', icon: 'add_circle', label: 'Screening' },
        { path: '/worker/settings', icon: 'settings', label: 'Settings' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center h-[72px] px-4 pb-safe shadow-sm z-30 shrink-0">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center transition-all duration-150 rounded-xl py-1 px-4 ${
              isActive 
                ? 'text-primary font-bold scale-95' 
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-label-sm font-label-sm mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
