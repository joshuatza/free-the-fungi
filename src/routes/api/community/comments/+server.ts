import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, platform }) => {
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const db = platform?.env?.DB;
	if (!db) return json({ error: 'Service unavailable' }, { status: 500 });

	let body: { postId: string; parentId?: string; body: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const { postId, parentId, body: commentBody } = body;
	if (!postId || !commentBody?.trim()) {
		return json({ error: 'Post ID and comment body required' }, { status: 400 });
	}

	if (commentBody.length > 5000) {
		return json({ error: 'Comment too long (max 5000 chars)' }, { status: 400 });
	}

	// Verify post exists
	const post = await db.prepare('SELECT id FROM posts WHERE id = ?1').bind(postId).first();
	if (!post) return json({ error: 'Post not found' }, { status: 404 });

	// Verify parent comment exists if replying
	if (parentId) {
		const parent = await db
			.prepare('SELECT id FROM comments WHERE id = ?1 AND post_id = ?2')
			.bind(parentId, postId)
			.first();
		if (!parent) return json({ error: 'Parent comment not found' }, { status: 404 });
	}

	const commentId = crypto.randomUUID();

	await db.batch([
		db.prepare(
			'INSERT INTO comments (id, post_id, user_id, parent_id, body, score) VALUES (?1, ?2, ?3, ?4, ?5, 1)'
		).bind(commentId, postId, locals.user.id, parentId || null, commentBody.trim()),
		db.prepare('UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?1').bind(postId),
		// Auto-upvote own comment
		db.prepare('INSERT INTO votes (user_id, target_id, target_type) VALUES (?1, ?2, ?3)')
			.bind(locals.user.id, commentId, 'comment')
	]);

	return json({
		ok: true,
		comment: {
			id: commentId,
			post_id: postId,
			user_id: locals.user.id,
			username: locals.user.username,
			parent_id: parentId || null,
			body: commentBody.trim(),
			score: 1,
			user_voted: 1,
			created_at: new Date().toISOString().replace('Z', '')
		}
	});
};
