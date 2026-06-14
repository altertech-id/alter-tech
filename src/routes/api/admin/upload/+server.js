import { json, error } from '@sveltejs/kit';

/**
 * POST /api/admin/upload  (multipart/form-data, field: "file")
 * Uploads an image to the public `portfolio` storage bucket and returns its
 * public URL: { url }.
 */
export async function POST({ request, locals }) {
	const form = await request.formData();
	const file = form.get('file');
	if (!(file instanceof File)) throw error(400, 'File tidak ditemukan.');

	const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
	const path = `portfolio/${Date.now()}-${crypto.randomUUID()}.${ext}`;

	const { error: upErr } = await locals.supabase.storage
		.from('portfolio')
		.upload(path, file, { upsert: true, contentType: file.type || undefined });
	if (upErr) throw error(500, upErr.message);

	const { data } = locals.supabase.storage.from('portfolio').getPublicUrl(path);
	return json({ url: data.publicUrl });
}
