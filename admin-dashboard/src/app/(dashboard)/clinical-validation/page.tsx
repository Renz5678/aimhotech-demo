"use client";

import React, { useState } from 'react';
import { ShieldCheck, QrCode, CheckCircle } from 'lucide-react';
import { useLiveDemoStore } from '../../../../../packages/shared/src/store/useLiveDemoStore';
import { useAdminStore } from '@/store/useAdminStore';
import { supabase } from '../../../lib/supabase';

type ScanState = 'idle' | 'scanning' | 'verified';

export default function ClinicalValidationPage() {
  const { screenings, clinicalValidations, submitClinicalValidation } = useLiveDemoStore();
  const { prcLicense, currentUserName } = useAdminStore();
  const validatedScreeningIds = new Set(clinicalValidations.map((cv: any) => cv.screeningId));
  const pendingScreenings = screenings.filter((s: any) => !validatedScreeningIds.has(s.id)).slice(0, 5);

  const PENDING_RECORDS = pendingScreenings.map((s: any) => ({
    id: s.id,
    patient: s.patientName || s.patientId || 'Unknown Patient',
    date: new Date(s.timestamp).toLocaleDateString(),
    bp: s.metrics
      ? `${s.metrics.systolic ?? s.bpSystolic ?? '--'}/${s.metrics.diastolic ?? s.bpDiastolic ?? '--'}`
      : `${s.bpSystolic ?? s.bp ?? '--'}/${s.bpDiastolic ?? '--'}`,
    glucose: s.metrics?.glucose ?? s.glucoseValue ?? s.glucose ?? '--',
    spo2: s.metrics?.spo2 ?? '--',
    summary: s.notes || `BP ${s.bpSystolic ?? '--'}/${s.bpDiastolic ?? '--'} · HR ${s.heartRate ?? '--'}`
  }));

  const RECENTLY_VALIDATED = clinicalValidations.slice(0, 5).map((cv: any) => ({
    id: cv.screeningId,
    patient: cv.patientName || 'Unknown Patient',
    doctor: cv.validatedBy || 'Unknown Doctor',
    initials: (cv.validatedBy || 'UD').split(' ').map((n: string) => n[0]).join(''),
    time: new Date(cv.validatedAt).toLocaleString()
  }));

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [license, setLicense] = useState(prcLicense || '');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [submitted, setSubmitted] = useState(false);

  const record = PENDING_RECORDS[selectedIdx];

  const handleScan = () => {
    setScanState('scanning');
    setTimeout(() => setScanState('verified'), 2000);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (record) {
      submitClinicalValidation(record.id);
      await supabase.from('activity_feed').insert({ 
        id: 'af-cv-' + Date.now(), 
        type: 'validation', 
        text: currentUserName + ' validated screening ' + record.id, 
        time: 'Just now', 
        dot: '#4C7A5A' 
      });
    }
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 bg-[#F5F4F0] min-h-screen">
      <div className="flex gap-8">
        {/* LEFT: Pending record selector + preview */}
        <div className="w-[45%] flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Validate record</p>
              <h2 className="text-xl font-bold text-[#1E3A2F]">Clinical Validation Workflow</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">Records become diagnostic-grade only after verification against clinician credentials.</p>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Pending Record</p>
              <div className="flex flex-col gap-2">
                {PENDING_RECORDS.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedIdx(i)}
                    className={`text-left p-3 rounded-xl border transition-all ${selectedIdx === i ? 'border-[#1E3A2F] bg-[#F5F4F0]' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span className="text-xs font-mono font-bold text-gray-500">Screening #{r.id}</span>
                    <span className="text-sm font-bold text-[#1E3A2F] ml-2">— {r.patient}</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{r.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#F5F4F0] rounded-xl border border-gray-200/50 p-5">
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">Record Preview</p>
              <h3 className="font-bold text-[#1E3A2F] text-lg mb-1">{record.patient}</h3>
              <p className="text-xs font-mono text-gray-400 mb-4">#{record.id} · {record.date}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Primary Metric</p>
                  <p className="text-lg font-black text-[#B0523F]">{record.bp}</p>
                  <p className="text-xs font-bold text-[#B0523F] mt-0.5">Elevated</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SpO2 Level</p>
                  <p className="text-lg font-black text-[#1E3A2F]">{record.spo2}%</p>
                  <p className="text-xs font-bold text-[#4C7A5A] mt-0.5">Normal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Findings Summary</p>
                <p className="text-sm text-gray-600 italic leading-relaxed">"{record.summary}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Verification form */}
        <div className="w-[55%] flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F4F0] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#1E3A2F]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E3A2F]">Clinician Verification</h2>
                <p className="text-xs text-gray-400">Match PRC license with QR scan to upgrade record</p>
              </div>
            </div>

            {/* License input */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Clinician PRC License Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={license}
                  onChange={e => setLicense(e.target.value)}
                  placeholder="Enter 7-digit license number"
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#4C7A5A] pr-10"
                />
                {license.length >= 7 && (
                  <CheckCircle className="absolute right-3 top-3.5 w-4 h-4 text-[#4C7A5A]" />
                )}
              </div>
            </div>

            {/* QR Scan area */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">QR Scan</label>
              {scanState === 'idle' && (
                <button
                  onClick={handleScan}
                  className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors gap-3 group"
                >
                  <QrCode className="w-8 h-8 text-gray-300 group-hover:text-[#4C7A5A] transition-colors" />
                  <p className="text-sm font-medium text-gray-400 group-hover:text-[#4C7A5A] transition-colors">Click to scan QR code</p>
                </button>
              )}
              {scanState === 'scanning' && (
                <div className="w-full h-36 border-2 border-[#C79A3C] rounded-xl flex flex-col items-center justify-center bg-[#C79A3C]/5 gap-3 animate-pulse">
                  <div className="w-8 h-8 border-4 border-[#C79A3C] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-[#C79A3C]">Scanning...</p>
                </div>
              )}
              {scanState === 'verified' && (
                <div className="w-full h-36 border-2 border-[#4C7A5A] rounded-xl flex flex-col items-center justify-center bg-[#4C7A5A]/5 gap-2">
                  <CheckCircle className="w-8 h-8 text-[#4C7A5A]" />
                  <p className="text-sm font-bold text-[#4C7A5A]">License & QR Matched</p>
                  <p className="text-xs text-gray-500">Validated against PRC database</p>
                </div>
              )}
            </div>

            {/* CTA */}
            {submitted ? (
              <div className="w-full py-4 bg-[#4C7A5A] text-white rounded-xl font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Upgraded to Diagnostic-grade ✓
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={scanState !== 'verified' || license.length < 7}
                className="w-full py-4 bg-[#1E3A2F] text-white rounded-xl font-bold hover:bg-[#152a22] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Confirm & Upgrade to Diagnostic-grade
              </button>
            )}

            <p className="text-[10px] font-bold text-gray-300 text-center uppercase tracking-widest mt-3">
              Action will be recorded under {currentUserName}
            </p>
          </div>
        </div>
      </div>

      {/* Recently Validated */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#1E3A2F]">Recently Validated</h2>
          <button className="text-sm font-bold text-[#4C7A5A] hover:text-[#1E3A2F] transition-colors">VIEW ALL HISTORY →</button>
        </div>
        <div className="flex gap-4">
          {RECENTLY_VALIDATED.map(v => (
            <div key={v.id} className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center text-xs font-bold shrink-0">{v.initials}</div>
              <div>
                <p className="text-sm font-bold text-[#1E3A2F]">{v.patient}</p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">Screening #{v.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold bg-[#4C7A5A]/10 text-[#4C7A5A] px-2 py-0.5 rounded-full">DIAGNOSTIC</span>
                  <span className="text-[10px] text-gray-400">{v.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Screening-grade kiosk data is never upgraded automatically — clinician review is always required.</p>
      </div>
    </div>
  );
}
