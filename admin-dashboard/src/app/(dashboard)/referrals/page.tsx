"use client";

import React, { useState } from 'react';
import { useDemoStore } from "@/store/useDemoStore";
import { AlertCircle } from 'lucide-react';

export default function ReferralsPage() {
  const { referrals, updateReferralStatus } = useDemoStore();
  
  // We can just use dummy or store data, let's mix for visually matching layout
  const refs = [
    { id: "REF-2098", patient: "Marites Ocampo", barangay: "Prov. Hospital", status: "referred", stalled: true },
    { id: "REF-2099", patient: "Eduardo Santos", barangay: "San Isidro", status: "flagged", stalled: false }
  ];

  const steps = ["Flagged", "Referred", "Seen", "Resolved"];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 bg-[#F5F4F0] min-h-screen">
      <h1 className="text-2xl font-bold text-[#1E3A2F]">Referral Management</h1>
      
      <div className="flex flex-col gap-4">
        {refs.map((r, idx) => {
          const currentStepIdx = steps.findIndex(s => s.toLowerCase() === r.status);
          
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 relative overflow-hidden">
              {r.stalled && <div className="absolute top-0 right-0 px-4 py-1 bg-[#B0523F] text-white text-xs font-bold rounded-bl-lg flex items-center gap-1"><AlertCircle className="w-3 h-3" /> STALLED</div>}
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-[#1E3A2F]">{r.patient}</h3>
                  <p className="text-sm font-mono text-gray-500 mt-1">{r.id} • {r.barangay}</p>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => updateReferralStatus(r.id, 'referred')} className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">MARK REFERRED</button>
                  <button onClick={() => updateReferralStatus(r.id, 'seen')} className="px-4 py-2 bg-[#4C7A5A] text-white rounded-lg text-xs font-bold hover:bg-[#3d6349]">MARK SEEN</button>
                  <button onClick={() => updateReferralStatus(r.id, 'resolved')} className="px-4 py-2 bg-[#1E3A2F] text-white rounded-lg text-xs font-bold hover:bg-[#152a22]">MARK RESOLVED</button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="flex items-center w-full max-w-2xl mt-4">
                {steps.map((step, i) => {
                  const isCompleted = i <= currentStepIdx;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs z-10 ${isCompleted ? 'bg-[#1E3A2F] border-[#1E3A2F] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                          {i + 1}
                        </div>
                        <span className={`text-xs font-bold absolute top-10 ${isCompleted ? 'text-[#1E3A2F]' : 'text-gray-400'}`}>{step}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-[#1E3A2F]' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
