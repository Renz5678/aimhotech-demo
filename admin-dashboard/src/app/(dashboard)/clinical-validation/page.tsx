"use client";

import React, { useState, useMemo } from 'react';
import { useDemoStore, formatDate, formatDateTime } from "@/store/useDemoStore";
import { CheckSquare, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function ClinicalValidationPage() {
  const { clinicalValidations, screenings, patients, users } = useDemoStore();
  
  const pendingRecords = useMemo(() => {
    return clinicalValidations.filter(cv => cv.status === 'awaiting').map(cv => {
      const screening = screenings.find(s => s.id === cv.screeningId);
      const patient = patients.find(p => p.id === cv.patientId);
      return {
        ...cv,
        label: `Screening #${cv.screeningId.substring(0, 8).toUpperCase()} — ${patient?.name ?? 'Unknown'} (${screening?.source ?? 'Kiosk'})`
      };
    });
  }, [clinicalValidations, screenings, patients]);

  const validatedRecords = useMemo(() => {
    return clinicalValidations.filter(cv => cv.status === 'submitted').map(cv => {
      const screening = screenings.find(s => s.id === cv.screeningId);
      const patient = patients.find(p => p.id === cv.patientId);
      const clinician = users.find(u => u.id === cv.validatingClinicianId);
      return {
        ...cv,
        recordLabel: `Screening #${cv.screeningId.substring(0, 8).toUpperCase()} — ${patient?.name ?? 'Unknown'}`,
        byLabel: `Dr. ${clinician?.name?.split(' ').pop() ?? 'Clinician'} (PRC ${cv.licenseNumber})`,
        whenLabel: cv.submittedAt ? formatDateTime(cv.submittedAt) : 'Recently'
      };
    }).sort((a, b) => new Date(b.submittedAt ?? 0).getTime() - new Date(a.submittedAt ?? 0).getTime());
  }, [clinicalValidations, screenings, patients, users]);

  const [selectedRecordId, setSelectedRecordId] = useState<string>(pendingRecords[0]?.id ?? '');
  const [license, setLicense] = useState('');
  const [valStep, setValStep] = useState<'idle' | 'verifying' | 'failed' | 'verified'>('idle');

  const doVerify = () => {
    if (!license) return;
    setValStep('verifying');
    setTimeout(() => {
      if (license.length < 6) {
        setValStep('failed');
      } else {
        setValStep('verified');
      }
    }, 1500);
  };

  const doSubmitVal = () => {
    // In a real app, this would mutate the store.
    // For demo purposes, we will just show a success state and reset.
    alert("Record successfully validated and upgraded to diagnostic-grade!");
    setLicense('');
    setValStep('idle');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[#A3B18B]" />
          Clinical Validation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review and validate AI-generated insights and alerts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 bg-white border border-[#E4E1D8] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Validate a hospital-submitted record</h2>
          <p className="text-[12.5px] text-[#6B7566] mb-5 leading-relaxed">
            Records become <b className="text-foreground">diagnostic-grade</b> only after the submitting clinician's PRC license and QR verification pass (Business Plan §4.3).
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-foreground">Pending record</label>
              <select 
                value={selectedRecordId}
                onChange={(e) => { setSelectedRecordId(e.target.value); setValStep('idle'); setLicense(''); }}
                className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-[13.5px] bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
              >
                {pendingRecords.length === 0 && <option value="">No pending records</option>}
                {pendingRecords.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-foreground">Clinician PRC license number</label>
              <input 
                type="text"
                value={license}
                onChange={(e) => { setLicense(e.target.value); if (valStep !== 'idle') setValStep('idle'); }}
                placeholder="e.g. 0123456"
                className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-sm font-mono bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
              />
            </div>

            {valStep === 'idle' && (
              <button 
                onClick={doVerify}
                disabled={!license || !selectedRecordId}
                className="w-full py-2.5 rounded-lg border-none bg-[#1E3A2F] text-[#F9F8F6] text-[13.5px] font-semibold hover:bg-[#2A4A3C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Verify license & QR
              </button>
            )}

            {valStep === 'verifying' && (
              <div className="flex items-center justify-center gap-2.5 p-2.5 rounded-lg bg-[#EFF2EA] text-[13px] font-medium text-[#3F4A3A] mt-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#1E3A2F]" />
                Checking PRC registry & QR signature…
              </div>
            )}

            {valStep === 'failed' && (
              <div className="mt-2 space-y-3">
                <div className="text-[12.5px] text-[#B0523F] bg-[#B0523F14] border border-[#B0523F33] rounded-lg p-2.5 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Verification failed — license number must be at least 6 digits. Check the entry and retry.</span>
                </div>
                <button 
                  onClick={doVerify}
                  className="w-full py-2.5 rounded-lg border border-[#B0523F] bg-white text-[#B0523F] text-[13.5px] font-semibold hover:bg-[#B0523F0D] transition-colors"
                >
                  Retry verification
                </button>
              </div>
            )}

            {valStep === 'verified' && (
              <div className="mt-2 space-y-3">
                <div className="text-[12.5px] text-[#2F5B40] bg-[#4C7A5A14] border border-[#4C7A5A44] rounded-lg p-2.5 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><b>Verified.</b> PRC license {license} — Dr. A. Reyes, Internal Medicine · QR signature valid.</span>
                </div>
                <button 
                  onClick={doSubmitVal}
                  className="w-full py-2.5 rounded-lg border-none bg-[#4C7A5A] text-white text-[13.5px] font-semibold hover:bg-[#3F6A4E] transition-colors"
                >
                  Submit as diagnostic-grade
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-5 bg-white border border-[#E4E1D8] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recently validated</h2>
          
          <div className="space-y-0">
            {validatedRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4">No recently validated records found.</p>
            ) : (
              validatedRecords.map((v, i) => (
                <div key={v.id} className="flex items-center gap-3 py-3 border-b border-[#F1EEE7] last:border-0">
                  <span className="w-2 h-2 rounded-full bg-[#4C7A5A] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate text-foreground">{v.recordLabel}</div>
                    <div className="text-xs text-[#6B7566] mt-0.5 truncate">by {v.byLabel} · {v.whenLabel}</div>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full text-[#2F5B40] bg-[#4C7A5A14]">
                    Diagnostic-grade
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="text-xs text-[#6B7566] mt-4 leading-relaxed">
            Screening-grade kiosk data is never upgraded automatically — every diagnostic-grade record traces to a verified clinician.
          </div>
        </div>
      </div>
    </div>
  );
}
