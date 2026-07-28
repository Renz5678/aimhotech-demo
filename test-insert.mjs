import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const newScreening = {
    id: `SCR-TEST-${Date.now()}`,
    patientId: 'BGY-041-00217',
    healthWorkerId: 'U-BHW-001',
    facilityId: 'BHS-042-01',
    timestamp: new Date().toISOString(),
    bp: '120/80',
    bpSystolic: 120,
    bpDiastolic: 80,
    glucose: '100 mg/dL',
    glucoseValue: 100,
    heartRate: 70,
    afibFlag: false,
    deviceId: 'KSK-042-01',
    gradeLevel: 'screening',
    syncStatus: 'pending',
    source: 'kiosk'
  };

  const { data, error } = await supabase.from('screenings').insert(newScreening);
  console.log('Insert error:', error);
}
test();
