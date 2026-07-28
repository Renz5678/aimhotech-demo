import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Listening for referrals...');
  supabase.channel('public:referrals')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, payload => {
      console.log('REALTIME EVENT!', payload);
    })
    .subscribe(async (status) => {
      console.log('Subscribe status:', status);
      if (status === 'SUBSCRIBED') {
        const { error } = await supabase.from('referrals').insert({
          id: 'TEST-REF-' + Date.now(),
          patientId: 'BGY-041-00217',
          riskFlagId: 'TEST',
          status: 'referred'
        });
        console.log('Insert error:', error);
      }
    });

  setTimeout(() => process.exit(0), 4000);
}
test();
