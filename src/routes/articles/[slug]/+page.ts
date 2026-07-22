import { error } from '@sveltejs/kit';
import { ARTICLES, getArticle, getRelatedArticles } from '$lib/content/articles.js';
import type { PageLoad } from './$types';

export const prerender = true;

// Enumerate every article slug so the prerenderer emits all pages even if the
// crawler misses one.
export function entries() {
	return ARTICLES.map((a: { slug: string }) => ({ slug: a.slug }));
}

export const load: PageLoad = ({ params }) => {
	const article = getArticle(params.slug);
	if (!article) throw error(404, 'Article not found');
	return { article, related: getRelatedArticles(params.slug, 3) };
};
