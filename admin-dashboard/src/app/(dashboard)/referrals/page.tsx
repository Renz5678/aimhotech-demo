"use client";

import React, { useState } from 'react';
import { useDemoStore } from "@/store/useDemoStore";

const STEPS = ["Flagged", "Referred", "Seen", "Resolved"];

function getStepIndex(status: string) {
  const map: Record<string, number> = { flagged: 0, referred: 1, seen: 2, resolved: 3 };
  return map[status] ?? 0;
}

function getDaysAgo(dateStr?: string): number {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function getNextAction(status: string) {
  if (status === 'flagged') return { label: 'MARK REFERRED', next: 'referred', color: 'bg-[#C79A3C] hover:bg-[#b08830]' };
  if (status === 'referred') return { label: 'MARK SEEN', next: 'seen', color: 'bg-[#4C7A5A] hover:bg-[#3d6349]' };
  if (status === 'seen') return { label: 'MARK RESOLVED', next: 'resolved', color: 'bg-[#1E3A2F] hover:bg-[#152a22]' };
  return null;
}

export default function ReferralsPage() {
  const { referrals, patients, updateReferralStatus } = useDemoStore() as any;
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getPatient = (patientId: string) => patients?.find((p: any) => p.id === patientId);

  // Build display list from real store + supplement with demo data
  const storeRefs = (referrals || []).slice(0, 8);
  const demoRefs = [
    { id: 'REF-2098', patientId: 'QC-097-00214', status: 'referred', destinationFacilityId: 'Provincial Hospital', createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
    { id: 'REF-2099', patientId: 'QC-097-00215', status: 'flagged', destinationFacilityId: 'San Isidro RHU', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'REF-2100', patientId: 'QC-133-00089', status: 'seen', destinationFacilityId: 'Malanday Barangay Health Center', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'REF-2101', patientId: 'QC-097-00214', status: 'resolved', destinationFacilityId: 'Provincial Hospital', createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  ];
  const allRefs = storeRefs.length > 0 ? storeRefs : demoRefs;

  const filtered = filter === 'all' ? allRefs : allRefs.filter((r: any) => r.status === filter);

  const counts = {
    all: allRefs.length,
    flagged: allRefs.filter((r: any) => r.status === 'flagged').length,
    referred: allRefs.filter((r: any) => r.status === 'referred').length,
    seen: allRefs.filter((r: any) => r.status === 'seen').length,
    resolved: allRefs.filter((r: any) => r.status === 'resolved').length,
    stalled: allRefs.filter((r: any) => getDaysAgo(r.createdAt) >= 7 && r.status !== 'resolved').length,
  };

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'flagged', label: 'Flagged' },
    { key: 'referred', label: 'Referred' },
    { key: 'seen', label: 'Seen' },
    { key: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 bg-[#F5F4F0] min-h-screen">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'TOTAL REFERRALS', value: counts.all, color: '#1E3A2F' },
          { label: 'ACTIVE', value: counts.referred, color: '#C79A3C' },
          { label: 'STALLED (7+ DAYS)', value: counts.stalled, color: '#B0523F' },
          { label: 'RESOLVED', value: counts.resolved, color: '#4C7A5A' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2">{s.label}</p>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${filter === tab.key ? 'border-[#1E3A2F] text-[#1E3A2F]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
            {counts[tab.key as keyof typeof counts] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === tab.key ? 'bg-[#1E3A2F] text-white' : 'bg-gray-100 text-gray-500'}`}>
                {counts[tab.key as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Referral cards */}
      <div className="space-y-3">
        {filtered.map((ref: any) => {
          const patient = getPatient(ref.patientId);
          const stepIdx = getStepIndex(ref.status);
          const daysAgo = getDaysAgo(ref.createdAt);
          const isStalled = daysAgo >= 7 && ref.status !== 'resolved';
          const action = getNextAction(ref.status);
          const isExpanded = expandedId === ref.id;

          return (
            <div key={ref.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-bold text-[#1E3A2F] text-lg">{patient?.name || ref.patientId}</p>
                    <p className="text-xs font-mono text-gray-400 mt-1">{ref.id} • {ref.destinationFacilityId || 'San Isidro RHU'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isStalled && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-[#B0523F]/10 text-[#B0523F] rounded-full text-xs font-bold border border-[#B0523F]/20">
                        ⏱ Stalled · {daysAgo}d
                      </span>
                    )}
                    {action && (
                      <button
                        onClick={() => updateReferralStatus?.(ref.id, action.next)}
                        className={`px-4 py-2 text-white rounded-lg text-xs font-bold tracking-wide transition-colors ${action.color}`}
                      >
                        {action.label}
                      </button>
                    )}
                    {ref.status === 'resolved' && (
                      <span className="px-3 py-1 bg-[#4C7A5A]/10 text-[#4C7A5A] rounded-full text-xs font-bold">✓ Resolved</span>
                    )}
                  </div>
                </div>

                {/* Horizontal progress stepper */}
                <div className="flex items-center w-full max-w-lg">
                  {STEPS.map((step, i) => {
                    const completed = i < stepIdx;
                    const active = i === stepIdx;
                    const future = i > stepIdx;
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1.5">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 transition-all ${
                            completed ? 'bg-[#1E3A2F] border-[#1E3A2F] text-white' :
                            active ? 'bg-white border-[#1E3A2F] text-[#1E3A2F] ring-4 ring-[#1E3A2F]/10' :
                            'bg-white border-gray-200 text-gray-300'
                          }`}>
                            {completed ? '✓' : i + 1}
                          </div>
                          <span className={`text-[10px] font-bold whitespace-nowrap ${active ? 'text-[#1E3A2F]' : completed ? 'text-[#4C7A5A]' : 'text-gray-300'}`}>{step}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mb-4 rounded transition-all ${completed ? 'bg-[#1E3A2F]' : future && i >= stepIdx ? 'bg-gray-100 border-t-2 border-dashed border-gray-200 h-0' : 'bg-gray-100'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Expandable history */}
                <button onClick={() => setExpandedId(isExpanded ? null : ref.id)} className="mt-4 text-xs font-bold text-[#4C7A5A] hover:text-[#1E3A2F] transition-colors flex items-center gap-1">
                  {isExpanded ? '▲ Hide' : '▼ Show'} status history
                </button>
              </div>

              {isExpanded && ref.statusHistory && (
                <div className="px-6 pb-4 border-t border-gray-50 bg-gray-50/50">
                  <div className="py-4 space-y-2">
                    {ref.statusHistory.map((h: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-[#4C7A5A] shrink-0" />
                        <span className="font-bold capitalize">{h.status}</span>
                        <span className="text-gray-400">·</span>
                        <span>{new Date(h.timestamp).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        {h.note && <span className="text-gray-500 italic">"{h.note}"</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center pt-2">Referrals idle past 7 days are flagged as stalled.</p>
    </div>
  );
}
