const axios = require('axios');

async function test() {
  console.log('Testing Vercel deployment error response...');
  try {
    const r = await axios.get('https://linkora-nu.vercel.app/api/version');
    console.log('VERSION SUCCESS:', r.data);
  } catch(e) {
    console.error('VERSION ERROR STATUS:', e.response ? e.response.status : e.message);
    console.error('VERSION ERROR DATA:', e.response ? JSON.stringify(e.response.data, null, 2) : 'No data');
  }
}

test();
