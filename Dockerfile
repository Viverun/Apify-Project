# Use Node.js 20 (required by some dependencies)
FROM node:20-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code and public assets
COPY src ./src
COPY public ./public

# Build TypeScript
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Expose port (Apify uses APIFY_CONTAINER_PORT env var, defaults to 4000)
EXPOSE 4000

# Health check (Apify sets APIFY_CONTAINER_PORT, default to 4000 for Standby mode)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.APIFY_CONTAINER_PORT || 4000; require('http').get('http://localhost:' + port + '/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "dist/main.js"]
