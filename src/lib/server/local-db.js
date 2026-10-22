import fs from 'node:fs';
import path from 'node:path';

const LOCAL_FILE = path.resolve(process.cwd(), 'data/local-projects.json');

/** Ensure data directory exists */
function ensureDir() {
	const dir = path.dirname(LOCAL_FILE);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

/** Read projects array from local JSON file */
export function readLocalProjects() {
	try {
		if (!fs.existsSync(LOCAL_FILE)) return null;
		const raw = fs.readFileSync(LOCAL_FILE, 'utf-8');
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : null;
	} catch (e) {
		console.warn('Gagal membaca data/local-projects.json:', e.message);
		return null;
	}
}

/** Write projects array atomically to local JSON file */
export function writeLocalProjects(projects) {
	try {
		ensureDir();
		const tmpFile = `${LOCAL_FILE}.tmp`;
		fs.writeFileSync(tmpFile, JSON.stringify(projects, null, 2), 'utf-8');
		fs.renameSync(tmpFile, LOCAL_FILE);
	} catch (e) {
		console.error('Gagal menulis data/local-projects.json:', e.message);
	}
}

/**
 * Merge remote projects (from Supabase or mock) with local persistent projects.
 * Local edits always win for existing projects, but any new remote projects are preserved.
 */
export function mergeWithLocal(remoteProjects = []) {
	const local = readLocalProjects();
	if (!local) {
		// First time: initialize local store with current remote projects
		if (Array.isArray(remoteProjects) && remoteProjects.length > 0) {
			const normalized = remoteProjects.map((p) => ({
				...p,
				client_pic: p.client_pic || p.client_name || ''
			}));
			writeLocalProjects(normalized);
			return normalized;
		}
		return remoteProjects;
	}

	const localMap = new Map(local.map((p) => [p.id, p]));
	const merged = [];

	// Update or add remote projects
	for (const rem of remoteProjects) {
		if (localMap.has(rem.id)) {
			// Merge: keep local edits, but fill any missing remote attributes
			const loc = localMap.get(rem.id);
			merged.push({
				...rem,
				...loc,
				client_pic: loc.client_pic || loc.client_name || rem.client_name || '',
				// preserve costs array
				costs: loc.costs || rem.costs || []
			});
			localMap.delete(rem.id);
		} else {
			merged.push({
				...rem,
				client_pic: rem.client_pic || rem.client_name || ''
			});
		}
	}

	// Add any purely local projects created during dev
	for (const loc of localMap.values()) {
		merged.push(loc);
	}

	// Sort newest updated first
	merged.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

	writeLocalProjects(merged);
	return merged;
}

/**
 * Get one project by ID from local store.
 */
export function getLocalProjectById(id) {
	const projects = readLocalProjects() || [];
	return projects.find((p) => p.id === id) || null;
}

/**
 * Save or update a project in local store.
 */
export function upsertLocalProject(id, updates, fullFallback = {}) {
	const projects = readLocalProjects() || [];
	const index = projects.findIndex((p) => p.id === id);

	let updatedItem;
	if (index >= 0) {
		const existing = projects[index];
		updatedItem = {
			...existing,
			...updates,
			client_pic: updates.client_pic || updates.client_name || existing.client_pic || existing.client_name || '',
			updated_at: new Date().toISOString()
		};
		projects[index] = updatedItem;
	} else {
		updatedItem = {
			...fullFallback,
			...updates,
			id,
			client_pic: updates.client_pic || updates.client_name || fullFallback.client_name || '',
			updated_at: new Date().toISOString()
		};
		projects.unshift(updatedItem);
	}

	writeLocalProjects(projects);
	return updatedItem;
}

/**
 * Delete a project in local store.
 */
export function deleteLocalProject(id) {
	const projects = readLocalProjects() || [];
	const filtered = projects.filter((p) => p.id !== id);
	writeLocalProjects(filtered);
	return true;
}
