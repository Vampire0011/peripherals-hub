# PeripheralsHub

A production-ready mouse & keyboard aggregator: dark, gamer-aesthetic storefront with OAuth auth, wishlists, an automated price-ingestion engine, and an admin sync console.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) · Tailwind CSS · shadcn/ui-style components · lucide-react
- **Backend**: Next.js Server Actions & Route Handlers · Prisma ORM
- **Auth**: Auth.js (NextAuth v5) — Google + GitHub OAuth, database sessions
- **DB**: SQLite locally, drop-in Postgres for production
- **Ingestion**: Mock feed simulator (default, instant) + Playwright headless scraper (opt-in)

## Project Structure
```
peripherals-hub/
├── prisma/
│   ├── schema.prisma        # User/Account/Session + Product/Wishlist/PriceHistory/SyncLog
│   └── seed.ts               # Seeds 6 peripherals + demo admin
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage (Hero + Grid)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── dashboard/page.tsx # Protected: profile + wishlist
│   │   ├── admin/page.tsx     # Protected (ADMIN): live sync console
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       └── admin/logs/route.ts
│   ├── components/            # navbar, hero, product-card, product-grid, admin-console, ui/*
│   ├── lib/
│   │   ├── engine/             # mockSource.ts, playwrightSource.ts, upsertProduct.ts, syncEngine.ts
│   │   ├── actions/             # products.ts, admin.ts (Server Actions)
│   │   ├── affiliate.ts         # localizeAffiliateLink()
│   │   ├── priceTrend.ts        # computePriceTrend()
│   │   └── prisma.ts
│   ├── auth.ts                 # NextAuth v5 config
│   └── middleware.ts           # Route protection for /admin & /dashboard
└── .env.example
```

## 1. Install
```bash
npm install
```
> Requires Prisma 6.2+ (SQLite enum support), already pinned in `package.json`.

## 2. Configure environment
```bash
cp .env.example .env
```
Fill in `.env`:

| Variable | How to get it |
|---|---|
| `AUTH_SECRET` | Run `npx auth secret` (or any long random string) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials). Create an OAuth Client (Web app). Redirect URI: `http://localhost:3000/api/auth/callback/google` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers). Callback URL: `http://localhost:3000/api/auth/callback/github` |
| `ADMIN_EMAILS` | Your sign-in email(s); auto-promoted to admin |
| `CRON_SECRET` | Any random string; secures `/api/cron/sync` |
| `DATABASE_URL` | Defaults to `file:./dev.db` (SQLite). See Postgres migration below. |

## 3. Set up the database
```bash
npm run db:push     # creates SQLite schema
npm run db:seed      # loads 6 peripherals + a demo admin row
```

## 4. Run the app
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Making yourself Admin
Set `ADMIN_EMAILS="you@example.com"` in `.env` (comma-separated). Whoever signs in with a matching email is promoted to `ADMIN` automatically, and the **Admin** link appears in the navbar. The role is re-read from the database on every server request, so changes apply without re-login. (You can also edit the `role` column in `npx prisma studio`.)

## Using the Ingestion Engine
- **Mock mode (default, instant)**: Go to `/admin` → **Run Sync Now**. This pulls from `src/lib/engine/mockSource.ts`, which simulates a live feed with jittered prices, then dedupes against existing `Product.sku` values — updating price/history on match, inserting new rows otherwise. All activity streams into the **Live Sync Console**.
- **Playwright mode (real scraping)**: pick "Playwright scraper" in the admin panel, or set `SYNC_MODE=playwright`. Define targets in `.env` as a JSON array in `SCRAPE_TARGETS` (see `.env.example`). Extraction reads schema.org JSON-LD, then OpenGraph/product meta tags. If Playwright is unavailable or returns nothing, the engine **automatically falls back to the mock feed** and logs a warning. Standalone:
  ```bash
  npx playwright install chromium
  SYNC_MODE=playwright npm run sync:mock
  ```

## Monetization
- `localizeAffiliateLink(url, country)` in `src/lib/affiliate.ts` appends country-specific affiliate tags (`AFFILIATE_TAG_US`, `AFFILIATE_TAG_UK`, `AFFILIATE_TAG_IN`, falling back to `AFFILIATE_TAG_DEFAULT`) to every outbound "Buy Now" link.
- `computePriceTrend()` in `src/lib/priceTrend.ts` compares current price to the historical average and drives the "📉 X% Price Drop" badge on product cards.

## Affiliate links
Cards link to `/go/<id>`, a server route that applies `localizeAffiliateLink()` using the visitor's country (from `x-vercel-ip-country` / `cf-ipcountry`) and 307-redirects. Tags are set via `AFFILIATE_TAG_*` env vars.

## Docker (PostgreSQL) and CI
```bash
cp .env.example .env      # fill in auth values
docker compose up --build  # app on :3000, Postgres 16 alongside
docker compose exec app npx prisma db push   # first run only
```
`.github/workflows/ci.yml` runs generate, typecheck, lint and build on every push. `vercel.json` schedules `/api/cron/sync` every 6 hours.

## Migrating to PostgreSQL
Quick way: `npm run db:use-postgres` (reverse with `node scripts/use-postgres.mjs --sqlite`). Manual way:

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL="postgresql://user:pass@host:5432/dbname"` in `.env`.
3. Run `npx prisma migrate dev --name init` (instead of `db push`) to generate a proper migration history, then `npm run db:seed`.

No application code changes are required — Prisma abstracts the rest.

## Deployment Notes
- Set all `.env` values as environment variables in your host (Vercel, Railway, Fly.io, etc.).
- Update OAuth redirect URIs in Google/GitHub consoles to your production domain.
- If deploying serverless (e.g. Vercel), Playwright scraping should run in a separate worker/cron process (e.g. a scheduled GitHub Action or a small Node worker) rather than inside a serverless function, due to browser binary size/cold-start constraints. The mock engine works fine inline.

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build && npm start` | Production build/serve |
| `npm run db:push` | Sync Prisma schema to DB |
| `npm run db:seed` | Seed demo catalog + admin |
| `npm run db:studio` | Open Prisma Studio |
| `npm run sync:mock` | Run the ingestion engine from the CLI |
