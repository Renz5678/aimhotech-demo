import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = ({ mode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const patientTabs = [
    { label: 'Home', path: '/patient/home', icon: 'home' },
    { label: 'My Health', path: '/patient/health-history', icon: 'favorite' },
    { label: 'Visits', path: '/patient/appointments', icon: 'calendar_month' },
    { label: 'Settings', path: '/patient/settings', icon: 'settings' }
  ];

  const workerTabs = [
    { label: 'Home', path: '/worker/home', icon: 'home' },
    { label: 'Screening', path: '/worker/lookup', icon: 'add_circle' },
    { label: 'Lookup', path: '/worker/lookup', icon: 'person_search' },
    { label: 'Settings', path: '/worker/settings', icon: 'settings' }
  ];

  const tabs = mode === 'patient' ? patientTabs : workerTabs;

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-16 pb-safe z-50">
      {tabs.map(tab => {
        const active = location.pathname.startsWith(tab.path);
        return (
          <button 
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-[#1E3A2F]' : 'text-gray-400'}`}
          >
            <span className="material-symbols-outlined text-2xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
