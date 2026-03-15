import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB;
	const apiKey = platform?.env?.RESEND_API_KEY;
	if (!db || !apiKey) return json({ error: 'Service unavailable' }, { status: 500 });

	let body: { email: string; username: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const { email, username } = body;
	if (!email || !username) return json({ error: 'Email and username required' }, { status: 400 });

	// Basic validation
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'Invalid email' }, { status: 400 });
	}
	if (!/^[a-zA-Z0-9_-]{2,30}$/.test(username)) {
		return json({ error: 'Username: 2-30 chars, letters/numbers/dashes only' }, { status: 400 });
	}

	// Check if email exists with different username — use existing username
	const existingUser = await db
		.prepare('SELECT username FROM users WHERE email = ?1')
		.bind(email)
		.first();

	const finalUsername = existingUser ? (existingUser.username as string) : username;

	// Check if username taken by different email (for new users)
	if (!existingUser) {
		const usernameTaken = await db
			.prepare('SELECT email FROM users WHERE username = ?1')
			.bind(username)
			.first();

		if (usernameTaken) {
			return json({ error: 'Username already taken' }, { status: 409 });
		}
	}

	// Rate limit: max 3 magic links per email per hour
	const recentLinks = await db
		.prepare(
			`SELECT COUNT(*) as cnt FROM magic_links
			WHERE email = ?1 AND expires_at > datetime('now')`
		)
		.bind(email)
		.first();

	if (recentLinks && (recentLinks.cnt as number) >= 3) {
		return json({ error: 'Too many requests — check your email' }, { status: 429 });
	}

	const token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString().replace('Z', '');

	await db
		.prepare(
			'INSERT INTO magic_links (token, email, username, expires_at) VALUES (?1, ?2, ?3, ?4)'
		)
		.bind(token, email, finalUsername, expiresAt)
		.run();

	const resend = new Resend(apiKey);
	const verifyUrl = `https://free-the-fungi.pages.dev/community/verify?token=${token}`;

	const { error: sendError } = await resend.emails.send({
		from: 'Free The Fungi <petition@jtstack.org>',
		to: [email],
		subject: 'Your login link — FTF Community',
		html: `
			<div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
				<h2 style="color: #2d6b4a; margin-bottom: 0.5rem;">Free The Fungi</h2>
				<p style="color: #6b6a64; margin-bottom: 1.5rem;">Click below to log in to the community forum:</p>
				<a href="${verifyUrl}"
					style="display: inline-block; background: #2d6b4a; color: #fff; padding: 0.75rem 1.5rem;
					border-radius: 5px; text-decoration: none; font-weight: 600;">
					Log in to FTF Community
				</a>
				<p style="color: #9c9b94; font-size: 0.85rem; margin-top: 1.5rem;">
					This link expires in 15 minutes. If you didn't request this, ignore this email.
				</p>
			</div>
		`
	});

	if (sendError) {
		console.error('Resend error:', JSON.stringify(sendError));
		return json({ error: 'Failed to send email', detail: sendError.message }, { status: 500 });
	}

	return json({ ok: true, message: existingUser ? 'Check your email' : 'Check your email to create your account' });
};
