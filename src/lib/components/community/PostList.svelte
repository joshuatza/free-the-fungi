<script lang="ts">
	import PostItem from './PostItem.svelte';

	let { posts }: { posts: Record<string, unknown>[] } = $props();
</script>

{#if posts.length === 0}
	<div class="empty">
		<p>Nothing here yet</p>
	</div>
{:else}
	<ol class="post-list">
		{#each posts as post, i (post.id)}
			<li>
				<PostItem {post} rank={i + 1} />
			</li>
		{/each}
	</ol>
{/if}

<style>
	.post-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.empty {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--dim);
		font-size: 0.9rem;
	}
</style>
