<script lang="ts">
	let email = $state('');
	let username = $state('');
	let loading = $state(false);
	let message = $state('');
	let error = $state('');

	async function submit() {
		if (!email || !username || loading) return;
		loading = true;
		error = '';
		message = '';

		try {
			const res = await fetch('/api/community/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, username })
			});

			const data = await res.json();
			if (!res.ok) {
				error = data.error || 'Something went wrong';
			} else {
				message = data.message || 'Check your email for a login link!';
			}
		} catch {
			error = 'Network error — try again';
		} finally {
			loading = false;
		}
	}
</script>

<form class="login-form" onsubmit={(e) => { e.preventDefault(); submit(); }}>
	<label class="field">
		<span class="field-label">Email</span>
		<input
			type="email"
			bind:value={email}
			placeholder="you@example.com"
			required
			disabled={loading}
		/>
	</label>

	<label class="field">
		<span class="field-label">Username</span>
		<input
			type="text"
			bind:value={username}
			placeholder="Choose a username"
			required
			pattern="[a-zA-Z0-9_-]{'{'}2,30{'}'}"
			title="2-30 characters, letters/numbers/dashes"
			disabled={loading}
		/>
		<span class="field-hint">2-30 characters, letters, numbers, dashes</span>
	</label>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if message}
		<div class="success">
			<p>{message}</p>
		</div>
	{:else}
		<button type="submit" class="submit-btn" disabled={loading || !email || !username}>
			{loading ? 'Sending...' : 'Send magic link'}
		</button>
	{/if}

	<p class="privacy">Your email is only used for login — it's never shown publicly</p>
</form>

<style>
	.login-form {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1.5rem;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.field-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text);
	}
	.field-hint {
		font-size: 0.72rem;
		color: var(--dim-light);
	}
	input {
		width: 100%;
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 5px;
		font-family: var(--sans);
		font-size: 0.88rem;
		background: var(--bg);
		color: var(--text);
	}
	input:focus {
		outline: none;
		border-color: var(--accent);
	}
	.error {
		font-size: 0.82rem;
		color: var(--red);
	}
	.success {
		background: var(--accent-bg);
		border: 1px solid rgba(45, 107, 74, 0.15);
		border-radius: 5px;
		padding: 0.75rem 1rem;
	}
	.success p {
		font-size: 0.88rem;
		color: var(--accent);
		font-weight: 500;
	}
	.submit-btn {
		padding: 0.6rem 1.25rem;
		background: var(--accent);
		color: #fff;
		border: none;
		border-radius: 5px;
		font-family: var(--sans);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}
	.submit-btn:hover:not(:disabled) {
		background: var(--accent-light);
	}
	.submit-btn:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.privacy {
		font-size: 0.72rem;
		color: var(--dim-light);
	}
</style>
