"use client";

import React, { useState, useMemo } from 'react';
import { useDemoStore, formatDateTime } from "@/store/useDemoStore";
import { History, Search, Download } from 'lucide-react';

export default function AuditLogPage() {
  const { auditLog } = useDemoStore();
  const [search, setSearch] = useState('');

  const actColors: Record<string, string[]> = {
    VIEW: ['#3F4A3A', '#EFF2EA'],
    UPDATE: ['#8F6E23', '#C79A3C1F'],
    CREATE: ['#2F5B40', '#4C7A5A14'],
    VALIDATE: ['#2F5B40', '#4C7A5A14'],
    FLAG: ['#B0523F', '#B0523F14'],
    EXPORT: ['#3F4A3A', '#EFF2EA'],
    SYNC: ['#8F6E23', '#C79A3C1F']
  };

  const filteredLog = useMemo(() => {
    const q = search.toLowerCase();
    return auditLog.filter(a => {
      return !q || 
        a.actor.toLowerCase().includes(q) || 
        a.action.toLowerCase().includes(q) || 
        a.entityType.toLowerCase().includes(q) ||
        (a.details ?? '').toLowerCase().includes(q);
    });
  }, [auditLog, search]);

  const auditRows = filteredLog.map(a => {
    const actColor = actColors[a.action] || ['#3F4A3A', '#EFF2EA'];
    return {
      ...a,
      actColor: actColor[0],
      actBg: actColor[1],
      timeFormatted: formatDateTime(a.timestamp)
    };
  });

  const handleExport = () => {
    alert("Exporting audit log as CSV...");
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
          <History className="w-6 h-6 text-[#A3B18B]" />
          Audit Log
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Immutable record of all system activity and data access.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7566]" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit trails by actor, action, or entity…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#D8D5CC] rounded-lg text-sm bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
          />
        </div>
        <button 
          onClick={handleExport}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#D8D5CC] bg-white text-[#6B7566] text-[13.5px] font-semibold hover:bg-[#F1EEE7] hover:text-[#1E3A2F] transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white border border-[#E4E1D8] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead className="bg-[#F9F8F6]">
              <tr className="text-left border-b border-[#E4E1D8]">
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Timestamp</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Actor</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Action</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Entity</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EEE7]">
              {auditRows.map((a, i) => (
                <tr key={a.id} className="even:bg-[#F1EEE7]/40 hover:bg-[#EFF2EA]/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-[#6B7566]">{a.timeFormatted}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-foreground">{a.actor}</div>
                    <div className="text-[11px] text-[#6B7566] font-mono mt-0.5">{a.ipAddress ?? '—'}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span 
                      className="inline-block px-2.5 py-1 rounded-[6px] text-[11px] font-bold tracking-[0.5px]"
                      style={{ color: a.actColor, backgroundColor: a.actBg, border: `1px solid ${a.actColor}33` }}
                    >
                      {a.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-[13px] font-medium text-foreground">{a.entityType}</div>
                    <div className="text-[11px] font-mono text-[#6B7566] mt-0.5">{a.entityId}</div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#3F4A3A] max-w-[300px] truncate" title={a.details}>
                    {a.details ?? '—'}
                  </td>
                </tr>
              ))}
              {auditRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No audit records found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
