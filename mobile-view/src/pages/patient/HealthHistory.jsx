import React, { useState } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';
import TopBar from '../../components/layout/TopBar';
import { useLanguage } from '../../hooks/useLanguage';

export default function HealthHistory() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const screenings = useLiveDemoStore(s => s.screenings.filter(sc => sc.patientId === 'QC-097-00214'));

  // SVG Chart data
  const chartPoints = "M0,70 L20,40 L40,60 L60,30 L80,50 L100,20";

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title={t('myHealth')} />
      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
        {['All', 'Blood Pressure', 'Glucose'].map(f => (
          <button key={f} onClick={() => setFilter(f.toLowerCase())} className={`px-4 py-1.5 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${filter === f.toLowerCase() ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}`}>{f}</button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pt-0 pb-24 space-y-6 page-enter">
        <div className="bg-surface-container rounded-2xl p-5 card-shadow-1">
          <h3 className="font-bold mb-4 text-on-surface">{t('vitalsSummary')}</h3>
          <div className="grid grid-cols-3 gap-2 text-center mb-6">
            <div><div className="text-xs text-secondary mb-1">{t('risk')}</div><div className="font-bold text-[#B0523F]">{t('elevatedRisk')}</div></div>
            <div className="border-l border-r border-outline-variant"><div className="text-xs text-secondary mb-1">{t('latestBP')}</div><div className="font-bold text-on-surface">142/90</div></div>
            <div><div className="text-xs text-secondary mb-1">{t('glucose')}</div><div className="font-bold text-on-surface">105</div></div>
          </div>
          <svg viewBox="0 0 100 80" className="w-full h-20 overflow-visible" preserveAspectRatio="none">
            <path d={chartPoints} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-on-surface px-1">{t('screeningTimeline')}</h3>
          {screenings.length === 0 && <div className="text-center text-secondary py-8">{t('noScreenings')}</div>}
          {screenings.map((sc, i) => {
            const isHighBP = (sc.bpSystolic ?? 0) > 140;
            const isHighGlucose = (sc.glucoseValue ?? 0) > 100;
            return (
              <div key={sc.id} className="bg-surface-container rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-sm text-secondary">{new Date(sc.timestamp).toLocaleDateString()}</div>
                  {sc.gradeLevel === 'diagnostic' && <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">Diagnostic</div>}
                </div>
                <div className="flex justify-between items-center bg-surface p-3 rounded-xl border border-outline-variant">
                  <div className="flex-1">
                    <div className="text-xs text-secondary">BP</div>
                    <div className={`font-bold ${isHighBP ? 'text-[#B0523F]' : 'text-on-surface'}`}>{sc.bpSystolic}/{sc.bpDiastolic}</div>
                  </div>
                  <div className="flex-1 border-l border-outline-variant pl-3">
                    <div className="text-xs text-secondary">Glucose</div>
                    <div className={`font-bold ${isHighGlucose ? 'text-amber-600' : 'text-on-surface'}`}>{sc.glucoseValue}</div>
                  </div>
                  <div className="flex-1 border-l border-outline-variant pl-3">
                    <div className="text-xs text-secondary">HR</div>
                    <div className="font-bold text-on-surface">{sc.heartRate}</div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary bg-primary/10 self-start px-2 py-1 rounded">{t('source')} {sc.source}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
