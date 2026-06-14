import { json, error } from '@sveltejs/kit';

const FIELDS = ['name', 'description', 'screenshot_url', 'website_url', 'is_confidential', 'sort_order', 'source_project_id'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));

/** GET /api/admin/portfolio — all items incl. confidential, ordered. */
export async function GET({ locals }) {
	const { data, error: dbErr } = await locals.supabase
		.from('portfolio_items')
		.select('*')
		.order('sort_order', { ascending: true });
	if (dbErr) throw error(500, dbErr.message);
	return json(data ?? []);
}

/** POST /api/admin/portfolio — create item. */
export async function POST({ request, locals }) {
	const body = await request.json();
	const { data, error: dbErr } = await locals.supabase
		.from('portfolio_items')
		.insert(pick(body))
		.select('*')
		.single();
	if (dbErr) throw error(500, dbErr.message);
	return json(data, { status: 201 });
}
