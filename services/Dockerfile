FROM node:21-alpine AS builder
WORKDIR /app

# Copy shared types required by services
COPY shared/ ./shared/

# Install dependencies
COPY services/package*.json ./services/
WORKDIR /app/services
RUN npm ci

# Copy source and build
COPY services/ .
RUN npm run build

# ---- Production image ----
FROM node:21-alpine
WORKDIR /app/services

COPY --from=builder /app/services/dist ./dist
COPY --from=builder /app/services/node_modules ./node_modules

EXPOSE 8000
CMD ["node", "dist/services/express-server/server.js"]
