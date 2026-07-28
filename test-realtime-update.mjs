import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Listening for referrals updates...');
  supabase.channel('public:referrals-update')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'referrals' }, payload => {
      console.log('UPDATE EVENT RECEIVED!', payload);
      process.exit(0);
    })
    .subscribe(async (status) => {
      console.log('Subscribe status:', status);
      if (status === 'SUBSCRIBED') {
        // Insert a dummy referral
        const id = 'TEST-REF-UP-' + Date.now();
        await supabase.from('referrals').insert({
          id, patientId: 'BGY-041-00217', riskFlagId: 'TEST',
          status: 'referred', stage: 1, agingDays: 0, stalled: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        });
        
        console.log('Inserted. Now updating...');
        // Update it
        await supabase.from('referrals').update({ status: 'seen', stage: 2 }).eq('id', id);
        console.log('Update command sent.');
      }
    });

  setTimeout(() => {
    console.log('Timed out waiting for UPDATE event.');
    process.exit(1);
  }, 5000);
}
test();
