"use client";

import React, { useState } from 'react';
import { useDemoStore } from "@/store/useDemoStore";

export default function ClinicalValidationPage() {
  const [license, setLicense] = useState("");

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 bg-[#F5F4F0] min-h-screen">
      <h1 className="text-2xl font-bold text-[#1E3A2F]">Clinical Validation</h1>

      <div className="flex gap-8">
        <div className="w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1E3A2F] mb-4">Pending Record</h2>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#4C7A5A] mb-6">
              <option>Screening #S-8842 — Eduardo Santos</option>
            </select>
            
            <div className="bg-[#F5F4F0] p-4 rounded-xl border border-gray-200/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vitals & Summary</h3>
              <p className="text-sm font-medium text-gray-800">178/108 BP · 245 mg/dL Glucose</p>
              <p className="text-sm text-gray-600 mt-2 italic">"Patient complains of dizziness and headache for 3 days."</p>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1E3A2F] mb-4">Validate with PRC License</h2>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">PRC License Number</label>
              <input 
                type="text" 
                value={license}
                onChange={e => setLicense(e.target.value)}
                placeholder="Enter 7-digit license number" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-[#4C7A5A]" 
              />
            </div>

            <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 mb-6">
              <p className="text-sm text-gray-400 font-medium">QR Scan Area</p>
            </div>

            <button className="w-full py-4 bg-[#4C7A5A] text-white rounded-xl font-bold hover:bg-[#3d6349] transition-colors">
              SUBMIT AS DIAGNOSTIC-GRADE
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#1E3A2F] mb-4 mt-4">Recently Validated</h2>
        <div className="flex gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1">
            <p className="text-sm font-bold text-gray-800">Screening #S-8841 — Rosario Dimagiba</p>
            <p className="text-xs text-gray-500 mt-1">by Dr. Amelia Reyes • 2 hours ago</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1">
            <p className="text-sm font-bold text-gray-800">Screening #S-8840 — Teresita Manalo</p>
            <p className="text-xs text-gray-500 mt-1">by Dr. Emmanuel Cruz • Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
}
