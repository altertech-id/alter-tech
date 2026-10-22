-- Altertech — Migration 0003: Add client PIC, domain tracking, and maintenance renewal fields

alter table public.projects
  add column if not exists client_pic text,
  add column if not exists client_contact text,
  add column if not exists domain_url text,
  add column if not exists domain_bought_at date default current_date,
  add column if not exists domain_duration_years int not null default 1,
  add column if not exists domain_price bigint not null default 150000,
  add column if not exists has_maintenance boolean not null default false,
  add column if not exists maintenance_fee bigint not null default 0,
  add column if not exists maintenance_due_date date;

-- Automatically initialize domain_bought_at from started_at if null
update public.projects
set domain_bought_at = started_at
where domain_bought_at is null and started_at is not null;
