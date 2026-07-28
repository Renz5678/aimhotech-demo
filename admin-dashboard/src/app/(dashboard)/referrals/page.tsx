"use client";

import React from 'react';
import { useDemoStore, getRiskColor, getRiskLabel, formatDate, calculateAge } from "@/store/useDemoStore";
import { FileText } from 'lucide-react';

export default function ReferralsPage() {
  const { referrals, patients, facilities } = useDemoStore();
  const stalledDays = 7; // Configuration from reference

  const activeReferrals = referrals.filter(r => r.status !== 'resolved');
  const stalledReferrals = activeReferrals.filter(r => (r.agingDays ?? 0) >= stalledDays);
  const resolvedThisMonth = referrals.filter(r => r.status === 'resolved').length;

  const refStats = [
    { label: 'Active referrals', value: String(activeReferrals.length), color: '#24291F' },
    { label: `Stalled (≥ ${stalledDays}d)`, value: String(stalledReferrals.length), color: '#B0523F' },
    { label: 'Resolved this month', value: String(resolvedThisMonth), color: '#4C7A5A' },
    { label: 'Median days to seen', value: '4.5', color: '#24291F' }
  ];

  const stages = ['flagged', 'referred', 'seen', 'resolved'] as const;
  const stageLabels = ['Flagged', 'Referred', 'Seen', 'Resolved'];

  const referralRows = referrals.map(r => {
    const p = patients.find(pat => pat.id === r.patientId);
    const facility = facilities.find(f => f.id === r.destinationFacilityId);
    const days = r.agingDays ?? 0;
    const stalled = r.status !== 'resolved' && days >= stalledDays;
    const stageIndex = stages.indexOf(r.status);
    
    const steps = stages.map((status, i) => {
      const done = i <= stageIndex;
      const isStalledAtThisStage = stalled && i === stageIndex;
      return {
        label: stageLabels[i],
        fill: done ? (isStalledAtThisStage ? '#C79A3C' : '#4C7A5A') : '#fff',
        ring: done ? (isStalledAtThisStage ? '#C79A3C' : '#4C7A5A') : '#D8D5CC',
        line: i < stageIndex ? '#4C7A5A' : '#E4E1D8',
        hasLine: i < 3,
        color: done ? '#24291F' : '#9AA394',
        w: i === stageIndex ? 700 : 500,
        flex: i < 3 ? '1' : 'none'
      };
    });

    return {
      id: r.id,
      patient: p?.name ?? 'Unknown',
      patientId: p?.id ?? '',
      brgy: p ? facilities.find(f => f.id === p.facilityId)?.name || 'Unknown' : 'Unknown',
      facility: facility?.name ?? r.destinationFacilityId,
      steps,
      days,
      stalled,
      fresh: !stalled && r.status !== 'resolved',
      cardBorder: stalled ? '#B0523F55' : '#E4E1D8',
      canAdvance: stageIndex < 3,
      done: r.status === 'resolved',
      nextLabel: stageIndex < 3 ? `Mark ${stageLabels[Math.min(stageIndex + 1, 3)].toLowerCase()}` : ''
    };
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#A3B18B]" />
            Referrals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage patient care transitions</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {refStats.map((s, i) => (
          <div key={i} className="flex-1 bg-white border border-[#E4E1D8] rounded-xl p-4">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#6B7566] font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {referralRows.map(r => (
          <div key={r.id} className="bg-white rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center gap-4 flex-wrap" style={{ border: `1px solid ${r.cardBorder}` }}>
            <div className="w-[170px] shrink-0">
              <div className="text-sm font-semibold text-foreground">{r.patient}</div>
              <div className="text-xs text-[#6B7566] mt-0.5"><span className="font-mono">{r.patientId}</span> · {r.brgy}</div>
            </div>
            
            <div className="flex-1 flex items-center min-w-[300px]">
              {r.steps.map((st, i) => (
                <div key={i} className={`flex items-center ${st.flex === '1' ? 'flex-1' : ''}`}>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ background: st.fill, border: `2px solid ${st.ring}` }} />
                    <span className="text-[10.5px] whitespace-nowrap" style={{ fontWeight: st.w, color: st.color }}>{st.label}</span>
                  </div>
                  {st.hasLine && <div className="flex-1 h-0.5 mx-1.5 mb-4" style={{ background: st.line }} />}
                </div>
              ))}
            </div>

            <div className="shrink-0 text-right max-w-[170px]">
              <div className="text-xs text-[#6B7566]">{r.facility}</div>
              {r.stalled && (
                <span className="inline-block mt-1 text-[11px] font-bold text-[#B0523F] bg-[#B0523F14] border border-[#B0523F33] rounded-full px-2 py-0.5">
                  Stalled · {r.days}d
                </span>
              )}
              {r.fresh && (
                <div className="text-[11.5px] text-[#6B7566] mt-1">{r.days}d in stage</div>
              )}
            </div>

            <div className="shrink-0 text-right min-w-[110px]">
              {r.canAdvance && (
                <button className="px-3.5 py-1.5 rounded-lg border-none bg-[#1E3A2F] text-[#F9F8F6] text-[12.5px] font-semibold hover:bg-[#2A4A3C] transition-colors">
                  {r.nextLabel}
                </button>
              )}
              {r.done && (
                <span className="text-[12.5px] font-semibold text-[#4C7A5A]">✓ Resolved</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-[#6B7566] mt-4">
        Referrals idle past <b>{stalledDays} days</b> are flagged as stalled. Video consults launch via Far EasTone Health⁺ at the "Seen" stage.
      </div>
    </div>
  );
}
