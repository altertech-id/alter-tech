import { json, error } from '@sveltejs/kit';
import { listProjectsWithCosts, getProjectWithCosts, replaceCosts, nextInvoiceCode } from '$lib/server/db.js';

/** Allowed project columns accepted from the client (id/invoice/costs handled separately). */
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

/** GET /api/admin/projects — all projects with nested costs. */
export async function GET({ locals }) {
	try {
		return json(await listProjectsWithCosts(locals.supabase));
	} catch (e) {
		throw error(500, e.message);
	}
}

/** POST /api/admin/projects — create project (auto invoice_code) + costs. */
export async function POST({ request, locals }) {
	try {
		const body = await request.json();
		const insert = { ...pick(body), invoice_code: await nextInvoiceCode(locals.supabase) };

		const { data, error: insErr } = await locals.supabase
			.from('projects')
			.insert(insert)
			.select('id')
			.single();
		if (insErr) throw error(500, insErr.message);

		await replaceCosts(locals.supabase, data.id, body.costs);
		return json(await getProjectWithCosts(locals.supabase, data.id), { status: 201 });
	} catch (e) {
		if (e.status) throw e;
		throw error(500, e.message);
	}
}
