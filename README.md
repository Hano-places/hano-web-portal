# Hano Web

User portal and business portal for the Hano platform.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Runs on **http://localhost:3001** (separate from the landing site on port 3000).

## Features

- **Anonymous browsing** — explore places, menus, and moments without an account
- **Auth gates** — login modal for cart, reviews, moments; redirect for profile/orders
- **User portal** — home, location, wallet, profile, orders, checkout
- **Business portal** — dashboard with mock KPIs, operations queue, onboarding wizard
- **API** — connects to `https://hano-api.onrender.com` (same as mobile app)

## Environment

See `.env.example` for required variables.
