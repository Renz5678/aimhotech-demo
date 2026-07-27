import { create } from 'zustand';
import seedData from '../data/seed-data.json';

export const useDemoStore = create((set) => ({
  patients: seedData.patients,
  screenings: seedData.screenings,
  riskFlags: seedData.riskFlags,
  referrals: seedData.referrals,
  
  // Mobile app demo state flags
  hasCapturedVitals: false,
  isSynced: false,
  isReferredOnDashboard: false, // Step 6 trigger

  submitVitals: () => set((state) => {
    const liveScenario = seedData.liveTriggerScenario;
    const newScreening = liveScenario.steps.find(s => s.step === 1)?.resultingRecord;
    const provisionalRisk = liveScenario.steps.find(s => s.step === 2)?.resultingRecord;
    
    if (!newScreening || !provisionalRisk) return state;

    return {
      hasCapturedVitals: true,
      screenings: [...state.screenings, newScreening],
      riskFlags: [...state.riskFlags, provisionalRisk]
    };
  }),

  syncToBrain: () => set((state) => {
    return {
      isSynced: true
    };
  }),

  simulateDashboardReferral: () => set((state) => {
    // This injects the referral record created in Step 5 of the live scenario script
    const liveScenario = seedData.liveTriggerScenario;
    const dashboardReferral = liveScenario.steps.find(s => s.step === 5)?.resultingRecord;
    
    if (!dashboardReferral) return state;
    
    // Replace the timestamp with a real one
    const newRef = {
      ...dashboardReferral,
      createdAt: new Date().toISOString()
    };

    return {
      isReferredOnDashboard: true,
      referrals: [...state.referrals, newRef]
    };
  })
}));
