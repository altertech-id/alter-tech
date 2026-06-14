import { json, error } from '@sveltejs/kit';
import { getSupabaseAdmin } from '$lib/server/supabaseAdmin.js';
import { rateLimit } from '$lib/server/rateLimit.js';

/**
 * GET /api/projects/track?invoice=ALT-2025-001
 *
 * Public, no auth. Returns ONLY { project_name, current_stage, progress_percent }
 * — no client data is ever exposed (PRD §7.6). Rate limited to 10 req/min/IP.
 * Responds 200 with `null` when not found (matches the frontend contract).
 */
export async function GET({ url, getClientAddress }) {
	const ip = getClientAddress();
	if (!rateLimit(`track:${ip}`, 10, 60_000)) {
		throw error(429, 'Terlalu banyak permintaan. Coba lagi sebentar.');
	}

	const invoice = (url.searchParams.get('invoice') ?? '').trim();
	if (!invoice) return json(null);

	const { data, error: dbError } = await getSupabaseAdmin()
		.from('projects')
		.select('project_name, current_stage, progress_percent')
		.ilike('invoice_code', invoice)
		.maybeSingle();

	if (dbError) throw error(500, dbError.message);
	return json(data ?? null);
}
