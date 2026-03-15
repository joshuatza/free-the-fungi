<script lang="ts">
	import CommentItem from './CommentItem.svelte';

	let {
		comments,
		postId,
		loggedIn
	}: {
		comments: Record<string, unknown>[];
		postId: string;
		loggedIn: boolean;
	} = $props();

	// Build tree from flat list
	const tree = $derived.by(() => {
		const map = new Map<string | null, Record<string, unknown>[]>();
		for (const c of comments) {
			const parentId = (c.parent_id as string) || null;
			if (!map.has(parentId)) map.set(parentId, []);
			map.get(parentId)!.push(c);
		}
		return map;
	});

	function getChildren(parentId: string | null): Record<string, unknown>[] {
		return tree.get(parentId) || [];
	}
</script>

<div class="thread">
	{#each getChildren(null) as comment (comment.id)}
		<CommentItem {comment} {postId} {loggedIn} {getChildren} depth={0} />
	{/each}
</div>

<style>
	.thread {
		margin-top: 1rem;
	}
</style>
