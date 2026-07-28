"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/store/useDemoStore";

const RISK_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  elevated: { label: 'Elevated', color: '#B0523F', bg: '#B0523F14', border: '#B0523F55' },
  moderate: { label: 'Moderate', color: '#8F6E23', bg: '#C79A3C1F', border: '#C79A3C55' },
  low: { label: 'Low', color: '#3F6A4E', bg: '#4C7A5A14', border: '#4C7A5A44' },
};

export default function RiskQueuePage() {
  const { riskQueue, patients, claimQueueItem } = useDemoStore() as any;
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const patientById = (pid: string) => (patients || []).find((p: any) => p.id === pid);

  const rows = (riskQueue || []).map((q: any) => {
    const p = patientById(q.pid);
    return { ...q, patient: p };
  }).filter((row: any) => row.patient);

  const filtered = activeFilter === 'all' ? rows
    : activeFilter === 'elevated' ? rows.filter((r: any) => r.patient?.risk === 'elevated')
    : activeFilter === 'moderate' ? rows.filter((r: any) => r.patient?.risk === 'moderate')
    : rows.filter((r: any) => r.status === 'unclaimed');

  const counts = {
    all: rows.length,
    elevated: rows.filter((r: any) => r.patient?.risk === 'elevated').length,
    moderate: rows.filter((r: any) => r.patient?.risk === 'moderate').length,
    unclaimed: rows.filter((r: any) => r.status === 'unclaimed').length,
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'elevated', label: 'Elevated' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'unclaimed', label: 'Unclaimed' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 bg-[#F5F4F0] min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F]">Risk Queue</h1>
          <p className="text-sm text-gray-400 mt-0.5">{counts.unclaimed} unclaimed · {rows.length} total flags</p>
        </div>
        <button className="px-4 py-2 bg-[#1E3A2F] text-white rounded-lg text-sm font-bold hover:bg-[#152a22] transition-colors">
          Bulk Refer Selected
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeFilter === f.key ? 'border-[#1E3A2F] text-[#1E3A2F]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {f.label}
            {counts[f.key as keyof typeof counts] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeFilter === f.key ? 'bg-[#1E3A2F] text-white' : 'bg-gray-100 text-gray-500'}`}>
                {counts[f.key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th className="py-4 px-5 w-8"><input type="checkbox" className="rounded" /></th>
              <th className="py-4 px-5">#</th>
              <th className="py-4 px-5">Patient</th>
              <th className="py-4 px-5">Barangay</th>
              <th className="py-4 px-5">AI Flag Reason</th>
              <th className="py-4 px-5">Flagged</th>
              <th className="py-4 px-5">Review Status</th>
              <th className="py-4 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item: any, i: number) => {
              const p = item.patient;
              const risk = p?.risk ?? 'low';
              const meta = RISK_META[risk];
              const isMine = item.status === 'mine';
              const isOther = item.status === 'other';
              const isUnclaimed = item.status === 'unclaimed';

              return (
                <tr key={item.pid} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 1 ? 'bg-[#FAFAF8]' : ''}`}>
                  <td className="py-4 px-5"><input type="checkbox" className="rounded" /></td>
                  <td className="py-4 px-5">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ background: meta.bg, color: meta.color }}>
                      {i + 1}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <p className="font-bold text-[#1E3A2F] text-sm">{p?.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{p?.id}</p>
                  </td>
                  <td className="py-4 px-5 text-sm text-gray-600">{p?.barangay}</td>
                  <td className="py-4 px-5 text-sm text-gray-700 max-w-xs">
                    <p className="truncate">{p?.reason ?? 'Routine review'}</p>
                  </td>
                  <td className="py-4 px-5 text-xs text-gray-500 font-medium whitespace-nowrap">{item.flagged}</td>
                  <td className="py-4 px-5">
                    {isMine ? (
                      <span className="px-2 py-1 bg-[#1E3A2F]/10 text-[#1E3A2F] text-xs font-bold rounded-md flex w-fit items-center gap-1">
                        👁 In review · you
                      </span>
                    ) : isOther ? (
                      <span className="px-2 py-1 bg-[#C79A3C]/10 text-[#8F6E23] text-xs font-bold rounded-md">
                        In review · {item.reviewer}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-md">Unclaimed</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {isUnclaimed ? (
                      <button
                        onClick={() => claimQueueItem?.(item.pid)}
                        className="px-4 py-2 bg-[#1E3A2F] text-white rounded-lg text-xs font-bold hover:bg-[#152a22] transition-colors"
                      >
                        Claim
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-[#4C7A5A]/10 text-[#4C7A5A] rounded-lg text-xs font-bold hover:bg-[#4C7A5A]/20 transition-colors">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">
          <div>Showing 1 – {filtered.length} of {filtered.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-300" disabled>Previous</button>
            <button className="px-3 py-1 bg-[#1E3A2F] text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-300" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
