import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const accounts = [
  { email: 'a.reyes@rhu.gov.ph', password: 'AimhoDemo2026!', meta: { role: 'rhu_physician', userId: 'U-PHY-001', name: 'Dr. Amelia Reyes', prcLicense: 'PRC-0142891' } },
  { email: 'j.uy@rhu.gov.ph', password: 'AimhoDemo2026!', meta: { role: 'rhu_physician', userId: 'U-PHY-002', name: 'Dr. Jonathan Uy', prcLicense: 'PRC-0198432' } },
  { email: 'm.delacruz@brgy.gov.ph', password: 'AimhoDemo2026!', meta: { role: 'barangay_health_worker', userId: 'U-BHW-001', name: 'Maria Dela Cruz' } },
  { email: 'j.lim@brgy.gov.ph', password: 'AimhoDemo2026!', meta: { role: 'barangay_health_worker', userId: 'U-BHW-002', name: 'Josefina Lim' } },
  { email: 'n.santos@brgy.gov.ph', password: 'AimhoDemo2026!', meta: { role: 'barangay_health_worker', userId: 'U-BHW-003', name: 'Nena Santos' } },
  { email: 'r.villareal@doh.gov.ph', password: 'AimhoDemo2026!', meta: { role: 'doh_regional_officer', userId: 'U-DOH-001', name: 'Ramon Villareal' } },
  { email: 'c.mendoza@hardyco.ph', password: 'AimhoDemo2026!', meta: { role: 'super_admin', userId: 'U-ADMIN-001', name: 'Carlo Mendoza' } },
  { email: 'maria.santos@patient.aimhotech.io', password: 'PatientDemo2026!', meta: { role: 'patient', userId: 'BGY-041-00217', name: 'Maria Santos' } }
];

async function seed() {
  console.log('Seeding users via API...');
  for (const acc of accounts) {
    const { data, error } = await supabase.auth.signUp({
      email: acc.email,
      password: acc.password,
      options: { data: acc.meta }
    });
    
    if (error) {
      if (error.message.includes('User already registered')) {
        console.log(`[OK] ${acc.email} already registered`);
      } else {
        console.log(`[Error] ${acc.email}: ${error.message}`);
      }
    } else {
      console.log(`[Created] ${acc.email}`);
    }
  }
}

seed();
