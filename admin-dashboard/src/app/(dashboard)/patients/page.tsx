"use client";

import React, { useState } from "react";
import { Search, Filter, Clock, FilePlus, X } from "lucide-react";

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patients = [
    { name: "Rosario Dimagiba", id: "QC-097-00214", barangay: "San Isidro", risk: "Elevated", lastScreening: "Today, 09:15 AM", vitals: "158/98 BP · 112 mg/dL", riskColor: "#B0523F" },
    { name: "Eduardo Santos", id: "QC-097-00215", barangay: "Poblacion", risk: "Moderate", lastScreening: "Yesterday", vitals: "145/90 BP · 102 mg/dL", riskColor: "#C79A3C" },
    { name: "Teresita Manalo", id: "QC-133-00089", barangay: "Malanday", risk: "Low", lastScreening: "Jul 20", vitals: "128/82 BP · 95 mg/dL", riskColor: "#4C7A5A" }
  ];

  return (
    <div className="flex h-full bg-[#F5F4F0] min-h-screen">
      {/* Main Table Area */}
      <div className={`p-8 transition-all duration-300 ${selectedPatient ? "w-[calc(100%-300px)]" : "w-full"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1E3A2F]">Patient Registry</h1>
          <div className="text-sm font-medium text-gray-500">{patients.length} patients in scope</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search patients..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4C7A5A]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">PATIENT</th>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">BARANGAY</th>
                <th className="py-3 px-6">RISK</th>
                <th className="py-3 px-6">LAST SCREENING</th>
                <th className="py-3 px-6">LATEST VITALS</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={i} onClick={() => setSelectedPatient(p)} className={`cursor-pointer border-b border-gray-50 hover:bg-[#F9F8F6] ${selectedPatient?.id === p.id ? 'bg-[#F9F8F6]' : ''}`}>
                  <td className="py-4 px-6 font-bold text-[#1E3A2F]">{p.name}</td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{p.barangay}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: p.riskColor }}>
                      {p.risk}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">{p.lastScreening}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{p.vitals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Sidebar */}
      {selectedPatient && (
        <div className="w-[300px] border-l border-gray-200 bg-white h-screen fixed right-0 top-0 pt-16 flex flex-col shadow-xl">
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-[#1E3A2F]">{selectedPatient.name}</h2>
              <p className="font-mono text-xs text-gray-500 mt-1">{selectedPatient.id}</p>
            </div>
            <button onClick={() => setSelectedPatient(null)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Screening History</h3>
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
              <div className="relative z-10 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-1">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Today, 09:15 AM</p>
                  <p className="text-xs text-gray-500 mt-1">Kiosk • San Isidro</p>
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm font-medium text-gray-700">
                    {selectedPatient.vitals}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100">
            <button className="w-full py-3 bg-[#1E3A2F] text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#152a22] transition-colors">
              <FilePlus className="w-4 h-4" /> New Clinical Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
