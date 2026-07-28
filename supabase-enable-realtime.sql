-- Enable realtime for all demo tables
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE screenings;
ALTER PUBLICATION supabase_realtime ADD TABLE risk_flags;
ALTER PUBLICATION supabase_realtime ADD TABLE referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE anomalies;
