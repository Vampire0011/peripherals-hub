# 🖱️⌨️ PeripheralsHub

A dark, gamer-styled **mouse & keyboard aggregator** with OAuth login, saved favorites, price-drop tracking, affiliate link localization, and an automated ingestion engine with a live admin console.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple)

## ✨ Features

- **Storefront**: responsive 4-column grid of mice and keyboards with live client-side filters (category, connection) and sorting.
- **Product cards**: image, title, price, platform, a prominent **Buy Now** button, and a ❤️ to save favorites. Outbound links open with `target="_blank"` and `rel="noopener noreferrer"`.
- **Auth**: Google and GitHub sign-in (Auth.js v5), protected `/dashboard`, and an admin-only `/admin`.
- **Price trends**: price history is stored per product; cards show a 📉 **X% Price Drop** badge when the price is below the historical average.
- **Affiliate monetization**: `localizeAffiliateLink(url, country)` appends country-specific tags, applied server-side through a `/go/[id]` redirect.
- **Ingestion engine** (`src/lib/engine/`): mock feed for instant testing, Playwright scraper for real pages (auto-falls back to mock), SKU-based deduplication (update price or create new).
- **Admin console**: trigger syncs and watch created/updated products stream into a live log.

## 🧰 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, shadcn/ui-style components, Lucide icons |
| Backend | Server Actions, Route Handlers, Prisma ORM |
| Auth | Auth.js (NextAuth v5), Google + GitHub, JWT sessions |
| Database | SQLite locally → PostgreSQL in production |
| Scraping | Playwright (headless) + mock feed |

## 🚀 Quick Start

```bash
git clone https://github.com/Vampire0011/peripherals-hub.git
cd peripherals-hub
npm install
cp .env.example .env        # then fill in the values below
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Open <http://localhost:3000>.

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | Session signing key. Generate with `npx auth secret` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Redirect URI: `http://localhost:3000/api/auth/callback/google` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | [GitHub OAuth Apps](https://github.com/settings/developers). Callback URL: `http://localhost:3000/api/auth/callback/github` |
| `ADMIN_EMAILS` | Comma-separated emails auto-promoted to admin on sign-in |
| `DATABASE_URL` | `file:./dev.db` (SQLite) or a PostgreSQL URI |
| `AFFILIATE_TAG_DEFAULT`, `_US`, `_UK`, `_IN` | Affiliate tracking IDs by country |
| `SYNC_MODE` | `mock` (default) or `playwright` |
| `SCRAPE_TARGETS` | JSON array of pages for the Playwright scraper (see `.env.example`) |
| `CRON_SECRET` | Secures `GET /api/cron/sync` |

> Never commit `.env`. It is already in `.gitignore`.

## 👑 Becoming Admin

Put your sign-in email in `ADMIN_EMAILS`, restart the server, and sign in. The **Admin** link appears in the navbar and `/admin` unlocks.

## 🔄 Ingestion Engine

1. Go to `/admin` and choose **Mock feed** or **Playwright scraper**.
2. Click **Run Sync Now**.
3. Watch the console. Existing SKUs get a price update and a new price-history row; unknown SKUs are created.

The first mock sync creates two products that aren't in the seed, so you'll see both "Created" and "Updated" lines.

For real scraping:

```bash
npx playwright install chromium
```

Then set `SCRAPE_TARGETS` in `.env`. Extraction reads schema.org JSON-LD and OpenGraph tags. If the scraper fails or returns nothing, the engine falls back to the mock feed and logs a warning.

Run a sync from the CLI or a scheduler:

```bash
npm run sync:mock
```

## 🗂️ Project Structure

```
├── prisma/            schema.prisma, seed.ts
├── public/products/   product artwork (SVG)
├── scripts/           use-postgres.mjs
├── src/
│   ├── app/           pages: /, /login, /signup, /dashboard, /admin, /go/[id], /api/*
│   ├── components/    navbar, hero, product-card, product-grid, admin-console, ui/*
│   ├── lib/
│   │   ├── engine/    mockSource, playwrightSource, upsertProduct, syncEngine
│   │   ├── actions/   products.ts, admin.ts (Server Actions)
│   │   ├── affiliate.ts, priceTrend.ts, prisma.ts, utils.ts
│   ├── auth.ts, auth.config.ts, middleware.ts
│   └── types/
├── Dockerfile, docker-compose.yml, vercel.json
└── .github/workflows/ci.yml
```

## 🐘 PostgreSQL

```bash
npm run db:use-postgres     # switches the Prisma provider
# set DATABASE_URL="postgresql://user:pass@host:5432/db"
npx prisma migrate dev --name init
npm run db:seed
```

Switch back with `node scripts/use-postgres.mjs --sqlite`.

## 🐳 Docker

```bash
cp .env.example .env
docker compose up --build
docker compose exec app npx prisma db push    # first run only
```

## ☁️ Deployment

- Set all `.env` values as environment variables on your host.
- Update the Google/GitHub OAuth redirect URLs to your production domain.
- `vercel.json` schedules `/api/cron/sync` every 6 hours (Vercel sends `CRON_SECRET` automatically).
- Run Playwright scraping in a separate worker or scheduled job, not inside a serverless function.

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply the Prisma schema |
| `npm run db:seed` | Load the 6 starter peripherals |
| `npm run db:studio` | Open Prisma Studio |
| `npm run sync:mock` | Run the ingestion engine from the CLI |

## 🛠️ Troubleshooting

- **`@prisma/client did not initialize yet`**: run `npx prisma generate`.
- **OAuth `redirect_uri_mismatch`**: the callback URL in Google/GitHub must match exactly, including the port.
- **Can't open `/admin`**: confirm your email is in `ADMIN_EMAILS`, then sign out and back in.
- **No price-drop badges yet**: run a few syncs. The badge needs history that is higher than the current price.

## 📄 License

MIT. Add a `LICENSE` file if you plan to publish.
