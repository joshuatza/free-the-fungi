<script lang="ts">
	let {
		targetId,
		targetType,
		score,
		voted,
		loggedIn
	}: {
		targetId: string;
		targetType: 'post' | 'comment';
		score: number;
		voted: boolean;
		loggedIn: boolean;
	} = $props();

	let scoreOffset = $state(0);
	let votedLocal = $state(false);
	let displayScore = $derived(score + scoreOffset);
	let displayVoted = $derived(voted || votedLocal);
	let loading = $state(false);

	async function vote() {
		if (displayVoted || loading || !loggedIn) return;
		loading = true;

		// Optimistic update
		scoreOffset = 1;
		votedLocal = true;

		const endpoint =
			targetType === 'post'
				? `/api/community/posts/${targetId}/vote`
				: `/api/community/comments/${targetId}/vote`;

		try {
			const res = await fetch(endpoint, { method: 'POST' });
			if (!res.ok) {
				scoreOffset = 0;
				votedLocal = false;
			}
		} catch {
			scoreOffset = 0;
			votedLocal = false;
		}
		loading = false;
	}
</script>

<button
	class="vote-btn"
	class:voted={displayVoted}
	class:disabled={!loggedIn}
	onclick={vote}
	disabled={displayVoted || loading}
	title={loggedIn ? (displayVoted ? 'Already upvoted' : 'Upvote') : 'Log in to vote'}
>
	<svg class="arrow" viewBox="0 0 12 8" width="10" height="7">
		<path d="M6 0L12 8H0z" fill="currentColor" />
	</svg>
	<span class="score">{displayScore}</span>
</button>

<style>
	.vote-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.2rem 0.35rem;
		border-radius: 3px;
		transition: all 0.15s;
		min-width: 2rem;
	}
	.vote-btn:hover:not(:disabled) {
		background: var(--accent-bg);
	}
	.vote-btn:disabled {
		cursor: default;
	}
	.vote-btn.disabled {
		cursor: default;
		opacity: 0.5;
	}
	.arrow {
		color: var(--dim-light);
		transition: color 0.15s;
	}
	.vote-btn:hover:not(:disabled) .arrow {
		color: var(--accent);
	}
	.voted .arrow {
		color: var(--accent);
	}
	.score {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--dim);
	}
	.voted .score {
		color: var(--accent);
	}
</style>
