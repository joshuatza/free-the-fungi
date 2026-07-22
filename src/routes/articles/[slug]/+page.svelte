<script lang="ts">
	import { SITE_URL, SITE_NAME, OG_IMAGE } from '$lib/content/articles.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const a = $derived(data.article);
	const related = $derived(data.related);

	const url = $derived(`${SITE_URL}/articles/${a.slug}/`);
	const pageTitle = $derived(`${a.title} | ${SITE_NAME}`);

	const meta = $derived(
		[
			`Published ${a.datePublished}`,
			a.dateModified !== a.datePublished ? `Updated ${a.dateModified}` : null,
			...(a.tags || [])
		]
			.filter(Boolean)
			.join(' · ')
	);

	const jsonLd = $derived(
		JSON.stringify([
			{
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: a.title,
				description: a.description,
				image: OG_IMAGE,
				datePublished: a.datePublished,
				dateModified: a.dateModified,
				author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
				publisher: {
					'@type': 'Organization',
					name: SITE_NAME,
					url: SITE_URL,
					logo: { '@type': 'ImageObject', url: OG_IMAGE }
				},
				mainEntityOfPage: url
			},
			{
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
					{ '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles/` },
					{ '@type': 'ListItem', position: 3, name: a.title, item: url }
				]
			}
		])
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={a.description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={a.description} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content={OG_IMAGE} />
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

<article class="wrap">
	<nav class="crumb">
		<a href="/">Home</a> / <a href="/articles/">Articles</a>
	</nav>

	<header>
		<h1>{a.title}</h1>
		<p class="meta">{meta}</p>
	</header>

	{#each a.sections as s}
		<section>
			{#if s.heading}<h2>{s.heading}</h2>{/if}
			{#each s.paragraphs as p}<p>{p}</p>{/each}
			{#if s.list}
				<ul>
					{#each s.list as item}<li>{item}</li>{/each}
				</ul>
			{/if}
		</section>
	{/each}

	{#if a.references && a.references.length > 0}
		<section class="refs">
			<h2>Sources and further reading</h2>
			<ul>
				{#each a.references as r}
					<li><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="cta">
		<h2>Back the campaign</h2>
		<p>
			Free The Fungi campaigns for evidence-based psilocybin policy reform in South Africa. If this
			was useful, add your name to the petition or join the community discussion.
		</p>
		<div class="cta-btns">
			<a class="btn-p" href="/#petition">Sign the petition</a>
			<a class="btn-s" href="/community">Join the community</a>
		</div>
	</section>

	<p class="disclaimer">
		{#if a.automated}This article was generated automatically from a curated topic brief and
			published without individual editorial review. {/if}This article is general reference
		information — not medical, legal, or professional advice, and not instructions for producing or
		using any controlled substance. Always verify against official sources.
	</p>

	{#if related.length > 0}
		<aside class="related">
			<h2>Related articles</h2>
			<ul>
				{#each related as r (r.slug)}
					<li><a href="/articles/{r.slug}/">{r.title}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}
</article>

<style>
	.wrap {
		max-width: var(--content);
		margin: 0 auto;
		padding: 2.5rem 1.5rem 1rem;
	}
	.crumb {
		font-size: 0.8rem;
		color: var(--dim-light);
		margin-bottom: 1.5rem;
	}
	.crumb a {
		color: var(--accent);
		text-decoration: none;
	}
	.crumb a:hover {
		text-decoration: underline;
	}
	header {
		margin-bottom: 2.5rem;
	}
	h1 {
		font-family: var(--serif);
		font-size: clamp(1.9rem, 4.5vw, 2.8rem);
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: -0.02em;
		margin-bottom: 0.75rem;
	}
	.meta {
		font-size: 0.78rem;
		color: var(--dim-light);
	}
	section {
		margin-bottom: 1.5rem;
	}
	h2 {
		font-family: var(--serif);
		font-size: 1.4rem;
		font-weight: 600;
		line-height: 1.25;
		margin: 2rem 0 1rem;
	}
	p {
		margin-bottom: 1.25rem;
		color: var(--text);
		line-height: 1.8;
	}
	ul {
		margin: 0 0 1.25rem 1.25rem;
		color: var(--text);
		line-height: 1.7;
	}
	.refs {
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
	}
	.refs h2 {
		font-size: 1.1rem;
	}
	.refs ul {
		font-size: 0.9rem;
		color: var(--dim);
	}
	.refs a {
		color: var(--accent);
		text-decoration: none;
	}
	.refs a:hover {
		text-decoration: underline;
	}
	.cta {
		margin-top: 2.5rem;
		background: var(--accent-bg);
		border: 1px solid rgba(45, 107, 74, 0.08);
		border-radius: 10px;
		padding: 1.75rem;
	}
	.cta h2 {
		margin-top: 0;
		font-size: 1.2rem;
		color: var(--accent);
	}
	.cta p {
		font-size: 0.92rem;
		color: var(--dim);
	}
	.cta-btns {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.disclaimer {
		margin-top: 2rem;
		font-size: 0.75rem;
		color: var(--dim-light);
		line-height: 1.6;
	}
	.related {
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
	}
	.related h2 {
		font-size: 1.1rem;
	}
	.related ul {
		list-style: none;
		margin-left: 0;
	}
	.related li {
		margin-bottom: 0.5rem;
	}
	.related a {
		color: var(--accent);
		text-decoration: none;
	}
	.related a:hover {
		text-decoration: underline;
	}
</style>
