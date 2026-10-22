-- Altertech — Add deal_amount to projects table
-- Allows recording custom project deal fees rather than only relying on package defaults.

alter table public.projects
  add column if not exists deal_amount bigint not null default 0;

-- Backfill deal_amount for existing projects from packages price
update public.projects p
set deal_amount = coalesce(pkg.price, 0)
from public.packages pkg
where p.package_type = pkg.name and (p.deal_amount is null or p.deal_amount = 0);
