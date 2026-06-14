/**
 * Shared server-side data helpers.
 * All take a request-scoped Supabase client (event.locals.supabase) so RLS
 * applies under the logged-in admin's session.
 */

const PROJECT_WITH_COSTS = '*, costs:project_costs(*)';

/** Throw a tidy error if Supabase returned one. */
function check(error, msg) {
	if (error) throw new Error(`${msg}: ${error.message}`);
}

/** List all projects, each with its nested `costs` array (newest first). */
export async function listProjectsWithCosts(supabase) {
	const { data, error } = await supabase
		.from('projects')
		.select(PROJECT_WITH_COSTS)
		.order('updated_at', { ascending: false });
	check(error, 'Gagal memuat projects');
	return data ?? [];
}

/** Fetch one project with costs. */
export async function getProjectWithCosts(supabase, id) {
	const { data, error } = await supabase
		.from('projects')
		.select(PROJECT_WITH_COSTS)
		.eq('id', id)
		.maybeSingle();
	check(error, 'Gagal memuat project');
	return data;
}

/** Replace a project's cost rows with the supplied list. */
export async function replaceCosts(supabase, projectId, costs) {
	const { error: delErr } = await supabase.from('project_costs').delete().eq('project_id', projectId);
	check(delErr, 'Gagal menghapus biaya lama');
	if (!Array.isArray(costs) || costs.length === 0) return;
	const rows = costs.map((c) => ({
		project_id: projectId,
		label: c.label ?? '',
		amount: Number(c.amount) || 0,
		cost_type: c.cost_type ?? 'other'
	}));
	const { error: insErr } = await supabase.from('project_costs').insert(rows);
	check(insErr, 'Gagal menyimpan biaya');
}

/** Generate the next unique invoice code: ALT-{year}-{NNN}. */
export async function nextInvoiceCode(supabase) {
	const { count, error } = await supabase
		.from('projects')
		.select('id', { count: 'exact', head: true });
	check(error, 'Gagal menghitung invoice');
	const seq = String((count ?? 0) + 1).padStart(3, '0');
	return `ALT-${new Date().getFullYear()}-${seq}`;
}
