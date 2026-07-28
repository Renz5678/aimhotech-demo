"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useLiveDemoStore } from '../../../../../packages/shared/src/store/useLiveDemoStore';

export default function ReportsPage() {
  const types = ["Monthly screening summary", "Referral outcomes", "Cost per screening", "DOH quarterly export"];
  const [activeType, setActiveType] = useState(types[0]);

  const { screenings, referrals, barangayMetrics } = useLiveDemoStore();

  const totalScreenings = screenings.length;
  const resolvedRefs = referrals.filter((r: any) => r.status === 'resolved').length;
  const refCompletionPct = Math.round(resolvedRefs / Math.max(referrals.length, 1) * 100);

  const kpis = [
    { label: "Total screenings", value: totalScreenings.toLocaleString() },
    { label: "Avg cost per screening", value: "₱136" },
    { label: "Referral completion", value: `${refCompletionPct}%` }
  ];

  const fallbackBreakdown = [
    { name: "San Isidro", totalScreened: 214, elevatedRiskPct: 18, refs: 30, cost: "₱118" },
    { name: "Poblacion", totalScreened: 189, elevatedRiskPct: 22, refs: 32, cost: "₱125" }
  ];
  const breakdown = barangayMetrics && barangayMetrics.length > 0 ? barangayMetrics : fallbackBreakdown;

  const handleExport = () => {
    const csv = ['ID,Patient,BP,Glucose,SpO2,Timestamp']
      .concat(screenings.map((s: any) => `${s.id},"${s.patientName || ''}","${s.metrics?.systolic}/${s.metrics?.diastolic}",${s.metrics?.glucose},${s.metrics?.spo2},${s.timestamp}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aimhotech-screenings-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 bg-[#F5F4F0] min-h-screen">
      <h1 className="text-2xl font-bold text-[#1E3A2F]">Reports & Analytics</h1>

      <div className="flex gap-8">
        {/* Configurator */}
        <div className="w-[30%] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Configure Report</h2>
          
          <div className="flex flex-col gap-3 mb-6">
            {types.map(t => (
              <button 
                key={t}
                onClick={() => setActiveType(t)}
                className={`p-4 rounded-xl text-left text-sm font-bold transition-colors ${activeType === t ? 'bg-[#1E3A2F] text-white shadow-md' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Period</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#4C7A5A]">
                <option>July 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Scope</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#4C7A5A]">
                <option>All stations</option>
              </select>
            </div>
          </div>

          <button className="w-full py-4 bg-[#4C7A5A] text-white rounded-xl font-bold hover:bg-[#3d6349] transition-colors">
            GENERATE REPORT
          </button>
        </div>

        {/* Preview */}
        <div className="w-[70%] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#1E3A2F]">Preview — {activeType}</h2>
            <button onClick={handleExport} className="px-4 py-2 border border-[#4C7A5A] text-[#4C7A5A] rounded-lg text-xs font-bold hover:bg-[#4C7A5A]/10">EXPORT CSV</button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {kpis.map(k => (
              <div key={k.label} className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-bold text-[#1E3A2F] mb-1">{k.value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="h-48 border border-gray-100 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown as any[]}>

                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="totalScreened" fill="#1E3A2F" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <table className="w-full text-left border border-gray-100 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Barangay</th>
                <th className="py-3 px-4 text-right">Screenings</th>
                <th className="py-3 px-4 text-right">Elevated %</th>
                <th className="py-3 px-4 text-right">Referrals</th>
                <th className="py-3 px-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((b: any) => (
                <tr key={b.name} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[#1E3A2F]">{b.name}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{b.totalScreened}</td>
                  <td className="py-3 px-4 text-right text-[#B0523F] font-bold">{b.elevatedRiskPct}%</td>
                  <td className="py-3 px-4 text-right text-gray-600">{b.refs || '-'}</td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600">{b.cost || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
