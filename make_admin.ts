import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function makeAdmin() {
  console.log('Updating users to super_admin...');
  
  const { data: users, error: fetchError } = await supabase.from('users').select('id, email, role');
  
  if (fetchError) {
    console.error('Error fetching users:', fetchError.message);
    return;
  }
  
  console.log('Found users:', users?.length);
  
  if (users && users.length > 0) {
    const { data, error } = await supabase
      .from('users')
      .update({ role: 'super_admin' })
      .not('id', 'is', null);
      
    if (error) {
      console.error('Error updating users:', error.message);
    } else {
      console.log('Successfully updated all users to super_admin!');
    }
  } else {
    console.log('No users found in database.');
  }
}

makeAdmin();
