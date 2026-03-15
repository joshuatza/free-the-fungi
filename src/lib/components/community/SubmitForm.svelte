<script lang="ts">
	import { CATEGORIES } from '$lib/community/ranking';

	let { form }: { form: { error?: string; title?: string; url?: string; body?: string; category?: string } | null } = $props();
</script>

<form method="POST" class="submit-form">
	<label class="field">
		<span class="field-label">Title</span>
		<input
			type="text"
			name="title"
			value={form?.title || ''}
			placeholder="Post title"
			required
			minlength="3"
			maxlength="300"
		/>
	</label>

	<label class="field">
		<span class="field-label">URL <span class="optional">(leave empty for Ask/discussion)</span></span>
		<input
			type="url"
			name="url"
			value={form?.url || ''}
			placeholder="https://..."
		/>
	</label>

	<label class="field">
		<span class="field-label">Text <span class="optional">(required for Ask posts)</span></span>
		<textarea
			name="body"
			rows="5"
			placeholder="Share your thoughts, ask a question..."
		>{form?.body || ''}</textarea>
	</label>

	<label class="field">
		<span class="field-label">Category</span>
		<select name="category" value={form?.category || 'general'}>
			{#each CATEGORIES as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
	</label>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<button type="submit" class="submit-btn">Submit</button>
</form>

<style>
	.submit-form {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1.5rem;
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
	.optional {
		font-weight: 400;
		color: var(--dim-light);
	}
	input,
	textarea,
	select {
		width: 100%;
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 5px;
		font-family: var(--sans);
		font-size: 0.88rem;
		background: var(--bg);
		color: var(--text);
	}
	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: var(--accent);
	}
	textarea {
		resize: vertical;
		line-height: 1.5;
	}
	select {
		cursor: pointer;
	}
	.error {
		font-size: 0.82rem;
		color: var(--red);
	}
	.submit-btn {
		align-self: flex-start;
		padding: 0.55rem 1.25rem;
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
	.submit-btn:hover {
		background: var(--accent-light);
		transform: translateY(-1px);
	}
</style>
