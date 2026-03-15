import { hnScore } from '$lib/community/ranking';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, platform, locals }) => {
	const db = platform?.env?.DB;
	if (!db) return { posts: [], sort: 'ranked', page: 1 };

	const sort = url.searchParams.get('sort') || 'ranked';
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const limit = 30;
	const offset = (page - 1) * limit;

	const result = await db
		.prepare(
			`SELECT p.*, u.username,
				EXISTS(SELECT 1 FROM votes v WHERE v.user_id = ?1 AND v.target_id = p.id) as user_voted
			FROM posts p
			JOIN users u ON p.user_id = u.id
			WHERE p.post_type = 'ask'
			ORDER BY p.created_at DESC
			LIMIT ?2 OFFSET ?3`
		)
		.bind(locals.user?.id || '', limit, offset)
		.all();

	let posts = result.results || [];

	if (sort === 'ranked') {
		posts = [...posts].sort((a, b) =>
			hnScore(b.score as number, b.created_at as string) -
			hnScore(a.score as number, a.created_at as string)
		);
	}

	return { posts, sort, page };
};
