import { json } from '@sveltejs/kit';

/**
 * POST /api/admin/login  { email, password }
 * Signs in via Supabase Auth; the session is persisted as http-only cookies by
 * the server client (see hooks.server.js). Returns the safe user shape the
 * frontend expects: { success, user?: { name, email }, error? }.
 */
export async function POST({ request, locals }) {
	const { email, password } = await request.json().catch(() => ({}));
	if (!email || !password) {
		return json({ success: false, error: 'Email dan password wajib diisi.' }, { status: 400 });
	}

	const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password });
	if (error) {
		return json({ success: false, error: 'Email atau password salah.' }, { status: 401 });
	}

	return json({
		success: true,
		user: {
			name: data.user?.user_metadata?.name ?? 'Altertech Admin',
			email: data.user?.email
		}
	});
}
