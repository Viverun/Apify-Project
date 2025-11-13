// Type definitions for backend API

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface MCPResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
  timestamp?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: { id: string; name: string; images?: any[] };
  uri: string;
  external_urls: { spotify: string };
  duration_ms: number;
  preview_url?: string | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  external_urls: { spotify: string };
}
