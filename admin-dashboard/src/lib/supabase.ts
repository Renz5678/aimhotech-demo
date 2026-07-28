import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton — ensures only one GoTrueClient instance in the browser
// Uses a global symbol so this survives HMR module re-evaluations
const GLOBAL_KEY = Symbol.for('aimhotech_supabase_client');

declare global {
  interface Window {
    [key: symbol]: SupabaseClient | undefined;
  }
}

function getClient(): SupabaseClient {
  if (typeof window !== 'undefined' && (window as any)[GLOBAL_KEY]) {
    return (window as any)[GLOBAL_KEY];
  }
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'
  );
  if (typeof window !== 'undefined') {
    (window as any)[GLOBAL_KEY] = client;
  }
  return client;
}

export const supabase = getClient();
