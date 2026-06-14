# Altertech Website Platform

Marketing landing page + lightweight operational admin for Altertech.
**Frontend:** SvelteKit (Svelte 5). **Backend:** SvelteKit server routes (`src/routes/api/**`). **Data/Auth/Storage:** Supabase. **Deploy:** Docker → Dokploy.

See [prd.md](prd.md) for the product spec and [design.md](design.md) for the design system.

---

## 1. Supabase setup (one-time)

1. Create a project at [supabase.com](https://supabase.com) (region **Singapore** for ID latency).
2. **Apply the schema:** Supabase Dashboard → SQL Editor → paste & run [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql). This creates the tables, RLS policies, and the public `portfolio` storage bucket.
3. Grab your keys: Project Settings → **API** → copy `Project URL`, `anon public`, and `service_role`.

## 2. Environment

Copy the template and fill it in:

```sh
cp .env.example .env
```

| Variable | Where | Notes |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Settings → API → Project URL | exposed to browser |
| `PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public | exposed to browser (RLS-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role | **secret, server-only — never commit** |
| `PUBLIC_SITE_URL` | e.g. `https://altertech.id` | canonical URLs |

## 3. Seed (one-time)

Creates the admin login and fills packages + portfolio so the site isn't empty:

```sh
ADMIN_EMAIL=admin@altertech.id ADMIN_PASSWORD='choose-a-strong-one' \
  node --env-file=.env supabase/seed.mjs

# add demo projects too (sample tracking/finance data):
# SEED_DEMO_PROJECTS=true ADMIN_EMAIL=... ADMIN_PASSWORD=... node --env-file=.env supabase/seed.mjs
```

## 4. Develop

```sh
npm install
npm run dev
```

- Public site: <http://localhost:5173>
- Admin: <http://localhost:5173/admin> (log in with the seeded admin)

## 5. Build & run (production)

```sh
npm run build     # adapter-node → ./build
npm start         # node build  (serves on PORT, default 3000)
```

## 6. Deploy to Dokploy

1. Push this repo to GitHub and create a Dokploy **Application** from it (Dockerfile build — [Dockerfile](Dockerfile) is included).
2. Set these **environment variables** in Dokploy (same as `.env`, minus the seed vars):
   `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SITE_URL`.
3. Point your domain at the app and enable HTTPS.
4. In Supabase → Authentication → URL Configuration, add your production domain to the allowed redirect URLs.

> The container listens on port **3000**. Rate limiting on the public tracking endpoint is in-memory, so keep this app to a **single replica** (or move the limiter to a shared store before scaling).

---

## Architecture notes

- **Auth:** Supabase email/password. Sessions live in http-only cookies via `@supabase/ssr` ([src/hooks.server.js](src/hooks.server.js)), which also guards `/admin/**` and `/api/admin/**` server-side.
- **Public tracking** (`/api/projects/track`) uses the service-role key to return only `project_name, current_stage, progress_percent` — no client data leaks — and is rate-limited to 10 req/min/IP.
- **API ↔ UI contract:** all browser calls go through [src/lib/data/api.js](src/lib/data/api.js); each function maps to one route under [src/routes/api/](src/routes/api/).
