"use client";

import React, { use, useState } from "react";
import {
  ArrowLeft, Activity, Calendar, HeartPulse, AlertTriangle,
  CheckCircle2, User, MapPin, ShieldCheck, ClipboardList, Wifi,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useDemoStore } from "@/store/useDemoStore";
import {
  getRiskLabel, getRiskColor, formatDate, formatDateTime, calculateAge, REFERRAL_STEPS,
} from "@/store/useDemoStore";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  kiosk:    { bg: "bg-[#A3B18B]/20", text: "text-[#4C7A5A]",  label: "Kiosk" },
  rhu:      { bg: "bg-[#1E3A2F]/10", text: "text-[#1E3A2F]",  label: "RHU" },
  hospital: { bg: "bg-blue-100",     text: "text-blue-700",    label: "Hospital" },
};

export default function PatientDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const {
    patients, screenings, riskFlags, referrals, facilities,
    clinicalValidations, updateReferralStatus, createReferral,
  } = useDemoStore();

  const vitalsHistory: Record<string, { timestamp: string; bpSystolic?: number; glucoseValue?: number }[]> = {
    "patient-1": [
      { timestamp: "2024-01-10T08:00:00Z", bpSystolic: 120, glucoseValue: 90 },
      { timestamp: "2024-02-15T09:30:00Z", bpSystolic: 125, glucoseValue: 95 },
      { timestamp: "2024-03-20T10:15:00Z", bpSystolic: 130, glucoseValue: 98 },
      { timestamp: "2024-04-05T14:20:00Z", bpSystolic: 145, glucoseValue: 105 },
    ]
  };

  const patient = patients.find((p) => p.id === id);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [referralFacility, setReferralFacility] = useState("");
  const [referralNote, setReferralNote] = useState("");

  if (!patient) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center gap-4">
        <User className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-bold text-[#1E3A2F]">Patient Not Found</h2>
        <Link href="/patients" className="text-[#A3B18B] hover:underline flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Registry
        </Link>
      </div>
    );
  }

  const facility = facilities.find((f) => f.id === patient.facilityId);
  const patientScreenings = screenings.filter((s) => s.patientId === id);
  const latestScreening = patientScreenings[0];
  const patientRiskFlag = riskFlags.find((r) => r.patientId === id);
  const patientReferral = referrals.find((r) => r.patientId === id);
  const vitalsData = (vitalsHistory as Record<string, { timestamp: string; bpSystolic?: number; glucoseValue?: number }[]>)[id] ?? [];

  const chartData = vitalsData.map((v) => ({
    date: formatDate(v.timestamp),
    Systolic: v.bpSystolic,
    Glucose: v.glucoseValue,
  }));

  const riskColor = patientRiskFlag
    ? getRiskColor(patientRiskFlag.category).hex
    : "#4C7A5A";

  const referralStepIndex = patientReferral
    ? REFERRAL_STEPS.indexOf(patientReferral.status)
    : -1;

  const getValidationBadge = (screeningId: string) =>
    clinicalValidations.find((cv: { screeningId: string }) => cv.screeningId === screeningId);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* ── Back + Header ── */}
      <div>
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1E3A2F] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Registry
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A2F]">{patient.name}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {patient.id}
              </span>
              <span className="text-xs text-muted-foreground">
                {patient.sex === "F" ? "Female" : "Male"} · Age {calculateAge(patient.dob)}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ color: riskColor, backgroundColor: `${riskColor}18` }}
              >
                {patientRiskFlag ? getRiskLabel(patientRiskFlag.category) : "Low Risk"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  patient.consentStatus === "given"
                    ? "bg-[#4C7A5A]/10 text-[#4C7A5A]"
                    : "bg-[#B0523F]/10 text-[#B0523F]"
                }`}
              >
                <ShieldCheck className="inline w-3 h-3 mr-1" />
                Consent {patient.consentStatus}
              </span>
            </div>
          </div>
          {patientRiskFlag && !patientReferral && (
            <button
              onClick={() => setShowReferralDialog(true)}
              className="px-4 py-2 bg-[#1E3A2F] text-[#A3B18B] rounded-lg text-sm font-medium hover:bg-[#2d5544] transition-colors"
            >
              Create Referral
            </button>
          )}
        </div>
      </div>

      {/* ── Create Referral Dialog ── */}
      {showReferralDialog && patientRiskFlag && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-[#1E3A2F] mb-1">Create Referral</h3>
            <p className="text-xs text-muted-foreground mb-4">
              AI Recommendation: {patientRiskFlag.recommendedAction}
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Destination Facility
                </label>
                <select
                  value={referralFacility}
                  onChange={(e) => setReferralFacility(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                >
                  <option value="">Select facility...</option>
                  {facilities
                    .filter((f) => f.type === "hospital")
                    .map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Notes (optional)
                </label>
                <textarea
                  value={referralNote}
                  onChange={(e) => setReferralNote(e.target.value)}
                  rows={2}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
                  placeholder="Add clinical notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowReferralDialog(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                disabled={!referralFacility}
                onClick={() => {
                  createReferral(patient.id, patientRiskFlag.id, referralFacility);
                  setShowReferralDialog(false);
                }}
                className="flex-1 px-4 py-2 bg-[#1E3A2F] text-[#A3B18B] rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Confirm Referral
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* ── Left column ── */}
        <div className="space-y-4">
          {/* Patient info */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-[#1E3A2F] text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#A3B18B]" />
              Patient Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{formatDate(patient.dob)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registered Facility</p>
                <p className="font-medium">{facility?.name ?? patient.facilityId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Consent Date</p>
                <p className="font-medium">{formatDate(patient.consentDate)}</p>
              </div>
            </div>
          </div>

          {/* AI Assessment */}
          {patientRiskFlag && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-[#1E3A2F] text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: riskColor }} />
                AI Brain Assessment
              </h3>
              {patientRiskFlag.provisional && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mb-2">
                  Provisional
                </span>
              )}
              <div
                className="rounded-lg p-3 mb-3"
                style={{ backgroundColor: `${riskColor}10` }}
              >
                <p className="text-lg font-bold" style={{ color: riskColor }}>
                  {getRiskLabel(patientRiskFlag.category)}
                </p>
                <p className="text-xs mt-0.5" style={{ color: riskColor }}>
                  Confidence: {Math.round(patientRiskFlag.confidence * 100)}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {patientRiskFlag.recommendedAction}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2">
                Source: {patientRiskFlag.source}
              </p>
            </div>
          )}

          {/* Referral Stepper */}
          {patientReferral && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-[#1E3A2F] text-sm mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#A3B18B]" />
                Referral Status
              </h3>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 right-3.5 h-px bg-border" />
                <div className="flex justify-between relative">
                  {REFERRAL_STEPS.map((step, i) => {
                    const historyEntry = patientReferral.statusHistory?.find(
                      (h: { status: string }) => h.status === step
                    );
                    const isDone = i <= referralStepIndex;
                    const isCurrent = i === referralStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                            isDone
                              ? "bg-[#1E3A2F] border-[#1E3A2F]"
                              : "bg-card border-border"
                          } ${isCurrent ? "ring-2 ring-[#A3B18B] ring-offset-1" : ""}`}
                        >
                          {isDone
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-[#A3B18B]" />
                            : <span className="w-2 h-2 rounded-full bg-border" />
                          }
                        </div>
                        <span className={`text-[10px] font-medium capitalize ${isDone ? "text-[#1E3A2F]" : "text-muted-foreground"}`}>
                          {step}
                        </span>
                        {historyEntry && (
                          <span className="text-[9px] text-muted-foreground text-center">
                            {formatDate((historyEntry as { timestamp: string }).timestamp)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Destination: {facilities.find((f) => f.id === patientReferral.destinationFacilityId)?.name ?? patientReferral.destinationFacilityId}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right column (2/3) ── */}
        <div className="col-span-2 space-y-4">
          {/* Vitals trend chart */}
          {chartData.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-[#1E3A2F] text-sm mb-4 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#A3B18B]" />
                Vitals Trend
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="Systolic"
                    stroke="#B0523F"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#B0523F" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Glucose"
                    stroke="#C79A3C"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#C79A3C" }}
                    strokeDasharray="4 2"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-0.5 bg-[#B0523F] inline-block" />
                  BP Systolic (mmHg)
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-0.5 bg-[#C79A3C] inline-block border-dashed border" />
                  Glucose (mg/dL)
                </div>
              </div>
            </div>
          )}

          {/* Screening History */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-[#1E3A2F] text-sm mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#A3B18B]" />
              Screening History
            </h3>
            {patientScreenings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No screenings recorded</p>
            ) : (
              <div className="space-y-3">
                {patientScreenings.map((s) => {
                  const src = SOURCE_COLORS[s.source] ?? SOURCE_COLORS.kiosk;
                  const validation = getValidationBadge(s.id);
                  return (
                    <div key={s.id} className="flex gap-4 p-3 rounded-lg border border-border even:bg-[#F1EEE7]/50">
                      <div className="text-center min-w-[60px]">
                        <p className="text-[10px] text-muted-foreground">{formatDate(s.timestamp)}</p>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
                        {s.bp && (
                          <div>
                            <span className="text-muted-foreground">BP</span>{" "}
                            <span className={`font-semibold ${s.bpSystolic && s.bpSystolic >= 140 ? "text-[#B0523F]" : "text-foreground"}`}>
                              {s.bp}
                            </span>
                          </div>
                        )}
                        {s.glucose && (
                          <div>
                            <span className="text-muted-foreground">Glucose</span>{" "}
                            <span className={`font-semibold ${s.glucoseValue && s.glucoseValue >= 100 ? "text-[#C79A3C]" : "text-foreground"}`}>
                              {s.glucose}
                            </span>
                          </div>
                        )}
                        {s.heartRate && (
                          <div>
                            <span className="text-muted-foreground">HR</span>{" "}
                            <span className="font-semibold">{s.heartRate} bpm</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${src.bg} ${src.text}`}>
                          {src.label}
                        </span>
                        {validation && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#4C7A5A]/10 text-[#4C7A5A] flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Validated
                          </span>
                        )}
                        {s.afibFlag && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#B0523F]/10 text-[#B0523F]">
                            AFIB
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
