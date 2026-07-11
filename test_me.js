const URL = "https://knngpbctdadwjykuojhq.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubmdwYmN0ZGFkd2p5a3VvamhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDU1MjQsImV4cCI6MjA5OTE4MTUyNH0.juDhEaQyVunaO7YYCi1uIyBs7Zi-vlsqXM36iaszYDo";

async function test() {
  const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `essghe@gmail.com`, password: "YOUR_PASSWORD" }) // I don't know the password
  });
  // Wait, I can't do this without the password!
}
test();
