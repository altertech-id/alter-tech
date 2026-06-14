/**
 * Finance aggregation shared by the dashboard and financial-report endpoints.
 * Replaces the old hardcoded MOCK_FINANCE_MONTHLY with real per-month buckets
 * derived from each project's `started_at`.
 */

const ID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const expenseOf = (p) => (p.costs ?? []).reduce((sum, c) => sum + c.amount, 0);

/**
 * Bucket revenue/expense by calendar month, chronologically.
 * @param {Array} projects  projects with nested `costs`
 * @param {(packageType: string) => number} priceOf  resolves revenue per project
 * @returns {Array<{month: string, revenue: number, expense: number}>}
 */
export function computeMonthly(projects, priceOf) {
	const currentYear = new Date().getFullYear();
	const buckets = new Map(); // 'YYYY-MM' -> { revenue, expense }

	for (const p of projects) {
		if (!p.started_at) continue;
		const d = new Date(p.started_at);
		if (Number.isNaN(d.getTime())) continue;
		const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
		const bucket = buckets.get(key) ?? { revenue: 0, expense: 0 };
		bucket.revenue += priceOf(p.package_type);
		bucket.expense += expenseOf(p);
		buckets.set(key, bucket);
	}

	return [...buckets.entries()]
		.sort(([a], [b]) => (a < b ? -1 : 1))
		.map(([key, value]) => {
			const [year, monthIdx] = key.split('-').map(Number);
			const label = year === currentYear ? ID_MONTHS[monthIdx] : `${ID_MONTHS[monthIdx]} '${String(year).slice(2)}`;
			return { month: label, revenue: value.revenue, expense: value.expense };
		});
}

/** Per-project profitability rows + totals (financial report). */
export function computeReport(projects, priceOf) {
	const rows = projects.map((p) => {
		const revenue = priceOf(p.package_type);
		const expense = expenseOf(p);
		const profit = revenue - expense;
		return {
			invoice_code: p.invoice_code,
			project_name: p.project_name,
			client_name: p.client_name,
			package_type: p.package_type,
			payment_status: p.payment_status,
			revenue,
			expense,
			profit,
			margin: revenue > 0 ? Math.round((profit / revenue) * 100) : 0
		};
	});

	const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
	const totalExpense = rows.reduce((s, r) => s + r.expense, 0);
	const netProfit = totalRevenue - totalExpense;
	const unpaid = rows.filter((r) => r.payment_status !== 'Lunas');

	return {
		totalRevenue,
		totalExpense,
		netProfit,
		profitMargin: totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0,
		projectCount: rows.length,
		outstanding: unpaid.reduce((s, r) => s + r.revenue, 0),
		unpaidCount: unpaid.length,
		projects: rows
	};
}
