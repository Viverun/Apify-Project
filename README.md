PlaylistifyPlaylistify# 🎵 Playlistify AI# Apify Spotify MCP Actor



AI-powered Spotify playlist creatorAI-powered Spotify playlist creator.**AI-powered Spotify playlist creator with natural language understanding**A production-ready Model Context Protocol (MCP) server for Spotify, deployable on the Apify platform. This Actor exposes an HTTP endpoint that AI clients can use to search tracks, get recommendations, and create playlists via natural language.



FeaturesFeaturesCreate unique, personalized Spotify playlists using natural language descriptions. Powered by Apify Actor platform and Spotify Web API.## 🎯 Features

- Search tracks

- Get recommendations  - Search Spotify tracks---- **MCP-Compatible HTTP Server** - Exposes `/mcp` endpoint for AI tool calls

- Create playlists

- Natural language support- Get AI recommendations



Setup- Create playlists with natural language- **Three Core Tools**:

1. Get credentials from https://developer.spotify.com/dashboard

2. Add to Apify input- Fast caching and rate limiting

3. Run

## ✨ Features - `search-track` - Search Spotify catalog by keyword

API

POST /mcp - Main endpointSetup

GET /health - Status

GET /stats - Statistics- `recommend` - Get personalized recommendations using seeds



Usage1. Get Spotify credentials from https://developer.spotify.com/dashboard

Search: {"tool":"search-track","input":{"query":"happy"}}

Recommend: {"tool":"recommend","input":{"seedGenres":["pop"]}}2. Add Client ID, Client Secret, and Refresh Token to Apify input- **🔍 Smart Search**: Search Spotify's catalog with intelligent filtering - `create-playlist` - Create playlists and add tracks

Create: {"tool":"create-playlist","input":{"name":"My Playlist","trackUris":[]}}

3. Run the Actor

- **🎯 AI Recommendations**: Get personalized track recommendations- **Advanced Capabilities**:

API Endpoints

- **🎨 Natural Language**: Describe your mood or activity in plain English - ✅ Automatic Spotify access token refresh

GET / - Landing page

GET /health - Health check- **⚡ Lightning Fast**: Optimized caching and rate limiting - ✅ Response caching (LRU cache with TTL)

GET /stats - Statistics

POST /mcp - Main API endpoint- **✅ Auto-Create Playlists**: Instantly save playlists to your Spotify account - ✅ NLP enhancement for natural language playlist descriptions

Usage - ✅ Request validation and error handling

Search tracks:--- - ✅ Billing integration with `Actor.charge()`

{

"tool": "search-track",- ✅ Structured logging with `log.info()`

"input": {"query": "happy", "limit": 10}

}## 🚀 Quick Start - ✅ TypeScript with full type safety

Get recommendations:### Option 1: Use on Apify Platform (Recommended)## 🚀 Quick Start

{

"tool": "recommend",1. **Visit**: [https://console.apify.com/actors/wealthy_rhinoceros~playlistify-ai](https://console.apify.com/actors/wealthy_rhinoceros~playlistify-ai)### Prerequisites

"input": {"nlpIntent": "workout", "limit": 20}

}2. **Run**: Click "Try for free" or "Start"

Create playlist:3. **Access**: Use the Standby URL for API access1. **Spotify Developer Account**

{

"tool": "create-playlist", - Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

"input": {

    "name": "My Playlist",### Option 2: Run Locally - Note your Client ID and Client Secret

    "trackUris": ["spotify:track:..."]

}- Get a refresh token (see "Getting Refresh Token" below)

}

````bash

# Clone the repository### Local Development

git clone https://github.com/avanishkasar/Apify-Project.git

cd Apify-Project1. **Install dependencies**:

```pwsh

# Install dependenciesnpm install

npm install```



# Set environment variables2. **Set environment variables** (PowerShell):

export SPOTIFY_CLIENT_ID="your_client_id"```pwsh

export SPOTIFY_CLIENT_SECRET="your_client_secret"$env:SPOTIFY_CLIENT_ID = 'your_client_id'

export SPOTIFY_REFRESH_TOKEN="your_refresh_token"$env:SPOTIFY_CLIENT_SECRET = 'your_client_secret'

$env:SPOTIFY_REFRESH_TOKEN = 'your_refresh_token'

# Build and run$env:ENABLE_NLP = 'true'  # Optional: enable natural language processing

npm run build```

npm start

```3. **Start the server**:

```pwsh

---npm run start

````

## 🔑 Getting Spotify Credentials

4. **Test the endpoints**:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)```pwsh

1. Create a new app# Health check

1. Copy Client ID and Client Secretcurl http://localhost:3001/

1. Add redirect URI: `http://localhost:3000/callback`

1. Get refresh token using OAuth flow# Search tracks

curl -X POST http://localhost:3001/mcp -H "Content-Type: application/json" -d '{\"tool\":\"search-track\",\"input\":{\"query\":\"Nirvana\"}}'

---```

## 📡 API EndpointsSee `examples.http` for more request examples.

### Health Check## 📡 API Reference

````http

GET /api### POST /mcp

GET /health

```Main MCP endpoint for tool invocations.



Returns server status and available endpoints.**Request Format:**

```json

### Statistics{

```http  "tool": "search-track" | "recommend" | "create-playlist",

GET /stats  "input": { /* tool-specific parameters */ }

```}

````

Returns performance metrics, cache stats, and uptime.

**Response Format:**

### MCP Endpoint (Main API)```json

````http{

POST /mcp  "status": "success" | "error",

Content-Type: application/json  "data": { /* tool-specific response */ },

  "message": "error message if status=error",

{  "timestamp": "2025-11-08T12:00:00.000Z"

  "tool": "search-track" | "recommend" | "create-playlist",}

  "input": { ... }```

}

```### Tool: `search-track`



#### Search TracksSearch for tracks on Spotify.

```json

{**Input:**

  "tool": "search-track",```json

  "input": {{

    "query": "happy upbeat music",  "query": "artist or song name",

    "limit": 10  "limit": 20  // optional, default 20

  }}

}```

````

**Response Data:**

#### Get Recommendations```json

````json{

{  "tracks": [

  "tool": "recommend",    {

  "input": {      "id": "track_id",

    "seedTracks": ["spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"],      "name": "Track Name",

    "seedGenres": ["pop", "rock"],      "artists": [{ "id": "artist_id", "name": "Artist Name" }],

    "limit": 20,      "album": { "id": "album_id", "name": "Album Name" },

    "nlpIntent": "workout motivation"      "uri": "spotify:track:...",

  }      "external_urls": { "spotify": "https://..." },

}      "duration_ms": 180000

```    }

  ],

#### Create Playlist  "count": 20

```json}

{```

  "tool": "create-playlist",

  "input": {### Tool: `recommend`

    "name": "My Awesome Playlist",

    "description": "Created with Playlistify AI",Get track recommendations based on seeds.

    "trackUris": ["spotify:track:..."],

    "isPublic": true**Input:**

  }```json

}{

```  "seedArtists": ["artist_id1", "artist_id2"],  // optional, max 5

  "seedGenres": ["rock", "indie"],              // optional, max 5

---  "seedTracks": ["track_id1"],                  // optional, max 5

  "description": "mellow morning music",        // optional, uses NLP if ENABLE_NLP=true

## 🎨 Natural Language Processing  "limit": 20                                   // optional, default 20

}

Describe your mood or activity, and Playlistify AI translates it to Spotify parameters:```



- **Moods**: happy, sad, energetic, calm, angry, romantic, melancholic, excited, peaceful**Response Data:**

- **Activities**: workout, study, party, sleep, relax, focus, dance```json

{

**Example**:  "tracks": [ /* same format as search-track */ ],

```json  "count": 20,

{  "seeds": { /* seeds used for recommendations */ }

  "tool": "recommend",}

  "input": {```

    "nlpIntent": "energetic workout music",

    "limit": 20### Tool: `create-playlist`

  }

}Create a new Spotify playlist and optionally add tracks.

````

**Input:**

---```json

{

## 🏗️ Architecture "name": "Playlist Name",

"description": "Optional description", // optional

- **Runtime**: Node.js 20 (Alpine Linux) "trackUris": ["spotify:track:...", "..."], // array of Spotify track URIs

- **Language**: TypeScript 4.9.5 "userId": "spotify_user_id", // optional, auto-detected if omitted

- **Framework**: Express.js 4.18.2 "public": false // optional, default false

- **Platform**: Apify Actor (Docker)}

- **API**: Spotify Web API (OAuth 2.0)```

- **Caching**: LRU Cache (5-10 min TTL)

- **Rate Limiting**: Token bucket (100 tokens, 10/sec refill)**Response Data:**

````json

---{

  "playlist": {

## 📦 Project Structure    "id": "playlist_id",

    "name": "Playlist Name",

```    "description": "Description",

.    "uri": "spotify:playlist:...",

├── src/    "external_urls": { "spotify": "https://..." },

│   ├── main.ts              # Express server & MCP routing    "trackCount": 10

│   ├── spotifyHandler.ts    # Spotify API integration  }

│   ├── nlpHelper.ts         # Natural language processing}

│   ├── cache.ts             # LRU caching layer```

│   ├── rateLimiter.ts       # Rate limiting

│   └── types.ts             # TypeScript definitions### GET /

├── public/

│   └── index.html           # Landing pageHealth check endpoint.

├── .actor/

│   ├── actor.json           # Apify Actor config### GET /stats

│   └── INPUT_SCHEMA.json    # Input form schema

├── Dockerfile               # Container configurationReturns billing and cache statistics.

└── package.json             # Dependencies

```## 🔐 Getting Spotify Refresh Token



---To get a refresh token:



## 🔧 Configuration1. Use the [Spotify Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

2. Or use a tool like [spotify-token-generator](https://github.com/your-username/spotify-token-generator)

### Environment Variables3. Request the following scopes:

   - `playlist-modify-private`

| Variable | Description | Required |   - `playlist-modify-public`

|----------|-------------|----------|   - `user-read-private`

| `SPOTIFY_CLIENT_ID` | Spotify app client ID | ✅ Yes |

| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret | ✅ Yes |Quick method using curl:

| `SPOTIFY_REFRESH_TOKEN` | OAuth refresh token | ✅ Yes |

| `PORT` | Server port (default: 3001) | ❌ No |```pwsh

| `APIFY_CONTAINER_PORT` | Apify container port | ❌ No |# 1. Get authorization code (open in browser)

| `ENABLE_NLP` | Enable NLP features (default: true) | ❌ No |https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:8888/callback&scope=playlist-modify-private%20playlist-modify-public%20user-read-private



### Apify Input Schema# 2. Exchange code for tokens

$code = "authorization_code_from_callback"

When running on Apify, configure via the Input UI:$authHeader = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("YOUR_CLIENT_ID:YOUR_CLIENT_SECRET"))



- **spotifyClientId**: Your Spotify client ID (secret)curl -X POST https://accounts.spotify.com/api/token `

- **spotifyClientSecret**: Your Spotify client secret (secret)  -H "Authorization: Basic $authHeader" `

- **spotifyRefreshToken**: Your refresh token (secret)  -H "Content-Type: application/x-www-form-urlencoded" `

- **enableNLP**: Enable natural language processing (default: true)  -d "grant_type=authorization_code&code=$code&redirect_uri=http://localhost:8888/callback"

- **port**: Server port (default: 3001)```



---## 🧠 NLP Enhancement



## 🧪 TestingWhen `ENABLE_NLP=true`, the `recommend` tool can interpret natural language descriptions:



```bash```json

# Health check{

curl http://localhost:3001/health  "tool": "recommend",

  "input": {

# Stats    "description": "energetic workout music"

curl http://localhost:3001/stats  }

}

# Search```

curl -X POST http://localhost:3001/mcp \

  -H "Content-Type: application/json" \The NLP parser will:

  -d '{"tool":"search-track","input":{"query":"happy","limit":5}}'- Detect mood keywords (happy, sad, energetic, calm, etc.)

- Detect activity keywords (workout, study, party, sleep, etc.)

# Recommendations- Map them to appropriate Spotify genres

curl -X POST http://localhost:3001/mcp \- Use as `seedGenres` for recommendations

  -H "Content-Type: application/json" \

  -d '{"tool":"recommend","input":{"nlpIntent":"workout","limit":10}}'Supported moods: happy, sad, energetic, calm, mellow, romantic, party, focus, workout

````

Supported activities: morning, night, workout, study, party, sleep, driving

---

## 📦 Deployment on Apify

## 📊 Performance

1. **Create a new Actor** in Apify Console

- **Cache Hit Rate**: 70-80% (typical)2. **Set environment variables** in Actor settings:

- **Response Time**: <100ms (cached), <500ms (API) - `SPOTIFY_CLIENT_ID`

- **Rate Limit**: 100 requests/10 seconds per client - `SPOTIFY_CLIENT_SECRET`

- **Uptime**: 99.9% (Apify platform) - `SPOTIFY_REFRESH_TOKEN`

  - `ENABLE_NLP` (optional, set to `true`)

---3. **Upload/link your code** to the Actor

4. **Build** the Actor

## 🛠️ Development5. **Run** in standby mode

````bashThe Actor will expose an HTTP endpoint at:

# Install dependencies```

npm installhttps://YOUR_ACTOR.apify.actor/mcp

````

# Build TypeScript

npm run build## 🏗️ Project Structure

# Run in development```

npm run devapify-spotify-mcp/

├── src/

# Lint code│ ├── main.ts # Express server & MCP routing

npm run lint│ ├── spotifyHandler.ts # Spotify API integration

│ ├── cache.ts # LRU cache implementation

# Format code│ ├── nlpHelper.ts # Natural language processing

npm run format│ ├── billing.ts # Billing/charging logic

````│ └── types.ts             # TypeScript interfaces

├── package.json

---├── tsconfig.json

├── examples.http            # HTTP request examples

## 🐳 Docker├── .gitignore

└── README.md

```bash```

# Build image

docker build -t playlistify-ai .## 🔧 Configuration



# Run container### Environment Variables

docker run -p 3001:4000 \

  -e SPOTIFY_CLIENT_ID=your_id \| Variable | Required | Description |

  -e SPOTIFY_CLIENT_SECRET=your_secret \|----------|----------|-------------|

  -e SPOTIFY_REFRESH_TOKEN=your_token \| `SPOTIFY_CLIENT_ID` | Yes | Spotify app client ID |

  playlistify-ai| `SPOTIFY_CLIENT_SECRET` | Yes | Spotify app client secret |

```| `SPOTIFY_REFRESH_TOKEN` | Yes | User refresh token |

| `PORT` | No | Server port (default: 3001) |

---| `MCP_COMMAND` | No | MCP endpoint URL override |

| `ENABLE_NLP` | No | Enable NLP features (default: false) |

## 📝 License

## 📊 Monitoring

MIT License - see LICENSE file for details

Access real-time stats at `GET /stats`:

---

```json

## 🤝 Contributing{

  "billing": {

Contributions are welcome! Please feel free to submit a Pull Request.    "totalEvents": 42,

    "eventsByType": {

---      "tool-request": 42

    },

## 📧 Support    "recentEvents": [ /* last 10 events */ ]

  },

- **GitHub Issues**: [Report bugs or request features](https://github.com/avanishkasar/Apify-Project/issues)  "cache": {

- **Apify Console**: [View Actor on Apify](https://console.apify.com/actors/wealthy_rhinoceros~playlistify-ai)    "search": { "size": 15, "maxSize": 50 },

    "recommend": { "size": 8, "maxSize": 50 }

---  }

}

## 🎉 Credits```



Built with:## 🧪 Testing

- [Apify Platform](https://apify.com)

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)Use the included `examples.http` file with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension.

- [Express.js](https://expressjs.com)

- [TypeScript](https://www.typescriptlang.org)Or use curl/PowerShell:



---```pwsh

# Search

**Made with ❤️ for music lovers**Invoke-RestMethod -Method Post -Uri http://localhost:3001/mcp -ContentType 'application/json' -Body '{"tool":"search-track","input":{"query":"Beatles"}}'


# Recommend
Invoke-RestMethod -Method Post -Uri http://localhost:3001/mcp -ContentType 'application/json' -Body '{"tool":"recommend","input":{"seedGenres":["rock"]}}'

# Create playlist
Invoke-RestMethod -Method Post -Uri http://localhost:3001/mcp -ContentType 'application/json' -Body '{"tool":"create-playlist","input":{"name":"Test Playlist","trackUris":[]}}'
````

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
