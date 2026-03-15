<script lang="ts">
	import PostList from '$lib/components/community/PostList.svelte';
	import { timeAgo } from '$lib/community/ranking';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.profile.username} — FTF Community</title>
</svelte:head>

<div class="profile-header">
	<h2>{data.profile.username}</h2>
	<span class="joined">joined {timeAgo(data.profile.created_at as string)}</span>
</div>

<h3 class="section-title">Posts</h3>
{#if data.posts.length}
	<PostList posts={data.posts} />
{:else}
	<p class="empty">No posts yet</p>
{/if}

<style>
	.profile-header {
		margin-bottom: 1.5rem;
	}
	h2 {
		font-family: var(--serif);
		font-size: 1.4rem;
		font-weight: 600;
	}
	.joined {
		font-size: 0.8rem;
		color: var(--dim);
	}
	.section-title {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--dim-light);
		margin-bottom: 0.75rem;
	}
	.empty {
		font-size: 0.88rem;
		color: var(--dim);
	}
</style>
