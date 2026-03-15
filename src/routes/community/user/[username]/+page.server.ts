import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform?.env?.DB;
	if (!db) error(500, 'Database not available');

	const user = await db
		.prepare('SELECT id, username, created_at FROM users WHERE username = ?1')
		.bind(params.username)
		.first();

	if (!user) error(404, 'User not found');

	const posts = await db
		.prepare(
			`SELECT p.*, u.username FROM posts p
			JOIN users u ON p.user_id = u.id
			WHERE p.user_id = ?1
			ORDER BY p.created_at DESC LIMIT 50`
		)
		.bind(user.id)
		.all();

	return {
		profile: user,
		posts: posts.results || []
	};
};
