import { listProjectsWithCosts } from '$lib/server/db.js';
import { computeReport, computeMonthly } from '$lib/server/finance.js';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	try {
		const [projects, { data: packages, error: pkgErr }] = await Promise.all([
			listProjectsWithCosts(locals.supabase),
			locals.supabase.from('packages').select('name, price')
		]);
		if (pkgErr) throw error(500, pkgErr.message);

		const priceOf = (type) => packages?.find((p) => p.name === type)?.price ?? 0;
		const report = computeReport(projects, priceOf);
		const monthlyData = computeMonthly(projects, priceOf).map((m) => ({
			...m,
			profit: m.revenue - m.expense
		}));

		return {
			report: { ...report, monthlyData }
		};
	} catch (e) {
		console.error('Error loading financial report:', e);
		return { report: null };
	}
}
