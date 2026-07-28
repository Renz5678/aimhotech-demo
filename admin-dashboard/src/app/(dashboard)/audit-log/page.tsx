"use client";

import React from 'react';

export default function AuditLogPage() {
  const logs = [
    { id: 'AL-1004', time: '2026-07-28 09:42:11', user: 'm.chen@aimhotech.com', action: 'EXPORT_PHI', details: 'Exported Risk Queue for 12 patients. IP: 192.168.1.45' },
    { id: 'AL-1003', time: '2026-07-28 09:15:00', user: 'SYSTEM', action: 'ALGORITHM_UPDATE', details: 'Deployed v2.4 of Arrhythmia detection model.' },
    { id: 'AL-1002', time: '2026-07-27 16:30:22', user: 's.jenkins@aimhotech.com', action: 'CLINICAL_VALIDATION', details: 'Validated alert for P-10293 as True Positive.' },
    { id: 'AL-1001', time: '2026-07-27 14:10:05', user: 'admin@aimhotech.com', action: 'ROLE_CHANGE', details: 'Changed role for c.bates@aimhotech.com to Viewer.' },
  ];

  return (
    <div className="p-6 bg-[#F9F8F6] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F]">System Audit Log</h1>
          <p className="text-gray-600 mt-1">HIPAA-compliant immutable log of system actions.</p>
        </div>
        <button className="border border-[#1E3A2F] text-[#1E3A2F] bg-white px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors">
          Export Logs (CSV)
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-[#A3B18B]/30">
        <div className="p-4 border-b border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="date" 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F]"
          />
          <input 
            type="text" 
            placeholder="Search user or ID..." 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F]"
          />
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F]">
            <option>All Actions</option>
            <option>PHI Access</option>
            <option>System Config</option>
            <option>Authentication</option>
          </select>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm font-medium">
            Apply Filters
          </button>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#1E3A2F] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User/System</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 font-mono text-sm">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#F9F8F6]">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{log.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">{log.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[#1E3A2F]">{log.action}</td>
                <td className="px-6 py-4 text-gray-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
