import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	try {
		const { data, error: dbErr } = await locals.supabase
			.from('packages')
			.select('*')
			.order('sort_order', { ascending: true });
		if (dbErr) throw error(500, dbErr.message);
		return {
			packages: data ?? []
		};
	} catch (e) {
		console.error('Error loading packages:', e);
		return { packages: [] };
	}
}
