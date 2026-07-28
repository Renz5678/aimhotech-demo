import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('patients').select('*');
  console.log('Patients count:', data?.length);
  console.log('Error:', error);
}
test();
