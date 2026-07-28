import { create } from 'zustand';

export type Role = 'rhu_physician' | 'doh_regional_officer' | 'super_admin' | 'barangay_health_worker';

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
}

interface AdminStoreState {
  currentRole: Role;
  isDarkMode: boolean;
  notifications: Notification[];
  setRole: (role: Role) => void;
  toggleDarkMode: () => void;
  clearNotifications: () => void;
  markAllRead: () => void;
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  currentRole: 'rhu_physician',
  isDarkMode: false,
  notifications: [
    {
      id: 'notif-1',
      title: 'Elevated Risk Detected',
      body: 'AI Brain flagged patient Juan Dela Cruz with high risk (94%).',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'notif-2',
      title: 'Device Offline',
      body: 'Station 3 in Barangay San Isidro has been offline for 24 hours.',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'notif-3',
      title: 'New Referral',
      body: 'Patient Maria Clara referred to PGH for cardiology consult.',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
  setRole: (role: Role) => set({ currentRole: role }),
  toggleDarkMode: () =>
    set((state) => {
      const nextMode = !state.isDarkMode;
      if (typeof window !== 'undefined') {
        if (nextMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { isDarkMode: nextMode };
    }),
  clearNotifications: () => set({ notifications: [] }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
