// @aimhotech/shared — useLiveDemoStore
// The single source of truth for both admin-dashboard and mobile-view.
// All seed data is sourced from references/admin and references/mobile HTML files.

import { create } from 'zustand';
import seedData from '../data/seed-data.json';
import type { RiskFlag, Referral, Screening, ReferralStatus } from '../types/index';

interface LiveDemoState {
  // ── Demo scenario state ─────────────────────────────────────────
  liveTriggerFired: boolean;
  liveScreening: Screening | null;
  liveProvisionalFlag: RiskFlag | null;
  liveConfirmedFlag: RiskFlag | null;
  liveReferral: Referral | null;

  // ── Core data ────────────────────────────────────────────────────
  patients: typeof seedData.patients;
  screenings: Screening[];
  riskFlags: RiskFlag[];
  referrals: Referral[];
  riskQueue: typeof seedData.riskQueue;
  appointments: typeof seedData.appointments;
  facilities: typeof seedData.facilities;
  devices: typeof seedData.devices;
  users: typeof seedData.users;
  barangayMetrics: typeof seedData.barangayMetrics;
  weeklyScreeningData: typeof seedData.weeklyScreeningData;
  kpis: typeof seedData.kpis;
  activityFeed: typeof seedData.activityFeed;
  auditLog: typeof seedData.auditLog;
  reports: typeof seedData.reports;
  reportBreakdown: typeof seedData.reportBreakdown;
  clinicalValidations: typeof seedData.clinicalValidations;
  validationQueue: typeof seedData.validationQueue;
  anomalies: typeof seedData.anomalies;
  healthTips: typeof seedData.healthTips;
  mobileHealthHistory: typeof seedData.mobileHealthHistory;
  workerStats: typeof seedData.workerStats;

  // ── Actions ─────────────────────────────────────────────────────
  triggerLiveSync: () => void;
  createReferral: (patientId: string, riskFlagId: string, destinationId: string) => void;
  simulateDashboardReferral: () => void;
  updateReferralStatus: (referralId: string, newStatus: ReferralStatus, note?: string) => void;
  updateDeviceStatus: (deviceId: string, status: string) => void;
  submitClinicalValidation: (validationId: string) => void;
  acknowledgeAnomaly: (anomalyId: string) => void;
  dismissAnomaly: (anomalyId: string) => void;
  claimQueueItem: (pid: string) => void;
  resetDemo: () => void;
}

export const useLiveDemoStore = create<LiveDemoState>((set) => ({
  // ── Initial state ───────────────────────────────────────────────
  liveTriggerFired: false,
  liveScreening: null,
  liveProvisionalFlag: null,
  liveConfirmedFlag: null,
  liveReferral: null,

  patients: seedData.patients,
  screenings: seedData.screenings as Screening[],
  riskFlags: seedData.riskFlags as RiskFlag[],
  referrals: seedData.referrals as unknown as Referral[],
  riskQueue: seedData.riskQueue,
  appointments: seedData.appointments,
  facilities: seedData.facilities,
  devices: seedData.devices,
  users: seedData.users,
  barangayMetrics: seedData.barangayMetrics,
  weeklyScreeningData: seedData.weeklyScreeningData,
  kpis: seedData.kpis,
  activityFeed: seedData.activityFeed,
  auditLog: seedData.auditLog,
  reports: seedData.reports,
  reportBreakdown: seedData.reportBreakdown,
  clinicalValidations: seedData.clinicalValidations,
  validationQueue: seedData.validationQueue,
  anomalies: seedData.anomalies,
  healthTips: seedData.healthTips,
  mobileHealthHistory: seedData.mobileHealthHistory,
  workerStats: seedData.workerStats,

  // ── triggerLiveSync ─────────────────────────────────────────────
  triggerLiveSync: () =>
    set((state) => {
      if (state.liveTriggerFired) return state;
      const now = new Date().toISOString();
      const newScreening: Screening = {
        id: 'SCR-LIVE-001',
        patientId: 'BGY-041-00217',
        healthWorkerId: 'U-BHW-001',
        facilityId: 'BHS-042-01',
        timestamp: now,
        bp: '164/99',
        bpSystolic: 164,
        bpDiastolic: 99,
        glucose: '128 mg/dL',
        glucoseValue: 128,
        heartRate: 88,
        afibFlag: true,
        deviceId: 'KSK-042-01',
        gradeLevel: 'screening',
        syncStatus: 'pending',
        source: 'kiosk',
      } as unknown as Screening;

      const provisionalFlag: RiskFlag = {
        id: 'RF-LIVE-001-provisional',
        patientId: 'BGY-041-00217',
        screeningId: 'SCR-LIVE-001',
        category: 'elevated',
        confidence: 0.78,
        source: 'On-Device AI (provisional)',
        recommendedAction: 'Elevated risk detected. Sync to AI Brain for full assessment.',
        timestamp: now,
        provisional: true,
      } as unknown as RiskFlag;

      const confirmedFlag: RiskFlag = {
        id: 'RF-LIVE-001-confirmed',
        patientId: 'BGY-041-00217',
        screeningId: 'SCR-LIVE-001',
        category: 'elevated',
        confidence: 0.91,
        source: 'AI Brain v3.2',
        recommendedAction: 'Urgent: Possible AFIB detected alongside elevated BP (164/99). Immediate referral to cardiologist strongly recommended.',
        timestamp: now,
        provisional: false,
      } as unknown as RiskFlag;

      return {
        liveTriggerFired: true,
        liveScreening: newScreening,
        liveProvisionalFlag: provisionalFlag,
        liveConfirmedFlag: confirmedFlag,
        screenings: [newScreening, ...state.screenings],
        riskFlags: [confirmedFlag, ...state.riskFlags],
      };
    }),

  // ── createReferral ───────────────────────────────────────────────
  createReferral: (patientId, riskFlagId, destinationId) =>
    set((state) => {
      const exists = state.referrals.find(
        (r) => r.patientId === patientId && r.riskFlagId === riskFlagId
      );
      if (exists) return state;
      const now = new Date().toISOString();
      const facility = state.facilities.find((f) => f.id === destinationId);
      const newReferral = {
        id: `REF-LIVE-${Date.now()}`,
        patientId,
        riskFlagId,
        destinationFacilityId: destinationId,
        destinationLabel: facility?.name ?? destinationId,
        status: 'referred',
        stage: 1,
        agingDays: 0,
        stalled: false,
        statusHistory: [
          { status: 'flagged', timestamp: now, note: 'AI Brain flagged elevated risk', updatedBy: 'AI Brain' },
          { status: 'referred', timestamp: now, note: 'Referred by Dr. Amelia Reyes', updatedBy: 'U-PHY-001' },
        ],
        createdAt: now,
        updatedAt: now,
      } as unknown as Referral;

      return {
        liveReferral: newReferral,
        referrals: [newReferral, ...state.referrals],
      };
    }),

  // ── simulateDashboardReferral ────────────────────────────────────
  simulateDashboardReferral: () =>
    set((state) => {
      if (state.liveReferral) return state;
      const now = new Date().toISOString();
      const newRef = {
        id: 'REF-LIVE-001',
        patientId: 'BGY-041-00217',
        riskFlagId: 'RF-LIVE-001-confirmed',
        destinationFacilityId: 'HOSP-PROV',
        destinationLabel: 'Provincial Hospital — Cardio',
        status: 'referred',
        stage: 1,
        agingDays: 0,
        stalled: false,
        statusHistory: [
          { status: 'flagged', timestamp: now, note: 'AI Brain flagged elevated risk with AFIB', updatedBy: 'AI Brain' },
          { status: 'referred', timestamp: now, note: 'Referred to Prov. Hospital by Dr. Amelia Reyes', updatedBy: 'U-PHY-001' },
        ],
        createdAt: now,
        updatedAt: now,
      } as unknown as Referral;
      return {
        liveReferral: newRef,
        referrals: [newRef, ...state.referrals],
      };
    }),

  // ── updateReferralStatus ─────────────────────────────────────────
  updateReferralStatus: (referralId, newStatus, note) =>
    set((state) => {
      const now = new Date().toISOString();
      const stageMap: Record<string, number> = { flagged: 0, referred: 1, seen: 2, resolved: 3 };
      const updated = state.referrals.map((r) => {
        if (r.id !== referralId) return r;
        return {
          ...r,
          status: newStatus as ReferralStatus,
          stage: stageMap[newStatus] ?? (r as any).stage,
          updatedAt: now,
          statusHistory: [
            ...(r.statusHistory || []),
            { status: newStatus as ReferralStatus, timestamp: now, note: note ?? `Status updated to ${newStatus}`, updatedBy: 'U-PHY-001' },
          ],
        };
      });
      const updatedLive =
        state.liveReferral?.id === referralId
          ? { ...state.liveReferral, status: newStatus as ReferralStatus }
          : state.liveReferral;
      return { referrals: updated as Referral[], liveReferral: updatedLive };
    }),

  // ── updateDeviceStatus ───────────────────────────────────────────
  updateDeviceStatus: (deviceId, status) =>
    set((state) => ({
      devices: state.devices.map((d) => (d.id === deviceId ? { ...d, status } : d)),
    })),

  // ── submitClinicalValidation ─────────────────────────────────────
  submitClinicalValidation: (validationId) =>
    set((state) => ({
      clinicalValidations: state.clinicalValidations.map((cv) =>
        cv.id === validationId ? { ...cv, status: 'submitted' } : cv
      ),
    })),

  // ── acknowledgeAnomaly ───────────────────────────────────────────
  acknowledgeAnomaly: (anomalyId) =>
    set((state) => ({
      anomalies: state.anomalies.map((a) =>
        a.id === anomalyId
          ? { ...a, status: 'ack', resolution: 'Acknowledged — routed to ops/clinical worklist' }
          : a
      ),
    })),

  // ── dismissAnomaly ───────────────────────────────────────────────
  dismissAnomaly: (anomalyId) =>
    set((state) => ({
      anomalies: state.anomalies.map((a) =>
        a.id === anomalyId
          ? { ...a, status: 'dismissed', resolution: 'Dismissed as false positive — fed to retraining set' }
          : a
      ),
    })),

  // ── claimQueueItem ───────────────────────────────────────────────
  claimQueueItem: (pid) =>
    set((state) => ({
      riskQueue: state.riskQueue.map((q) =>
        q.pid === pid ? { ...q, status: 'mine' } : q
      ),
    })),

  // ── resetDemo ────────────────────────────────────────────────────
  resetDemo: () =>
    set({
      liveTriggerFired: false,
      liveScreening: null,
      liveProvisionalFlag: null,
      liveConfirmedFlag: null,
      liveReferral: null,
      riskFlags: seedData.riskFlags as RiskFlag[],
      referrals: seedData.referrals as unknown as Referral[],
      screenings: seedData.screenings as Screening[],
      riskQueue: seedData.riskQueue,
      anomalies: seedData.anomalies,
    }),
}));
