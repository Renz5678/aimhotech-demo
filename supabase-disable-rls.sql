-- Disable RLS on all demo tables so the frontend can read/write data freely
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE screenings DISABLE ROW LEVEL SECURITY;
ALTER TABLE risk_flags DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed DISABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies DISABLE ROW LEVEL SECURITY;

-- Ensure roles have permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE patients TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE screenings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE risk_flags TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE referrals TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE activity_feed TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE anomalies TO anon, authenticated;
