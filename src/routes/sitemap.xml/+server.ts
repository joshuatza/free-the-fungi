import { ARTICLES, SITE_URL } from '$lib/content/articles.js';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const latest = ARTICLES.reduce(
		(m: string, a: { dateModified: string }) => (a.dateModified > m ? a.dateModified : m),
		'2026-07-21'
	);

	const urls = [
		{ loc: `${SITE_URL}/`, lastmod: latest },
		{ loc: `${SITE_URL}/articles/`, lastmod: latest },
		{ loc: `${SITE_URL}/community`, lastmod: latest },
		...ARTICLES.map((a: { slug: string; dateModified: string }) => ({
			loc: `${SITE_URL}/articles/${a.slug}/`,
			lastmod: a.dateModified
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
