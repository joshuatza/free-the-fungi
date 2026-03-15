<script lang="ts">
	import VoteButton from './VoteButton.svelte';
	import CommentForm from './CommentForm.svelte';
	import CommentItem from './CommentItem.svelte';
	import { timeAgo } from '$lib/community/ranking';

	let {
		comment,
		postId,
		loggedIn,
		getChildren,
		depth
	}: {
		comment: Record<string, unknown>;
		postId: string;
		loggedIn: boolean;
		getChildren: (parentId: string | null) => Record<string, unknown>[];
		depth: number;
	} = $props();

	let showReply = $state(false);
	const children = $derived(getChildren(comment.id as string));
	const maxIndent = 5;
</script>

<div class="comment" style:margin-left="{Math.min(depth, maxIndent) * 1.25}rem">
	<div class="comment-header">
		<VoteButton
			targetId={comment.id as string}
			targetType="comment"
			score={comment.score as number}
			voted={!!comment.user_voted}
			{loggedIn}
		/>
		<div class="comment-meta">
			<a href="/community/user/{comment.username}" class="user-link">{comment.username}</a>
			<span class="time">{timeAgo(comment.created_at as string)}</span>
		</div>
	</div>
	<div class="comment-body">{comment.body}</div>
	{#if loggedIn}
		<button class="reply-toggle" onclick={() => (showReply = !showReply)}>
			{showReply ? 'cancel' : 'reply'}
		</button>
	{/if}
	{#if showReply}
		<CommentForm {postId} parentId={comment.id as string} onsubmit={() => (showReply = false)} />
	{/if}

	{#each children as child (child.id)}
		<CommentItem comment={child} {postId} {loggedIn} {getChildren} depth={depth + 1} />
	{/each}
</div>

<style>
	.comment {
		padding: 0.5rem 0;
		border-left: 1px solid var(--border-light);
		padding-left: 0.75rem;
		margin-bottom: 0.25rem;
	}
	.comment-header {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.comment-meta {
		display: flex;
		gap: 0.4rem;
		font-size: 0.75rem;
		align-items: center;
	}
	.user-link {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}
	.user-link:hover {
		text-decoration: underline;
	}
	.time {
		color: var(--dim-light);
	}
	.comment-body {
		font-size: 0.88rem;
		line-height: 1.6;
		margin: 0.25rem 0;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.reply-toggle {
		background: none;
		border: none;
		font-size: 0.72rem;
		color: var(--dim);
		cursor: pointer;
		font-family: var(--sans);
		padding: 0;
	}
	.reply-toggle:hover {
		text-decoration: underline;
		color: var(--text);
	}
</style>
