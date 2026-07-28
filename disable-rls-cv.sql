ALTER TABLE clinical_validations DISABLE ROW LEVEL SECURITY;
ALTER PUBLICATION supabase_realtime ADD TABLE clinical_validations;
