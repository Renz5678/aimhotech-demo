"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDemoStore } from "@/store/useDemoStore";
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function DashboardPage() {
  const {
    barangayMetrics,
    weeklyScreeningData,
  } = useDemoStore() as any;

  const {
    patients,
    screenings,
    riskFlags,
    referrals,
    activityFeed
  } = useLiveDemoStore();

  const prevActivityLength = useRef(activityFeed.length);
  const [newActivity, setNewActivity] = useState(false);

  useEffect(() => {
    if (activityFeed.length > prevActivityLength.current) {
      setNewActivity(true);
      const timer = setTimeout(() => setNewActivity(false), 3000);
      return () => clearTimeout(timer);
    }
    prevActivityLength.current = activityFeed.length;
  }, [activityFeed.length]);

  const kpis = [
    { label: "Total Patients", value: patients.length.toLocaleString(), trend: "+3%", trendNote: "this month", trendColor: "#4C7A5A" },
    { label: "Total Screenings", value: screenings.length.toLocaleString(), trend: "+5%", trendNote: "this month", trendColor: "#4C7A5A" },
    { label: "Active Risk Flags", value: riskFlags.filter((f: any) => f.status === 'unclaimed' || f.status === 'in-review').length, trend: "Requires attention", trendNote: "now", trendColor: "#B0523F" },
    { label: "Pending Referrals", value: referrals.filter((r: any) => r.status !== 'resolved').length, trend: "-2", trendNote: "vs last week", trendColor: "#4C7A5A" }
  ];

  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'quarter'>('month');

  const getColorForPct = (pct: number) => {
    if (pct >= 18) return { text: '#B0523F', bg: '#B0523F1F', border: '#B0523F55' };
    if (pct >= 10) return { text: '#8F6E23', bg: '#C79A3C1F', border: '#C79A3C55' };
    return { text: '#3F6A4E', bg: '#4C7A5A14', border: '#4C7A5A44' };
  };

  const refStats = {
    flagged: (referrals || []).filter((r: any) => r.status === 'flagged').length,
    referred: (referrals || []).filter((r: any) => r.status === 'referred').length,
    seen: (referrals || []).filter((r: any) => r.status === 'seen').length,
    resolved: (referrals || []).filter((r: any) => r.status === 'resolved').length,
  };

  const dotColor: Record<string, string> = { flag: '#B0523F', referral: '#4C7A5A', device: '#C79A3C', validation: '#4C7A5A', sync: '#A3B18B', report: '#A3B18B' };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 bg-[#F5F4F0] min-h-screen">
      {/* Date filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#1E3A2F]">Population Health Dashboard</h1>
          <div className="flex items-center gap-1.5 bg-[#4C7A5A]/10 text-[#4C7A5A] px-2.5 py-1 rounded-full text-xs font-bold border border-[#4C7A5A]/20">
            <span className="w-2 h-2 rounded-full bg-[#4C7A5A] animate-pulse" />
            Live
          </div>
        </div>
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1">
          {(['week', 'month', 'quarter'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${dateFilter === f ? 'bg-[#1E3A2F] text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'Last 3 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {(kpis || []).map((k: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all cursor-default">
            <h3 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">{k.label}</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black" style={{ color: k.trendColor === '#B0523F' ? '#B0523F' : '#1E3A2F' }}>{k.value}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-bold" style={{ color: k.trendColor }}>{k.trend}</span>
              <span className="text-xs text-gray-400">{k.trendNote}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col (span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Barangay heatmap */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#1E3A2F]">Barangay risk heatmap</h3>
              <span className="text-xs text-gray-400 italic">% elevated-risk of screened, this month</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {(barangayMetrics || []).map((b: any, i: number) => {
                const c = getColorForPct(b.elevatedRiskPct);
                return (
                  <div key={i} className="rounded-xl p-4 flex flex-col h-28 border justify-between" style={{ background: c.bg, borderColor: c.border }}>
                    <h4 className="font-bold text-[#1E3A2F] text-sm">{b.name}</h4>
                    <span className="text-3xl font-light" style={{ color: c.text }}>{b.elevatedRiskPct}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{b.totalScreened} screened</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100 text-xs font-medium text-gray-500">
              {[['#4C7A5A', '< 10% low'], ['#C79A3C', '10–17% moderate'], ['#B0523F', '≥ 18% elevated']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: color + '20', border: `1px solid ${color}55` }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Screening volume chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-[#1E3A2F]">Screening volume</h3>
                <span className="text-xs text-gray-400 italic">last 12 weeks</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklyScreeningData || []} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={18}
                    fill="#A3B18B"
                    // Last bar is darker
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Referral funnel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-[#1E3A2F] mb-4">Referral funnel</h3>
              <div className="flex flex-col gap-2 mt-2">
                {[
                  { label: 'Flagged', value: refStats.flagged + 8, color: '#B0523F' },
                  { label: 'Referred', value: refStats.referred + 5, color: '#C79A3C' },
                  { label: 'Seen', value: refStats.seen + 3, color: '#4C7A5A' },
                  { label: 'Resolved', value: refStats.resolved + 2, color: '#1E3A2F' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-20 text-xs font-bold text-gray-500">{row.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, row.value * 6)}%`, background: row.color }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-5">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (span 1) — Activity feed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#1E3A2F] mb-6">Recent activity</h3>
          <div className="flex flex-col gap-5 relative">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100" />
            {(activityFeed || []).map((item: any, i: number) => (
              <div key={i} className={`flex gap-4 relative z-10 p-2 rounded-lg transition-colors ${i === 0 && newActivity ? 'animate-pulse bg-green-50' : ''}`}>
                <div className="w-5 h-5 rounded-full border-4 border-white shadow-sm mt-0.5 shrink-0" style={{ background: dotColor[item.type] || item.dot }} />
                <div>
                  <p className="text-sm text-gray-800 leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
