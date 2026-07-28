import React, { useState } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import { useLanguage } from '../../hooks/useLanguage';
import { useMobileStore } from '../../store/useMobileStore';

const SRC_STYLE = {
  kiosk: 'bg-primary-fixed text-on-primary-fixed',
  rhu: 'bg-secondary-container text-on-secondary-container',
  hospital: 'bg-surface-container-high text-on-surface-variant',
};

export default function HealthHistory() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('bp');
  
  const screenings = useLiveDemoStore(s => s.screenings);
  const referrals = useLiveDemoStore(s => s.referrals);
  const selectedPatientId = useMobileStore(s => s.selectedPatientId);
  const patientScreenings = screenings
    .filter(s => s.patientId === selectedPatientId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
  const recentScreenings = patientScreenings.length ? patientScreenings : [{ bpSystolic: 124, bpDiastolic: 82 }];
  
  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="absolute top-0 left-0 w-full z-50 bg-background flex flex-col px-edge_margin pt-xl pb-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            </div>
            <div>
              <h1 className="text-headline-md font-headline-md text-primary tracking-tight">Barangay San Isidro</h1>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Health Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-xs px-3 py-1.5 rounded-full bg-secondary-container/30 border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-label-sm font-label-sm text-on-secondary-container">{referrals.filter(r => r.patientId === selectedPatientId && r.status !== 'resolved').length} pending</span>
          </div>
        </div>
      </header>

      <main className="mt-28 px-edge_margin space-y-xl pb-24">
        {/* Screen Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-display-lg font-display-lg text-primary">My Health</h2>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
          </button>
        </div>

        {/* Vital Switcher */}
        <div className="bg-surface-container-low p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button onClick={() => setFilter('bp')} className={`flex-1 min-w-[90px] py-2.5 rounded-xl transition-all ${filter === 'bp' ? 'bg-surface-container-lowest shadow-sm text-primary font-bold active:scale-95' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="text-body-md font-body-md">BP</span>
          </button>
          <button onClick={() => setFilter('glucose')} className={`flex-1 min-w-[90px] py-2.5 rounded-xl transition-all ${filter === 'glucose' ? 'bg-surface-container-lowest shadow-sm text-primary font-bold active:scale-95' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="text-body-md font-body-md">Glucose</span>
          </button>
          <button onClick={() => setFilter('bmi')} className={`flex-1 min-w-[90px] py-2.5 rounded-xl transition-all ${filter === 'bmi' ? 'bg-surface-container-lowest shadow-sm text-primary font-bold active:scale-95' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="text-body-md font-body-md">BMI</span>
          </button>
          <button onClick={() => setFilter('heart')} className={`flex-1 min-w-[90px] py-2.5 rounded-xl transition-all ${filter === 'heart' ? 'bg-surface-container-lowest shadow-sm text-primary font-bold active:scale-95' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="text-body-md font-body-md">Heart</span>
          </button>
        </div>

        {/* Trend Chart: Blood Pressure */}
        <section className="bg-surface-container-lowest rounded-3xl p-lg shadow-[0_4px_12px_rgba(30,58,47,0.04)] border border-surface-variant/20">
          <div className="flex justify-between items-start mb-md">
            <div>
              <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Blood pressure</h3>
              <div className="flex items-baseline gap-xs mt-1">
                <span className="text-display-lg font-display-lg text-primary">{patientScreenings[0]?.bpSystolic ?? 124}/{patientScreenings[0]?.bpDiastolic ?? 82}</span>
                <div className="flex items-center gap-1 text-on-primary-container bg-primary-fixed px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">trending_down</span>
                  <span className="text-label-sm font-label-sm">improving</span>
                </div>
              </div>
            </div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">last 6 visits</p>
          </div>

          {/* SVG Smooth Chart */}
          <div className="relative h-40 w-full mt-lg">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
              <defs>
                <linearGradient id="chart-bg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#A3B18B" stopOpacity="0.4"></stop>
                  <stop offset="100%" stopColor="#A3B18B" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path className="chart-gradient" style={{ fill: 'url(#chart-bg)' }} d="M0,80 Q50,75 100,85 T200,70 T300,95 T400,90 L400,120 L0,120 Z"></path>
              <path d={
                patientScreenings.length > 0 ? (() => {
                  const values = patientScreenings.slice(0, 6).map(s => s.bpSystolic || 124).reverse();
                  while (values.length < 6) values.unshift(124);
                  const maxV = 200;
                  const stepX = 400 / 5;
                  const pts = values.map((v, i) => `${i * stepX},${110 - (v / maxV) * 100}`);
                  return `M${pts.join(' L')}`;
                })() : "M0,80 Q50,75 100,85 T200,70 T300,95 T400,90"
              } fill="none" stroke="#1E3A2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              <circle cx="400" cy={patientScreenings.length > 0 ? 110 - ((patientScreenings[0]?.bpSystolic || 124) / 200) * 100 : 91} fill="#1E3A2F" r="5"></circle>
              <circle cx="400" cy={patientScreenings.length > 0 ? 110 - ((patientScreenings[0]?.bpSystolic || 124) / 200) * 100 : 91} fill="#1E3A2F" fillOpacity="0.1" r="8"></circle>
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 pt-2 border-t border-outline-variant/20">
              <span className="text-label-sm font-label-sm text-on-surface-variant">JAN</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">MAR</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">MAY</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">JUL</span>
            </div>
          </div>
        </section>

        {/* Trend Chart: Blood Glucose */}
        <section className="bg-surface-container-lowest rounded-3xl p-lg shadow-[0_4px_12px_rgba(30,58,47,0.04)] border border-surface-variant/20">
          <div className="flex justify-between items-start mb-md">
            <div>
              <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Blood glucose</h3>
              <div className="flex items-baseline gap-xs mt-1">
                <span className="text-display-lg font-display-lg text-primary">108</span>
                <div className="flex items-center gap-1 text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full">
                  <span className="text-label-sm font-label-sm">steady</span>
                </div>
              </div>
            </div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">mg/dL</p>
          </div>
          <div className="relative h-24 w-full mt-md">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 60">
              <path d="M0,45 Q50,42 100,48 T200,44 T300,47 T400,45" fill="none" stroke="#566342" strokeDasharray="1 0" strokeLinecap="round" strokeWidth="2.5"></path>
              <circle cx="395" cy="45" fill="#566342" r="4"></circle>
            </svg>
          </div>
        </section>

        {/* Screening History */}
        <section className="space-y-md">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">All Screenings</h3>
            <button className="text-label-sm font-label-sm text-primary font-bold">View Archive</button>
          </div>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-surface-variant/20">
            {patientScreenings.map((s, i) => {
              const dateObj = new Date(s.timestamp);
              const mon = dateObj.toLocaleString('en', { month: 'short' }).toUpperCase();
              const day = dateObj.getDate();
              const srcStyle = SRC_STYLE[s.source] || SRC_STYLE.kiosk;
              const bpStr = s.bp || s.bpSystolic + '/' + s.bpDiastolic;
              const glucStr = s.glucose || s.glucoseValue + ' mg/dL';
              return (
                <div key={i} className={`p-lg flex items-center justify-between hover:bg-surface-container-low transition-colors ${i < (patientScreenings.length - 1) ? 'border-b border-outline-variant/10' : ''}`}>
                  <div className="flex gap-md">
                    <div className="flex flex-col items-center justify-center bg-surface-container-high w-14 h-14 rounded-2xl">
                      <span className="text-label-sm font-label-sm text-on-surface-variant">{mon}</span>
                      <span className="text-headline-sm font-headline-sm text-primary">{day || '—'}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-body-lg font-body-lg text-primary">{`BP ${bpStr} · HR ${s.heartRate} bpm`}</p>
                      <p className="text-body-md font-body-md text-on-surface-variant">{`Glucose ${glucStr}`}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${srcStyle}`}>{s.source === 'kiosk' ? 'Kiosk' : s.source}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
