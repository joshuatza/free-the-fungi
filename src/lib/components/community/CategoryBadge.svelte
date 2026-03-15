<script lang="ts">
	let { category }: { category: string } = $props();
</script>

<span class="badge">{category}</span>

<style>
	.badge {
		display: inline-block;
		padding: 0.1rem 0.4rem;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		border-radius: 3px;
		background: var(--accent-bg);
		color: var(--accent);
		white-space: nowrap;
	}
</style>
