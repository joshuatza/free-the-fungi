import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, platform, cookies }) => {
	const token = url.searchParams.get('token');
	if (!token) error(400, 'Missing token');

	const db = platform?.env?.DB;
	const sessions = platform?.env?.SESSIONS;
	if (!db || !sessions) error(500, 'Service unavailable');

	// Look up the magic link
	const link = await db
		.prepare('SELECT * FROM magic_links WHERE token = ?1 AND used = 0')
		.bind(token)
		.first();

	if (!link) error(400, 'Invalid or expired link');

	// Check expiry
	if (new Date(link.expires_at as string + 'Z') < new Date()) {
		error(400, 'Link has expired — please request a new one');
	}

	// Mark as used
	await db.prepare('UPDATE magic_links SET used = 1 WHERE token = ?1').bind(token).run();

	// Find or create user
	let user = await db
		.prepare('SELECT * FROM users WHERE email = ?1')
		.bind(link.email)
		.first();

	if (!user) {
		// Check username isn't taken
		const existingUsername = await db
			.prepare('SELECT id FROM users WHERE username = ?1')
			.bind(link.username)
			.first();

		const username = existingUsername
			? (link.username as string) + '-' + Math.random().toString(36).slice(2, 6)
			: (link.username as string);

		const userId = crypto.randomUUID();
		await db
			.prepare('INSERT INTO users (id, username, email) VALUES (?1, ?2, ?3)')
			.bind(userId, username, link.email)
			.run();

		user = { id: userId, username, email: link.email as string };
	}

	// Create session
	const sessionId = crypto.randomUUID();
	const sessionData = JSON.stringify({
		id: user.id,
		username: user.username,
		email: user.email
	});

	await sessions.put(sessionId, sessionData, { expirationTtl: 60 * 60 * 24 * 30 }); // 30 days

	cookies.set('ftf_session', sessionId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30
	});

	redirect(302, '/community/new');
};
