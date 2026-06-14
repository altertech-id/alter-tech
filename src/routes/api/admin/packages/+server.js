import { json, error } from '@sveltejs/kit';

/** GET /api/admin/packages — all packages, ordered. */
export async function GET({ locals }) {
	const { data, error: dbErr } = await locals.supabase
		.from('packages')
		.select('*')
		.order('sort_order', { ascending: true });
	if (dbErr) throw error(500, dbErr.message);
	return json(data ?? []);
}
