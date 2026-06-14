/**
 * API Service Layer — Altertech Website
 *
 * Thin wrappers over the SvelteKit backend (src/routes/api/**), backed by
 * Supabase. Every function keeps the same signature the components already
 * use, so no UI changes are needed.
 */

/**
 * Parse a JSON response, throwing the server's error message on failure.
 * @param {Response} res
 */
async function handle(res) {
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || body.message || `Request gagal (${res.status})`);
	}
	return res.json();
}

/** @param {string} url */
const getJSON = (url) => fetch(url).then(handle);

/**
 * @param {string} url
 * @param {string} method
 * @param {Object} body
 */
const sendJSON = (url, method, body) =>
	fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	}).then(handle);

/* ============================================================
   PUBLIC ENDPOINTS
   ============================================================ */

/**
 * Fetch all pricing packages
 * @returns {Promise<Array>}
 */
export async function fetchPackages() {
	return getJSON('/api/packages');
}

/**
 * Fetch public portfolio items (non-confidential)
 * @returns {Promise<Array>}
 */
export async function fetchPortfolio() {
	return getJSON('/api/portfolio');
}

/**
 * Fetch portfolio preview (latest 4 items)
 * @returns {Promise<Array>}
 */
export async function fetchPortfolioPreview() {
	return getJSON('/api/portfolio?limit=4');
}

/**
 * Track project by invoice code.
 * Only returns: project_name, current_stage, progress_percent (or null).
 * @param {string} invoiceCode
 * @returns {Promise<{project_name: string, current_stage: string, progress_percent: number} | null>}
 */
export async function trackProject(invoiceCode) {
	return getJSON(`/api/projects/track?invoice=${encodeURIComponent(invoiceCode.trim())}`);
}

/* ============================================================
   ADMIN ENDPOINTS — Auth
   ============================================================ */

/**
 * Admin login via Supabase Auth (session stored in http-only cookies).
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: {name: string, email: string}, error?: string}>}
 */
export async function login(email, password) {
	const res = await fetch('/api/admin/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});
	// Backend returns a structured { success, ... } body on both 200 and 401.
	return res.json().catch(() => ({ success: false, error: 'Terjadi kesalahan.' }));
}

/** Sign out and clear the session cookies. */
export async function logout() {
	await fetch('/api/admin/logout', { method: 'POST' });
}

/* ============================================================
   ADMIN ENDPOINTS — Dashboard
   ============================================================ */

/**
 * Fetch dashboard summary
 * @returns {Promise<Object>}
 */
export async function fetchDashboard() {
	return getJSON('/api/admin/dashboard');
}

/* ============================================================
   ADMIN ENDPOINTS — Media Upload
   ============================================================ */

/**
 * Upload an image file to Supabase Storage and return its public URL.
 * @param {File} file
 * @returns {Promise<string>} public URL of the uploaded image
 */
export async function uploadImage(file) {
	const form = new FormData();
	form.append('file', file);
	const { url } = await fetch('/api/admin/upload', { method: 'POST', body: form }).then(handle);
	return url;
}

/* ============================================================
   ADMIN ENDPOINTS — Financial Report
   ============================================================ */

/**
 * Fetch full business financial report
 * @returns {Promise<Object>}
 */
export async function fetchFinancialReport() {
	return getJSON('/api/admin/financial-report');
}

/* ============================================================
   ADMIN ENDPOINTS — Projects CRUD
   ============================================================ */

/**
 * Fetch all projects
 * @returns {Promise<Array>}
 */
export async function fetchProjects() {
	return getJSON('/api/admin/projects');
}

/**
 * Create a new project
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function createProject(data) {
	return sendJSON('/api/admin/projects', 'POST', data);
}

/**
 * Update an existing project
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
export async function updateProject(id, data) {
	return sendJSON(`/api/admin/projects/${id}`, 'PATCH', data);
}

/**
 * Delete a project
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteProject(id) {
	const { success } = await sendJSON(`/api/admin/projects/${id}`, 'DELETE', {});
	return !!success;
}

/* ============================================================
   ADMIN ENDPOINTS — Portfolio CRUD
   ============================================================ */

/**
 * Fetch all portfolio items (including confidential)
 * @returns {Promise<Array>}
 */
export async function fetchAllPortfolio() {
	return getJSON('/api/admin/portfolio');
}

/**
 * Create portfolio item
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function createPortfolioItem(data) {
	return sendJSON('/api/admin/portfolio', 'POST', data);
}

/**
 * Update portfolio item
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
export async function updatePortfolioItem(id, data) {
	return sendJSON(`/api/admin/portfolio/${id}`, 'PATCH', data);
}

/**
 * Delete portfolio item
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deletePortfolioItem(id) {
	const { success } = await sendJSON(`/api/admin/portfolio/${id}`, 'DELETE', {});
	return !!success;
}

/**
 * Publish a completed project as a portfolio item.
 * @param {string} projectId
 * @param {{ isConfidential: boolean, screenshotUrl: string }} options
 * @returns {Promise<{success: boolean, item?: Object, error?: string}>}
 */
export async function publishProjectToPortfolio(projectId, { isConfidential, screenshotUrl }) {
	const res = await fetch(`/api/admin/projects/${projectId}/publish`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ isConfidential, screenshotUrl })
	});
	return res.json().catch(() => ({ success: false, error: 'Terjadi kesalahan.' }));
}

/* ============================================================
   ADMIN ENDPOINTS — Packages CRUD
   ============================================================ */

/**
 * Fetch all packages (admin)
 * @returns {Promise<Array>}
 */
export async function fetchAllPackages() {
	return getJSON('/api/admin/packages');
}

/**
 * Update package
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
export async function updatePackage(id, data) {
	return sendJSON(`/api/admin/packages/${id}`, 'PATCH', data);
}
