FROM node:21-alpine AS builder
WORKDIR /app

# Copy shared types required by admin-ui
COPY shared/ ./shared/

# Install dependencies
COPY admin-ui/package*.json ./admin-ui/
WORKDIR /app/admin-ui
RUN npm ci

# Copy source and build — use vite directly to skip tsc pre-check
COPY admin-ui/ .
RUN npx vite build

# ---- Production image ----
FROM nginx:alpine

COPY --from=builder /app/admin-ui/dist /usr/share/nginx/html
COPY admin-ui/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
