import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	try {
		const { data, error: dbErr } = await locals.supabase
			.from('portfolio_items')
			.select('*')
			.eq('is_confidential', false)
			.order('sort_order', { ascending: true });
		if (dbErr) throw error(500, dbErr.message);
		return {
			items: data ?? []
		};
	} catch (e) {
		console.error('Error loading portfolio:', e);
		return { items: [] };
	}
}
