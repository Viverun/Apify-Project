const fetch = require('node-fetch');

const CLIENT_ID = 'e7b084553d51471fbc32cb2e8a90936d';
const CLIENT_SECRET = '5db1a269182b45c5ba59406192bfa704';
const REFRESH_TOKEN = 'AQDJ1d_74Td9rg8aiCadUkl6EJm1E9ewEk58ALOzBHRSrbZsOrnDnfr3lCxYkWg33XDjo2Y2HNGbR2p6O0XFseCDrW5KER6A1sOv4rCZYEHZ4NisDsnCYshwcVEmO2ITQDs';

async function test() {
  try {
    // Get access token
    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log('✅ Got access token\n');

    // Test different search queries
    const queries = [
      'pop',
      'genre:pop',
      'pop year:2024',
      'genre:pop year:2024',
      'track:love',
      'Billie Eilish',
    ];

    for (const q of queries) {
      console.log(`🔍 Testing query: "${q}"`);
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5&market=IN`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${data.tracks.items.length} tracks found`);
        if (data.tracks.items.length > 0) {
          console.log(`   First: ${data.tracks.items[0].name} by ${data.tracks.items[0].artists[0].name}`);
        }
      } else {
        console.log(`   ❌ Error: ${response.status}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test();
