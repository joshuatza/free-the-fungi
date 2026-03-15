<script lang="ts">
	import { CATEGORIES } from '$lib/community/ranking';

	let {
		selected,
		baseUrl,
		sort
	}: {
		selected: string;
		baseUrl: string;
		sort: string;
	} = $props();
</script>

<div class="category-filter">
	<a
		href="{baseUrl}?sort={sort}"
		class="cat-pill"
		class:active={!selected}
	>all</a>
	{#each CATEGORIES as cat}
		<a
			href="{baseUrl}?sort={sort}&category={cat}"
			class="cat-pill"
			class:active={selected === cat}
		>{cat}</a>
	{/each}
</div>

<style>
	.category-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem;
	}
	.cat-pill {
		padding: 0.2rem 0.5rem;
		font-size: 0.68rem;
		color: var(--dim);
		text-decoration: none;
		border-radius: 3px;
		transition: all 0.15s;
		white-space: nowrap;
	}
	.cat-pill:hover {
		background: var(--bg-alt);
		color: var(--text);
	}
	.cat-pill.active {
		background: var(--accent-bg);
		color: var(--accent);
		font-weight: 600;
	}
</style>
