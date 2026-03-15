<script lang="ts">
	import CommunityNav from '$lib/components/community/CommunityNav.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Community — Free The Fungi</title>
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
