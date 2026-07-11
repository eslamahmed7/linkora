import { supabase } from './server/utils/supabase';

async function test() {
  const email = `testme_${Date.now()}@example.com`;
  const password = "Password123!";
  
  // 1. Sign up to get token
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) {
    console.error("SignUp error:", authError);
    return;
  }
  
  console.log("Token:", authData.session?.access_token ? "Exists" : "None");
  
  // 2. Insert into users table (since we are bypassing the frontend /auth/register endpoint)
  await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: authData.user?.id,
      email,
      username: "testme_user"
    })
  });

  // 3. Fetch /auth/me
  const res = await fetch('http://localhost:3001/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${authData.session?.access_token}`
    }
  });
  
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
test();
