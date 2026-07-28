-- ============================================================
-- AImhotech Demo Auth Migration
-- Run this ONCE in the Supabase SQL Editor BEFORE starting the demo
-- 
-- Pre-flight checklist:
--   1. Supabase Auth > Providers > Email must be ENABLED
--   2. Confirm email = OFF (disable for demo)
--   3. Run supabase-notifications.sql first
-- 
-- Demo Credentials:
--   Staff (all roles):  AimhoDemo2026!
--   Patient login:      PatientDemo2026!
-- ============================================================

-- Credentials Reference:
-- | Role                   | Email                             | Password         | userId        | Name             |
-- |------------------------|-----------------------------------|------------------|---------------|------------------|
-- | rhu_physician          | a.reyes@rhu.gov.ph                | AimhoDemo2026!   | U-PHY-001     | Dr. Amelia Reyes |
-- | rhu_physician          | j.uy@rhu.gov.ph                   | AimhoDemo2026!   | U-PHY-002     | Dr. Jonathan Uy  |
-- | barangay_health_worker | m.delacruz@brgy.gov.ph            | AimhoDemo2026!   | U-BHW-001     | Maria Dela Cruz  |
-- | barangay_health_worker | j.lim@brgy.gov.ph                 | AimhoDemo2026!   | U-BHW-002     | Josefina Lim     |
-- | barangay_health_worker | n.santos@brgy.gov.ph              | AimhoDemo2026!   | U-BHW-003     | Nena Santos      |
-- | doh_regional_officer   | r.villareal@doh.gov.ph            | AimhoDemo2026!   | U-DOH-001     | Ramon Villareal  |
-- | super_admin            | c.mendoza@hardyco.ph              | AimhoDemo2026!   | U-ADMIN-001   | Carlo Mendoza    |
-- | patient                | maria.santos@patient.aimhotech.io | PatientDemo2026! | BGY-041-00217 | Maria Santos     |

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove existing demo accounts (safe to re-run)
DELETE FROM auth.users WHERE email IN (
  'a.reyes@rhu.gov.ph',
  'j.uy@rhu.gov.ph',
  'm.delacruz@brgy.gov.ph',
  'j.lim@brgy.gov.ph',
  'n.santos@brgy.gov.ph',
  'r.villareal@doh.gov.ph',
  'c.mendoza@hardyco.ph',
  'maria.santos@patient.aimhotech.io'
);

-- Insert all 8 demo accounts
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  deleted_at
) VALUES

-- 1. Dr. Amelia Reyes (RHU Physician)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'a.reyes@rhu.gov.ph',
  crypt('AimhoDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "rhu_physician", "userId": "U-PHY-001", "name": "Dr. Amelia Reyes", "prcLicense": "PRC-0142891"}'::jsonb,
  now(), now(), false, NULL
),

-- 2. Dr. Jonathan Uy (RHU Physician)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'j.uy@rhu.gov.ph',
  crypt('AimhoDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "rhu_physician", "userId": "U-PHY-002", "name": "Dr. Jonathan Uy", "prcLicense": "PRC-0198432"}'::jsonb,
  now(), now(), false, NULL
),

-- 3. Maria Dela Cruz (Barangay Health Worker)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'm.delacruz@brgy.gov.ph',
  crypt('AimhoDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "barangay_health_worker", "userId": "U-BHW-001", "name": "Maria Dela Cruz"}'::jsonb,
  now(), now(), false, NULL
),

-- 4. Josefina Lim (Barangay Health Worker)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'j.lim@brgy.gov.ph',
  crypt('AimhoDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "barangay_health_worker", "userId": "U-BHW-002", "name": "Josefina Lim"}'::jsonb,
  now(), now(), false, NULL
),

-- 5. Nena Santos (Barangay Health Worker)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'n.santos@brgy.gov.ph',
  crypt('AimhoDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "barangay_health_worker", "userId": "U-BHW-003", "name": "Nena Santos"}'::jsonb,
  now(), now(), false, NULL
),

-- 6. Ramon Villareal (DOH Regional Officer)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'r.villareal@doh.gov.ph',
  crypt('AimhoDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "doh_regional_officer", "userId": "U-DOH-001", "name": "Ramon Villareal"}'::jsonb,
  now(), now(), false, NULL
),

-- 7. Carlo Mendoza (Super Admin)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'c.mendoza@hardyco.ph',
  crypt('AimhoDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "super_admin", "userId": "U-ADMIN-001", "name": "Carlo Mendoza"}'::jsonb,
  now(), now(), false, NULL
),

-- 8. Maria Santos (Patient)
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'maria.santos@patient.aimhotech.io',
  crypt('PatientDemo2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"role": "patient", "userId": "BGY-041-00217", "name": "Maria Santos"}'::jsonb,
  now(), now(), false, NULL
);

-- Verify: should return 8 rows
SELECT email, raw_user_meta_data->>'role' AS role, raw_user_meta_data->>'name' AS name
FROM auth.users
WHERE email IN (
  'a.reyes@rhu.gov.ph', 'j.uy@rhu.gov.ph',
  'm.delacruz@brgy.gov.ph', 'j.lim@brgy.gov.ph', 'n.santos@brgy.gov.ph',
  'r.villareal@doh.gov.ph', 'c.mendoza@hardyco.ph',
  'maria.santos@patient.aimhotech.io'
)
ORDER BY email;

-- -------------------------------------------------------
-- IMPORTANT: also insert identity records
-- (required for signInWithPassword to work)
-- -------------------------------------------------------
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT
  u.id,
  u.email,
  u.id,
  json_build_object('sub', u.id::text, 'email', u.email)::jsonb,
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email IN (
  'a.reyes@rhu.gov.ph',
  'j.uy@rhu.gov.ph',
  'm.delacruz@brgy.gov.ph',
  'j.lim@brgy.gov.ph',
  'n.santos@brgy.gov.ph',
  'r.villareal@doh.gov.ph',
  'c.mendoza@hardyco.ph',
  'maria.santos@patient.aimhotech.io'
)
ON CONFLICT DO NOTHING;
