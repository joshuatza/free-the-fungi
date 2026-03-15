import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	const db = platform?.env?.DB;
	if (!db) error(500, 'Database not available');

	const post = await db
		.prepare(
			`SELECT p.*, u.username,
				EXISTS(SELECT 1 FROM votes v WHERE v.user_id = ?1 AND v.target_id = p.id) as user_voted
			FROM posts p
			JOIN users u ON p.user_id = u.id
			WHERE p.id = ?2`
		)
		.bind(locals.user?.id || '', params.id)
		.first();

	if (!post) error(404, 'Post not found');

	const commentsResult = await db
		.prepare(
			`SELECT c.*, u.username,
				EXISTS(SELECT 1 FROM votes v WHERE v.user_id = ?1 AND v.target_id = c.id) as user_voted
			FROM comments c
			JOIN users u ON c.user_id = u.id
			WHERE c.post_id = ?2
			ORDER BY c.created_at ASC`
		)
		.bind(locals.user?.id || '', params.id)
		.all();

	return {
		post,
		comments: commentsResult.results || []
	};
};
