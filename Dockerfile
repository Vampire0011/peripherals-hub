# Production image. Uses PostgreSQL: the schema provider is switched at build time.
FROM node:20-bookworm-slim AS deps
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

FROM deps AS build
COPY . .
RUN node scripts/use-postgres.mjs && npx prisma generate
ENV AUTH_SECRET=build-only DATABASE_URL=postgresql://x:x@localhost:5432/x
RUN npm run build

FROM node:20-bookworm-slim AS run
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
