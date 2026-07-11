const URL = "https://knngpbctdadwjykuojhq.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubmdwYmN0ZGFkd2p5a3VvamhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDU1MjQsImV4cCI6MjA5OTE4MTUyNH0.juDhEaQyVunaO7YYCi1uIyBs7Zi-vlsqXM36iaszYDo";

fetch(`${URL}/auth/v1/signup`, {
  method: 'POST',
  headers: {
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: `test_${Date.now()}@example.com`,
    password: "Password123!"
  })
}).then(async res => {
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}).catch(console.error);
