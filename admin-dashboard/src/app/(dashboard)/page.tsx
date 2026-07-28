"use client";

import React from "react";
import { useDemoStore } from "@/store/useDemoStore";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const { screenings, riskFlags, referrals, barangayMetrics, patients } = useDemoStore();

  const totalScreenings = screenings.length + 1150 + 15;
  const elevatedPct = 13.4;
  const refRate = 78;
  const onlineStations = 7;
  const totalStations = 8;

  const kpis = [
    { label: "SCREENINGS THIS MONTH", value: "1,165", trend: "↑12% vs last month", trendColor: "text-[#4C7A5A]" },
    { label: "ELEVATED-RISK SHARE", value: "13.4%", trend: "↑1.8 pts vs last month", trendColor: "text-[#B0523F]" },
    { label: "REFERRAL COMPLETION", value: "78%", trend: "↑6 pts vs last month", trendColor: "text-[#4C7A5A]" },
    { label: "STATIONS ONLINE", value: "7 / 8", trend: "↓1 kiosk vs last month", trendColor: "text-[#C79A3C]" },
  ];

  const barangays = barangayMetrics && barangayMetrics.length > 0 ? barangayMetrics : [
    { name: "San Isidro", elevatedRiskPct: 18, totalScreened: 214 },
    { name: "Poblacion", elevatedRiskPct: 22, totalScreened: 189 },
    { name: "Malanday", elevatedRiskPct: 15, totalScreened: 176 },
    { name: "Bagong Silang", elevatedRiskPct: 9, totalScreened: 142 },
    { name: "Sta. Cruz", elevatedRiskPct: 11, totalScreened: 138 },
    { name: "Mabini", elevatedRiskPct: 6, totalScreened: 121 },
    { name: "Del Pilar", elevatedRiskPct: 5, totalScreened: 97 },
    { name: "Maligaya", elevatedRiskPct: 7, totalScreened: 88 },
  ];

  const getColorForPct = (pct: number) => {
    if (pct >= 18) return "#B0523F";
    if (pct >= 10) return "#C79A3C";
    return "#4C7A5A";
  };

  const chartData = [
    { week: "W1", volume: 220 },
    { week: "W2", volume: 280 },
    { week: "W3", volume: 260 },
    { week: "W4", volume: 405 }
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 bg-[#F5F4F0] min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-4">{k.label}</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-[#1E3A2F]">{k.value}</span>
              <span className={`text-xs font-bold mb-1.5 ${k.trendColor}`}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Left Col (65%) */}
        <div className="w-[65%] flex flex-col gap-8">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#1E3A2F]">Barangay risk heatmap</h3>
              <span className="text-sm text-gray-400 italic">% elevated-risk of screened, this month</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {barangays.map((b, i) => {
                const color = getColorForPct(b.elevatedRiskPct);
                return (
                  <div key={i} className="bg-[#F5F4F0] rounded-xl p-4 flex flex-col h-32 border border-gray-200/50 justify-between">
                    <h4 className="font-bold text-[#1E3A2F]">{b.name}</h4>
                    <span className="text-3xl font-light" style={{ color }}>{b.elevatedRiskPct}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{b.totalScreened} SCREENED</span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm border border-[#4C7A5A] bg-[#4C7A5A]/20"></span> &lt; 10% low
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm border border-[#C79A3C] bg-[#C79A3C]/20"></span> 10–17% moderate
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm border border-[#B0523F] bg-[#B0523F]/20"></span> ≥ 18% elevated
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[280px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1E3A2F]">Screening volume</h3>
              <span className="text-sm text-gray-400 italic">last 12 weeks</span>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Bar dataKey="volume" fill="#1E3A2F" radius={[4,4,0,0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Right Col (35%) */}
        <div className="w-[35%] bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#1E3A2F] mb-6">Recent activity</h3>
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="w-5 h-5 rounded-full bg-[#B0523F] border-4 border-white shadow-sm mt-1 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800">AI Brain flagged <span className="font-bold">Rosario Dimagiba (San Isidro)</span> — repeat elevated BP</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">36 min ago</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-5 h-5 rounded-full bg-[#4C7A5A] border-4 border-white shadow-sm mt-1 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800">Referral <span className="font-mono text-xs font-bold text-gray-600">REF-2098</span> marked <b>"Seen"</b> — Marites Ocampo at Prov. Hospital</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">1 h ago</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-5 h-5 rounded-full bg-[#C79A3C] border-4 border-white shadow-sm mt-1 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800">Kiosk <span className="font-mono text-xs font-bold text-gray-600">KSK-042-04</span> (Bagong Silang) offline for 48h — ops notified</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">3 h ago</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-5 h-5 rounded-full bg-[#4C7A5A] border-4 border-white shadow-sm mt-1 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800"><span className="font-bold">Dr. Uy</span> validated screening <span className="font-mono text-xs font-bold text-gray-600">S-8841</span> as diagnostic-grade</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">Yesterday</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-5 h-5 rounded-full bg-[#1E3A2F] border-4 border-white shadow-sm mt-1 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800"><span className="font-bold">214 screenings</span> synced from San Isidro station this week</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">Yesterday</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
