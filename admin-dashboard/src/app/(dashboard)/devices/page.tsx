"use client";

import React, { useMemo } from 'react';
import { useLiveDemoStore } from '../../../../../packages/shared/src/store/useLiveDemoStore';
import { formatDateTime } from "@/store/useDemoStore";
import { Monitor } from 'lucide-react';
// Removed duplicate getRelativeTime import

// A simple relative time formatter if we don't have one in utils:
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.floor(hrs / 24);
  return `${days} d ago`;
}

export default function DevicesPage() {
  const { devices, facilities, updateDeviceStatus } = useLiveDemoStore();

  const devStats = useMemo(() => {
    const online = devices.filter(d => d.status === 'online').length;
    const attention = devices.filter(d => d.status !== 'online').length;
    const stations = new Set(devices.map(d => d.facilityId)).size;

    return [
      { label: 'Devices online', value: `${online} / ${devices.length}`, color: '#4C7A5A' },
      { label: 'Needs attention', value: String(attention), color: '#B0523F' },
      { label: 'Stations covered', value: String(stations), color: '#24291F' }
    ];
  }, [devices]);

  const deviceRows = useMemo(() => {
    const typeNames: Record<string, string> = {
      'microlife_b6_connect': 'Microlife BP A7',
      'bionime_rightest_ifree': 'Bionime GM700',
      'kiosk_terminal': 'Kiosk terminal'
    };
    
    const stMap: Record<string, any> = {
      online: ['Online', '#4C7A5A', 'animate-ping-dot'],
      offline: ['Offline', '#B0523F', 'animate-ping-dot'],
      maintenance_needed: ['Maintenance due', '#C79A3C', 'animate-ping-dot']
    };

    return devices.map(d => {
      const facilityName = facilities.find(f => f.id === d.facilityId)?.name ?? d.facilityId;
      const statusInfo = stMap[d.status] || stMap['offline'];
      
      let fwColor = '#24291F';
      if (d.firmwareVersion && d.firmwareVersion < 'v2' && d.type !== 'kiosk_terminal') fwColor = '#24291F';
      if (d.firmwareVersion === 'v2.3.9') fwColor = '#C79A3C'; // highlight older firmwares like reference

      return {
        ...d,
        typeName: typeNames[d.type] || d.type,
        facilityName,
        statusLabel: statusInfo[0],
        stColor: statusInfo[1],
        anim: statusInfo[2],
        fw: d.firmwareVersion ?? 'unknown',
        fwColor,
        sync: d.lastSeen ? timeAgo(d.lastSeen) : 'Never'
      };
    });
  }, [devices, facilities]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
          <Monitor className="w-6 h-6 text-[#A3B18B]" />
          Device Fleet Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor and manage connected patient devices.</p>
      </div>

      <div className="flex gap-4 mb-4 flex-wrap md:flex-nowrap">
        {devStats.map((s, i) => (
          <div key={i} className="flex-1 bg-white border border-[#E4E1D8] rounded-xl p-4 min-w-[200px]">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#6B7566] font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E4E1D8] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead className="bg-[#F9F8F6]">
              <tr className="text-left border-b border-[#E4E1D8]">
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Device</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Type</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Facility</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Status</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Firmware</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Last sync</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EEE7]">
              {deviceRows.map((d, i) => (
                <tr key={d.id} className="even:bg-[#F1EEE7]/50 hover:bg-[#EFF2EA]/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[12.5px] font-medium text-foreground">{d.id}</td>
                  <td className="px-5 py-3.5 text-foreground">{d.typeName}</td>
                  <td className="px-5 py-3.5 text-foreground">{d.facilityName}</td>
                  <td className="px-5 py-3.5">
                    <span 
                      className="inline-flex items-center gap-2 text-[12.5px] font-semibold"
                      style={{ color: d.stColor }}
                    >
                      <span className="relative flex h-2 w-2">
                        {d.anim && (
                          <span 
                            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${d.anim}`}
                            style={{ backgroundColor: d.stColor }}
                          />
                        )}
                        <span 
                          className="relative inline-flex rounded-full h-2 w-2" 
                          style={{ backgroundColor: d.stColor }}
                        />
                      </span>
                      {d.statusLabel}
                    </span>
                  </td>
                  <td 
                    className="px-5 py-3.5 font-mono text-[12.5px]"
                    style={{ color: d.fwColor }}
                  >
                    {d.fw}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6B7566]">{d.sync}</td>
                  <td className="px-5 py-3.5 text-right">
                    {d.status === 'online' ? (
                      <button 
                        onClick={() => updateDeviceStatus(d.id, 'offline')}
                        className="px-3 py-1 bg-[#C79A3C]/10 text-[#C79A3C] font-bold rounded"
                      >
                        Take Offline
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateDeviceStatus(d.id, 'online')}
                        className="px-3 py-1 bg-[#4C7A5A]/10 text-[#4C7A5A] font-bold rounded"
                      >
                        Bring Online
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {deviceRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground text-sm">
                    No devices provisioned.
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
