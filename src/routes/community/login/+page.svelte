<script lang="ts">
	import LoginForm from '$lib/components/community/LoginForm.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Log in — FTF Community</title>
</svelte:head>

{#if data.user}
	<div class="already">
		<p>You're logged in as <strong>{data.user.username}</strong></p>
		<a href="/community/new" class="back-link">Back to community</a>
	</div>
{:else}
	<h2 class="page-title">Join the conversation</h2>
	<p class="page-desc">Enter your email and we'll send you a magic link — no password needed</p>
	<LoginForm />
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
	.already {
		text-align: center;
		padding: 3rem 1rem;
	}
	.already p {
		font-size: 1rem;
		margin-bottom: 0.75rem;
	}
	.back-link {
		color: var(--accent);
		text-decoration: none;
		font-size: 0.85rem;
	}
	.back-link:hover {
		text-decoration: underline;
	}
</style>
