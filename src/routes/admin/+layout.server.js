/**
 * Provides the authenticated admin user to the admin layout.
 * Route protection itself is enforced in hooks.server.js — by the time this
 * runs, an unauthenticated visitor has already been redirected to /admin/login.
 */
export async function load({ locals }) {
	return {
		user: locals.user
			? {
					email: locals.user.email,
					name: locals.user.user_metadata?.name ?? 'Altertech Admin'
				}
			: null
	};
}
