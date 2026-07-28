import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileStore } from '../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import { useLanguage } from '../../hooks/useLanguage';

export default function WorkerHome() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { syncQueueCount, currentUserId } = useMobileStore();
  const patients = useLiveDemoStore(s => s.patients);
  const workerStats = useLiveDemoStore(s => s.workerStats);
  const activityFeed = useLiveDemoStore(s => s.activityFeed);
  const screenings = useLiveDemoStore(s => s.screenings);
  const referrals = useLiveDemoStore(s => s.referrals);
  
  const todayFilter = s => new Date(s.timestamp).toDateString() === new Date().toDateString();
  const screeningsTodayCount = screenings.filter(s => currentUserId ? (s.healthWorkerId === currentUserId && todayFilter(s)) : todayFilter(s)).length;
  const referralsTodayCount = referrals.filter(s => currentUserId ? (s.healthWorkerId === currentUserId && todayFilter(s)) : todayFilter(s)).length;
  const recentScreenings = screenings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen pb-32 bg-background font-figtree">
      <header className={`flex flex-col px-edge_margin pt-xl pb-md w-full sticky top-0 z-40 transition-all ${isScrolled ? 'shadow-md bg-white/90 backdrop-blur-md' : 'bg-background'}`}>
        <div className="flex items-center justify-between mb-sm">
          <div className="flex items-center gap-xs">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-fixed rotate-45"></div>
              <span className="material-symbols-outlined text-white text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>medical_services</span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Health Worker</span>
            </div>
          </div>
          <div 
            className="bg-surface-container-high px-sm py-1.5 rounded-full flex items-center gap-1.5 active-press transition-all cursor-pointer"
            onClick={() => navigate('/worker/sync')}
          >
            <div className={`w-2 h-2 rounded-full ${syncQueueCount > 0 ? 'bg-[#C79A3C]' : 'bg-green-500'}`}></div>
            <span className="text-label-sm font-label-sm text-on-surface">
              {syncQueueCount > 0 ? `${syncQueueCount} pending` : 'Synced'}
            </span>
          </div>
        </div>
        <div className="mt-base">
          <h1 className="text-headline-md font-headline-md text-primary leading-tight">Barangay San Isidro</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Health Station • Sat, Jul 26 • Aling Nena on duty</p>
        </div>
      </header>

      <main className="px-edge_margin space-y-stack_gap mt-md">
        <div className="grid grid-cols-2 gap-md">
          <div className="bg-surface-container-lowest p-md rounded-xl custom-shadow flex flex-col justify-between h-[120px] relative overflow-hidden border border-outline-variant/30 active-press transition-all">
            <div className="absolute -right-4 -top-4 opacity-5">
              <span className="material-symbols-outlined text-[80px]">fact_check</span>
            </div>
            <div>
              <h2 className="text-display-lg font-display-lg text-primary">{screeningsTodayCount}</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Screenings today</p>
            </div>
            <div className="w-8 h-1 bg-secondary-fixed rounded-full"></div>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-xl custom-shadow flex flex-col justify-between h-[120px] relative overflow-hidden border border-outline-variant/30 active-press transition-all">
            <div className="absolute -right-4 -top-4 opacity-5">
              <span className="material-symbols-outlined text-[80px]">assignment_turned_in</span>
            </div>
            <div>
              <h2 className="text-display-lg font-display-lg text-primary">{referralsTodayCount}</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Referrals created</p>
            </div>
            <div className="w-8 h-1 bg-secondary-fixed rounded-full"></div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/worker/lookup')}
          className="w-full h-[56px] bg-primary text-white rounded-xl font-body-lg flex items-center justify-center gap-2 active-press transition-all duration-200 shadow-lg shadow-primary/10"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-bold">Start New Screening</span>
        </button>

        {syncQueueCount > 0 ? (
          <div 
            onClick={() => navigate('/worker/sync')}
            className="bg-surface-container-low border border-outline-variant/20 rounded-xl px-md py-sm flex items-center justify-between active-press transition-all cursor-pointer"
          >
            <div className="flex items-center gap-sm">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C79A3C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C79A3C]"></span>
              </div>
              <div className="flex flex-col">
                <p className="text-body-md font-bold text-on-surface leading-tight">{syncQueueCount} records waiting to sync</p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Last sync 7:42 AM</p>
              </div>
            </div>
            <div className="flex items-center text-on-secondary-container gap-1">
              <span className="text-label-sm font-bold uppercase">View</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => navigate('/worker/sync')}
            className="bg-surface-container-low border border-outline-variant/20 rounded-xl px-md py-sm flex items-center justify-between active-press transition-all cursor-pointer"
          >
            <div className="flex items-center gap-sm">
              <div className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <div className="flex flex-col">
                <p className="text-body-md font-bold text-on-surface leading-tight">All synced</p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Just now</p>
              </div>
            </div>
            <div className="flex items-center text-on-secondary-container gap-1">
              <span className="text-label-sm font-bold uppercase">View</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </div>
        )}

        <section className="bg-surface-container-lowest rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
          <div className="px-md py-sm border-b border-outline-variant/20 bg-surface-container-low/50">
            <h3 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Recent Activity</h3>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {recentScreenings.map((screening, i) => {
              const p = patients.find(p => p.id === screening.patientId) || { name: 'Unknown Patient' };
              const colors = ['bg-[#4C7A5A]', 'bg-[#C79A3C]', 'bg-[#B0523F]'];
              const statuses = ['low risk', 'moderate', 'elevated'];
              
              const isElevated = screening.riskLevel === 'high' || screening.riskLevel === 'elevated';
              const isModerate = screening.riskLevel === 'medium' || screening.riskLevel === 'moderate';
              const riskIndex = isElevated ? 2 : isModerate ? 1 : 0;
              
              const color = colors[riskIndex];
              const status = statuses[riskIndex];
              const textColors = ['text-[#4C7A5A]', 'text-[#C79A3C]', 'text-[#B0523F]'];
              const textColor = textColors[riskIndex];
              const timeFormatted = new Date(screening.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              
              return (
                <div key={screening.id || i} className="px-md py-md flex items-center gap-md active-press transition-all hover:bg-surface-container-low/30 cursor-pointer">
                  <div className={`w-1 h-10 ${color} rounded-full`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-body-lg font-bold text-on-surface truncate">{p.name}</h4>
                      <span className="text-label-sm font-label-sm text-on-surface-variant">{timeFormatted}</span>
                    </div>
                    <p className="text-body-md font-body-md text-on-surface-variant">
                      Screening • <span className={`${textColor} font-medium`}>{status}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate('/worker/lookup')} className="w-full py-md text-label-sm font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-low/20 border-t border-outline-variant/10 active-press">
            View All History
          </button>
        </section>
      </main>

    </div>
  );
}
