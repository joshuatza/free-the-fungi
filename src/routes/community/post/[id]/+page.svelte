<script lang="ts">
	import VoteButton from '$lib/components/community/VoteButton.svelte';
	import CategoryBadge from '$lib/components/community/CategoryBadge.svelte';
	import CommentThread from '$lib/components/community/CommentThread.svelte';
	import CommentForm from '$lib/components/community/CommentForm.svelte';
	import { timeAgo, extractDomain } from '$lib/community/ranking';

	let { data } = $props();
	const post = $derived(data.post);
	const user = $derived(data.user);
</script>

<svelte:head>
	<title>{post.title} — FTF Community</title>
</svelte:head>

<article class="post-detail">
	<div class="post-header">
		<VoteButton
			targetId={post.id as string}
			targetType="post"
			score={post.score as number}
			voted={!!post.user_voted}
			loggedIn={!!user}
		/>
		<div class="post-info">
			<h1>
				{#if post.url}
					<a href={post.url as string} class="post-title-link" target="_blank" rel="noopener">
						{post.title}
					</a>
					<span class="post-domain">({extractDomain(post.url as string)})</span>
				{:else}
					{post.title}
				{/if}
			</h1>
			<div class="post-meta">
				<CategoryBadge category={post.category as string} />
				<span>by <a href="/community/user/{post.username}" class="user-link">{post.username}</a></span>
				<span>{timeAgo(post.created_at as string)}</span>
				<span>{post.comment_count} comment{post.comment_count === 1 ? '' : 's'}</span>
			</div>
		</div>
	</div>

	{#if post.body}
		<div class="post-body">{post.body}</div>
	{/if}
</article>

<section class="comments-section">
	{#if user}
		<CommentForm postId={post.id as string} />
	{:else}
		<p class="login-prompt"><a href="/community/login">Log in</a> to comment</p>
	{/if}

	<CommentThread
		comments={data.comments}
		postId={post.id as string}
		loggedIn={!!user}
	/>
</section>

<style>
	.post-detail {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1.25rem;
		margin-bottom: 1.5rem;
	}
	.post-header {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
	}
	.post-info {
		flex: 1;
		min-width: 0;
	}
	h1 {
		font-family: var(--serif);
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: 0.35rem;
	}
	.post-title-link {
		color: var(--text);
		text-decoration: none;
	}
	.post-title-link:hover {
		color: var(--accent);
	}
	.post-domain {
		font-size: 0.78rem;
		color: var(--dim-light);
		font-weight: 400;
		font-family: var(--sans);
	}
	.post-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.78rem;
		color: var(--dim);
		align-items: center;
	}
	.user-link {
		color: var(--accent);
		text-decoration: none;
	}
	.user-link:hover {
		text-decoration: underline;
	}
	.post-body {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-light);
		font-size: 0.92rem;
		line-height: 1.7;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.comments-section {
		margin-top: 0.5rem;
	}
	.login-prompt {
		font-size: 0.85rem;
		color: var(--dim);
		margin-bottom: 1rem;
	}
	.login-prompt a {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}
	.login-prompt a:hover {
		text-decoration: underline;
	}
</style>
