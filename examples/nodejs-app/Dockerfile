# ⚠️ Demo Dockerfile — has intentional issues for security tools to find.
# In production, follow https://docs.docker.com/develop/dev-best-practices/

# Issue 1 (Checkov CKV_DOCKER_2): No HEALTHCHECK defined
# Issue 2 (Checkov CKV_DOCKER_3): Running as root by default

FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/index.js"]

# Production fixes (commented out — uncomment to fix the findings):
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1