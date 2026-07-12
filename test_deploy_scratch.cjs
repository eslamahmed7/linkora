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

console.log('Using Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    console.log('Logging in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'essghe@gmail.com',
      password: '123456789'
    });

    if (error) {
      console.error('Login failed:', error.message);
      return;
    }

    const token = data.session.access_token;
    console.log('Login successful! Access token obtained.');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const baseUrl = 'https://linkora-nu.vercel.app/api';

    console.log('\n--- Testing /pages ---');
    try {
      const res = await axios.get(`${baseUrl}/pages`, { headers });
      console.log('Status:', res.status);
      console.log('Data:', JSON.stringify(res.data, null, 2).substring(0, 500));
    } catch (err) {
      console.error('Failed /pages:', err.response ? err.response.status : err.message);
      if (err.response) console.error('Response:', err.response.data);
    }

    console.log('\n--- Testing /qr ---');
    try {
      const res = await axios.get(`${baseUrl}/qr`, { headers });
      console.log('Status:', res.status);
      console.log('Data:', JSON.stringify(res.data, null, 2).substring(0, 500));
    } catch (err) {
      console.error('Failed /qr:', err.response ? err.response.status : err.message);
      if (err.response) console.error('Response:', err.response.data);
    }

    console.log('\n--- Testing /nfc ---');
    try {
      const res = await axios.get(`${baseUrl}/nfc`, { headers });
      console.log('Status:', res.status);
      console.log('Data:', JSON.stringify(res.data, null, 2).substring(0, 500));
    } catch (err) {
      console.error('Failed /nfc:', err.response ? err.response.status : err.message);
      if (err.response) console.error('Response:', err.response.data);
    }

  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

test();
