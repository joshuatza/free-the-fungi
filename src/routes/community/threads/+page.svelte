<script lang="ts">
	import { timeAgo } from '$lib/community/ranking';

	let { data } = $props();
</script>

<svelte:head>
	<title>Threads — FTF Community</title>
</svelte:head>

<h2 class="page-title">Recent Threads</h2>
<p class="page-desc">Latest comments and discussions across all posts</p>

{#if data.threads.length === 0}
	<div class="empty">No comments yet — be the first to start a discussion</div>
{:else}
	<div class="thread-list">
		{#each data.threads as thread (thread.id)}
			<div class="thread-item">
				<div class="thread-meta">
					<a href="/community/user/{thread.username}" class="user-link">{thread.username}</a>
					<span class="sep">on</span>
					<a href="/community/post/{thread.post_id}" class="post-link">{thread.post_title}</a>
					<span class="time">{timeAgo(thread.created_at as string)}</span>
				</div>
				<a href="/community/post/{thread.post_id}" class="thread-body">
					{(thread.body as string).length > 200
						? (thread.body as string).slice(0, 200) + '...'
						: thread.body}
				</a>
			</div>
		{/each}
	</div>
{/if}

<style>
	.page-title {
		font-family: var(--serif);
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}
	.page-desc {
		font-size: 0.85rem;
		color: var(--dim);
		margin-bottom: 1.5rem;
	}
	.empty {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--dim);
		font-size: 0.9rem;
	}
	.thread-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.thread-item {
		padding: 0.65rem 0.5rem;
		border-radius: 4px;
		transition: background 0.15s;
	}
	.thread-item:hover {
		background: var(--bg-alt);
	}
	.thread-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		font-size: 0.75rem;
		color: var(--dim);
		align-items: baseline;
		margin-bottom: 0.3rem;
	}
	.user-link {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}
	.user-link:hover {
		text-decoration: underline;
	}
	.sep {
		color: var(--dim-light);
	}
	.post-link {
		color: var(--text);
		text-decoration: none;
		font-weight: 500;
	}
	.post-link:hover {
		color: var(--accent);
	}
	.time {
		color: var(--dim-light);
	}
	.thread-body {
		display: block;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--dim);
		text-decoration: none;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.thread-body:hover {
		color: var(--text);
	}
</style>
