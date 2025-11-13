const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Proxy for Spotify token
app.post('/token', async (req, res) => {
  try {
    console.log('📥 Token request received');
    
    const authHeader = req.headers.authorization;
    const body = req.body;
    
    console.log('Auth header:', authHeader ? authHeader.substring(0, 20) + '...' : 'MISSING');
    console.log('Body:', body);
    
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    console.log('Forwarding to Spotify token endpoint...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: new URLSearchParams(body).toString(),
    });
    
    console.log('Spotify token response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Spotify token error:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to get token',
        details: errorText,
        status: response.status 
      });
    }
    
    const data = await response.json();
    console.log('✅ Token response: SUCCESS');
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Exception in /token:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Proxy for Spotify API
app.get('/recommendations', async (req, res) => {
  try {
    console.log('📥 Recommendations request');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const queryString = new URLSearchParams(req.query).toString();
    
    console.log('Query:', queryString);
    console.log('Auth:', authHeader.substring(0, 20) + '...');
    
    const url = `https://api.spotify.com/v1/recommendations?${queryString}`;
    console.log('Fetching:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': authHeader,
      },
    });
    
    console.log('Spotify response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Spotify error:', errorText);
      return res.status(response.status).json({ 
        error: 'Spotify API error',
        details: errorText,
        status: response.status 
      });
    }
    
    const data = await response.json();
    console.log('✅ Recommendations response:', response.status, data.tracks?.length || 0, 'tracks');
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Exception in /recommendations:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Available genres
app.get('/available-genre-seeds', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        'Authorization': authHeader,
      },
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search endpoint
app.get('/search', async (req, res) => {
  try {
    console.log('🔍 Search request');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const queryString = new URLSearchParams(req.query).toString();
    
    console.log('Query:', queryString);
    console.log('Auth:', authHeader.substring(0, 20) + '...');
    
    const url = `https://api.spotify.com/v1/search?${queryString}`;
    console.log('Fetching:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': authHeader,
      },
    });
    
    console.log('Spotify response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Spotify error:', errorText);
      return res.status(response.status).json({ 
        error: 'Spotify API error',
        details: errorText,
        status: response.status 
      });
    }
    
    const data = await response.json();
    console.log('✅ Search response:', response.status, data.tracks?.items?.length || 0, 'tracks');
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Exception in /search:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Create playlist endpoint
app.post('/create-playlist', async (req, res) => {
  try {
    console.log('🎵 Create playlist request');
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const { userId, name, description, public: isPublic, trackUris } = req.body;
    
    console.log('Creating playlist:', { name, userId, trackCount: trackUris?.length });
    
    // Step 1: Create the playlist
    const createUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        public: isPublic || false,
      }),
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Create playlist error:', errorText);
      return res.status(createResponse.status).json({ 
        error: 'Failed to create playlist',
        details: errorText 
      });
    }
    
    const playlist = await createResponse.json();
    console.log('✅ Playlist created:', playlist.id);
    
    // Step 2: Add tracks to the playlist
    if (trackUris && trackUris.length > 0) {
      const addTracksUrl = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;
      const addTracksResponse = await fetch(addTracksUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      });
      
      if (!addTracksResponse.ok) {
        const errorText = await addTracksResponse.text();
        console.error('❌ Add tracks error:', errorText);
        return res.status(addTracksResponse.status).json({ 
          error: 'Failed to add tracks',
          details: errorText 
        });
      }
      
      console.log('✅ Added', trackUris.length, 'tracks to playlist');
    }
    
    res.json({
      id: playlist.id,
      url: playlist.external_urls.spotify,
      name: playlist.name,
    });
    
  } catch (error) {
    console.error('❌ Exception in /create-playlist:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Spotify proxy running on http://localhost:${PORT}`);
});
