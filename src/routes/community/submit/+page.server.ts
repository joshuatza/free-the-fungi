import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { loggedIn: !!locals.user };
};

export const actions: Actions = {
	default: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { error: 'Not logged in' });

		const db = platform?.env?.DB;
		if (!db) return fail(500, { error: 'Database not available' });

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim();
		const url = (formData.get('url') as string)?.trim() || null;
		const body = (formData.get('body') as string)?.trim() || null;
		const category = (formData.get('category') as string) || 'general';
		const postType = url ? 'new' : 'ask';

		if (!title || title.length < 3) {
			return fail(400, { error: 'Title must be at least 3 characters', title, url, body, category });
		}
		if (title.length > 300) {
			return fail(400, { error: 'Title too long (max 300 characters)', title, url, body, category });
		}

		if (url) {
			try {
				new URL(url);
			} catch {
				return fail(400, { error: 'Invalid URL', title, url, body, category });
			}
		}

		if (!url && !body) {
			return fail(400, { error: 'Ask posts need a body text', title, url, body, category });
		}

		const id = crypto.randomUUID();
		await db
			.prepare(
				`INSERT INTO posts (id, user_id, title, url, body, post_type, category, score)
				VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 1)`
			)
			.bind(id, locals.user.id, title, url, body, postType, category)
			.run();

		// Auto-upvote own post
		await db
			.prepare(`INSERT INTO votes (user_id, target_id, target_type) VALUES (?1, ?2, 'post')`)
			.bind(locals.user.id, id)
			.run();

		redirect(303, `/community/post/${id}`);
	}
};
