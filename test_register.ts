import { authAPI } from './src/api/auth';
import { supabase } from './src/lib/supabase';

async function test() {
  try {
    const email = `test-${Date.now()}@example.com`;
    console.log("Registering", email);
    const result = await authAPI.register(email, 'password123', `user_${Date.now()}`);
    console.log("Success", result);
  } catch (err: any) {
    console.error("Error", err.message);
  }
}
test();
