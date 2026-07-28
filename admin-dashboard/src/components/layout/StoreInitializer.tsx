'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/store/useDemoStore';
import { useAdminStore } from '@/store/useAdminStore';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import { supabase } from '@/lib/supabase';
import type { Role } from '@/store/useAdminStore';

export default function StoreInitializer({ children }: { children: React.ReactNode }) {
  const isInitialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Hydrate all stores
    useDemoStore.getState().hydrateFromSupabase();
    useDemoStore.getState().setupRealtime();
    useLiveDemoStore.getState().hydrateFromSupabase();
    useLiveDemoStore.getState().setupRealtime();

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.startsWith('/login')) {
          router.push('/login');
        }
        return;
      }
      const meta = session.user.user_metadata ?? {};
      useAdminStore.getState().setCurrentUser(
        meta.userId ?? session.user.id,
        meta.name ?? session.user.email?.split('@')[0] ?? 'Admin',
        session.user.email ?? '',
        (meta.role as Role) ?? 'rhu_physician',
        meta.prcLicense ?? ''
      );
      useLiveDemoStore.getState().setCurrentUser(meta.userId ?? session.user.id, meta.role ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session) {
        const meta = session.user.user_metadata ?? {};
        useAdminStore.getState().setCurrentUser(
          meta.userId ?? session.user.id,
          meta.name ?? session.user.email?.split('@')[0] ?? 'Admin',
          session.user.email ?? '',
          (meta.role as Role) ?? 'rhu_physician',
          meta.prcLicense ?? ''
        );
      }
    });

    // Subscribe to notifications table for real-time admin toasts
    supabase
      .channel('admin:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const n = payload.new as any;
        useAdminStore.getState().notifications; // access to trigger re-read
        // Prepend to admin notifications
        const current = useAdminStore.getState().notifications;
        useAdminStore.setState({
          notifications: [{
            id: n.id,
            title: n.title,
            body: n.body,
            read: false,
            timestamp: n.created_at ?? new Date().toISOString(),
          }, ...current]
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}
