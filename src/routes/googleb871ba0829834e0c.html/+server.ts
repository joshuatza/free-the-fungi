import type { RequestHandler } from './$types';

// Google Search Console verification file. Served dynamically by the worker
// (prerender = false) so Cloudflare's pretty-URL ".html" redirect never fires
// and Google gets the exact file at the exact path with a 200.
export const prerender = false;

export const GET: RequestHandler = () =>
	new Response('google-site-verification: googleb871ba0829834e0c.html', {
		headers: { 'Content-Type': 'text/html' }
	});
