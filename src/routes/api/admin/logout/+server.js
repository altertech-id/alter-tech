import { json } from '@sveltejs/kit';

/** POST /api/admin/logout — clears the Supabase auth cookies. */
export async function POST({ locals }) {
	await locals.supabase.auth.signOut();
	return json({ success: true });
}
