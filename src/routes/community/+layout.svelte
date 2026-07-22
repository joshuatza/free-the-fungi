<script lang="ts">
	import CommunityNav from '$lib/components/community/CommunityNav.svelte';
	import { page } from '$app/stores';
	import { SITE_URL, SITE_NAME, OG_IMAGE } from '$lib/content/articles.js';

	let { data, children } = $props();

	// Per-page canonical so each community URL is self-canonical (not flagged as
	// duplicate). Individual pages may still override the title in their own head.
	const canonical = $derived(`${SITE_URL}${$page.url.pathname}`);
</script>

<svelte:head>
	<title>Community — {SITE_NAME}</title>
	<meta
		name="description"
		content="Community discussion on psilocybin science, law and reform in South Africa — join the conversation on Free The Fungi."
	/>
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Community — {SITE_NAME}" />
	<meta
		property="og:description"
		content="Community discussion on psilocybin science, law and reform in South Africa."
	/>
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<div class="community-wrap">
	<CommunityNav user={data.user} />
	<main class="community-main">
		{@render children()}
	</main>
</div>

<style>
	.community-wrap {
		min-height: 100vh;
		background: var(--bg);
	}
	.community-main {
		max-width: 780px;
		margin: 0 auto;
		padding: 1.5rem 1rem;
	}
	@media (max-width: 600px) {
		.community-main {
			padding: 1rem 0.75rem;
		}
	}
</style>
