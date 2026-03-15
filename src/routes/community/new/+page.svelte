<script lang="ts">
	import PostList from '$lib/components/community/PostList.svelte';
	import CategoryFilter from '$lib/components/community/CategoryFilter.svelte';

	let { data } = $props();
</script>

<div class="feed-header">
	<div class="feed-tabs">
		<a href="/community/new?sort=ranked" class="feed-tab" class:active={data.sort === 'ranked'}>Ranked</a>
		<a href="/community/new?sort=newest" class="feed-tab" class:active={data.sort === 'newest'}>Newest</a>
	</div>
	<CategoryFilter selected={data.category ?? ''} baseUrl="/community/new" sort={data.sort} />
</div>

<PostList posts={data.posts} />

{#if data.posts.length >= 30}
	<div class="pagination">
		{#if data.page > 1}
			<a href="/community/new?sort={data.sort}&page={data.page - 1}" class="page-link">prev</a>
		{/if}
		<a href="/community/new?sort={data.sort}&page={(data.page || 1) + 1}" class="page-link">more</a>
	</div>
{/if}

<style>
	.feed-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.feed-tabs {
		display: flex;
		gap: 0.25rem;
	}
	.feed-tab {
		padding: 0.35rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--dim);
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.15s;
	}
	.feed-tab:hover {
		color: var(--text);
		background: var(--bg-alt);
	}
	.feed-tab.active {
		color: var(--accent);
		background: var(--accent-bg);
		font-weight: 600;
	}
	.pagination {
		display: flex;
		justify-content: center;
		gap: 1rem;
		padding: 1.5rem 0;
	}
	.page-link {
		color: var(--accent);
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 500;
	}
	.page-link:hover {
		text-decoration: underline;
	}
</style>
