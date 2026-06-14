/**
 * Service-role Supabase client — SERVER ONLY.
 *
 * Bypasses Row Level Security. Use it ONLY where the backend must control
 * exactly what is exposed — currently just the public project-tracking
 * endpoint, which returns a hand-picked subset of columns.
 *
 * NEVER import this into a component or any code that ships to the browser.
 */
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as pubEnv } from '$env/dynamic/public';

let _admin;

/** @returns {import('@supabase/supabase-js').SupabaseClient} */
export function getSupabaseAdmin() {
	if (_admin) return _admin;
	const url = pubEnv.PUBLIC_SUPABASE_URL;
	const key = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		throw new Error('Supabase admin client not configured: set PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
	}
	_admin = createClient(url, key, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
	return _admin;
}
