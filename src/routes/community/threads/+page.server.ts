import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = platform?.env?.DB;
	if (!db) return { threads: [] };

	const result = await db
		.prepare(
			`SELECT c.id, c.post_id, c.body, c.score, c.created_at,
				u.username,
				p.title as post_title,
				EXISTS(SELECT 1 FROM votes v WHERE v.user_id = ?1 AND v.target_id = c.id) as user_voted
			FROM comments c
			JOIN users u ON c.user_id = u.id
			JOIN posts p ON c.post_id = p.id
			ORDER BY c.created_at DESC
			LIMIT 50`
		)
		.bind(locals.user?.id || '')
		.all();

	return { threads: result.results || [] };
};
