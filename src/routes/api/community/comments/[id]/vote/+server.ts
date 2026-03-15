import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals, platform }) => {
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const db = platform?.env?.DB;
	if (!db) return json({ error: 'Service unavailable' }, { status: 500 });

	const commentId = params.id;
	const userId = locals.user.id;

	const existing = await db
		.prepare('SELECT 1 FROM votes WHERE user_id = ?1 AND target_id = ?2')
		.bind(userId, commentId)
		.first();

	if (existing) {
		return json({ error: 'Already voted' }, { status: 409 });
	}

	await db.batch([
		db.prepare('INSERT INTO votes (user_id, target_id, target_type) VALUES (?1, ?2, ?3)')
			.bind(userId, commentId, 'comment'),
		db.prepare('UPDATE comments SET score = score + 1 WHERE id = ?1')
			.bind(commentId)
	]);

	const comment = await db.prepare('SELECT score FROM comments WHERE id = ?1').bind(commentId).first();

	return json({ ok: true, score: comment?.score ?? 0 });
};
