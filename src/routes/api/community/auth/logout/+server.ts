import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, platform }) => {
	const sessionId = cookies.get('ftf_session');
	if (sessionId && platform?.env?.SESSIONS) {
		await platform.env.SESSIONS.delete(sessionId);
	}
	cookies.delete('ftf_session', { path: '/' });
	return json({ ok: true });
};
