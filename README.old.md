# Apify Spotify MCP Actor

A production-ready Model Context Protocol (MCP) server for Spotify, deployable on the Apify platform. This Actor exposes an HTTP endpoint that AI clients can use to search tracks, get recommendations, and create playlists via natural language.

## 🎯 Features

- **MCP-Compatible HTTP Server** - Exposes `/mcp` endpoint for AI tool calls
- **Three Core Tools**:
  - `search-track` - Search Spotify catalog by keyword
  - `recommend` - Get personalized recommendations using seeds
  - `create-playlist` - Create playlists and add tracks
- **Advanced Capabilities**:
  - ✅ Automatic Spotify access token refresh
  - ✅ Response caching (LRU cache with TTL)
  - ✅ NLP enhancement for natural language playlist descriptions
  - ✅ Request validation and error handling
  - ✅ Billing integration with `Actor.charge()`
  - ✅ Structured logging with `log.info()`
  - ✅ TypeScript with full type safety

## 🚀 Quick Start

### Prerequisites

1. **Spotify Developer Account**
   - Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Note your Client ID and Client Secret
   - Get a refresh token (see "Getting Refresh Token" below)

### Local Development

1. **Install dependencies**:
```pwsh
npm install
```

2. **Set environment variables** (PowerShell):
```pwsh
$env:SPOTIFY_CLIENT_ID = 'your_client_id'
$env:SPOTIFY_CLIENT_SECRET = 'your_client_secret'
$env:SPOTIFY_REFRESH_TOKEN = 'your_refresh_token'
$env:ENABLE_NLP = 'true'  # Optional: enable natural language processing
```

3. **Start the server**:
```pwsh
npm run start
```

4. **Test the endpoints**:
```pwsh
# Health check
curl http://localhost:3001/

# Search tracks
curl -X POST http://localhost:3001/mcp -H "Content-Type: application/json" -d '{\"tool\":\"search-track\",\"input\":{\"query\":\"Nirvana\"}}'
```

See `examples.http` for more request examples.

## 📡 API Reference

### POST /mcp

Main MCP endpoint for tool invocations.

**Request Format:**
```json
{
  "tool": "search-track" | "recommend" | "create-playlist",
  "input": { /* tool-specific parameters */ }
}
```

**Response Format:**
```json
{
  "status": "success" | "error",
  "data": { /* tool-specific response */ },
  "message": "error message if status=error",
  "timestamp": "2025-11-08T12:00:00.000Z"
}
```

### Tool: `search-track`

Search for tracks on Spotify.

**Input:**
```json
{
  "query": "artist or song name",
  "limit": 20  // optional, default 20
}
```

**Response Data:**
```json
{
  "tracks": [
    {
      "id": "track_id",
      "name": "Track Name",
      "artists": [{ "id": "artist_id", "name": "Artist Name" }],
      "album": { "id": "album_id", "name": "Album Name" },
      "uri": "spotify:track:...",
      "external_urls": { "spotify": "https://..." },
      "duration_ms": 180000
    }
  ],
  "count": 20
}
```

### Tool: `recommend`

Get track recommendations based on seeds.

**Input:**
```json
{
  "seedArtists": ["artist_id1", "artist_id2"],  // optional, max 5
  "seedGenres": ["rock", "indie"],              // optional, max 5
  "seedTracks": ["track_id1"],                  // optional, max 5
  "description": "mellow morning music",        // optional, uses NLP if ENABLE_NLP=true
  "limit": 20                                   // optional, default 20
}
```

**Response Data:**
```json
{
  "tracks": [ /* same format as search-track */ ],
  "count": 20,
  "seeds": { /* seeds used for recommendations */ }
}
```

### Tool: `create-playlist`

Create a new Spotify playlist and optionally add tracks.

**Input:**
```json
{
  "name": "Playlist Name",
  "description": "Optional description",        // optional
  "trackUris": ["spotify:track:...", "..."],   // array of Spotify track URIs
  "userId": "spotify_user_id",                 // optional, auto-detected if omitted
  "public": false                              // optional, default false
}
```

**Response Data:**
```json
{
  "playlist": {
    "id": "playlist_id",
    "name": "Playlist Name",
    "description": "Description",
    "uri": "spotify:playlist:...",
    "external_urls": { "spotify": "https://..." },
    "trackCount": 10
  }
}
```

### GET /

Health check endpoint.

### GET /stats

Returns billing and cache statistics.

## 🔐 Getting Spotify Refresh Token

To get a refresh token:

1. Use the [Spotify Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
2. Or use a tool like [spotify-token-generator](https://github.com/your-username/spotify-token-generator)
3. Request the following scopes:
   - `playlist-modify-private`
   - `playlist-modify-public`
   - `user-read-private`

Quick method using curl:

```pwsh
# 1. Get authorization code (open in browser)
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:8888/callback&scope=playlist-modify-private%20playlist-modify-public%20user-read-private

# 2. Exchange code for tokens
$code = "authorization_code_from_callback"
$authHeader = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("YOUR_CLIENT_ID:YOUR_CLIENT_SECRET"))

curl -X POST https://accounts.spotify.com/api/token `
  -H "Authorization: Basic $authHeader" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "grant_type=authorization_code&code=$code&redirect_uri=http://localhost:8888/callback"
```

## 🧠 NLP Enhancement

When `ENABLE_NLP=true`, the `recommend` tool can interpret natural language descriptions:

```json
{
  "tool": "recommend",
  "input": {
    "description": "energetic workout music"
  }
}
```

The NLP parser will:
- Detect mood keywords (happy, sad, energetic, calm, etc.)
- Detect activity keywords (workout, study, party, sleep, etc.)
- Map them to appropriate Spotify genres
- Use as `seedGenres` for recommendations

Supported moods: happy, sad, energetic, calm, mellow, romantic, party, focus, workout

Supported activities: morning, night, workout, study, party, sleep, driving

## 📦 Deployment on Apify

1. **Create a new Actor** in Apify Console
2. **Set environment variables** in Actor settings:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
   - `ENABLE_NLP` (optional, set to `true`)
3. **Upload/link your code** to the Actor
4. **Build** the Actor
5. **Run** in standby mode

The Actor will expose an HTTP endpoint at:
```
https://YOUR_ACTOR.apify.actor/mcp
```

## 🏗️ Project Structure

```
apify-spotify-mcp/
├── src/
│   ├── main.ts              # Express server & MCP routing
│   ├── spotifyHandler.ts    # Spotify API integration
│   ├── cache.ts             # LRU cache implementation
│   ├── nlpHelper.ts         # Natural language processing
│   ├── billing.ts           # Billing/charging logic
│   └── types.ts             # TypeScript interfaces
├── package.json
├── tsconfig.json
├── examples.http            # HTTP request examples
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SPOTIFY_CLIENT_ID` | Yes | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Yes | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | Yes | User refresh token |
| `PORT` | No | Server port (default: 3001) |
| `MCP_COMMAND` | No | MCP endpoint URL override |
| `ENABLE_NLP` | No | Enable NLP features (default: false) |

## 📊 Monitoring

Access real-time stats at `GET /stats`:

```json
{
  "billing": {
    "totalEvents": 42,
    "eventsByType": {
      "tool-request": 42
    },
    "recentEvents": [ /* last 10 events */ ]
  },
  "cache": {
    "search": { "size": 15, "maxSize": 50 },
    "recommend": { "size": 8, "maxSize": 50 }
  }
}
```

## 🧪 Testing

Use the included `examples.http` file with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension.

Or use curl/PowerShell:

```pwsh
# Search
Invoke-RestMethod -Method Post -Uri http://localhost:3001/mcp -ContentType 'application/json' -Body '{"tool":"search-track","input":{"query":"Beatles"}}'

# Recommend
Invoke-RestMethod -Method Post -Uri http://localhost:3001/mcp -ContentType 'application/json' -Body '{"tool":"recommend","input":{"seedGenres":["rock"]}}'

# Create playlist
Invoke-RestMethod -Method Post -Uri http://localhost:3001/mcp -ContentType 'application/json' -Body '{"tool":"create-playlist","input":{"name":"Test Playlist","trackUris":[]}}'
```

## 🐛 Troubleshooting

### TypeScript errors about missing modules

Run `npm install` to install all dependencies including type definitions.

### "Spotify authentication failed"

- Verify your `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`
- Ensure your refresh token hasn't expired (they typically don't expire)
- Check that your Spotify app has the correct redirect URIs configured

### "Actor.charge failed"

This is expected when running locally (outside Apify platform). The warning is logged but won't affect functionality.

### Cache not working

- Cache is in-memory and resets on server restart
- Check cache stats at `GET /stats`
- Cached responses expire after TTL (5 min for search, 10 min for recommend)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! This is a working MCP server ready for production use on Apify.

## 🔗 Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Apify Platform Documentation](https://docs.apify.com/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)

---

Built with ❤️ for the Apify Platform
