const fetch = require('node-fetch');

const CLIENT_ID = 'e7b084553d51471fbc32cb2e8a90936d';
const CLIENT_SECRET = '5db1a269182b45c5ba59406192bfa704';
const REFRESH_TOKEN = 'AQDJ1d_74Td9rg8aiCadUkl6EJm1E9ewEk58ALOzBHRSrbZsOrnDnfr3lCxYkWg33XDjo2Y2HNGbR2p6O0XFseCDrW5KER6A1sOv4rCZYEHZ4NisDsnCYshwcVEmO2ITQDs';

async function test() {
  try {
    // Step 1: Get access token
    console.log('🔑 Getting access token...');
    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token error: ${error}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log('✅ Got access token');
    console.log('Token scope:', tokenData.scope);

    // Step 2: Verify token works with a known endpoint
    console.log('\n👤 Testing user profile endpoint...');
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    console.log('Profile response status:', profileResponse.status);
    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log('✅ User:', profile.display_name, '(' + profile.id + ')');
      console.log('Country:', profile.country);
      console.log('Product:', profile.product);
    }

    // Step 3: Test different endpoints
    console.log('\n🎵 Testing available-genre-seeds endpoint...');
    
    const genresUrl = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
    console.log('URL:', genresUrl);
    
    const genresResponse = await fetch(genresUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Genres response status:', genresResponse.status, genresResponse.statusText);

    if (genresResponse.ok) {
      const genres = await genresResponse.json();
      console.log('✅ Got', genres.genres.length, 'genres');
      console.log('Sample genres:', genres.genres.slice(0, 10));
    } else {
      const error = await genresResponse.text();
      console.error('❌ Genres error:', error);
    }

    // Now try recommendations
    console.log('\n🎵 Testing recommendations endpoint...');
    
    // Try with market parameter
    const url = 'https://api.spotify.com/v1/recommendations?seed_genres=pop&limit=5';
    console.log('URL:', url);
    
    const recommendationsResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Response status:', recommendationsResponse.status, recommendationsResponse.statusText);

    if (!recommendationsResponse.ok) {
      const error = await recommendationsResponse.text();
      console.error('❌ Error:', error);
      
      // Try search as alternative
      console.log('\n🔍 Trying search endpoint as alternative...');
      const searchUrl = 'https://api.spotify.com/v1/search?q=genre:pop&type=track&limit=5&market=IN';
      console.log('Search URL:', searchUrl);
      
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      console.log('Search response status:', searchResponse.status);
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        console.log('✅ Search works! Got', searchData.tracks.items.length, 'tracks');
        console.log('First track:', searchData.tracks.items[0]?.name, 'by', searchData.tracks.items[0]?.artists[0]?.name);
      }
      
      return;
    }

    const recommendations = await recommendationsResponse.json();
    console.log('✅ Success! Got', recommendations.tracks.length, 'tracks');
    console.log('First track:', recommendations.tracks[0]?.name, 'by', recommendations.tracks[0]?.artists[0]?.name);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

test();
