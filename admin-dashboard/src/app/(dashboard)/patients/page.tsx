"use client";

import React, { useState } from "react";
import { Search, Download, Clock, FilePlus, X, ChevronUp, ChevronDown } from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";

const RISK_META: Record<string, { label: string; color: string; bg: string }> = {
  elevated: { label: 'Elevated', color: '#fff', bg: '#B0523F' },
  moderate: { label: 'Moderate', color: '#fff', bg: '#C79A3C' },
  low: { label: 'Low', color: '#fff', bg: '#4C7A5A' },
};

export default function PatientsPage() {
  const { patients, riskFlags, referrals, facilities } = useDemoStore() as any;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'name' | 'risk' | 'lastScreening'>('risk');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const getPatientRisk = (pid: string) => {
    const flags = (riskFlags || []).filter((f: any) => f.patientId === pid);
    if (flags.some((f: any) => f.category === 'elevated')) return 'elevated';
    if (flags.some((f: any) => f.category === 'moderate')) return 'moderate';
    return null;
  };

  const getFacilityName = (fid: string) =>
    (facilities || []).find((f: any) => f.id === fid)?.name ?? fid;

  const filtered = (patients || [])
    .filter((p: any) => {
      const q = query.toLowerCase();
      const matchesQ = !q || p.name?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q) || p.barangay?.toLowerCase().includes(q);
      const riskLevel = p.risk ?? getPatientRisk(p.id) ?? 'low';
      const matchesRisk = riskFilter === 'all' || riskLevel === riskFilter;
      return matchesQ && matchesRisk;
    })
    .sort((a: any, b: any) => {
      const riskOrder: Record<string, number> = { elevated: 0, moderate: 1, low: 2 };
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name?.localeCompare(b.name);
      else if (sortKey === 'risk') cmp = (riskOrder[a.risk] ?? 2) - (riskOrder[b.risk] ?? 2);
      else if (sortKey === 'lastScreening') cmp = a.lastScreening?.localeCompare(b.lastScreening ?? '') ?? 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const selectedPatient = (patients || []).find((p: any) => p.id === selectedId);
  const selectedReferral = (referrals || []).find((r: any) => r.patientId === selectedId);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: string }) =>
    sortKey === col
      ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
      : <ChevronUp className="w-3 h-3 opacity-20" />;

  return (
    <div className="flex h-full bg-[#F5F4F0] min-h-screen">
      <div className={`p-8 transition-all duration-300 ${selectedPatient ? 'w-[calc(100%-340px)]' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A2F]">Patient Registry</h1>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} patients in scope</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#4C7A5A] text-[#4C7A5A] rounded-lg text-sm font-bold hover:bg-[#4C7A5A]/5 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name, ID, or barangay…"
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4C7A5A]"
            />
          </div>
          <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1">
            {[['all', 'All'], ['elevated', 'Elevated'], ['moderate', 'Moderate'], ['low', 'Low']].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setRiskFilter(k)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${riskFilter === k ? 'bg-[#1E3A2F] text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >{l}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="py-3.5 px-5">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1">Patient <SortIcon col="name" /></button>
                </th>
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Barangay</th>
                <th className="py-3.5 px-5">
                  <button onClick={() => toggleSort('risk')} className="flex items-center gap-1">Risk <SortIcon col="risk" /></button>
                </th>
                <th className="py-3.5 px-5">
                  <button onClick={() => toggleSort('lastScreening')} className="flex items-center gap-1">Last Screening <SortIcon col="lastScreening" /></button>
                </th>
                <th className="py-3.5 px-5">Latest Vitals</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any, i: number) => {
                const risk = p.risk ?? 'low';
                const meta = RISK_META[risk];
                const isSelected = p.id === selectedId;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedId(isSelected ? null : p.id)}
                    className={`cursor-pointer border-b border-gray-50 hover:bg-[#F9F8F6] transition-colors ${isSelected ? 'bg-[#F9F8F6]' : i % 2 === 1 ? 'bg-[#FAFAF8]' : ''}`}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: meta.bg }}>
                          {p.name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-[#1E3A2F] text-sm">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.age} yrs · {p.sex === 'F' ? 'Female' : 'Male'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-gray-500">{p.id}</td>
                    <td className="py-3.5 px-5 text-sm text-gray-600">{p.barangay}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: meta.bg }}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-gray-600">{p.lastScreening ?? '—'}</td>
                    <td className="py-3.5 px-5 text-sm text-gray-700 font-medium">{p.vitals ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4 border-t border-gray-100 text-xs text-gray-400 font-medium">
            Showing 1 – {filtered.length} of {filtered.length} patients
          </div>
        </div>
      </div>

      {/* Right drawer */}
      {selectedPatient && (
        <div className="w-[340px] border-l border-gray-200 bg-white h-screen fixed right-0 top-0 pt-16 flex flex-col shadow-2xl z-40 overflow-y-auto">
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-[#1E3A2F]">{selectedPatient.name}</h2>
              <p className="font-mono text-xs text-gray-400 mt-0.5">{selectedPatient.id}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: RISK_META[selectedPatient.risk ?? 'low'].bg }}>
                {RISK_META[selectedPatient.risk ?? 'low'].label} Risk
              </span>
            </div>
            <button onClick={() => setSelectedId(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 flex-1">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Age / Sex</p>
                <p className="text-sm font-bold text-[#1E3A2F] mt-1">{selectedPatient.age} yrs · {selectedPatient.sex === 'F' ? 'Female' : 'Male'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Screenings</p>
                <p className="text-sm font-bold text-[#1E3A2F] mt-1">{selectedPatient.screenCount ?? '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Consent</p>
                <p className="text-sm font-bold text-[#4C7A5A] mt-1">✓ Given</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Barangay</p>
                <p className="text-sm font-bold text-[#1E3A2F] mt-1">{selectedPatient.barangay}</p>
              </div>
            </div>

            {selectedPatient.reason && (
              <div className="bg-[#B0523F]/5 border border-[#B0523F]/20 rounded-xl p-4 mb-6">
                <p className="text-[10px] font-bold text-[#B0523F] uppercase tracking-wider mb-1">AI Flag Reason</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedPatient.reason}</p>
              </div>
            )}

            {selectedReferral && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Active Referral</p>
                <p className="text-sm font-bold text-[#1E3A2F]">{selectedReferral.id}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedReferral.destinationLabel} · {selectedReferral.status}</p>
              </div>
            )}

            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Screening History</h3>
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
              {[
                { date: selectedPatient.lastScreening, source: `Kiosk screening · Brgy. ${selectedPatient.barangay}`, vitals: selectedPatient.vitals, grade: 'Screening' },
                { date: 'Jun 30', source: `Kiosk screening · Brgy. ${selectedPatient.barangay}`, vitals: 'BP 148/92 · GLU 156', grade: 'Screening' },
                { date: 'May 12', source: 'Hospital record · Prov. Hospital', vitals: 'BP 150/94 · HbA1c 6.9%', grade: 'Diagnostic' },
              ].map((h, i) => (
                <div key={i} className="relative z-10 flex gap-3">
                  <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5 ${h.grade === 'Diagnostic' ? 'bg-[#4C7A5A]' : 'bg-[#1E3A2F]'}`}>
                    <Clock className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{h.date}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{h.source}</p>
                    <div className="mt-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 text-xs font-medium text-gray-700">{h.vitals}</div>
                    <span className={`text-[10px] font-bold mt-1 inline-block ${h.grade === 'Diagnostic' ? 'text-[#4C7A5A]' : 'text-gray-400'}`}>{h.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 border-t border-gray-100">
            <button className="w-full py-3 bg-[#1E3A2F] text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#152a22] transition-colors">
              <FilePlus className="w-4 h-4" /> New Clinical Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
