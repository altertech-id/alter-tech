import { json, error } from '@sveltejs/kit';

const FIELDS = ['name', 'price', 'renewal_price', 'is_highlighted', 'sort_order', 'features'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));

/** PATCH /api/admin/packages/:id */
export async function PATCH({ params, request, locals }) {
	const body = await request.json();
	const { data, error: dbErr } = await locals.supabase
		.from('packages')
		.update(pick(body))
		.eq('id', params.id)
		.select('*')
		.maybeSingle();
	if (dbErr) throw error(500, dbErr.message);
	if (!data) throw error(404, 'Paket tidak ditemukan.');
	return json(data);
}
