import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Connecting to Realtime...');
  const channel = supabase.channel('test-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'screenings' }, (payload) => {
      console.log('REALTIME EVENT RECEIVED:', payload);
      process.exit(0);
    })
    .subscribe((status) => {
      console.log('Subscription status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed! Inserting dummy screening...');
        supabase.from('screenings').insert({
          id: `SCR-RT-${Date.now()}`,
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
        }).then(res => console.log('Insert response:', res));
      }
    });

  setTimeout(() => {
    console.log('Timeout reached, no realtime event received.');
    process.exit(1);
  }, 10000);
}
test();
