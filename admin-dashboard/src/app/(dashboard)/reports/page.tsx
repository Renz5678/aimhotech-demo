"use client";

import React, { useState, useMemo } from 'react';
import { useDemoStore } from "@/store/useDemoStore";
import { BarChart, Loader2, Download, FileSpreadsheet } from 'lucide-react';

export default function ReportsPage() {
  const { barangayMetrics, facilities } = useDemoStore();
  
  const REPORT_TYPES = [
    { label: 'Monthly screening summary', desc: 'Volume, risk mix, and station coverage' },
    { label: 'Referral outcomes', desc: 'Funnel from flagged to resolved, aging analysis' },
    { label: 'Cost per screening', desc: 'Unit economics per station and LGU' },
    { label: 'DOH quarterly export', desc: 'Formatted for DOH regional submission' }
  ];

  const [repType, setRepType] = useState(0);
  const [repStep, setRepStep] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [period, setPeriod] = useState('July 2026');
  const [scope, setScope] = useState('All stations');

  const reportTypes = REPORT_TYPES.map((t, i) => ({
    ...t,
    pick: () => { setRepType(i); setRepStep('idle'); },
    border: repType === i ? '#1E3A2F' : '#E4E1D8',
    bg: repType === i ? '#EFF2EA' : '#fff',
    color: '#24291F'
  }));

  const genReport = () => {
    setRepStep('generating');
    setTimeout(() => {
      setRepStep('ready');
    }, 1200);
  };

  const repRows = useMemo(() => {
    return barangayMetrics.map((b, i) => {
      const refs = Math.round((b.totalScreened * b.elevatedRiskPct / 100) * 0.78);
      const cost = (118 + i * 7).toFixed(0);
      const pctColor = b.elevatedRiskPct >= 18 ? '#B0523F' : b.elevatedRiskPct >= 10 ? '#8F6E23' : '#3F6A4E';
      return {
        name: b.name,
        screenings: b.totalScreened,
        pct: b.elevatedRiskPct,
        pctColor,
        refs,
        cost
      };
    });
  }, [barangayMetrics]);

  const totalScreenings = useMemo(() => barangayMetrics.reduce((sum, b) => sum + b.totalScreened, 0), [barangayMetrics]);

  const repKpis = [
    { label: 'Total screenings', value: totalScreenings.toLocaleString(), color: '#24291F' },
    { label: 'Avg cost per screening', value: '₱136', color: '#24291F' },
    { label: 'Referral completion', value: '78%', color: '#4C7A5A' }
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
          <BarChart className="w-6 h-6 text-[#A3B18B]" />
          Reports & Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and export population health data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 xl:col-span-3 bg-white border border-[#E4E1D8] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Configure report</h2>
          
          <div className="flex flex-col gap-2.5">
            {reportTypes.map((t, i) => (
              <div 
                key={i} 
                onClick={t.pick} 
                className="px-3.5 py-3 rounded-lg border-2 cursor-pointer transition-all"
                style={{ borderColor: t.border, background: t.bg }}
              >
                <div className="text-[13.5px] font-semibold" style={{ color: t.color }}>{t.label}</div>
                <div className="text-[11.5px] text-[#6B7566] mt-1">{t.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 my-5">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-foreground">Period</label>
              <select 
                value={period}
                onChange={(e) => { setPeriod(e.target.value); setRepStep('idle'); }}
                className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-[13px] bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
              >
                <option>July 2026</option>
                <option>Q2 2026</option>
                <option>H1 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-foreground">Scope</label>
              <select 
                value={scope}
                onChange={(e) => { setScope(e.target.value); setRepStep('idle'); }}
                className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-[13px] bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
              >
                <option>All stations</option>
                {facilities.filter(f => f.type === 'barangay_station').map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {repStep === 'idle' && (
            <button 
              onClick={genReport}
              className="w-full py-2.5 rounded-lg border-none bg-[#1E3A2F] text-[#F9F8F6] text-[13.5px] font-semibold hover:bg-[#2A4A3C] transition-colors"
            >
              Generate report
            </button>
          )}

          {repStep === 'generating' && (
            <div className="flex items-center justify-center gap-2.5 p-2.5 rounded-lg bg-[#EFF2EA] text-[13px] font-medium text-[#3F4A3A]">
              <Loader2 className="w-4 h-4 animate-spin text-[#1E3A2F]" />
              Aggregating {scope.toLowerCase()}…
            </div>
          )}

          {repStep === 'ready' && (
            <div className="flex gap-2.5">
              <button 
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-none bg-[#4C7A5A] text-white text-[13px] font-semibold hover:bg-[#3F6A4E] transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-[#4C7A5A] bg-white text-[#4C7A5A] text-[13px] font-semibold hover:bg-[#4C7A5A]/5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 xl:col-span-9 bg-white border border-[#E4E1D8] rounded-xl p-5 min-h-[420px] shadow-sm flex flex-col">
          {repStep === 'idle' || repStep === 'generating' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#6B7566]">
              <BarChart className="w-12 h-12 text-[#E4E1D8] mb-3" />
              <p className="text-[13.5px]">Select report configuration and click Generate</p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Preview — {REPORT_TYPES[repType].label}</h2>
                <div className="text-xs text-[#6B7566]">{period} · {scope}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                {repKpis.map((k, i) => (
                  <div key={i} className="border border-[#F1EEE7] rounded-lg p-3.5 bg-[#FDFCFA]">
                    <div className="text-[22px] font-bold" style={{ color: k.color }}>{k.value}</div>
                    <div className="text-[11.5px] text-[#6B7566] mt-0.5">{k.label}</div>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#E4E1D8]">
                <table className="w-full text-[13.5px] border-collapse">
                  <thead className="bg-[#F9F8F6]">
                    <tr className="text-left border-b border-[#E4E1D8]">
                      <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Barangay</th>
                      <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.4px] text-[#6B7566] text-right">Screenings</th>
                      <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.4px] text-[#6B7566] text-right">Elevated %</th>
                      <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.4px] text-[#6B7566] text-right">Referrals done</th>
                      <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.4px] text-[#6B7566] text-right">Cost / screening</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1EEE7] bg-white">
                    {repRows.map((r, i) => (
                      <tr key={i} className="even:bg-[#F1EEE7]/40 hover:bg-[#EFF2EA]/50 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-foreground">{r.name}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-[12.5px]">{r.screenings}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-[12.5px] font-semibold" style={{ color: r.pctColor }}>{r.pct}%</td>
                        <td className="px-3 py-2.5 text-right font-mono text-[12.5px]">{r.refs}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-[12.5px]">₱{r.cost}</td>
                      </tr>
                    ))}
                    {repRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground text-sm">
                          No data available for the selected scope.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
