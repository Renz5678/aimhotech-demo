import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, 'src/data/seed-data.json');
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const sqlFile = path.join(__dirname, 'schema.sql');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (typeof str === 'number') return str;
  if (typeof str === 'object') return `'${JSON.stringify(str).replace(/'/g, "''")}'::jsonb`;
  return `'${String(str).replace(/'/g, "''")}'`;
}

let sql = `
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
`;

// Insert Helper
function generateInserts(tableName, data) {
  if (!data || data.length === 0) return '';
  const keys = Object.keys(data[0]);
  let output = `-- Insert ${tableName}\n`;
  for (const row of data) {
    const values = keys.map(k => escapeSql(row[k]));
    output += `INSERT INTO ${tableName} ("${keys.join('", "')}") VALUES (${values.join(', ')});\n`;
  }
  return output + '\n';
}

sql += generateInserts('facilities', seedData.facilities);
sql += generateInserts('users', seedData.users);
sql += generateInserts('devices', seedData.devices);
sql += generateInserts('patients', seedData.patients);

// For screenings, riskQueue maps to riskFlags slightly differently, but we have riskFlags
sql += generateInserts('screenings', seedData.screenings);

// Combine riskFlags and riskQueue for seed data
const combinedRiskFlags = seedData.riskFlags.map(rf => {
  const qItem = seedData.riskQueue.find(q => q.pid === rf.patientId);
  const obj = {
    ...rf,
    reviewer: qItem?.reviewer || null,
    status: qItem?.status || 'unclaimed'
  };
  delete obj.flaggedAt;
  return obj;
});
sql += generateInserts('risk_flags', combinedRiskFlags);

const mappedReferrals = seedData.referrals.map(r => ({
  ...r,
  updatedAt: r.updatedAt || r.createdAt
}));
sql += generateInserts('referrals', mappedReferrals);

const mappedValidations = seedData.clinicalValidations.map((cv, i) => {
  const validScreening = seedData.screenings[i % seedData.screenings.length];
  return {
    id: cv.id,
    screeningId: validScreening.id,
    patientId: validScreening.patientId,
    validatingClinicianId: 'U-PHY-001',
    licenseNumber: 'PRC 0384712',
    qrVerified: true,
    status: cv.status,
    submittedAt: new Date().toISOString(),
    notes: cv.record
  };
});
sql += generateInserts('clinical_validations', mappedValidations);
sql += generateInserts('anomalies', seedData.anomalies);
sql += generateInserts('activity_feed', seedData.activityFeed.map((a, i) => ({ ...a, id: `af-${i}` })));

fs.writeFileSync(sqlFile, sql);
console.log('Generated schema.sql');
