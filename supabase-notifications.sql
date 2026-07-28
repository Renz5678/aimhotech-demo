-- AImhotech: Notifications table migration
-- Run once in Supabase SQL Editor
-- Safe to re-run (uses IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  "patientId" TEXT REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Grant access for anon/authenticated roles (for demo, no RLS)
GRANT SELECT, INSERT, UPDATE ON TABLE notifications TO anon, authenticated;
