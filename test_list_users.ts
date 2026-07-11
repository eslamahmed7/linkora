import { supabase } from './server/utils/supabase';

async function listUsers() {
  const { data, error } = await supabase.from('users').select('*');
  console.log("Users in public.users:", data);
  if (error) console.error("Error:", error);
}
listUsers();
