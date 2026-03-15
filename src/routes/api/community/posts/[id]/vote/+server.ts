import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals, platform }) => {
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const db = platform?.env?.DB;
	if (!db) return json({ error: 'Service unavailable' }, { status: 500 });

	const postId = params.id;
	const userId = locals.user.id;

	// Check if already voted
	const existing = await db
		.prepare('SELECT 1 FROM votes WHERE user_id = ?1 AND target_id = ?2')
		.bind(userId, postId)
		.first();

	if (existing) {
		return json({ error: 'Already voted' }, { status: 409 });
	}

	// Insert vote and update score
	await db.batch([
		db.prepare('INSERT INTO votes (user_id, target_id, target_type) VALUES (?1, ?2, ?3)')
			.bind(userId, postId, 'post'),
		db.prepare('UPDATE posts SET score = score + 1 WHERE id = ?1')
			.bind(postId)
	]);

	const post = await db.prepare('SELECT score FROM posts WHERE id = ?1').bind(postId).first();

	return json({ ok: true, score: post?.score ?? 0 });
};
