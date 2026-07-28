-- Compare an API-created user with our manually created user
SELECT 
  email,
  encrypted_password IS NOT NULL as has_password,
  aud,
  role,
  instance_id,
  is_sso_user
FROM auth.users
WHERE email IN ('test.aimhotech@gmail.com', 'a.reyes@rhu.gov.ph');

SELECT
  i.provider,
  i.provider_id,
  i.user_id,
  i.identity_data
FROM auth.identities i
JOIN auth.users u ON u.id = i.user_id
WHERE u.email IN ('test.aimhotech@gmail.com', 'a.reyes@rhu.gov.ph');
