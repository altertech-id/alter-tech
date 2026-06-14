import { json } from '@sveltejs/kit';

/**
 * POST /api/admin/projects/:id/publish  { isConfidential, screenshotUrl }
 * Publishes a completed project as a portfolio item. Mirrors the original
 * guards: project must be Closing + Lunas, not already published, photo required.
 * Returns { success, item? } | { success:false, error }.
 */
export async function POST({ params, request, locals }) {
	const { isConfidential = false, screenshotUrl } = await request.json().catch(() => ({}));

	const { data: project, error: pErr } = await locals.supabase
		.from('projects')
		.select('id, project_name, client_name, current_stage, payment_status, published_to_portfolio')
		.eq('id', params.id)
		.maybeSingle();

	if (pErr) return json({ success: false, error: pErr.message }, { status: 500 });
	if (!project) return json({ success: false, error: 'Project tidak ditemukan.' }, { status: 404 });
	if (project.current_stage !== 'Closing' || project.payment_status !== 'Lunas') {
		return json({ success: false, error: 'Hanya project Closing & Lunas yang bisa dipublikasikan.' }, { status: 400 });
	}
	if (project.published_to_portfolio) {
		return json({ success: false, error: 'Project ini sudah ada di portfolio.' }, { status: 400 });
	}
	if (!screenshotUrl) {
		return json({ success: false, error: 'Foto wajib diunggah.' }, { status: 400 });
	}

	// Next sort_order = current max + 1.
	const { data: top } = await locals.supabase
		.from('portfolio_items')
		.select('sort_order')
		.order('sort_order', { ascending: false })
		.limit(1)
		.maybeSingle();
	const nextSort = (top?.sort_order ?? 0) + 1;

	const description = isConfidential
		? `Internal project untuk ${project.client_name}.`
		: `Website ${project.project_name} untuk ${project.client_name}.`;

	const { data: item, error: insErr } = await locals.supabase
		.from('portfolio_items')
		.insert({
			name: project.project_name,
			description,
			screenshot_url: screenshotUrl,
			website_url: '',
			is_confidential: isConfidential,
			sort_order: nextSort,
			source_project_id: project.id
		})
		.select('*')
		.single();
	if (insErr) return json({ success: false, error: insErr.message }, { status: 500 });

	const { error: upErr } = await locals.supabase
		.from('projects')
		.update({ published_to_portfolio: true })
		.eq('id', project.id);
	if (upErr) return json({ success: false, error: upErr.message }, { status: 500 });

	return json({ success: true, item });
}
