# ── Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# PUBLIC_* env must be present at build time (SvelteKit inlines a fallback).
# They can be overridden at runtime since we use $env/dynamic/public.
RUN npm run build && npm prune --production

# ── Runtime stage ───────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "build"]
