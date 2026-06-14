import { json, error } from '@sveltejs/kit';
import { getProjectWithCosts, replaceCosts } from '$lib/server/db.js';

const FIELDS = [
	'project_name',
	'client_name',
	'client_contact',
	'current_stage',
	'progress_percent',
	'notes',
	'package_type',
	'payment_status',
	'published_to_portfolio'
];

const pick = (body) => Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));

/** PATCH /api/admin/projects/:id — update fields + replace costs. */
export async function PATCH({ params, request, locals }) {
	try {
		const body = await request.json();
		const updates = pick(body);

		if (Object.keys(updates).length > 0) {
			const { error: upErr } = await locals.supabase
				.from('projects')
				.update(updates)
				.eq('id', params.id);
			if (upErr) throw error(500, upErr.message);
		}

		// Only touch costs when the client actually sent them.
		if (Array.isArray(body.costs)) {
			await replaceCosts(locals.supabase, params.id, body.costs);
		}

		const project = await getProjectWithCosts(locals.supabase, params.id);
		if (!project) throw error(404, 'Project tidak ditemukan.');
		return json(project);
	} catch (e) {
		if (e.status) throw e;
		throw error(500, e.message);
	}
}

/** DELETE /api/admin/projects/:id — costs cascade via FK. */
export async function DELETE({ params, locals }) {
	const { error: delErr } = await locals.supabase.from('projects').delete().eq('id', params.id);
	if (delErr) throw error(500, delErr.message);
	return json({ success: true });
}
