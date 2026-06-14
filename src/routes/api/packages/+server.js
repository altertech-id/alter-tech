import { json, error } from '@sveltejs/kit';

/** GET /api/packages — public pricing packages, ordered. */
export async function GET({ locals }) {
	const { data, error: dbError } = await locals.supabase
		.from('packages')
		.select('*')
		.order('sort_order', { ascending: true });
	if (dbError) throw error(500, dbError.message);
	return json(data ?? []);
}
