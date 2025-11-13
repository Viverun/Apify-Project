// Test creating a playlist on Spotify
const fetch = require('node-fetch');

const clientId = 'e7b084553d51471fbc32cb2e8a90936d';
const clientSecret = '5db1a269182b45c5ba59406192bfa704';
const refreshToken = 'AQDJ1d_74Td9rg8aiCadUkl6EJm1E9ewEk58ALOzBHRSrbZsOrnDnfr3lCxYkWg33XDjo2Y2HNGbR2p6O0XFseCDrW5KER6A1sOv4rCZYEHZ4NisDsnCYshwcVEmO2ITQDs';

async function testCreatePlaylist() {
  try {
    // 1. Get access token
    console.log('🔑 Getting access token...');
    const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('❌ Token error:', tokenData);
      return;
    }
    
    console.log('✅ Got access token');
    const accessToken = tokenData.access_token;

    // 2. Get user info
    console.log('👤 Getting user info...');
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const user = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('❌ User error:', user);
      return;
    }
    
    console.log('✅ User:', user.display_name, '(ID:', user.id + ')');

    // 3. Create playlist
    console.log('🎵 Creating test playlist...');
    const createResponse = await fetch(
      `https://api.spotify.com/v1/users/${user.id}/playlists`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Playlist ' + Date.now(),
          description: 'Created by test script',
          public: false,
        }),
      }
    );

    const playlist = await createResponse.json();
    
    if (!createResponse.ok) {
      console.error('❌ Create playlist error:', playlist);
      return;
    }

    console.log('✅ Playlist created!');
    console.log('   Name:', playlist.name);
    console.log('   ID:', playlist.id);
    console.log('   URL:', playlist.external_urls.spotify);

    // 4. Add a sample track
    console.log('🎵 Adding sample track...');
    const addResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: ['spotify:track:3n3Ppam7vgaVa1iaRUc9Lp'], // Mr. Brightside
        }),
      }
    );

    const addResult = await addResponse.json();
    
    if (!addResponse.ok) {
      console.error('❌ Add tracks error:', addResult);
      return;
    }

    console.log('✅ Track added successfully!');
    console.log('\n🎉 SUCCESS! Check your Spotify account for the playlist.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCreatePlaylist();
