import { create } from 'zustand';
import seedData from '../data/seed-data.json';
import { supabase } from '@aimhotech/shared/supabase';

// Module-level guard — prevents double-subscribe in StrictMode
let _demoRealtimeSetup = false;

export const useDemoStore = create((set, get) => ({
  patients: seedData.patients,
  screenings: seedData.screenings,
  riskFlags: seedData.riskFlags,
  referrals: seedData.referrals,
  
  // Mobile app demo state flags
  hasCapturedVitals: false,
  isSynced: false,
  isReferredOnDashboard: false, // Step 6 trigger

  submitVitals: async () => {
    const liveScenario = seedData.liveTriggerScenario;
    const newScreening = liveScenario.steps.find(s => s.step === 1)?.resultingRecord;
    const provisionalRisk = liveScenario.steps.find(s => s.step === 2)?.resultingRecord;
    
    if (!newScreening || !provisionalRisk) return;

    set((state) => ({
      hasCapturedVitals: true,
      screenings: [...state.screenings, newScreening],
      riskFlags: [...state.riskFlags, provisionalRisk]
    }));

    if (supabase) {
      // Create new unique IDs to avoid conflicts on repeat runs
      const screeningId = `SCR-MOB-${Date.now()}`;
      await supabase.from('screenings').insert({ ...newScreening, id: screeningId });
      await supabase.from('risk_flags').insert({ ...provisionalRisk, id: `RF-MOB-${Date.now()}`, screeningId, status: 'unclaimed' });
      await supabase.from('activity_feed').insert({
        id: `af-mob-${Date.now()}`,
        type: 'flag',
        text: 'AI Brain flagged Maria Santos (San Isidro) — AFIB detected (Provisional)',
        time: 'Just now',
        dot: '#B0523F'
      });
    }
  },

  syncToBrain: () => set({ isSynced: true }),

  simulateDashboardReferral: () => set((state) => {
    // This injects the referral record created in Step 5 of the live scenario script
    const liveScenario = seedData.liveTriggerScenario;
    const dashboardReferral = liveScenario.steps.find(s => s.step === 5)?.resultingRecord;
    
    if (!dashboardReferral) return state;
    
    const newRef = {
      ...dashboardReferral,
      createdAt: new Date().toISOString()
    };

    return {
      isReferredOnDashboard: true,
      referrals: [...state.referrals, newRef]
    };
  }),

  // ── Supabase Integration ─────────────────────────────────────────
  hydrateFromSupabase: async () => {
    try {
      if (!supabase) return;
      const [pts, scrs, rfs, refs] = await Promise.all([
        supabase.from('patients').select('*'),
        supabase.from('screenings').select('*').order('timestamp', { ascending: false }),
        supabase.from('risk_flags').select('*').order('timestamp', { ascending: false }),
        supabase.from('referrals').select('*').order('updatedAt', { ascending: false })
      ]);
      set({
        patients: pts.data || [],
        screenings: scrs.data || [],
        riskFlags: rfs.data || [],
        referrals: refs.data || []
      });
    } catch (err) {
      console.warn('Failed to hydrate mobile from Supabase', err);
    }
  },

  setupRealtime: () => {
    if (!supabase) return;
    if (_demoRealtimeSetup) return;
    _demoRealtimeSetup = true;
    
    supabase.channel('public:screenings_mob')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'screenings' }, (payload) => {
        set((state) => ({ screenings: [payload.new, ...state.screenings] }));
      }).subscribe();
      
    supabase.channel('public:risk_flags_mob')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'risk_flags' }, (payload) => {
        set((state) => ({ riskFlags: [payload.new, ...state.riskFlags] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'risk_flags' }, (payload) => {
        set((state) => ({
          riskFlags: state.riskFlags.map(rf => rf.id === payload.new.id ? payload.new : rf)
        }));
      }).subscribe();
      
    supabase.channel('public:referrals_mob')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'referrals' }, (payload) => {
        // Automatically set isReferredOnDashboard to trigger UI step if a new referral arrives
        set((state) => ({ isReferredOnDashboard: true, referrals: [payload.new, ...state.referrals] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'referrals' }, (payload) => {
        set((state) => ({
          referrals: state.referrals.map(r => r.id === payload.new.id ? payload.new : r)
        }));
      }).subscribe();
  }
}));
