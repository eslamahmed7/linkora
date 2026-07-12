const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'essghe@gmail.com',
      password: '123456789'
    });

    if (error) {
      console.error('Login failed:', error.message);
      return;
    }

    const token = data.session.access_token;
    console.log('Login successful! Testing deployed Vercel app...');

    const headers = { Authorization: `Bearer ${token}` };
    const baseUrl = 'https://linkora-nu.vercel.app/api';

    const testEndpoint = async (endpoint) => {
      try {
        const res = await axios.get(`${baseUrl}${endpoint}`, { headers });
        console.log(`[SUCCESS] ${endpoint}: ${res.status}`);
      } catch (err) {
        console.error(`[ERROR] ${endpoint}: ${err.response ? err.response.status : err.message}`);
      }
    };

    await testEndpoint('/pages');
    await testEndpoint('/qr');
    await testEndpoint('/nfc');
    
  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

test();
