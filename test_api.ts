import { supabase } from './server/utils/supabase';

async function run() {
  const { data, error } = await supabase.from('qr_codes').select('id, page_id, link_id').limit(1);
  if (!data || data.length === 0) return console.log('No QR codes');
  const qr = data[0];
  console.log('Testing QR ID:', qr.id);

  // We need a user token to call the API.
  // Instead of logging in, I'll just check if the route code is logically flawed.
  console.log('We cannot easily test the API without a valid user token.');
}
run();
