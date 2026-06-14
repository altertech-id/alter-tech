import { json, error } from '@sveltejs/kit';

/**
 * GET /api/portfolio[?limit=N]
 * Public, non-confidential portfolio items ordered by sort_order.
 */
export async function GET({ url, locals }) {
	let query = locals.supabase
		.from('portfolio_items')
		.select('*')
		.eq('is_confidential', false)
		.order('sort_order', { ascending: true });

	const limit = Number(url.searchParams.get('limit'));
	if (Number.isFinite(limit) && limit > 0) query = query.limit(limit);

	const { data, error: dbError } = await query;
	if (dbError) throw error(500, dbError.message);
	return json(data ?? []);
}
