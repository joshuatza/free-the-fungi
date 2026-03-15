<script lang="ts">
	import SubmitForm from '$lib/components/community/SubmitForm.svelte';
	import LoginForm from '$lib/components/community/LoginForm.svelte';
	import type { ActionData } from './$types';

	let { data, form }: { data: { loggedIn: boolean }; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Submit — FTF Community</title>
</svelte:head>

<h2 class="page-title">Submit</h2>
<p class="page-desc">Share a link or start a discussion</p>

{#if data.loggedIn}
	<SubmitForm {form} />
{:else}
	<div class="login-prompt">
		<p>Log in to submit a post</p>
		<LoginForm />
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
	.login-prompt p {
		font-size: 0.9rem;
		color: var(--dim);
		margin-bottom: 1rem;
	}
</style>
