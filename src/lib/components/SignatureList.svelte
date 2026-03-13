<script lang="ts">
	import { signatures, avColors, avText } from '$lib/stores/signatures';

	let { max = 4 }: { max?: number } = $props();

	let displaySigs = $derived($signatures.slice(0, max));
</script>

{#if displaySigs.length === 0}
	<p class="empty">Be the first to sign.</p>
{:else}
	{#each displaySigs as sig, i}
		<div class="sig-row">
			<div
				class="sig-av"
				style="background:{avColors[i % avColors.length]};color:{avText[i % avText.length]}"
			>
				{(sig.fn[0] + (sig.ln[0] || '')).toUpperCase()}
			</div>
			<div class="sig-info">
				<div class="name">{sig.fn} {sig.ln[0]}.</div>
				<div class="loc">{sig.city}, {sig.prov}</div>
			</div>
		</div>
	{/each}
{/if}

<style>
	.empty {
		color: var(--dim-light);
		font-size: 0.82rem;
	}
	.sig-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.4rem 0;
	}
	.sig-av {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.65rem;
		font-weight: 600;
		flex-shrink: 0;
	}
	.sig-info {
		font-size: 0.82rem;
		line-height: 1.3;
	}
	.name {
		font-weight: 500;
		color: var(--text);
	}
	.loc {
		color: var(--dim-light);
		font-size: 0.75rem;
	}
</style>
