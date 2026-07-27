import { create } from 'zustand';
import seedData from '../data/seed-data.json';

export type RiskFlag = {
  id: string;
  patientId: string;
  screeningId: string;
  category: 'low' | 'moderate' | 'elevated';
  confidence: number;
  source: string;
  recommendedAction: string;
  timestamp: string;
  provisional?: boolean;
};

export type Referral = {
  id: string;
  patientId: string;
  riskFlagId: string;
  destinationFacilityId: string;
  status: 'flagged' | 'referred' | 'seen' | 'resolved';
  createdAt: string;
  updatedAt: string;
  agingDays?: number;
  stalled?: boolean;
};

export type Patient = {
  id: string;
  name: string;
  dob: string;
  sex: string;
  facilityId: string;
  consentStatus: string;
  consentDate: string;
};

interface DemoStore {
  patients: Patient[];
  riskFlags: RiskFlag[];
  referrals: Referral[];
  screenings: any[];
  liveTriggerFired: boolean;
  
  // Actions
  triggerLiveSync: () => void;
  createReferral: (patientId: string, riskFlagId: string, destinationId: string) => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
  patients: seedData.patients,
  riskFlags: seedData.riskFlags as RiskFlag[],
  referrals: seedData.referrals as Referral[],
  screenings: seedData.screenings,
  liveTriggerFired: false,

  triggerLiveSync: () => set((state) => {
    // Only fire once
    if (state.liveTriggerFired) return state;

    const liveScenario = seedData.liveTriggerScenario;
    const baseRiskFlag = liveScenario.steps.find((s: any) => s.step === 4)?.resultingRecord;
    const newScreening = liveScenario.steps.find((s: any) => s.step === 1)?.resultingRecord;

    if (!baseRiskFlag || !newScreening) return state;
    
    const newRiskFlag = {
      ...baseRiskFlag,
      timestamp: new Date().toISOString()
    } as RiskFlag;

    // We prepend the new risk flag to the top of the queue so it shows up immediately
    return {
      liveTriggerFired: true,
      riskFlags: [newRiskFlag, ...state.riskFlags],
      screenings: [...state.screenings, newScreening],
    };
  }),

  createReferral: (patientId, riskFlagId, destinationId) => set((state) => {
    // Check if referral exists
    const exists = state.referrals.find((r) => r.patientId === patientId && r.riskFlagId === riskFlagId);
    if (exists) return state;

    const newReferral: Referral = {
      id: `REF-LIVE-${Date.now()}`,
      patientId,
      riskFlagId,
      destinationFacilityId: destinationId,
      status: 'referred',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      agingDays: 0,
      stalled: false,
    };

    return {
      referrals: [newReferral, ...state.referrals],
    };
  }),
}));
