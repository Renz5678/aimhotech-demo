// @aimhotech/shared — useLiveDemoStore
// The single source of truth for both admin-dashboard and mobile-view.
// All seed data is sourced from references/admin and references/mobile HTML files.

import { create } from 'zustand';
import seedData from '../data/seed-data.json';
import type { RiskFlag, Referral, Screening, ReferralStatus, Patient } from '../types/index';
import { supabase } from '../lib/supabase';

interface LiveDemoState {
  // ── Demo scenario state ─────────────────────────────────────────
  liveTriggerFired: boolean;
  liveScreening: Screening | null;
  liveProvisionalFlag: RiskFlag | null;
  liveConfirmedFlag: RiskFlag | null;
  liveReferral: Referral | null;

  // ── Core data ────────────────────────────────────────────────────
  patients: Patient[];
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
  aiStats: typeof seedData.aiStats;
  aiModels: typeof seedData.aiModels;
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
  
  // ── Supabase Integration ────────────────────────────────────────
  hydrateFromSupabase: () => Promise<void>;
  setupRealtime: () => void;

  currentUserId: string | null;
  currentUserRole: string | null;
  mobileNotifications: any[];
  setCurrentUser: (userId: string | null, role: string | null) => void;
  pushNotification: (patientId: string, title: string, body: string) => Promise<void>;
}

// Module-level guard — prevents setupRealtime() being called twice
// (React StrictMode mounts/unmounts in dev, so component-level refs are not enough)
let _realtimeSetup = false;

export const useLiveDemoStore = create<LiveDemoState>((set, get) => ({
  // ── Initial state ───────────────────────────────────────────────
  liveTriggerFired: false,
  liveScreening: null,
  liveProvisionalFlag: null,
  liveConfirmedFlag: null,
  liveReferral: null,
  currentUserId: null,
  currentUserRole: null,
  mobileNotifications: [],

  patients: seedData.patients as unknown as Patient[],
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
  aiStats: seedData.aiStats,
  aiModels: seedData.aiModels,
  healthTips: seedData.healthTips,
  mobileHealthHistory: seedData.mobileHealthHistory,
  workerStats: seedData.workerStats,

  // ── triggerLiveSync ─────────────────────────────────────────────
  triggerLiveSync: async (vitals?: { bpSystolic?: number; bpDiastolic?: number; heartRate?: number; glucose?: string; glucoseValue?: number; afibFlag?: boolean; height?: number; weight?: number }, patientId?: string) => {
    const state = get();
    const now = new Date().toISOString();
    
    const bpSystolic = vitals?.bpSystolic ?? 164;
    const bpDiastolic = vitals?.bpDiastolic ?? 99;
    const glucoseValue = vitals?.glucoseValue ?? 128;
    const heartRate = vitals?.heartRate ?? 88;
    const afibFlag = vitals?.afibFlag ?? true;

    const actualPatientId = patientId || 'BGY-041-00217';
    const p = state.patients.find(p => p.id === actualPatientId);
    const patientName = p?.name || 'Unknown Patient';
    const patientBarangay = p?.barangay || 'San Isidro';

    const newScreening = {
      id: `SCR-LIVE-${Date.now()}`,
      patientId: actualPatientId,
      healthWorkerId: state.currentUserId ?? 'U-BHW-001',
      facilityId: 'BHS-042-01',
      timestamp: now,
      bp: `${bpSystolic}/${bpDiastolic}`,
      bpSystolic,
      bpDiastolic,
      glucose: vitals?.glucose ?? `${glucoseValue} mg/dL`,
      glucoseValue,
      heartRate,
      afibFlag,
      deviceId: 'KSK-042-01',
      gradeLevel: 'screening',
      syncStatus: 'pending',
      source: 'kiosk',
      height: vitals?.height,
      weight: vitals?.weight,
    };
    const confirmedFlag = {
      id: `RF-LIVE-${Date.now()}`,
      patientId: actualPatientId,
      screeningId: newScreening.id,
      category: 'elevated',
      confidence: 0.91,
      source: 'AI Brain v3.2',
      recommendedAction: 'Urgent: Possible AFIB detected alongside elevated BP (164/99). Immediate referral to cardiologist strongly recommended.',
      timestamp: now,
      provisional: false,
      status: 'unclaimed'
    };
    const activity = {
      id: `af-live-${Date.now()}`,
      type: 'flag',
      text: `AI Brain flagged ${patientName} (${patientBarangay}) — AFIB detected`,
      time: 'Just now',
      dot: '#B0523F'
    };
    
    // Optimistic local update
    set({
      liveTriggerFired: true,
      liveScreening: newScreening as unknown as Screening,
      liveProvisionalFlag: confirmedFlag as unknown as RiskFlag, // Simplifying for demo
      liveConfirmedFlag: confirmedFlag as unknown as RiskFlag,
      screenings: [newScreening as unknown as Screening, ...state.screenings],
      riskFlags: [confirmedFlag as unknown as RiskFlag, ...state.riskFlags],
    });

    if (supabase) {
      await supabase.from('screenings').insert(newScreening);
      await supabase.from('risk_flags').insert(confirmedFlag);
      await supabase.from('activity_feed').insert(activity);
    }
  },

  // ── createReferral ───────────────────────────────────────────────
  createReferral: async (patientId, riskFlagId, destinationId) => {
    const state = get();
    const exists = state.referrals.find((r) => r.patientId === patientId && r.riskFlagId === riskFlagId);
    if (exists) return;
    
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
        { status: 'referred', timestamp: now, note: 'Referred by Dr. Amelia Reyes', updatedBy: state.currentUserId ?? 'U-PHY-001' },
      ],
      createdAt: now,
      updatedAt: now,
    };
    
    set({
      liveReferral: newReferral as unknown as Referral,
      referrals: [newReferral as unknown as Referral, ...state.referrals],
    });
    
    if (supabase) {
      await supabase.from('referrals').insert(newReferral);
      await supabase.from('activity_feed').insert({
        id: `af-live-${Date.now()}`,
        type: 'referral',
        text: `Referral created for ${patientId} to ${facility?.name}`,
        time: 'Just now',
        dot: '#4C7A5A'
      });
    }
  },

  // ── simulateDashboardReferral ────────────────────────────────────
  simulateDashboardReferral: () => {
    get().createReferral('BGY-041-00217', get().liveConfirmedFlag?.id || 'RF-LIVE-001', 'HOSP-PROV');
  },

  // ── updateReferralStatus ─────────────────────────────────────────
  updateReferralStatus: async (referralId, newStatus, note) => {
    const state = get();
    const r = state.referrals.find(r => r.id === referralId);
    if (!r) return;
    
    const now = new Date().toISOString();
    const stageMap: Record<string, number> = { flagged: 0, referred: 1, seen: 2, resolved: 3 };
    const stage = stageMap[newStatus] ?? (r as any).stage;
    
    const statusHistory = [
      ...(r.statusHistory || []),
      { status: newStatus as ReferralStatus, timestamp: now, note: note ?? `Status updated to ${newStatus}`, updatedBy: 'U-PHY-001' },
    ];
    
    set((state) => ({
      referrals: state.referrals.map(ref => ref.id === referralId ? { ...ref, status: newStatus as ReferralStatus, stage, updatedAt: now, statusHistory } : ref),
      liveReferral: state.liveReferral?.id === referralId ? { ...state.liveReferral, status: newStatus as ReferralStatus } : state.liveReferral
    }));
    
    if (supabase) {
      await supabase.from('referrals').update({ status: newStatus, stage, updatedAt: now, statusHistory }).eq('id', referralId);
      await supabase.from('activity_feed').insert({
        id: `af-live-${Date.now()}`,
        type: 'referral',
        text: `Referral ${referralId} updated to ${newStatus}`,
        time: 'Just now',
        dot: '#4C7A5A'
      });
    }
  },

  // ── updateDeviceStatus ───────────────────────────────────────────
  updateDeviceStatus: async (deviceId, status) => {
    set((state) => ({ devices: state.devices.map((d) => (d.id === deviceId ? { ...d, status } : d)) }));
    if (supabase) await supabase.from('devices').update({ status }).eq('id', deviceId);
  },

  // ── submitClinicalValidation ─────────────────────────────────────
  submitClinicalValidation: async (screeningId) => {
    const state = get();
    const newCv = {
      id: `CV-LIVE-${Date.now()}`,
      screeningId: screeningId,
      validatedBy: state.currentUserId || 'U-PHY-001',
      validatedAt: new Date().toISOString(),
      status: 'approved',
      patientName: state.screenings.find(s => s.id === screeningId)?.patientId || 'Unknown Patient'
    };

    set((state) => ({ 
      clinicalValidations: [newCv as any, ...state.clinicalValidations]
    }));
    
    if (supabase) {
      await supabase.from('clinical_validations').insert(newCv);
    }
  },

  // ── acknowledgeAnomaly ───────────────────────────────────────────
  acknowledgeAnomaly: async (anomalyId) => {
    set((state) => ({ anomalies: state.anomalies.map((a) => a.id === anomalyId ? { ...a, status: 'ack', resolution: 'Acknowledged' } : a) }));
    if (supabase) await supabase.from('anomalies').update({ status: 'ack', resolution: 'Acknowledged' }).eq('id', anomalyId);
  },

  // ── dismissAnomaly ───────────────────────────────────────────────
  dismissAnomaly: async (anomalyId) => {
    set((state) => ({ anomalies: state.anomalies.map((a) => a.id === anomalyId ? { ...a, status: 'dismissed', resolution: 'Dismissed by user' } : a) }));
    if (supabase) await supabase.from('anomalies').update({ status: 'dismissed', resolution: 'Dismissed by user' }).eq('id', anomalyId);
  },

  // ── claimQueueItem ───────────────────────────────────────────────
  claimQueueItem: async (pid) => {
    const state = get();
    const flag = state.riskFlags.find(rf => rf.patientId === pid && rf.status === 'unclaimed');
    
    set((state) => ({
      riskQueue: state.riskQueue.map((q) => q.pid === pid ? { ...q, status: 'in-review', reviewer: 'Dr. Reyes' } : q),
      riskFlags: state.riskFlags.map((rf) => rf.id === flag?.id ? { ...rf, status: 'in-review', reviewer: 'Dr. Reyes' } : rf)
    }));
    
    if (supabase && flag) {
      await supabase.from('risk_flags').update({ status: 'in-review', reviewer: 'Dr. Reyes' }).eq('id', flag.id);
    }
  },

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
      activityFeed: seedData.activityFeed,
    }),

  setCurrentUser: (userId, role) => set({ currentUserId: userId, currentUserRole: role }),
  pushNotification: async (patientId, title, body) => { 
    const row = { id: `NOTIF-${Date.now()}`, patientId, title, body, read: false, created_at: new Date().toISOString() }; 
    if (supabase) await supabase.from('notifications').insert(row); 
  },

  // ── Supabase Integration ─────────────────────────────────────────
  hydrateFromSupabase: async () => {
    try {
      if (!supabase) return;
      const [pts, scrs, rfs, refs, anoms, feeds] = await Promise.all([
        supabase.from('patients').select('*'),
        supabase.from('screenings').select('*').order('timestamp', { ascending: false }),
        supabase.from('risk_flags').select('*').order('timestamp', { ascending: false }),
        supabase.from('referrals').select('*').order('updatedAt', { ascending: false }),
        supabase.from('anomalies').select('*').order('timestamp', { ascending: false }),
        supabase.from('activity_feed').select('*').order('created_at', { ascending: false }),
      ]);
      set({
        patients: (pts.data || []) as Patient[],
        screenings: (scrs.data || []) as Screening[],
        riskFlags: (rfs.data || []) as RiskFlag[],
        referrals: (refs.data || []) as unknown as Referral[],
        anomalies: anoms.data || [],
        activityFeed: feeds.data || [],
      });
    } catch (err) {
      console.warn('Failed to hydrate from Supabase', err);
    }
  },

  setupRealtime: () => {
    if (!supabase) return;
    if (_realtimeSetup) return; // prevent double-subscribe
    _realtimeSetup = true;
    
    // Group all listeners into a single channel to avoid 'already subscribed' conflicts
    supabase.channel('aimhotech_live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'screenings' }, (payload) => {
        set((state) => ({ screenings: [payload.new as Screening, ...state.screenings] }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'risk_flags' }, (payload) => {
        set((state) => ({ riskFlags: [payload.new as RiskFlag, ...state.riskFlags] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'risk_flags' }, (payload) => {
        set((state) => ({ riskFlags: state.riskFlags.map(rf => rf.id === payload.new.id ? (payload.new as RiskFlag) : rf) }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'referrals' }, (payload) => {
        set((state) => ({ referrals: [payload.new as unknown as Referral, ...state.referrals] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'referrals' }, (payload) => {
        set((state) => ({ referrals: state.referrals.map(r => r.id === payload.new.id ? (payload.new as unknown as Referral) : r) }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'anomalies' }, (payload) => {
        set((state) => ({ anomalies: state.anomalies.map(a => a.id === payload.new.id ? (payload.new as any) : a) }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_feed' }, (payload) => {
        set((state) => ({ activityFeed: [payload.new as any, ...state.activityFeed] }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        set((state) => ({ mobileNotifications: [payload.new, ...state.mobileNotifications] }));
      })
      .subscribe();
  }
}));
