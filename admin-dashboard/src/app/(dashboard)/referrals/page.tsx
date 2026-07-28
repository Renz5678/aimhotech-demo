"use client";

import React, { useState } from 'react';
import { useDemoStore, formatDate, formatTime } from "@/store/useDemoStore";
import { FileText, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Referral, ReferralStatus } from '@/store/useDemoStore';

export default function ReferralsPage() {
  const { referrals, patients, facilities, updateReferralStatus } = useDemoStore();
  const stalledDays = 7;

  const [activeTab, setActiveTab] = useState<'All' | 'Flagged' | 'Referred' | 'Seen' | 'Resolved'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Dialog state
  const [editingRef, setEditingRef] = useState<Referral | null>(null);
  const [newStatus, setNewStatus] = useState<ReferralStatus>('flagged');
  const [notes, setNotes] = useState('');

  const activeReferrals = referrals.filter(r => r.status !== 'resolved');
  const stalledReferrals = activeReferrals.filter(r => (r.agingDays ?? 0) >= stalledDays);
  const resolvedThisMonth = referrals.filter(r => r.status === 'resolved').length;

  const refStats = [
    { label: 'Total active', value: String(activeReferrals.length), color: '#24291F' },
    { label: `Stalled (≥ ${stalledDays}d)`, value: String(stalledReferrals.length), color: '#B0523F' },
    { label: 'Resolved this month', value: String(resolvedThisMonth), color: '#4C7A5A' },
    { label: 'Median days to seen', value: '4.5', color: '#24291F' }
  ];

  const filteredReferrals = referrals.filter(r => {
    if (activeTab === 'All') return true;
    return r.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getAgingBadge = (days: number) => {
    if (days >= 7) return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#B0523F]/10 text-[#B0523F] border border-[#B0523F]/30">{days}d</span>;
    if (days >= 3) return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C79A3C]/10 text-[#C79A3C] border border-[#C79A3C]/30">{days}d</span>;
    return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#4C7A5A]/10 text-[#4C7A5A] border border-[#4C7A5A]/30">{days}d</span>;
  };

  const handleUpdateStatus = () => {
    if (editingRef) {
      updateReferralStatus(editingRef.id, newStatus, notes);
      setEditingRef(null);
      setNotes('');
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#A3B18B]" />
            Referral Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage patient care transitions</p>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
        {refStats.map((s, i) => (
          <div key={i} className="flex-1 bg-white border border-[#E4E1D8] rounded-xl p-4 min-w-[180px]">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#6B7566] font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-[#E4E1D8] pb-px">
        {['All', 'Flagged', 'Referred', 'Seen', 'Resolved'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-[#1E3A2F] text-[#1E3A2F]' 
                : 'border-transparent text-[#6B7566] hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredReferrals.map(r => {
          const p = patients.find(pat => pat.id === r.patientId);
          const facility = facilities.find(f => f.id === r.destinationFacilityId);
          const days = r.agingDays ?? 0;
          const isStalled = r.status !== 'resolved' && days >= stalledDays;
          const isExpanded = expandedId === r.id;

          return (
            <div key={r.id} className="bg-white rounded-xl border border-[#E4E1D8] overflow-hidden">
              <div className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
                
                <div className="w-[200px] shrink-0">
                  <div className="text-sm font-semibold text-foreground">{p?.name ?? 'Unknown'}</div>
                  <div className="text-xs text-[#6B7566] mt-0.5"><span className="font-mono">{p?.id}</span></div>
                </div>

                <div className="flex-1 min-w-[150px]">
                  <div className="text-xs text-[#6B7566] mb-1">Destination Facility</div>
                  <div className="text-sm font-medium">{facility?.name ?? r.destinationFacilityId}</div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <div className="flex flex-col gap-1 items-end mr-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A2F] bg-[#F1EEE7] px-2 py-0.5 rounded-full">
                      {r.status}
                    </span>
                    <div className="flex gap-2 mt-1">
                      {r.status !== 'resolved' && getAgingBadge(days)}
                      {isStalled && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#B0523F] text-white flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Stalled
                        </span>
                      )}
                    </div>
                  </div>

                  {r.status !== 'resolved' && (
                    <button 
                      onClick={() => {
                        setEditingRef(r);
                        setNewStatus(r.status);
                        setNotes('');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#D8D5CC] text-[12.5px] font-semibold hover:border-[#1E3A2F] transition-colors"
                    >
                      Update Status
                    </button>
                  )}

                  <button 
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    className="p-1.5 rounded-lg hover:bg-[#F1EEE7] transition-colors text-[#6B7566]"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 py-4 bg-[#FDFCFA] border-t border-[#F1EEE7]">
                  <h4 className="text-xs font-bold uppercase text-[#9AA394] mb-4">Status History</h4>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {r.statusHistory?.map((sh, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-[#4C7A5A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded border border-[#E4E1D8] shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs uppercase text-[#1E3A2F]">{sh.status}</span>
                            <span className="text-[10px] text-[#6B7566] font-mono">{formatDate(sh.timestamp)} {formatTime(sh.timestamp.split('T')[1].substring(0,5))}</span>
                          </div>
                          <div className="text-[12px] text-[#6B7566] leading-relaxed">{sh.note}</div>
                          <div className="text-[10px] text-[#9AA394] mt-2 text-right">By {sh.updatedBy}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredReferrals.length === 0 && (
          <div className="py-12 text-center text-[#6B7566] text-sm">No referrals found matching the selected filter.</div>
        )}
      </div>

      {editingRef && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">Update Referral Status</h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#6B7566] mb-1.5">New Status</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ReferralStatus)}
                className="w-full p-2 border border-[#D8D5CC] rounded-lg text-sm bg-white"
              >
                <option value="flagged">Flagged</option>
                <option value="referred">Referred</option>
                <option value="seen">Seen</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#6B7566] mb-1.5">Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter updates or clinical notes..."
                className="w-full p-2 border border-[#D8D5CC] rounded-lg text-sm bg-white min-h-[80px]"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setEditingRef(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#6B7566] hover:bg-[#F1EEE7]"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStatus}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#1E3A2F] text-white hover:bg-[#2A4A3C]"
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
