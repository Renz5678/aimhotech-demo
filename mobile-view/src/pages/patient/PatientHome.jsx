import React, { useState, useEffect } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import TopBar from '../../components/layout/TopBar';
import { useLanguage } from '../../hooks/useLanguage';

export default function PatientHome() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const healthTips = useLiveDemoStore(s => s.healthTips);
  const tip = healthTips[0];

  useEffect(() => {
    const onScroll = (e) => setScrolled(e.target.scrollTop > 10);
    const el = document.getElementById('scroll-container');
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  // Dummy sparkline points
  const sparkline = "M0,25 L20,20 L40,22 L60,10 L80,15";

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar 
        title={`${t('greeting')} Rosalinda!`} 
        subtitle="San Isidro, Quezon City" 
        rightIcon="notifications"
        scrolled={scrolled}
      />
      <div id="scroll-container" className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 page-enter">
        {/* Risk Card */}
        <div className="bg-primary text-white rounded-2xl p-5 card-shadow-2 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-primary-100 text-sm font-semibold mb-1">{t('riskStatus')}</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {t('elevatedRisk')} <span className="text-sm bg-white/20 px-2 py-1 rounded-full text-white">78% conf</span>
              </div>
            </div>
            <div className="bg-[#B0523F] px-3 py-1 rounded-full text-sm font-bold shadow-sm">Elevated</div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-primary-100 text-sm">{t('latestBP')}</div>
              <div className="text-xl font-bold">142/90</div>
            </div>
            <svg viewBox="0 0 80 30" className="w-20 h-8 opacity-80 overflow-visible">
              <path d={sparkline} fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Appointment Card */}
        <div className="bg-surface-container rounded-2xl p-4 card-shadow-1">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-on-surface"><span className="material-symbols-outlined text-primary">calendar_month</span> {t('upcomingVisit')}</h3>
          <div className="flex gap-4">
            <div className="bg-primary/10 rounded-xl p-3 text-center min-w-[70px]">
              <div className="text-primary font-bold text-lg">Oct</div>
              <div className="text-primary font-black text-2xl">14</div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold text-lg text-on-surface">St. Luke's Medical Center</div>
              <div className="text-secondary font-semibold text-sm">9:00 AM • Cardiology Consult</div>
            </div>
          </div>
        </div>

        {/* Health Tip */}
        <div className="bg-surface-container rounded-xl p-4 border-l-4 border-secondary flex gap-4 items-start">
          <span className="material-symbols-outlined text-secondary text-3xl">lightbulb</span>
          <div>
            <h4 className="font-bold text-on-surface mb-1">{t('healthTip')}</h4>
            <p className="text-sm text-secondary leading-snug">{t('drinkWater')}</p>
          </div>
        </div>

        {/* Goals */}
        <div className="flex gap-4">
          <div className="flex-1 bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-primary">directions_walk</span> <span className="font-bold">Steps</span></div>
            <div className="text-2xl font-black text-primary">5,432</div>
          </div>
          <div className="flex-1 bg-surface-container rounded-2xl p-4 card-shadow-1">
            <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-blue-500">water_drop</span> <span className="font-bold">Water</span></div>
            <div className="text-xl font-black">6/8 <span className="text-sm text-secondary">gl</span></div>
            <div className="h-2 bg-outline-variant rounded-full mt-2 overflow-hidden"><div className="h-full bg-blue-500 w-3/4 rounded-full" /></div>
          </div>
        </div>

        {/* Community Insight */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">groups</span>
          <p className="text-sm font-semibold text-on-surface">In San Isidro: 18% elevated risk this month. Stay proactive!</p>
        </div>
      </div>
    </div>
  );
}
