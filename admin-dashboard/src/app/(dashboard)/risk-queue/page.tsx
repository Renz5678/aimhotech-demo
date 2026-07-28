"use client";

import React, { useState } from "react";
import { Eye } from 'lucide-react';

export default function RiskQueuePage() {
  const [activeTab, setActiveTab] = useState("Needs Review");

  const items = [
    { id: "RF-001", priority: 1, patient: "Rosario Dimagiba", station: "San Isidro", reason: "Repeat elevated BP over 5 months", flagged: "10 mins ago", status: "Needs Review", riskColor: "#B0523F" },
    { id: "RF-002", priority: 2, patient: "Eduardo Santos", station: "Poblacion", reason: "Possible AFIB + high glucose", flagged: "2 hrs ago", status: "Needs Review", riskColor: "#B0523F" },
    { id: "RF-003", priority: 3, patient: "Teresita Manalo", station: "Malanday", reason: "Moderate risk trend", flagged: "1 day ago", status: "Referred", riskColor: "#C79A3C" }
  ];

  const tabs = [
    { name: "Needs Review", count: 2 },
    { name: "Referred", count: 1 },
    { name: "Resolved", count: 0 }
  ];

  const filtered = items.filter(i => i.status === activeTab);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 bg-[#F5F4F0] min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A2F]">Risk Queue</h1>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        {tabs.map(t => (
          <button 
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === t.name ? 'border-[#1E3A2F] text-[#1E3A2F]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            {t.name}
            {t.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs text-white ${activeTab === t.name ? 'bg-[#1E3A2F]' : 'bg-gray-300'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-6 w-10"><input type="checkbox" className="rounded" /></th>
              <th className="py-4 px-6">PRIORITY</th>
              <th className="py-4 px-6">PATIENT</th>
              <th className="py-4 px-6">STATION</th>
              <th className="py-4 px-6">AI FLAG REASON</th>
              <th className="py-4 px-6">FLAGGED</th>
              <th className="py-4 px-6">REVIEW STATUS</th>
              <th className="py-4 px-6 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 px-6"><input type="checkbox" className="rounded" /></td>
                <td className="py-4 px-6">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: item.riskColor }}>
                    {item.priority}
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-[#1E3A2F]">{item.patient}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.station}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-800">{item.reason}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.flagged}</td>
                <td className="py-4 px-6">
                  {i === 0 && activeTab === "Needs Review" ? (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md flex w-fit items-center gap-1 border border-blue-200">
                      <Eye className="w-3 h-3" /> In review • Dr. Reyes
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md border border-gray-200">
                      {item.status}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  {activeTab === "Needs Review" ? (
                    <button className="px-4 py-2 bg-[#1E3A2F] text-white rounded-lg text-sm font-bold hover:bg-[#152a22]">
                      Claim
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-[#4C7A5A]/10 text-[#4C7A5A] rounded-lg text-sm font-bold hover:bg-[#4C7A5A]/20">
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 font-medium">
          <div>Showing 1 to {filtered.length} of {filtered.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-400" disabled>Previous</button>
            <button className="px-3 py-1 bg-[#1E3A2F] text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-400" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
