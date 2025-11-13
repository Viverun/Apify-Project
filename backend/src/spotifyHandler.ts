import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyCredentials, SpotifyTrack, MCPResponse } from "./types";

interface TokenCache {
  [key: string]: {
    token: string;
    expiresAt: number;
  };
}

const tokenCache: TokenCache = {};

async function ensureAccessToken(credentials: SpotifyCredentials): Promise<string> {
  const cacheKey = `${credentials.clientId}:${credentials.refreshToken}`;
  const cached = tokenCache[cacheKey];

  // Use cached token if not expired (with 60 second buffer)
  if (cached && Date.now() < cached.expiresAt - 60000) {
    console.log("✅ Using cached access token");
    return cached.token;
  }

  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
      refreshToken: credentials.refreshToken,
    });

    console.log("🔑 Refreshing Spotify access token...");
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body["access_token"];
    const expiresIn = data.body["expires_in"] || 3600;

    // Cache the token
    tokenCache[cacheKey] = {
      token: accessToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    console.log("✅ Spotify access token refreshed");
    return accessToken;
  } catch (err: any) {
    console.error("❌ Failed to refresh Spotify access token:", err?.message);
    throw new Error(`Spotify authentication failed: ${err?.message || "Unknown error"}`);
  }
}

/**
 * Search for tracks on Spotify
 */
export async function searchTracks(
  credentials: SpotifyCredentials,
  query: string,
  limit = 20
): Promise<MCPResponse> {
  try {
    if (!query || query.trim().length === 0) {
      return {
        status: "error",
        message: "Query parameter is required and cannot be empty",
      };
    }

    const accessToken = await ensureAccessToken(credentials);
    const spotifyApi = new SpotifyWebApi({
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
    });
    spotifyApi.setAccessToken(accessToken);

    const res = await spotifyApi.searchTracks(query, { limit });
    const items = res.body.tracks?.items || [];

    const tracks: SpotifyTrack[] = items.map((t: any) => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map((a: any) => ({ id: a.id, name: a.name })),
      album: { id: t.album.id, name: t.album.name, images: t.album.images },
      uri: t.uri,
      external_urls: t.external_urls,
      duration_ms: t.duration_ms,
      preview_url: t.preview_url,
    }));

    console.log(`✅ Search completed: ${tracks.length} tracks found`);

    return {
      status: "success",
      data: { tracks, count: tracks.length },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error("❌ Search tracks failed:", err?.message);
    return {
      status: "error",
      message: `Search failed: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Get track recommendations
 */
export async function getRecommendations(
  credentials: SpotifyCredentials,
  seedArtists?: string[],
  seedGenres?: string[],
  seedTracks?: string[],
  limit = 20
): Promise<MCPResponse> {
  try {
    const accessToken = await ensureAccessToken(credentials);
    const spotifyApi = new SpotifyWebApi({
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
    });
    spotifyApi.setAccessToken(accessToken);

    const params: any = { limit };
    if (seedArtists && seedArtists.length) params.seed_artists = seedArtists.slice(0, 5);
    if (seedGenres && seedGenres.length) params.seed_genres = seedGenres.slice(0, 5);
    if (seedTracks && seedTracks.length) params.seed_tracks = seedTracks.slice(0, 5);

    // Spotify requires at least one seed
    if (!params.seed_artists && !params.seed_genres && !params.seed_tracks) {
      params.seed_genres = ["pop"];
      console.log("⚠️ No seeds provided, defaulting to pop genre");
    }

    const res = await spotifyApi.getRecommendations(params);
    const tracks: SpotifyTrack[] = (res.body.tracks || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map((a: any) => ({ id: a.id, name: a.name })),
      album: { id: t.album.id, name: t.album.name, images: t.album.images },
      uri: t.uri,
      external_urls: t.external_urls,
      duration_ms: t.duration_ms,
      preview_url: t.preview_url,
    }));

    console.log(`✅ Recommendations completed: ${tracks.length} tracks`);

    return {
      status: "success",
      data: { tracks, count: tracks.length, seeds: params },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error("❌ Get recommendations failed:", err?.message);
    return {
      status: "error",
      message: `Recommendations failed: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Create a playlist and optionally add tracks
 */
export async function createPlaylist(
  credentials: SpotifyCredentials,
  name: string,
  description: string,
  trackUris: string[],
  isPublic = false
): Promise<MCPResponse> {
  try {
    if (!name || name.trim().length === 0) {
      return {
        status: "error",
        message: "Playlist name is required and cannot be empty",
      };
    }

    const accessToken = await ensureAccessToken(credentials);
    const spotifyApi = new SpotifyWebApi({
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
    });
    spotifyApi.setAccessToken(accessToken);

    // Create playlist (auto-detects current user)
    const createRes = await spotifyApi.createPlaylist(name, {
      description: description || `Created via Playlistify on ${new Date().toLocaleDateString()}`,
      public: isPublic,
    });

    const playlist = createRes.body;
    console.log(`✅ Playlist created: ${playlist.name} (ID: ${playlist.id})`);

    // Add tracks if provided
    if (trackUris && trackUris.length > 0) {
      // Spotify API accepts up to 100 tracks per request
      const chunks: string[][] = [];
      for (let i = 0; i < trackUris.length; i += 100) {
        chunks.push(trackUris.slice(i, i + 100));
      }

      for (const chunk of chunks) {
        await spotifyApi.addTracksToPlaylist(playlist.id, chunk);
      }

      console.log(`✅ Added ${trackUris.length} tracks to playlist`);
    }

    return {
      status: "success",
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          uri: playlist.uri,
          external_urls: playlist.external_urls,
          trackCount: trackUris.length,
        },
      },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error("❌ Create playlist failed:", err?.message);
    return {
      status: "error",
      message: `Create playlist failed: ${err?.message || String(err)}`,
    };
  }
}

export default { searchTracks, getRecommendations, createPlaylist };
