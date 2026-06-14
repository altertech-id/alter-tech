/**
 * Minimal in-memory sliding-window rate limiter.
 * Adequate for a single-instance Dokploy deployment. If you scale to multiple
 * replicas, swap this for a shared store (e.g. Supabase table or Redis).
 */
const hits = new Map(); // key -> number[] (timestamps ms)

/**
 * @param {string} key       identifier (e.g. IP)
 * @param {number} limit     max requests per window
 * @param {number} windowMs  window size in ms
 * @returns {boolean} true if allowed, false if over the limit
 */
export function rateLimit(key, limit, windowMs) {
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (recent.length >= limit) {
		hits.set(key, recent);
		return false;
	}
	recent.push(now);
	hits.set(key, recent);
	return true;
}
