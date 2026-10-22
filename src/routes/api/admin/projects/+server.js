import { json, error } from '@sveltejs/kit';
import { listProjectsWithCosts, getProjectWithCosts, replaceCosts, nextInvoiceCode } from '$lib/server/db.js';
import { upsertLocalProject } from '$lib/server/local-db.js';

/** Allowed project columns accepted from the client (id/invoice/costs handled separately). */
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
		const invoiceCode = await nextInvoiceCode(locals.supabase).catch((err) => {
			if (import.meta.env.DEV) {
				return `ALT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
			}
			throw err;
		});

		const picked = pick(body);
		if (picked.client_name && !picked.client_pic) {
			picked.client_pic = picked.client_name;
		}

		const insert = { ...picked, invoice_code: invoiceCode };
		const localId = `prj-local-${Date.now()}`;
		let createdId = localId;

		const { data, error: insErr } = await locals.supabase
			.from('projects')
			.insert(insert)
			.select('id')
			.single();

		if (insErr) {
			if (import.meta.env.DEV) {
				console.warn('[Sync] Supabase project creation bypassed in dev:', insErr.message);
			} else {
				throw error(500, insErr.message);
			}
		} else if (data?.id) {
			createdId = data.id;
			await replaceCosts(locals.supabase, createdId, body.costs);
		}

		let localSaved = null;
		if (import.meta.env.DEV) {
			localSaved = upsertLocalProject(createdId, {
				...insert,
				id: createdId,
				costs: body.costs || []
			});
		}

		const project = await getProjectWithCosts(locals.supabase, createdId);
		return json(project || localSaved, { status: 201 });
	} catch (e) {
		if (e.status) throw e;
		throw error(500, e.message);
	}
}
