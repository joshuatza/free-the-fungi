<script lang="ts">
	import { count } from '$lib/stores/signatures';
</script>

<nav>
	<div class="nav-inner">
		<a href="#top" class="nav-logo">Free The <span>Fungi</span></a>
		<div class="nav-links">
			<a href="#evidence">The Science</a>
			<a href="#rights">Our Rights</a>
			<a href="#timeline">The Case</a>
			<a href="#petition" class="nav-sign">Sign the Petition</a>
		</div>
		<button
			class="nav-mob"
			onclick={() => document.getElementById('petition')?.scrollIntoView({ behavior: 'smooth' })}
			aria-label="Sign petition"
		>
			<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 6h14M3 10h14M3 14h14" />
			</svg>
		</button>
	</div>
</nav>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(250, 250, 248, 0.88);
		backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--border-light);
		padding: 0 1.5rem;
	}
	.nav-inner {
		max-width: var(--wide);
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
	}
	.nav-logo {
		font-family: var(--serif);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text);
		text-decoration: none;
		letter-spacing: -0.01em;
	}
	.nav-logo span {
		color: var(--accent);
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}
	.nav-links a {
		color: var(--dim);
		text-decoration: none;
		font-size: 0.82rem;
		font-weight: 500;
		transition: color 0.15s;
	}
	.nav-links a:hover {
		color: var(--text);
	}
	.nav-sign {
		background: var(--accent);
		color: #fff !important;
		padding: 0.5rem 1.1rem;
		border-radius: 5px;
		font-size: 0.8rem;
		font-weight: 600;
		transition: all 0.15s;
	}
	.nav-sign:hover {
		background: var(--accent-light);
	}
	.nav-mob {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
	}
	@media (max-width: 600px) {
		.nav-links {
			display: none;
		}
		.nav-mob {
			display: block;
		}
	}
</style>
