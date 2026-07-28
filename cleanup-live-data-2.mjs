import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clean() {
  console.log('Cleaning up polluted live data... (pass 2)');
  
  const r2 = await supabase.from('risk_flags').delete().like('id', '%LIVE%');
  console.log('Risk flags:', r2.error || 'Cleaned');
  
  const r1 = await supabase.from('screenings').delete().like('id', '%LIVE%');
  console.log('Screenings:', r1.error || 'Cleaned');
  
  console.log('Done!');
}
clean();
