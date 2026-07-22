// Prerender the whole /articles subtree to static HTML for SEO. The [slug]
// pages are discovered by SvelteKit's crawler from the index page links, and
// also enumerated explicitly via entries() on the [slug] page.
export const prerender = true;
export const trailingSlash = 'always';
