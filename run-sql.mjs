import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcvtggspewkybuwfykmz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIxNjM1NywiZXhwIjoyMTAwNzkyMzU3fQ.r3i8bZ0Yx8k4yI2-O72-aX2m8v3Q50n5zWz-u9100Zk';
const supabase = createClient(supabaseUrl, supabaseKey);
import fs from 'fs';
async function test() {
  const sql = fs.readFileSync('/home/scarecrow/dev/aimhotech/disable-rls-cv.sql', 'utf8');
  // I will just use postgres directly or rest api? Wait, service_role key can't run arbitrary SQL easily without a function.
  // The user ran it in SQL editor before. I can just give them the SQL if it fails.
  // Wait, I can try to use standard insert with anon key. If RLS is enabled, it will throw.
  const { data, error } = await createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdnRnZ3NwZXdreWJ1d2Z5a216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzNTcsImV4cCI6MjEwMDc5MjM1N30.9oJ1dhHZ0LrHYT5aV5OA7dHEAvsLP7tcS-ziL7btDbc').from('clinical_validations').insert({ id: 'test', screeningId: 'test' });
  console.log('Insert test:', error);
}
test();
