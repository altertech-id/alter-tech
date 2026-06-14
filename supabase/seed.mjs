/**
 * Seed script — run ONCE after applying migrations.
 *
 *   node --env-file=.env supabase/seed.mjs
 *
 * Requires in .env (or shell env):
 *   PUBLIC_SUPABASE_URL          - your project URL
 *   SUPABASE_SERVICE_ROLE_KEY    - service_role secret (bypasses RLS)
 *   ADMIN_EMAIL / ADMIN_PASSWORD - the admin login you want to create
 *
 * Optional:
 *   SEED_DEMO_PROJECTS=true      - also insert the 5 demo projects so the
 *                                  tracking + finance flows have sample data.
 *
 * Idempotent: clears and re-inserts content tables on each run.
 */
import { createClient } from '@supabase/supabase-js';
import { MOCK_PACKAGES, MOCK_PORTFOLIO_ITEMS, MOCK_PROJECTS } from '../src/lib/data/mock.js';

const url = process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error('✗ Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

/** Strip the mock string ids — let Postgres generate real uuids. */
const stripId = ({ id, ...rest }) => rest;

async function seedAdmin() {
  if (!adminEmail || !adminPassword) {
    console.log('• Skipping admin user (set ADMIN_EMAIL + ADMIN_PASSWORD to create one).');
    return;
  }
  const { error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { name: 'Altertech Admin' }
  });
  if (error && !/already.+registered|exists/i.test(error.message)) throw error;
  console.log(error ? `• Admin user already exists: ${adminEmail}` : `✓ Created admin user: ${adminEmail}`);
}

async function seedPackages() {
  await supabase.from('packages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const rows = MOCK_PACKAGES.map(stripId);
  const { error } = await supabase.from('packages').insert(rows);
  if (error) throw error;
  console.log(`✓ Seeded ${rows.length} packages`);
}

async function seedPortfolio() {
  // Demo projects are seeded first (below) when enabled; portfolio here is the
  // standalone master list, independent of projects.
  await supabase.from('portfolio_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const rows = MOCK_PORTFOLIO_ITEMS.map(stripId);
  const { error } = await supabase.from('portfolio_items').insert(rows);
  if (error) throw error;
  console.log(`✓ Seeded ${rows.length} portfolio items`);
}

async function seedDemoProjects() {
  if (process.env.SEED_DEMO_PROJECTS !== 'true') {
    console.log('• Skipping demo projects (set SEED_DEMO_PROJECTS=true to include them).');
    return;
  }
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  for (const p of MOCK_PROJECTS) {
    const { id, costs, ...project } = p;
    const { data, error } = await supabase.from('projects').insert(project).select('id').single();
    if (error) throw error;
    if (costs?.length) {
      const costRows = costs.map(({ id: _id, ...c }) => ({ ...c, project_id: data.id }));
      const { error: ce } = await supabase.from('project_costs').insert(costRows);
      if (ce) throw ce;
    }
  }
  console.log(`✓ Seeded ${MOCK_PROJECTS.length} demo projects`);
}

try {
  await seedAdmin();
  await seedPackages();
  await seedPortfolio();
  await seedDemoProjects();
  console.log('\n✓ Seed complete.');
} catch (err) {
  console.error('\n✗ Seed failed:', err.message);
  process.exit(1);
}
