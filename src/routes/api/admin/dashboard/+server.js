import { json, error } from '@sveltejs/kit';
import { listProjectsWithCosts } from '$lib/server/db.js';
import { computeMonthly } from '$lib/server/finance.js';

/** GET /api/admin/dashboard — summary cards + recent projects. */
export async function GET({ locals }) {
	try {
		const [projects, { data: packages, error: pkgErr }] = await Promise.all([
			listProjectsWithCosts(locals.supabase),
			locals.supabase.from('packages').select('name, price')
		]);
		if (pkgErr) throw error(500, pkgErr.message);

		const priceOf = (type) => packages?.find((p) => p.name === type)?.price ?? 0;

		const totalRevenue = projects.reduce((sum, p) => sum + priceOf(p.package_type), 0);
		const totalExpense = projects.reduce(
			(sum, p) => sum + (p.costs ?? []).reduce((cs, c) => cs + c.amount, 0),
			0
		);

		return json({
			activeProjects: projects.filter((p) => p.current_stage !== 'Closing').length,
			completedProjects: projects.filter((p) => p.current_stage === 'Closing').length,
			totalProjects: projects.length,
			totalRevenue,
			totalExpense,
			netProfit: totalRevenue - totalExpense,
			monthlyData: computeMonthly(projects, priceOf),
			recentProjects: projects.slice(0, 5)
		});
	} catch (e) {
		throw error(500, e.message);
	}
}
