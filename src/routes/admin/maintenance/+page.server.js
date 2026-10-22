import { listProjectsWithCosts } from '$lib/server/db.js';

export async function load({ locals }) {
	try {
		const projects = await listProjectsWithCosts(locals.supabase);
		return {
			projects: projects ?? []
		};
	} catch (e) {
		console.error('Error loading maintenance data:', e);
		return { projects: [] };
	}
}
