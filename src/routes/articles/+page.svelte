<script lang="ts">
	import { ARTICLES, SITE_URL, SITE_NAME, OG_IMAGE } from '$lib/content/articles.js';

	const title = `Articles — Psilocybin Science, Law & Policy | ${SITE_NAME}`;
	const description =
		'Plain-language reference articles on psilocybin: the science, the law in South Africa and worldwide, the history, and the policy-reform debate.';
	const url = `${SITE_URL}/articles/`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<div class="wrap">
	<p class="label">Reference</p>
	<h1>Articles</h1>
	<p class="lead">
		Plain-language reference articles on psilocybin — the science, the law in South Africa and
		worldwide, the history, and the policy-reform debate.
	</p>

	<div class="cards">
		{#each ARTICLES as a (a.slug)}
			<article class="card">
				<h2><a href="/articles/{a.slug}/">{a.title}</a></h2>
				<p class="meta">{[a.datePublished, ...(a.tags || [])].join(' · ')}</p>
				<p class="desc">{a.description}</p>
				<a class="read" href="/articles/{a.slug}/">Read article →</a>
			</article>
		{/each}
	</div>
</div>

<style>
	.wrap {
		max-width: var(--content);
		margin: 0 auto;
		padding: 3.5rem 1.5rem;
	}
	h1 {
		font-family: var(--serif);
		font-size: clamp(2rem, 5vw, 2.8rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}
	.cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2.5rem;
	}
	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 1.5rem 1.75rem;
		transition: all 0.25s;
	}
	.card:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
	}
	.card h2 {
		font-family: var(--serif);
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.25;
		margin-bottom: 0.4rem;
	}
	.card h2 a {
		color: var(--text);
		text-decoration: none;
	}
	.card h2 a:hover {
		color: var(--accent);
	}
	.meta {
		font-size: 0.75rem;
		color: var(--dim-light);
		margin-bottom: 0.6rem;
	}
	.desc {
		font-size: 0.92rem;
		color: var(--dim);
		line-height: 1.6;
		margin-bottom: 0.75rem;
	}
	.read {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--accent);
		text-decoration: none;
	}
	.read:hover {
		text-decoration: underline;
	}
</style>
