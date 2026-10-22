import { json, error } from '@sveltejs/kit';
import { getProjectWithCosts, replaceCosts } from '$lib/server/db.js';
import { upsertLocalProject, deleteLocalProject } from '$lib/server/local-db.js';

const FIELDS = [
	'project_name',
	'client_name',
	'client_pic',
	'client_contact',
	'current_stage',
	'progress_percent',
	'notes',
	'package_type',
	'deal_amount',
	'payment_status',
	'published_to_portfolio',
	'domain_url',
	'domain_bought_at',
	'domain_duration_years',
	'domain_price',
	'has_maintenance',
	'maintenance_fee',
	'maintenance_due_date'
];

const pick = (body) => {
	const out = Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));
	if ('deal_amount' in out) out.deal_amount = Number(out.deal_amount) || 0;
	if ('domain_duration_years' in out) out.domain_duration_years = Number(out.domain_duration_years) || 1;
	if ('domain_price' in out) out.domain_price = Number(out.domain_price) || 0;
	if ('has_maintenance' in out) out.has_maintenance = Boolean(out.has_maintenance);
	if ('maintenance_fee' in out) out.maintenance_fee = Number(out.maintenance_fee) || 0;
	if ('domain_bought_at' in out && !out.domain_bought_at) out.domain_bought_at = null;
	if ('maintenance_due_date' in out && !out.maintenance_due_date) out.maintenance_due_date = null;
	return out;
};

/** PATCH /api/admin/projects/:id — update fields + replace costs. */
export async function PATCH({ params, request, locals }) {
	try {
		const body = await request.json();
		const updates = pick(body);

		// If Klien = PIC, ensure client_pic follows client_name if not specified
		if (updates.client_name && !updates.client_pic) {
			updates.client_pic = updates.client_name;
		}

		if (Array.isArray(body.costs)) {
			updates.costs = body.costs;
		}

		// In development: persist to local store for offline/migration-free testing
		let localSaved = null;
		if (import.meta.env.DEV) {
			localSaved = upsertLocalProject(params.id, updates, body);
		}

		// Sync to Supabase
		if (Object.keys(updates).length > 0) {
			const dbUpdates = { ...updates };
			delete dbUpdates.costs;
			const { error: upErr } = await locals.supabase
				.from('projects')
				.update(dbUpdates)
				.eq('id', params.id);
			if (upErr) {
				if (import.meta.env.DEV) {
					console.warn('[Sync] Supabase update bypassed in dev:', upErr.message);
				} else {
					throw error(500, upErr.message);
				}
			}
		}

		// Only touch costs in Supabase when the client sent them
		if (Array.isArray(body.costs)) {
			try {
				await replaceCosts(locals.supabase, params.id, body.costs);
			} catch (costErr) {
				if (import.meta.env.DEV) {
					console.warn('[Sync] Supabase replaceCosts bypassed in dev:', costErr.message);
				} else {
					throw costErr;
				}
			}
		}

		const project = await getProjectWithCosts(locals.supabase, params.id);
		return json(project || localSaved);
	} catch (e) {
		if (e.status) throw e;
		throw error(500, e.message);
	}
}

/** DELETE /api/admin/projects/:id — costs cascade via FK. */
export async function DELETE({ params, locals }) {
	if (import.meta.env.DEV) {
		deleteLocalProject(params.id);
	}
	const { error: delErr } = await locals.supabase.from('projects').delete().eq('id', params.id);
	if (delErr) {
		if (import.meta.env.DEV) {
			console.warn('[Sync] Supabase delete warning in dev:', delErr.message);
		} else {
			throw error(500, delErr.message);
		}
	}
	return json({ success: true });
}
