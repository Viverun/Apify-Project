import express, { Request, Response } from "express";
import cors from "cors";
import spotifyHandler from "./spotifyHandler";

const PORT = Number(process.env.PORT || 3001);

/**
 * Initialize and start the backend server
 */
async function start(): Promise<void> {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "healthy",
      service: "Playlistify Backend",
      version: "0.1.0",
    });
  });

  // Search tracks endpoint
  app.post("/api/search", async (req: Request, res: Response) => {
    try {
      const { query, limit = 20, credentials } = req.body;

      if (!query || typeof query !== "string" || query.trim().length === 0) {
        return res.status(400).json({
          status: "error",
          message: 'Missing or invalid "query" parameter',
        });
      }

      const result = await spotifyHandler.searchTracks(credentials, query, limit);
      return res.json(result);
    } catch (err: any) {
      console.error("Search error:", err);
      return res.status(500).json({
        status: "error",
        message: err?.message || "Search failed",
      });
    }
  });

  // Get recommendations endpoint
  app.post("/api/recommend", async (req: Request, res: Response) => {
    try {
      const { seedArtists, seedGenres, seedTracks, limit = 20, credentials } = req.body;

      const result = await spotifyHandler.getRecommendations(
        credentials,
        seedArtists,
        seedGenres,
        seedTracks,
        limit
      );
      return res.json(result);
    } catch (err: any) {
      console.error("Recommend error:", err);
      return res.status(500).json({
        status: "error",
        message: err?.message || "Recommendations failed",
      });
    }
  });

  // Create playlist endpoint
  app.post("/api/create-playlist", async (req: Request, res: Response) => {
    try {
      const { name, description, trackUris, isPublic = false, credentials } = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          status: "error",
          message: 'Missing or invalid "name" parameter',
        });
      }

      if (trackUris !== undefined && !Array.isArray(trackUris)) {
        return res.status(400).json({
          status: "error",
          message: '"trackUris" must be an array',
        });
      }

      const result = await spotifyHandler.createPlaylist(
        credentials,
        name,
        description || "",
        trackUris || [],
        Boolean(isPublic)
      );
      return res.json(result);
    } catch (err: any) {
      console.error("Create playlist error:", err);
      return res.status(500).json({
        status: "error",
        message: err?.message || "Create playlist failed",
      });
    }
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: "error",
      message: "Endpoint not found",
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`✅ Backend server listening on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Search: POST http://localhost:${PORT}/api/search`);
    console.log(`   Recommend: POST http://localhost:${PORT}/api/recommend`);
    console.log(`   Create Playlist: POST http://localhost:${PORT}/api/create-playlist`);
  });
}

// Entry point
if (require.main === module) {
  start().catch((err) => {
    console.error("Failed to start backend server:", err);
    process.exit(1);
  });
}

export default start;
