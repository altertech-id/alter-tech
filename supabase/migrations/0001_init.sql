-- Altertech — initial schema, RLS policies, and storage bucket.
-- Maps 1:1 to the field shapes the SvelteKit frontend already expects
-- (see src/lib/data/mock.js) and the PRD §6 ER diagram.
--
-- Admin auth uses Supabase Auth (auth.users) — there is no separate `users`
-- table. Any authenticated user is treated as an Altertech admin.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists public.packages (
  id             uuid primary key default gen_random_uuid(),
  name           text   not null,
  price          bigint not null default 0,        -- IDR
  renewal_price  bigint,                            -- nullable (Custom has none)
  is_highlighted boolean not null default false,
  sort_order     int    not null default 0,
  features       jsonb  not null default '[]'::jsonb  -- [{ name, included }]
);

create table if not exists public.projects (
  id                     uuid primary key default gen_random_uuid(),
  invoice_code           text not null unique,
  project_name           text not null,
  client_name            text,
  client_contact         text,
  current_stage          text not null default 'Kualifikasi'
                           check (current_stage in ('Kualifikasi','Pre-Deal','DP','Produksi','Closing')),
  progress_percent       int  not null default 0 check (progress_percent between 0 and 100),
  notes                  text,
  package_type           text,
  payment_status         text not null default 'Pending'
                           check (payment_status in ('Pending','DP','Lunas')),
  published_to_portfolio boolean not null default false,
  started_at             date not null default current_date,
  updated_at             timestamptz not null default now()
);

create table if not exists public.project_costs (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label      text not null,
  amount     bigint not null default 0,            -- IDR
  cost_type  text not null default 'other'
               check (cost_type in ('developer_fee','domain','hosting','other'))
);
create index if not exists project_costs_project_id_idx on public.project_costs(project_id);

create table if not exists public.portfolio_items (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  screenshot_url    text,
  website_url       text,
  is_confidential   boolean not null default false,
  sort_order        int not null default 0,
  source_project_id uuid references public.projects(id) on delete set null,
  created_at        timestamptz not null default now()
);

-- Keep projects.updated_at fresh on every change.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
--   anon          → public read of marketing content only
--   authenticated → full admin access
--   service_role  → bypasses RLS (used by the tracking endpoint & seeding)
-- ─────────────────────────────────────────────────────────────

alter table public.packages        enable row level security;
alter table public.projects        enable row level security;
alter table public.project_costs   enable row level security;
alter table public.portfolio_items enable row level security;

-- packages: public read, admin write
create policy "packages public read"  on public.packages for select to anon, authenticated using (true);
create policy "packages admin write"  on public.packages for all    to authenticated using (true) with check (true);

-- portfolio: public reads non-confidential; admin reads/writes everything
create policy "portfolio public read" on public.portfolio_items for select to anon using (is_confidential = false);
create policy "portfolio admin all"   on public.portfolio_items for all    to authenticated using (true) with check (true);

-- projects + costs: admin only. Public tracking is served by the backend via
-- the service_role key, exposing only safe columns — never direct table access.
create policy "projects admin all"      on public.projects      for all to authenticated using (true) with check (true);
create policy "project_costs admin all" on public.project_costs for all to authenticated using (true) with check (true);

-- ─────────────────────────────────────────────────────────────
-- Storage: public bucket for portfolio screenshots
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "portfolio storage public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio');

create policy "portfolio storage admin write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio');

create policy "portfolio storage admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio');

create policy "portfolio storage admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio');
