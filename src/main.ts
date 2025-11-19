import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Actor, log } from "apify";
import spotifyHandler from "./spotifyHandler";
import { chargeForEvent } from "./billing";
import { parsePlaylistIntent } from "./nlpHelper";
import { globalRateLimiter } from "./rateLimiter";
import { MCPRequest, MCPResponse } from "./types";

// Local MCP endpoint used by AI clients to call this server
export const MCP_COMMAND =
  process.env.MCP_COMMAND || "http://localhost:3001/mcp";

// Use APIFY_CONTAINER_PORT for Standby mode, fallback to PORT or 3001
const PORT = Number(
  process.env.APIFY_CONTAINER_PORT || process.env.PORT || 3001
);
const ENABLE_NLP = process.env.ENABLE_NLP === "true";

/**
 * Validate MCP request structure
 */
function validateMCPRequest(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  if (!body.tool || typeof body.tool !== "string") {
    return { valid: false, error: 'Missing or invalid "tool" field' };
  }

  const validTools = ["search-track", "recommend", "create-playlist"];
  if (!validTools.includes(body.tool)) {
    return {
      valid: false,
      error: `Invalid tool. Must be one of: ${validTools.join(", ")}`,
    };
  }

  if (!body.input || typeof body.input !== "object") {
    return { valid: false, error: 'Missing or invalid "input" field' };
  }

  return { valid: true };
}

/**
 * Initialize and start the MCP server
 */
async function start(): Promise<void> {
  // Initialize Apify and get input
  await Actor.init();
  const input = await Actor.getInput<{
    spotifyClientId?: string;
    spotifyClientSecret?: string;
    spotifyRefreshToken?: string;
    enableNLP?: boolean;
    port?: number;
  }>();




  // In Standby mode, Apify sets environment variables directly from task input
  // Prefer environment variables if they exist, otherwise use input
  const clientId = process.env.SPOTIFY_CLIENT_ID || input?.spotifyClientId;
  const clientSecret =
    process.env.SPOTIFY_CLIENT_SECRET || input?.spotifyClientSecret;
  const refreshToken =
    process.env.SPOTIFY_REFRESH_TOKEN || input?.spotifyRefreshToken;

  // Set environment variables for the application
  if (clientId) {
    process.env.SPOTIFY_CLIENT_ID = clientId;
  }
  if (clientSecret) {
    process.env.SPOTIFY_CLIENT_SECRET = clientSecret;
  }
  if (refreshToken) {
    process.env.SPOTIFY_REFRESH_TOKEN = refreshToken;
  }
  if (input?.enableNLP !== undefined) {
    process.env.ENABLE_NLP = String(input.enableNLP);
  }
  if (input?.port) {
    process.env.PORT = String(input.port);
  }

  log.info("Apify Actor initialized", {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasRefreshToken: !!refreshToken,
    enableNLP: input?.enableNLP ?? true,
    port: input?.port ?? 3001,
    source: process.env.SPOTIFY_CLIENT_ID ? "env" : "input",
  });

  const app = express();

  // Middleware
  app.use(bodyParser.json({ limit: "10mb" }));

  // Serve static landing page
  app.use(express.static("public"));

  // API endpoint - return JSON for /api or accept header
  app.get("/api", (_req: Request, res: Response) => {
    res.json({
      status: "healthy",
      service: "Playlistify",
      version: "0.1.0",
      endpoints: {
        mcp: "/mcp",
        health: "/api",
        stats: "/stats",
        landing: "/",
      },
    });
  });

  // Health check endpoint (for backwards compatibility and health checks)
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "healthy",
      service: "Playlistify",
      version: "0.1.0",
    });
  });

  // Stats endpoint
  app.get("/stats", async (_req: Request, res: Response) => {
    const { getBillingStats } = await import("./billing");
    const { searchCache, recommendCache } = await import("./cache");

    res.json({
      billing: getBillingStats(),
      cache: {
        search: searchCache.getStats(),
        recommend: recommendCache.getStats(),
      },
    });
  });

  /**
   * Main MCP endpoint
   *
   * Expected request format:
   * {
   *   "tool": "search-track" | "recommend" | "create-playlist",
   *   "input": { ... }
   * }
   */
  app.post("/mcp", async (req: Request, res: Response) => {
    const startTime = Date.now();
    const body = req.body as MCPRequest;

    // Rate limiting
    if (!globalRateLimiter.consume(1)) {
      log.warning("Rate limit exceeded for request");
      return res.status(429).json({
        status: "error",
        message: "Rate limit exceeded. Please try again later.",
      } as MCPResponse);
    }

    // Validate request
    const validation = validateMCPRequest(body);
    if (!validation.valid) {
      log.warning("Invalid MCP request", { error: validation.error, body });
      return res.status(400).json({
        status: "error",
        message: validation.error,
      } as MCPResponse);
    }

    const { tool, input } = body;
    log.info("MCP request received", { tool, input });

    try {
      let result: MCPResponse;

      // Route to appropriate handler
      switch (tool) {
        case "search-track": {
          const query = input.query as string;
          const limit = (input.limit as number) || 20;

          if (
            !query ||
            typeof query !== "string" ||
            query.trim().length === 0
          ) {
            return res.status(400).json({
              status: "error",
              message: 'Missing or invalid "query" parameter in input',
            } as MCPResponse);
          }

          result = await spotifyHandler.searchTracks(query, limit);
          break;
        }

        case "recommend": {
          const { seedArtists, seedGenres, seedTracks, genres, limit } = input;

          // Handle both "genres" and "seedGenres" for flexibility
          let finalGenres = (seedGenres || genres) as string[] | undefined;

          // Optional NLP enhancement for natural language descriptions or genre keywords
          if (ENABLE_NLP && finalGenres && finalGenres.length > 0) {
            // Check if genres need NLP translation (e.g., "workout" -> ["rock", "electronic"])
            const translatedGenres: string[] = [];
            for (const genre of finalGenres) {
              const intent = parsePlaylistIntent(genre);
              if (intent.suggestedSeeds?.genres) {
                translatedGenres.push(...intent.suggestedSeeds.genres);
              } else {
                translatedGenres.push(genre);
              }
            }
            finalGenres = translatedGenres.slice(0, 5); // Max 5 seed genres
            log.info("Translated genres via NLP", {
              original: finalGenres,
              translated: finalGenres,
            });
          }

          // Also support NLP description
          if (
            ENABLE_NLP &&
            input.description &&
            typeof input.description === "string"
          ) {
            const intent = parsePlaylistIntent(input.description);
            log.info("Parsed NLP intent for recommendations", { intent });

            // Use NLP-suggested genres if no explicit seeds provided
            if (!finalGenres && intent.suggestedSeeds?.genres) {
              finalGenres = intent.suggestedSeeds.genres;
            }
          }

          result = await spotifyHandler.getRecommendations(
            seedArtists as string[] | undefined,
            finalGenres,
            seedTracks as string[] | undefined,
            (limit as number) || 20
          );
          break;
        }

        case "create-playlist": {
          const {
            name,
            description,
            trackUris,
            userId,
            public: isPublic,
          } = input;

          if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({
              status: "error",
              message: 'Missing or invalid "name" parameter in input',
            } as MCPResponse);
          }

          if (trackUris !== undefined && !Array.isArray(trackUris)) {
            return res.status(400).json({
              status: "error",
              message:
                '"trackUris" must be an array (or omit for empty playlist)',
            } as MCPResponse);
          }

          result = await spotifyHandler.createPlaylist(
            userId as string | undefined,
            name as string,
            (description as string) || "",
            (trackUris as string[]) || [],
            Boolean(isPublic)
          );
          break;
        }

        default:
          return res.status(400).json({
            status: "error",
            message: `Unknown tool: ${tool}`,
          } as MCPResponse);
      }

      // Charge for successful tool request
      try {
        await chargeForEvent(Actor.charge.bind(Actor), "tool-request", {
          tool,
        });
      } catch (err: any) {
        log.warning(
          "Actor.charge failed (may not be running in Apify environment)",
          {
            error: err?.message || err,
          }
        );
      }

      // Add processing time to response
      const processingTime = Date.now() - startTime;
      if (result.data) {
        result.data.processingTimeMs = processingTime;
      }

      log.info("MCP request completed", {
        tool,
        status: result.status,
        processingTime,
      });
      return res.json(result);
    } catch (err: any) {
      const processingTime = Date.now() - startTime;
      log.error("Unhandled error while processing MCP request", {
        tool,
        error: err?.message || err,
        stack: err?.stack,
        processingTime,
      });

      return res.status(500).json({
        status: "error",
        message: `Internal server error: ${err?.message || String(err)}`,
      } as MCPResponse);
    }
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: "error",
      message: "Endpoint not found. Use POST /mcp for MCP requests.",
    } as MCPResponse);
  });

  // Start server
  return new Promise<void>(() => {
    app.listen(PORT, () => {
      log.info(`MCP server listening on http://localhost:${PORT}/mcp`);
      log.info(`Health check available at http://localhost:${PORT}/`);
      log.info(`Stats available at http://localhost:${PORT}/stats`);
      if (ENABLE_NLP) {
        log.info("NLP enhancement is ENABLED");
      }
      log.info("Server running indefinitely (Standby mode)");
      // Don't resolve - keep running forever
    });
  });
}

// Entry point: start the server when run directly
if (require.main === module) {
  start().catch((err) => {
    log.error("Failed to start MCP server", {
      error: err?.message || err,
      stack: err?.stack,
    });
    process.exit(1);
  });
}

export default start;
