# FullStack Commerce Hub

A full-stack e-commerce platform built as a portfolio piece: a Next.js storefront, a React admin dashboard, and an Express/MongoDB backend, all running together via Docker Compose. It began life as a real project for a Greek coffee shop and has been neutralized (branding, secrets, infrastructure details) for public display.

## Architecture

```
┌────────────────┐      ┌────────────────┐      ┌──────────────────┐
│  customer-ui    │      │   admin-ui     │      │      mongo        │
│  Next.js :4000  │      │  React/Vite    │      │   MongoDB :27017  │
│  storefront     │      │  :3000 (nginx) │      │                    │
└───────┬────────┘      └───────┬────────┘      └─────────┬─────────┘
        │                       │                          │
        └──────────────┬────────┘                          │
                        ▼                                   │
              ┌──────────────────┐                          │
              │       api         │◄─────────────────────────┘
              │  Express :8000    │
              │  REST + WebSocket │
              └──────────────────┘
```

- **`customer-ui/`** — Next.js 14 storefront: product browsing, cart, checkout, Stripe payments, i18n (EN/EL)
- **`admin-ui/`** — React/Vite admin dashboard for managing products, categories, orders, and users
- **`services/`** — Express/TypeScript API: MongoDB persistence, JWT auth, WebSocket order notifications, Stripe, transactional email
- **`shared/`** — TypeScript interfaces and constants shared across all three apps

## Key features

- JWT auth (cookie-based) with separate customer and admin roles
- Product catalog with categories, ingredients, and configurable options
- Cart, checkout, and Stripe payment flow
- Real-time order notifications over WebSocket
- Delivery zone selection via Google Maps
- Full EN/EL internationalization
- Dockerized end-to-end: one command brings up the database, API, and both frontends

## Tech stack

React · Next.js · TypeScript · Express · MongoDB · Mongoose · Redux Toolkit · Ant Design · Stripe · WebSockets · Docker

## Running locally

Requires Docker and Docker Compose.

```bash
docker compose up --build
```

This starts:

| Service       | URL                     |
|---------------|-------------------------|
| Customer store| http://localhost:4000   |
| Admin panel   | http://localhost:3000   |
| API           | http://localhost:8000   |
| MongoDB       | localhost:27017         |

The database starts empty. Seed it with sample categories, products, and a default admin account:

```bash
docker compose exec api node dist/services/seed.js
```

This creates a default admin login (`admin@commerce-hub.local` / `ChangeMe123!` — override via `SEED_ADMIN_EMAIL`/`SEED_ADMIN_USERNAME`/`SEED_ADMIN_PASSWORD` env vars). The seed is idempotent, so it's safe to re-run.

### Running without Docker

Each app can also be run independently for development:

```bash
cd services && npm install && npm run build && npm start
cd customer-ui && npm install && npm run dev
cd admin-ui && npm install && npm run dev
```

You'll need a local or remote MongoDB instance and the environment variables described in `docker-compose.yml` and `customer-ui/.env.sample`.

## Project structure

```
admin-ui/     admin-facing React application
customer-ui/  customer-facing Next.js application
services/     Express API, MongoDB models, business logic
shared/       shared TypeScript interfaces and constants
```

## Portfolio note

This repository is a cleaned-up, neutralized version of a real production project. All client branding, credentials, infrastructure details, and personal data have been replaced with placeholders; the code and architecture are otherwise unchanged.
