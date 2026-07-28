
-- AImhotech Supabase Schema

-- Enable realtime for the tables that need it
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

-- Clean up existing tables
DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS anomalies CASCADE;
DROP TABLE IF EXISTS clinical_validations CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS risk_flags CASCADE;
DROP TABLE IF EXISTS screenings CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;

-- 1. Facilities
CREATE TABLE facilities (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "lgu" TEXT NOT NULL,
  "areaCodePrefix" TEXT
);

-- 2. Users
CREATE TABLE users (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "facilityId" TEXT REFERENCES facilities(id),
  "region" TEXT,
  "email" TEXT,
  "active" BOOLEAN,
  "lastLogin" TEXT,
  "prcLicense" TEXT
);

-- 3. Devices
CREATE TABLE devices (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "facilityId" TEXT REFERENCES facilities(id),
  "status" TEXT NOT NULL,
  "lastMaintenance" TEXT,
  "firmwareVersion" TEXT,
  "lastSeen" TEXT
);

-- 4. Patients
CREATE TABLE patients (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "dob" TEXT NOT NULL,
  "sex" TEXT NOT NULL,
  "facilityId" TEXT REFERENCES facilities(id),
  "consentStatus" TEXT NOT NULL,
  "consentDate" TEXT NOT NULL,
  "phone" TEXT,
  "barangay" TEXT,
  "risk" TEXT,
  "age" INTEGER,
  "screenCount" INTEGER,
  "lastScreening" TEXT,
  "vitals" TEXT,
  "reason" TEXT
);

-- 5. Screenings
CREATE TABLE screenings (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT REFERENCES patients(id),
  "healthWorkerId" TEXT REFERENCES users(id),
  "facilityId" TEXT REFERENCES facilities(id),
  "timestamp" TIMESTAMPTZ NOT NULL,
  "bp" TEXT,
  "bpSystolic" INTEGER,
  "bpDiastolic" INTEGER,
  "glucose" TEXT,
  "glucoseValue" INTEGER,
  "heartRate" INTEGER,
  "bmi" NUMERIC,
  "height" NUMERIC,
  "weight" NUMERIC,
  "afibFlag" BOOLEAN,
  "deviceId" TEXT REFERENCES devices(id),
  "gradeLevel" TEXT NOT NULL,
  "syncStatus" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "notes" TEXT
);

-- 6. Risk Flags
CREATE TABLE risk_flags (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT REFERENCES patients(id),
  "screeningId" TEXT REFERENCES screenings(id),
  "category" TEXT NOT NULL,
  "confidence" NUMERIC NOT NULL,
  "source" TEXT NOT NULL,
  "recommendedAction" TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL,
  "provisional" BOOLEAN,
  "reviewer" TEXT,
  "status" TEXT
);

-- 7. Referrals
CREATE TABLE referrals (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT REFERENCES patients(id),
  "riskFlagId" TEXT REFERENCES risk_flags(id),
  "destinationFacilityId" TEXT REFERENCES facilities(id),
  "destinationLabel" TEXT,
  "status" TEXT NOT NULL,
  "stage" INTEGER NOT NULL,
  "agingDays" INTEGER,
  "stalled" BOOLEAN,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL,
  "statusHistory" JSONB
);

-- 8. Clinical Validations
CREATE TABLE clinical_validations (
  "id" TEXT PRIMARY KEY,
  "screeningId" TEXT REFERENCES screenings(id),
  "patientId" TEXT REFERENCES patients(id),
  "validatingClinicianId" TEXT REFERENCES users(id),
  "licenseNumber" TEXT,
  "qrVerified" BOOLEAN,
  "status" TEXT NOT NULL,
  "submittedAt" TIMESTAMPTZ,
  "notes" TEXT
);

-- 9. Anomalies
CREATE TABLE anomalies (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL,
  "status" TEXT NOT NULL,
  "resolution" TEXT
);

-- 10. Activity Feed (Audit Log)
CREATE TABLE activity_feed (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "dot" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE screenings;
ALTER PUBLICATION supabase_realtime ADD TABLE risk_flags;
ALTER PUBLICATION supabase_realtime ADD TABLE referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE anomalies;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;

-- Data Inserts
-- Insert facilities
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('RHU-042', 'RHU', 'RHU Malanday', 'Malanday, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-01', 'barangay_station', 'Brgy. San Isidro Health Station', 'San Isidro, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-02', 'barangay_station', 'Brgy. Poblacion Health Station', 'Poblacion, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-03', 'barangay_station', 'Brgy. Malanday Health Station', 'Malanday, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-04', 'barangay_station', 'Brgy. Bagong Silang Health Station', 'Bagong Silang, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-05', 'barangay_station', 'Brgy. Sta. Cruz Health Station', 'Sta. Cruz, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-06', 'barangay_station', 'Brgy. Mabini Health Station', 'Mabini, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-07', 'barangay_station', 'Brgy. Del Pilar Health Station', 'Del Pilar, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('BHS-042-08', 'barangay_station', 'Brgy. Maligaya Health Station', 'Maligaya, Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('HOSP-PROV', 'hospital', 'Provincial Hospital', 'Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('HOSP-DIST', 'hospital', 'District Hospital', 'Valenzuela City', 'Valenzuela City');
INSERT INTO facilities ("id", "type", "name", "address", "lgu") VALUES ('HOSP-FAREAST', 'hospital', 'Far EasTone Health⁺', 'Metro Manila', 'Metro Manila');

-- Insert users
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-PHY-001', 'Dr. Amelia Reyes', 'a.reyes@rhu.gov.ph', 'rhu_physician', 'RHU-042', 'PRC 0384712', TRUE, '2026-07-28T08:00:00Z');
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-PHY-002', 'Dr. Jonathan Uy', 'j.uy@rhu.gov.ph', 'rhu_physician', 'RHU-042', 'PRC 0291045', TRUE, '2026-07-27T09:30:00Z');
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-BHW-001', 'Maria Dela Cruz', 'm.delacruz@brgy.gov.ph', 'barangay_health_worker', 'BHS-042-01', NULL, TRUE, '2026-07-28T07:10:00Z');
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-BHW-002', 'Josefina Lim', 'j.lim@brgy.gov.ph', 'barangay_health_worker', 'BHS-042-02', NULL, TRUE, '2026-07-28T06:45:00Z');
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-BHW-003', 'Nena Santos', 'n.santos@brgy.gov.ph', 'barangay_health_worker', 'BHS-042-03', NULL, TRUE, '2026-07-27T08:00:00Z');
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-DOH-001', 'Ramon Villareal', 'r.villareal@doh.gov.ph', 'doh_regional_officer', NULL, NULL, TRUE, '2026-07-25T10:00:00Z');
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-ADMIN-001', 'Carlo Mendoza', 'c.mendoza@hardyco.ph', 'super_admin', NULL, NULL, TRUE, '2026-07-28T09:00:00Z');
INSERT INTO users ("id", "name", "email", "role", "facilityId", "prcLicense", "active", "lastLogin") VALUES ('U-BHW-004', 'Elena Pascual', 'e.pascual@brgy.gov.ph', 'barangay_health_worker', 'BHS-042-06', NULL, FALSE, '2026-07-10T10:00:00Z');

-- Insert devices
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('KSK-042-01', 'Kiosk terminal', 'BHS-042-01', 'online', 'v2.4.1', '2 min ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('MLF-BP-0148', 'Microlife BP A7', 'BHS-042-01', 'online', 'v1.9.0', '2 min ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('BNM-GL-0072', 'Bionime GM700', 'BHS-042-01', 'online', 'v3.1.2', '2 min ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('KSK-042-02', 'Kiosk terminal', 'BHS-042-02', 'online', 'v2.4.1', '11 min ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('MLF-BP-0152', 'Microlife BP A7', 'BHS-042-02', 'maintenance', 'v1.8.4', '6 h ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('KSK-042-03', 'Kiosk terminal', 'BHS-042-03', 'online', 'v2.4.1', '4 min ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('BNM-GL-0075', 'Bionime GM700', 'BHS-042-03', 'online', 'v3.1.2', '4 min ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('KSK-042-04', 'Kiosk terminal', 'BHS-042-04', 'offline', 'v2.3.9', '2 d ago');
INSERT INTO devices ("id", "type", "facilityId", "status", "firmwareVersion", "lastSeen") VALUES ('MLF-BP-0160', 'Microlife BP A7', 'BHS-042-05', 'online', 'v1.9.0', '18 min ago');

-- Insert patients
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0117', 'Rosario Dimagiba', '1959-03-14', 67, 'F', 'BHS-042-01', 'San Isidro', 'elevated', 'BP 165/102 · GLU 182', 'Jul 24', 6, 'Repeat elevated BP + fasting glucose above threshold', 'given', '2026-03-03', '09171234567');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0093', 'Ernesto Salvador', '1968-05-22', 58, 'M', 'BHS-042-02', 'Poblacion', 'elevated', 'BP 158/98 · GLU 210', 'Jul 24', 4, 'Glucose trend rising across 3 screenings', 'given', '2026-04-10', '09189876543');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0210', 'Marites Ocampo', '1977-09-30', 49, 'F', 'BHS-042-03', 'Malanday', 'elevated', 'BP 150/95 · GLU 168', 'Jul 23', 5, 'Stage-2 hypertension range, untreated', 'given', '2026-02-28', '09204567890');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0076', 'Luzviminda Santos', '1963-11-08', 63, 'F', 'BHS-042-02', 'Poblacion', 'elevated', 'BP 170/105 · GLU 195', 'Jul 20', 8, 'Highest composite risk score in RHU scope', 'given', '2026-01-15', '09155551234');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0058', 'Antonio Mercado', '1956-02-19', 70, 'M', 'BHS-042-03', 'Malanday', 'elevated', 'BP 162/100', 'Jul 17', 5, 'Elevated BP, missed follow-up window', 'given', '2026-03-20', '09176543210');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0064', 'Lito Bautista', '1965-07-11', 61, 'M', 'BHS-042-04', 'Bagong Silang', 'moderate', 'BP 142/90', 'Jul 23', 3, 'Borderline BP two screenings in a row', 'given', '2026-05-01', '09201234567');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0155', 'Corazon Villanueva', '1954-06-03', 72, 'F', 'BHS-042-01', 'San Isidro', 'moderate', 'BP 145/88 · GLU 131', 'Jul 22', 7, 'Age-weighted BP risk', 'given', '2026-02-10', '09167654321');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0031', 'Danilo Reyes', '1982-04-25', 44, 'M', 'BHS-042-05', 'Sta. Cruz', 'moderate', 'BP 138/86', 'Jul 22', 2, 'First-time borderline reading', 'given', '2026-06-15', '09198887766');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0121', 'Teresita Ramos', '1967-08-17', 59, 'F', 'BHS-042-01', 'San Isidro', 'moderate', 'BP 140/89 · GLU 127', 'Jul 18', 4, 'Pre-diabetic glucose range', 'given', '2026-04-22', '09152223344');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0188', 'Imelda Navarro', '1971-12-01', 55, 'F', 'BHS-042-06', 'Mabini', 'low', 'BP 122/78 · GLU 98', 'Jul 21', 3, NULL, 'given', '2026-05-12', '09183334455');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0142', 'Roberto Cruz', '1987-03-30', 39, 'M', 'BHS-042-07', 'Del Pilar', 'low', 'BP 118/76 · GLU 92', 'Jul 21', 2, NULL, 'given', '2026-06-01', '09174445566');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('PT-042-0199', 'Fernando Aquino', '1974-10-14', 52, 'M', 'BHS-042-08', 'Maligaya', 'low', 'BP 125/80 · GLU 101', 'Jul 19', 3, NULL, 'given', '2026-03-30', '09165556677');
INSERT INTO patients ("id", "name", "dob", "age", "sex", "facilityId", "barangay", "risk", "vitals", "lastScreening", "screenCount", "reason", "consentStatus", "consentDate", "phone") VALUES ('BGY-041-00217', 'Maria Santos', '1968-05-14', 58, 'F', 'BHS-042-01', 'San Isidro', 'low', 'BP 124/82 · GLU 108', 'Jul 12', 4, NULL, 'given', '2026-03-03', '09171111222');

-- Insert screenings
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-001', 'PT-042-0117', 'U-BHW-001', 'BHS-042-01', '2026-07-24T09:15:00Z', '165/102', 165, 102, '182 mg/dL', 182, 86, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-002', 'PT-042-0117', 'U-BHW-001', 'BHS-042-01', '2026-06-30T10:30:00Z', '148/92', 148, 92, '156 mg/dL', 156, 80, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-003', 'PT-042-0117', 'U-PHY-001', 'HOSP-PROV', '2026-05-12T14:00:00Z', '150/94', 150, 94, 'HbA1c 6.9%', 148, 78, FALSE, NULL, 'diagnostic', 'synced', 'hospital');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-004', 'PT-042-0093', 'U-BHW-002', 'BHS-042-02', '2026-07-24T08:41:00Z', '158/98', 158, 98, '210 mg/dL', 210, 92, FALSE, 'KSK-042-02', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-005', 'PT-042-0210', 'U-BHW-001', 'BHS-042-01', '2026-07-23T14:22:00Z', '150/95', 150, 95, '168 mg/dL', 168, 84, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-006', 'PT-042-0076', 'U-BHW-002', 'BHS-042-02', '2026-07-20T07:12:00Z', '170/105', 170, 105, '195 mg/dL', 195, 95, TRUE, 'KSK-042-02', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-007', 'PT-042-0058', 'U-BHW-003', 'BHS-042-03', '2026-07-17T09:55:00Z', '162/100', 162, 100, 'N/A', NULL, 88, FALSE, 'KSK-042-03', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-008', 'PT-042-0064', 'U-BHW-003', 'BHS-042-03', '2026-07-23T10:18:00Z', '142/90', 142, 90, 'N/A', NULL, 76, FALSE, 'KSK-042-03', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-009', 'PT-042-0155', 'U-BHW-001', 'BHS-042-01', '2026-07-22T11:30:00Z', '145/88', 145, 88, '131 mg/dL', 131, 74, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-010', 'PT-042-0031', 'U-BHW-001', 'BHS-042-01', '2026-07-22T09:00:00Z', '138/86', 138, 86, 'N/A', NULL, 72, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-011', 'PT-042-0121', 'U-BHW-001', 'BHS-042-01', '2026-07-18T16:44:00Z', '140/89', 140, 89, '127 mg/dL', 127, 75, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-012', 'BGY-041-00217', 'U-BHW-001', 'BHS-042-01', '2026-07-12T09:00:00Z', '124/82', 124, 82, '108 mg/dL', 108, 70, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-013', 'BGY-041-00217', 'U-BHW-001', 'BHS-042-01', '2026-05-28T11:00:00Z', '131/85', 131, 85, '112 mg/dL', 112, 72, FALSE, 'KSK-042-01', 'screening', 'synced', 'rhu');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-014', 'BGY-041-00217', 'U-BHW-001', 'BHS-042-01', '2026-04-02T09:30:00Z', '138/89', 138, 89, '121 mg/dL', 121, 74, FALSE, 'KSK-042-01', 'screening', 'synced', 'kiosk');
INSERT INTO screenings ("id", "patientId", "healthWorkerId", "facilityId", "timestamp", "bp", "bpSystolic", "bpDiastolic", "glucose", "glucoseValue", "heartRate", "afibFlag", "deviceId", "gradeLevel", "syncStatus", "source") VALUES ('SCR-015', 'BGY-041-00217', 'U-PHY-001', 'HOSP-PROV', '2026-01-15T09:00:00Z', '136/84', 136, 84, 'Annual physical exam', NULL, 68, FALSE, NULL, 'diagnostic', 'synced', 'hospital');

-- Insert risk_flags
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-001', 'PT-042-0076', 'SCR-006', 'elevated', 0.92, 'AI Brain v3.2', 'Highest composite risk score in RHU scope. AFIB pattern detected. Urgent referral to Provincial Hospital Cardio recommended.', '2026-07-20T07:20:00Z', FALSE, 'unclaimed', NULL);
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-002', 'PT-042-0117', 'SCR-001', 'elevated', 0.87, 'AI Brain v3.2', 'Repeat elevated BP + fasting glucose above threshold across 6 screenings. Referral to RHU physician and Far EasTone Health⁺ consult recommended.', '2026-07-24T08:03:00Z', FALSE, 'unclaimed', NULL);
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-003', 'PT-042-0093', 'SCR-004', 'elevated', 0.84, 'AI Brain v3.2', 'Glucose trend rising across 3 screenings. Schedule follow-up and diabetes screening panel.', '2026-07-24T08:41:00Z', FALSE, 'other', 'Dr. Reyes');
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-004', 'PT-042-0210', 'SCR-005', 'elevated', 0.79, 'AI Brain v3.2', 'Stage-2 hypertension range, untreated. Refer to Provincial Hospital Internal Medicine.', '2026-07-23T14:30:00Z', FALSE, 'unclaimed', NULL);
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-005', 'PT-042-0058', 'SCR-007', 'elevated', 0.75, 'AI Brain v3.2', 'Elevated BP, missed follow-up window. Patient overdue for RHU physician review.', '2026-07-17T10:05:00Z', FALSE, 'unclaimed', NULL);
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-006', 'PT-042-0064', 'SCR-008', 'moderate', 0.68, 'AI Brain v3.2', 'Borderline BP two screenings in a row. Monitor monthly, lifestyle counseling advised.', '2026-07-23T10:25:00Z', FALSE, 'other', 'Dr. Uy');
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-007', 'PT-042-0155', 'SCR-009', 'moderate', 0.65, 'AI Brain v3.2', 'Age-weighted BP risk. Semi-annual review recommended.', '2026-07-22T11:38:00Z', FALSE, 'unclaimed', NULL);
INSERT INTO risk_flags ("id", "patientId", "screeningId", "category", "confidence", "source", "recommendedAction", "timestamp", "provisional", "status", "reviewer") VALUES ('RF-008', 'PT-042-0121', 'SCR-011', 'moderate', 0.61, 'AI Brain v3.2', 'Pre-diabetic glucose range. Lifestyle intervention and quarterly glucose monitoring recommended.', '2026-07-18T16:52:00Z', FALSE, 'unclaimed', NULL);

-- Insert referrals
INSERT INTO referrals ("id", "patientId", "riskFlagId", "destinationFacilityId", "destinationLabel", "status", "stage", "agingDays", "stalled", "statusHistory", "createdAt", "updatedAt") VALUES ('REF-2107', 'PT-042-0076', 'RF-001', 'HOSP-PROV', 'Prov. Hospital — Cardio', 'referred', 1, 9, TRUE, '[{"status":"flagged","timestamp":"2026-07-20T07:20:00Z","note":"AI Brain flagged elevated risk with AFIB pattern","updatedBy":"AI Brain"},{"status":"referred","timestamp":"2026-07-20T10:00:00Z","note":"Referred to Prov. Hospital Cardio by Dr. Amelia Reyes","updatedBy":"U-PHY-001"}]'::jsonb, '2026-07-20T10:00:00Z', '2026-07-20T10:00:00Z');
INSERT INTO referrals ("id", "patientId", "riskFlagId", "destinationFacilityId", "destinationLabel", "status", "stage", "agingDays", "stalled", "statusHistory", "createdAt", "updatedAt") VALUES ('REF-2111', 'PT-042-0117', 'RF-002', 'HOSP-FAREAST', 'Far EasTone Health⁺ consult', 'flagged', 0, 2, FALSE, '[{"status":"flagged","timestamp":"2026-07-24T08:03:00Z","note":"AI Brain flagged repeat elevated BP + glucose","updatedBy":"AI Brain"}]'::jsonb, '2026-07-24T08:03:00Z', '2026-07-24T08:03:00Z');
INSERT INTO referrals ("id", "patientId", "riskFlagId", "destinationFacilityId", "destinationLabel", "status", "stage", "agingDays", "stalled", "statusHistory", "createdAt", "updatedAt") VALUES ('REF-2098', 'PT-042-0210', 'RF-004', 'HOSP-PROV', 'Prov. Hospital — IM', 'seen', 2, 3, FALSE, '[{"status":"flagged","timestamp":"2026-07-23T14:30:00Z","note":"Stage-2 hypertension, AI Brain flagged","updatedBy":"AI Brain"},{"status":"referred","timestamp":"2026-07-23T15:00:00Z","note":"Referred to Prov. Hospital IM","updatedBy":"U-PHY-001"},{"status":"seen","timestamp":"2026-07-24T11:00:00Z","note":"Patient seen by Dr. Santos at Prov. Hospital","updatedBy":"U-PHY-002"}]'::jsonb, '2026-07-23T15:00:00Z', '2026-07-23T15:00:00Z');
INSERT INTO referrals ("id", "patientId", "riskFlagId", "destinationFacilityId", "destinationLabel", "status", "stage", "agingDays", "stalled", "statusHistory", "createdAt", "updatedAt") VALUES ('REF-2091', 'PT-042-0058', 'RF-005', 'HOSP-DIST', 'District Hospital — IM', 'referred', 1, 11, TRUE, '[{"status":"flagged","timestamp":"2026-07-17T10:05:00Z","note":"Elevated BP, missed follow-up","updatedBy":"AI Brain"},{"status":"referred","timestamp":"2026-07-17T11:30:00Z","note":"Referred to District Hospital IM","updatedBy":"U-PHY-001"}]'::jsonb, '2026-07-17T11:30:00Z', '2026-07-17T11:30:00Z');
INSERT INTO referrals ("id", "patientId", "riskFlagId", "destinationFacilityId", "destinationLabel", "status", "stage", "agingDays", "stalled", "statusHistory", "createdAt", "updatedAt") VALUES ('REF-2086', 'PT-042-0155', 'RF-007', 'HOSP-FAREAST', 'Far EasTone Health⁺ consult', 'resolved', 3, 0, FALSE, '[{"status":"flagged","timestamp":"2026-07-15T11:38:00Z","note":"Age-weighted BP risk flagged","updatedBy":"AI Brain"},{"status":"referred","timestamp":"2026-07-15T13:00:00Z","note":"Referred to Far EasTone consult","updatedBy":"U-PHY-002"},{"status":"seen","timestamp":"2026-07-16T10:00:00Z","note":"Patient completed video consult","updatedBy":"U-PHY-002"},{"status":"resolved","timestamp":"2026-07-22T09:00:00Z","note":"Follow-up completed, medication adjusted","updatedBy":"U-PHY-001"}]'::jsonb, '2026-07-15T13:00:00Z', '2026-07-15T13:00:00Z');
INSERT INTO referrals ("id", "patientId", "riskFlagId", "destinationFacilityId", "destinationLabel", "status", "stage", "agingDays", "stalled", "statusHistory", "createdAt", "updatedAt") VALUES ('REF-2079', 'PT-042-0031', NULL, 'RHU-042', 'RHU Malanday follow-up', 'resolved', 3, 0, FALSE, '[{"status":"flagged","timestamp":"2026-07-10T09:00:00Z","note":"First-time borderline reading","updatedBy":"AI Brain"},{"status":"referred","timestamp":"2026-07-10T10:00:00Z","note":"Referred to RHU Malanday","updatedBy":"U-PHY-001"},{"status":"seen","timestamp":"2026-07-12T09:00:00Z","note":"Seen at RHU","updatedBy":"U-PHY-001"},{"status":"resolved","timestamp":"2026-07-22T10:00:00Z","note":"Lifestyle counseling completed, resolved","updatedBy":"U-PHY-001"}]'::jsonb, '2026-07-10T10:00:00Z', '2026-07-10T10:00:00Z');

-- Insert clinical_validations
INSERT INTO clinical_validations ("id", "screeningId", "patientId", "validatingClinicianId", "licenseNumber", "qrVerified", "status", "submittedAt", "notes") VALUES ('CV-001', 'SCR-001', 'PT-042-0117', 'U-PHY-001', 'PRC 0384712', TRUE, 'submitted', '2026-07-28T06:51:27.744Z', 'Screening #S-8841 — Luzviminda Santos');
INSERT INTO clinical_validations ("id", "screeningId", "patientId", "validatingClinicianId", "licenseNumber", "qrVerified", "status", "submittedAt", "notes") VALUES ('CV-002', 'SCR-002', 'PT-042-0117', 'U-PHY-001', 'PRC 0384712', TRUE, 'submitted', '2026-07-28T06:51:27.745Z', 'Screening #S-8790 — Corazon Villanueva');
INSERT INTO clinical_validations ("id", "screeningId", "patientId", "validatingClinicianId", "licenseNumber", "qrVerified", "status", "submittedAt", "notes") VALUES ('CV-003', 'SCR-003', 'PT-042-0117', 'U-PHY-001', 'PRC 0384712', TRUE, 'submitted', '2026-07-28T06:51:27.745Z', 'Screening #S-8712 — Danilo Reyes');

-- Insert anomalies
INSERT INTO anomalies ("id", "sev", "type", "title", "detail", "time", "status") VALUES ('IFA-1042', 'critical', 'Data integrity', 'Physiologically implausible reading at KSK-042-02', 'Glucose 812 mg/dL captured for PT-042-0142 (Poblacion). Value exceeds device ceiling — probable strip error or manual entry fault. Record quarantined from risk scoring.', 'Today 08:52', 'open');
INSERT INTO anomalies ("id", "sev", "type", "title", "detail", "time", "status") VALUES ('IFA-1041', 'critical', 'Device drift', 'BP cuff MLF-BP-0152 drifting +12 mmHg vs baseline', 'Rolling 50-reading mean is 12 mmHg above facility baseline since Jul 22. 3 elevated-risk flags in Poblacion may be device-induced. Recalibration recommended before next session.', 'Today 07:15', 'open');
INSERT INTO anomalies ("id", "sev", "type", "title", "detail", "time", "status") VALUES ('IFA-1039', 'warning', 'Duplicate identity', 'Possible duplicate enrollment in San Isidro', 'PT-042-0117 and kiosk enrollment K-5518 share name, birth year, and address fingerprint (match score 0.94). Merging preserves both screening histories.', 'Yesterday 16:40', 'open');
INSERT INTO anomalies ("id", "sev", "type", "title", "detail", "time", "status") VALUES ('IFA-1036', 'warning', 'Volume anomaly', 'Screening volume spike in Poblacion (+3.1σ)', '184 screenings in 48h vs seasonal mean of 61. Consistent with the announced barangay health drive — confirm to suppress alerts for this window.', 'Yesterday 11:02', 'open');
INSERT INTO anomalies ("id", "sev", "type", "title", "detail", "time", "status") VALUES ('IFA-1031', 'info', 'Coverage gap', 'No senior (65+) screenings in Del Pilar for 21 days', 'Historical cadence is every 9 days. May indicate outreach lapse rather than data fault.', 'Jul 23', 'ack');
INSERT INTO anomalies ("id", "sev", "type", "title", "detail", "time", "status") VALUES ('IFA-1028', 'warning', 'Device drift', 'Glucometer BNM-GL-0072 cold-storage variance', 'Morning readings 8% below afternoon distribution. Pattern matched strip storage temperature issue.', 'Jul 21', 'dismissed');

-- Insert activity_feed
INSERT INTO activity_feed ("text", "time", "dot", "type", "id") VALUES ('AI Brain flagged Rosario Dimagiba (San Isidro) — repeat elevated BP', '36 min ago', '#B0523F', 'flag', 'af-0');
INSERT INTO activity_feed ("text", "time", "dot", "type", "id") VALUES ('Referral REF-2098 marked "Seen" — Marites Ocampo at Prov. Hospital', '1 h ago', '#4C7A5A', 'referral', 'af-1');
INSERT INTO activity_feed ("text", "time", "dot", "type", "id") VALUES ('Kiosk KSK-042-04 (Bagong Silang) offline for 48h — ops notified', '3 h ago', '#C79A3C', 'device', 'af-2');
INSERT INTO activity_feed ("text", "time", "dot", "type", "id") VALUES ('Dr. Uy validated screening S-8841 as diagnostic-grade', 'Yesterday', '#4C7A5A', 'validation', 'af-3');
INSERT INTO activity_feed ("text", "time", "dot", "type", "id") VALUES ('214 screenings synced from San Isidro station this week', 'Yesterday', '#A3B18B', 'sync', 'af-4');
INSERT INTO activity_feed ("text", "time", "dot", "type", "id") VALUES ('Monthly DOH report RPT-0663 exported by Region IV-A office', 'Yesterday', '#A3B18B', 'report', 'af-5');

