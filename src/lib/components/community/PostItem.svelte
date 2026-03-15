<script lang="ts">
	import VoteButton from './VoteButton.svelte';
	import CategoryBadge from './CategoryBadge.svelte';
	import { timeAgo, extractDomain } from '$lib/community/ranking';
	import { page } from '$app/stores';

	let { post, rank }: { post: Record<string, unknown>; rank: number } = $props();

	const user = $derived($page.data.user);
</script>

<div class="post-item">
	<span class="rank">{rank}.</span>
	<VoteButton
		targetId={post.id as string}
		targetType="post"
		score={post.score as number}
		voted={!!post.user_voted}
		loggedIn={!!user}
	/>
	<div class="post-info">
		<div class="post-title-row">
			{#if post.url}
				<a href={post.url as string} class="post-title" target="_blank" rel="noopener">{post.title}</a>
				<span class="post-domain">({extractDomain(post.url as string)})</span>
			{:else}
				<a href="/community/post/{post.id}" class="post-title">{post.title}</a>
			{/if}
		</div>
		<div class="post-meta">
			<CategoryBadge category={post.category as string} />
			<span>by <a href="/community/user/{post.username}" class="user-link">{post.username}</a></span>
			<span>{timeAgo(post.created_at as string)}</span>
			<span class="sep">|</span>
			<a href="/community/post/{post.id}" class="comments-link">
				{#if (post.comment_count as number) === 0}
					discuss
				{:else}
					{post.comment_count} comment{post.comment_count === 1 ? '' : 's'}
				{/if}
			</a>
		</div>
	</div>
</div>

<style>
	.post-item {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
		padding: 0.5rem 0.25rem;
	}
	.post-item:hover {
		background: var(--bg-alt);
		border-radius: 4px;
	}
	.rank {
		font-size: 0.78rem;
		color: var(--dim-light);
		min-width: 1.5rem;
		text-align: right;
		padding-top: 0.15rem;
	}
	.post-info {
		flex: 1;
		min-width: 0;
	}
	.post-title-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
	}
	.post-title {
		font-size: 0.92rem;
		font-weight: 500;
		color: var(--text);
		text-decoration: none;
		line-height: 1.35;
	}
	.post-title:visited {
		color: var(--dim);
	}
	.post-title:hover {
		color: var(--accent);
	}
	.post-domain {
		font-size: 0.72rem;
		color: var(--dim-light);
	}
	.post-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		font-size: 0.72rem;
		color: var(--dim);
		margin-top: 0.15rem;
		align-items: center;
	}
	.user-link {
		color: var(--dim);
		text-decoration: none;
	}
	.user-link:hover {
		text-decoration: underline;
	}
	.sep {
		color: var(--border);
	}
	.comments-link {
		color: var(--dim);
		text-decoration: none;
	}
	.comments-link:hover {
		text-decoration: underline;
	}
</style>
