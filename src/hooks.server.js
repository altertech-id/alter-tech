/**
 * Server hooks:
 *  1. Attach a request-scoped Supabase client bound to the auth cookies
 *     (@supabase/ssr) so SSR + server routes share the logged-in session.
 *  2. Guard every /admin and /api/admin route — unauthenticated requests are
 *     redirected (pages) or rejected with 401 (API). This replaces the old
 *     client-only onMount redirect, which was trivially bypassable.
 */
import { createServerClient } from '@supabase/ssr';
import { redirect, json } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/public';

/** @type {import('@sveltejs/kit').Handle} */
const supabase = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		env.PUBLIC_SUPABASE_URL ?? '',
		env.PUBLIC_SUPABASE_ANON_KEY ?? '',
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	/**
	 * Validates the JWT against Supabase (getUser) rather than trusting the
	 * unverified cookie session, then returns both.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-range' || name === 'x-supabase-api-version'
	});
};

/** @type {import('@sveltejs/kit').Handle} */
const authGuard = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	const { pathname } = event.url;
	const isLogin = pathname === '/admin/login' || pathname === '/api/admin/login';
	const isProtected =
		(pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !isLogin;

	if (isProtected && !user) {
		if (pathname.startsWith('/api/')) {
			return json({ error: 'Tidak terautentikasi.' }, { status: 401 });
		}
		throw redirect(303, '/admin/login');
	}

	return resolve(event);
};

export const handle = sequence(supabase, authGuard);
