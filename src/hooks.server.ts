import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;

	const sessionId = event.cookies.get('ftf_session');
	if (sessionId && event.platform?.env?.SESSIONS) {
		const sessionData = await event.platform.env.SESSIONS.get(sessionId);
		if (sessionData) {
			try {
				event.locals.user = JSON.parse(sessionData);
			} catch {
				// Invalid session data, clear cookie
				event.cookies.delete('ftf_session', { path: '/' });
			}
		}
	}

	return resolve(event);
};
