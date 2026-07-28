// @aimhotech/shared — useLiveDemoStore
// The connected bridge between admin-dashboard and mobile-view.
// Both apps import this store. During the live demo, triggering the
// Maria Dela Cruz scenario on admin immediately reflects in mobile.
//
// Usage (both apps):
//   import { useLiveDemoStore } from '@aimhotech/shared/store';

import { create } from 'zustand';
import seedData from '../data/seed-data.json';
import type { RiskFlag, Referral, Screening } from '../types/index';

interface LiveDemoState {
  // ── Demo scenario state ─────────────────────────────────────────
  liveTriggerFired: boolean;
  liveScreening: Screening | null;
  liveProvisionalFlag: RiskFlag | null;
  liveConfirmedFlag: RiskFlag | null;
  liveReferral: Referral | null;

  // ── Core data (read from seed, extended by actions) ────────────
  patients: typeof seedData.patients;
  screenings: Screening[];
  riskFlags: RiskFlag[];
  referrals: Referral[];
  appointments: typeof seedData.appointments;
  facilities: typeof seedData.facilities;
  devices: typeof seedData.devices;
  users: typeof seedData.users;
  barangayMetrics: typeof seedData.barangayMetrics;
  auditLog: typeof seedData.auditLog;
  reports: typeof seedData.reports;
  clinicalValidations: typeof seedData.clinicalValidations;
  healthTips: typeof seedData.healthTips;

  // ── Actions ─────────────────────────────────────────────────────
  /** Step 1–4: BHW submits vitals → on-device AI → sync → AI Brain confirms */
  triggerLiveSync: () => void;

  /** Step 5: RHU physician creates referral on admin dashboard */
  createReferral: (patientId: string, riskFlagId: string, destinationId: string) => void;

  /** Step 6: Called by mobile Appointments page — pulls live referral */
  simulateDashboardReferral: () => void;

  /** Update referral status (admin referral management) */
  updateReferralStatus: (referralId: string, newStatus: Referral['status'], note?: string) => void;

  /** Mark device status update */
  updateDeviceStatus: (deviceId: string, status: 'online' | 'offline' | 'maintenance_needed') => void;

  /** Submit clinical validation */
  submitClinicalValidation: (validationId: string) => void;

  /** Reset demo to initial state */
  resetDemo: () => void;
}

const scenario = seedData.liveTriggerScenario;

const getStep = (step: number) =>
  scenario.steps.find((s: { step: number }) => s.step === step)?.resultingRecord as Record<string, unknown> | undefined;

export const useLiveDemoStore = create<LiveDemoState>((set) => ({
  // ── Initial state from seed data ────────────────────────────────
  liveTriggerFired: false,
  liveScreening: null,
  liveProvisionalFlag: null,
  liveConfirmedFlag: null,
  liveReferral: null,

  patients: seedData.patients,
  screenings: seedData.screenings as Screening[],
  riskFlags: seedData.riskFlags as RiskFlag[],
  referrals: seedData.referrals as Referral[],
  appointments: seedData.appointments,
  facilities: seedData.facilities,
  devices: seedData.devices,
  users: seedData.users,
  barangayMetrics: seedData.barangayMetrics,
  auditLog: seedData.auditLog,
  reports: seedData.reports,
  clinicalValidations: seedData.clinicalValidations,
  healthTips: seedData.healthTips,

  // ── triggerLiveSync (Steps 1–4) ─────────────────────────────────
  triggerLiveSync: () =>
    set((state) => {
      if (state.liveTriggerFired) return state;

      const newScreening = getStep(1) as Screening | undefined;
      const provisionalFlag = getStep(2) as RiskFlag | undefined;
      const confirmedFlag = { ...(getStep(4) as RiskFlag), timestamp: new Date().toISOString() } as RiskFlag;

      if (!newScreening || !provisionalFlag) return state;

      return {
        liveTriggerFired: true,
        liveScreening: newScreening,
        liveProvisionalFlag: provisionalFlag,
        liveConfirmedFlag: confirmedFlag,
        screenings: [newScreening, ...state.screenings],
        riskFlags: [confirmedFlag, ...state.riskFlags],
      };
    }),

  // ── createReferral (Step 5) ─────────────────────────────────────
  createReferral: (patientId, riskFlagId, destinationId) =>
    set((state) => {
      const exists = state.referrals.find(
        (r) => r.patientId === patientId && r.riskFlagId === riskFlagId
      );
      if (exists) return state;

      const now = new Date().toISOString();
      const newReferral: Referral = {
        id: `REF-LIVE-${Date.now()}`,
        patientId,
        riskFlagId,
        destinationFacilityId: destinationId,
        status: 'referred',
        statusHistory: [
          { status: 'flagged', timestamp: now, note: 'AI Brain flagged elevated risk', updatedBy: 'AI Brain' },
          { status: 'referred', timestamp: now, note: 'Referred by Dr. Carmela Ramos', updatedBy: 'U-PHY-001' },
        ],
        createdAt: now,
        updatedAt: now,
        agingDays: 0,
        stalled: false,
      };

      return {
        liveReferral: newReferral,
        referrals: [newReferral, ...state.referrals],
      };
    }),

  // ── simulateDashboardReferral (Step 6 — mobile side) ───────────
  simulateDashboardReferral: () =>
    set((state) => {
      const baseReferral = getStep(5) as Referral | undefined;
      if (!baseReferral || state.liveReferral) return state;

      const newRef: Referral = {
        ...baseReferral,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        liveReferral: newRef,
        referrals: [newRef, ...state.referrals],
      };
    }),

  // ── updateReferralStatus ─────────────────────────────────────────
  updateReferralStatus: (referralId, newStatus, note) =>
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.referrals.map((r) => {
        if (r.id !== referralId) return r;
        return {
          ...r,
          status: newStatus,
          updatedAt: now,
          statusHistory: [
            ...(r.statusHistory || []),
            { status: newStatus, timestamp: now, note: note ?? `Status updated to ${newStatus}`, updatedBy: 'U-PHY-001' },
          ],
        };
      });
      const updatedLive =
        state.liveReferral?.id === referralId
          ? { ...state.liveReferral, status: newStatus }
          : state.liveReferral;

      return { referrals: updated, liveReferral: updatedLive };
    }),

  // ── updateDeviceStatus ──────────────────────────────────────────
  updateDeviceStatus: (deviceId, status) =>
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, status } : d
      ),
    })),

  // ── submitClinicalValidation ────────────────────────────────────
  submitClinicalValidation: (validationId) =>
    set((state) => ({
      clinicalValidations: state.clinicalValidations.map((cv) =>
        cv.id === validationId
          ? { ...cv, status: 'submitted', submittedAt: new Date().toISOString() }
          : cv
      ),
    })),

  // ── resetDemo ───────────────────────────────────────────────────
  resetDemo: () =>
    set({
      liveTriggerFired: false,
      liveScreening: null,
      liveProvisionalFlag: null,
      liveConfirmedFlag: null,
      liveReferral: null,
      riskFlags: seedData.riskFlags as RiskFlag[],
      referrals: seedData.referrals as Referral[],
      screenings: seedData.screenings as Screening[],
    }),
}));
