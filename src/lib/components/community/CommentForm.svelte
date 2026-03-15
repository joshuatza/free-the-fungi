<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	let {
		postId,
		parentId,
		onsubmit
	}: {
		postId: string;
		parentId?: string;
		onsubmit?: () => void;
	} = $props();

	let body = $state('');
	let loading = $state(false);
	let error = $state('');

	async function submit() {
		if (!body.trim() || loading) return;
		loading = true;
		error = '';

		try {
			const res = await fetch('/api/community/comments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ postId, parentId, body: body.trim() })
			});

			if (!res.ok) {
				const data = await res.json();
				error = data.error || 'Failed to post comment';
				return;
			}

			body = '';
			onsubmit?.();
			await invalidateAll();
		} catch {
			error = 'Network error';
		} finally {
			loading = false;
		}
	}
</script>

<form class="comment-form" onsubmit={(e) => { e.preventDefault(); submit(); }}>
	<textarea
		bind:value={body}
		placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
		rows="3"
		disabled={loading}
	></textarea>
	{#if error}
		<p class="error">{error}</p>
	{/if}
	<button type="submit" class="submit-btn" disabled={!body.trim() || loading}>
		{loading ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
	</button>
</form>

<style>
	.comment-form {
		margin-bottom: 1rem;
	}
	textarea {
		width: 100%;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 5px;
		font-family: var(--sans);
		font-size: 0.88rem;
		line-height: 1.5;
		resize: vertical;
		background: var(--surface);
		color: var(--text);
	}
	textarea:focus {
		outline: none;
		border-color: var(--accent);
	}
	.error {
		font-size: 0.78rem;
		color: var(--red);
		margin: 0.35rem 0;
	}
	.submit-btn {
		margin-top: 0.35rem;
		padding: 0.4rem 0.85rem;
		background: var(--accent);
		color: #fff;
		border: none;
		border-radius: 4px;
		font-family: var(--sans);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.submit-btn:hover:not(:disabled) {
		background: var(--accent-light);
	}
	.submit-btn:disabled {
		opacity: 0.5;
		cursor: default;
	}
</style>
