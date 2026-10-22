import { listProjectsWithCosts } from '$lib/server/db.js';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	try {
		const [projects, { data: packages, error: pkgErr }] = await Promise.all([
			listProjectsWithCosts(locals.supabase),
			locals.supabase.from('packages').select('*').order('sort_order', { ascending: true })
		]);
		if (pkgErr) throw error(500, pkgErr.message);

		return {
			projects: projects ?? [],
			packages: packages ?? []
		};
	} catch (e) {
		console.error('Error loading projects:', e);
		return { projects: [], packages: [] };
	}
}
