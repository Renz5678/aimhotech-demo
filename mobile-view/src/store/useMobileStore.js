import { create } from 'zustand';
import { useLiveDemoStore } from '../../../packages/shared/src/store/useLiveDemoStore';

export const useMobileStore = create((set, get) => ({
  currentMode: 'patient',
  currentUserId: null,
  currentUserRole: null,
  currentUserName: 'User',
  selectedPatientId: 'QC-097-00310',
  language: 'en',
  screeningStep: 0,
  pairedDevices: [],
  syncQueueCount: 3,
  isOnline: true,
  hasCapturedVitals: false,
  isSynced: false,
  vitalsSession: null,
  notifications: [
    { id: 'N1', title: 'New AI Brain Flag', body: 'Rosalinda Buenaventura flagged as elevated risk', read: false, timestamp: new Date(Date.now()-300000).toISOString() },
    { id: 'N2', title: 'Referral Update', body: 'Eduardo Santos referral to St. Luke\'s created', read: false, timestamp: new Date(Date.now()-600000).toISOString() },
    { id: 'N3', title: 'Sync Complete', body: '14 records uploaded to AI Brain', read: true, timestamp: new Date(Date.now()-900000).toISOString() },
  ],

  setMode: (mode) => set({ currentMode: mode }),
  setLanguage: (lang) => set({ language: lang }),
  selectPatient: (id) => set({ selectedPatientId: id }),
  clearPatient: () => set({ selectedPatientId: null }),
  pairDevice: (deviceId) => set((s) => ({ pairedDevices: [...s.pairedDevices, deviceId] })),
  unpairDevice: (deviceId) => set((s) => ({ pairedDevices: s.pairedDevices.filter((d) => d !== deviceId) })),
  setVitalsSession: (vitals) => set({ vitalsSession: vitals }),
  clearVitalsSession: () => set({ vitalsSession: null }),
  submitVitals: () => {
    const vitals = get().vitalsSession;
    const pid = get().selectedPatientId || 'BGY-041-00217';
    useLiveDemoStore.getState().triggerLiveSync(vitals || undefined, pid);
    set({ hasCapturedVitals: true, screeningStep: 3 });
  },
  syncToBrain: () => set({ isSynced: true, syncQueueCount: 0 }),
  toggleOnline: () => set((s) => ({ isOnline: !s.isOnline })),
  markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  setScreeningStep: (step) => set({ screeningStep: step }),

  setCurrentUser: (userId, role, name) => set({ currentUserId: userId, currentUserRole: role, currentUserName: name }),
  signOut: async () => { 
    const { supabase } = await import('../../../packages/shared/src/lib/supabase'); 
    await supabase.auth.signOut(); 
    set({ currentUserId: null, currentUserRole: null, currentUserName: 'User', currentMode: 'patient' }); 
  },
  addNotification: (notif) => set((s) => ({ notifications: [notif, ...s.notifications] }))
}));
