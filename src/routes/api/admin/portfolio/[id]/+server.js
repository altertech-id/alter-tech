import { json, error } from '@sveltejs/kit';

const FIELDS = ['name', 'description', 'screenshot_url', 'website_url', 'is_confidential', 'sort_order', 'source_project_id'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));

/** PATCH /api/admin/portfolio/:id */
export async function PATCH({ params, request, locals }) {
	const body = await request.json();
	const { data, error: dbErr } = await locals.supabase
		.from('portfolio_items')
		.update(pick(body))
		.eq('id', params.id)
		.select('*')
		.maybeSingle();
	if (dbErr) throw error(500, dbErr.message);
	if (!data) throw error(404, 'Item portfolio tidak ditemukan.');
	return json(data);
}

/** DELETE /api/admin/portfolio/:id */
export async function DELETE({ params, locals }) {
	const { error: dbErr } = await locals.supabase.from('portfolio_items').delete().eq('id', params.id);
	if (dbErr) throw error(500, dbErr.message);
	return json({ success: true });
}
