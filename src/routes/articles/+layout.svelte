<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<!-- Fonts (match the rest of the site) -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,300;1,8..60,400;1,8..60,500&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<header class="a-nav">
	<div class="a-nav-inner">
		<a href="/" class="a-logo">Free The <span>Fungi</span></a>
		<nav class="a-links">
			<a href="/articles/">Articles</a>
			<a href="/community">Community</a>
			<a href="/#petition" class="a-sign">Sign the Petition</a>
		</nav>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="a-footer">
	<div class="a-footer-inner">
		<p class="a-flogo">Free The <span>Fungi</span></p>
		<p>
			An independent, non-commercial campaign for evidence-based psilocybin policy reform in South
			Africa. Articles are general reference information — not medical, legal, or professional advice,
			and never instructions for producing or using any controlled substance.
		</p>
		<nav class="a-footer-links">
			<a href="/">Home</a>
			<a href="/articles/">Articles</a>
			<a href="/community">Community</a>
			<a href="/#petition">Sign the Petition</a>
		</nav>
	</div>
</footer>

<style>
	.a-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(250, 250, 248, 0.88);
		backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--border-light);
		padding: 0 1.5rem;
	}
	.a-nav-inner {
		max-width: var(--wide);
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
	}
	.a-logo {
		font-family: var(--serif);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text);
		text-decoration: none;
		letter-spacing: -0.01em;
	}
	.a-logo span {
		color: var(--accent);
	}
	.a-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.a-links a {
		color: var(--dim);
		text-decoration: none;
		font-size: 0.82rem;
		font-weight: 500;
		transition: color 0.15s;
	}
	.a-links a:hover {
		color: var(--text);
	}
	.a-sign {
		background: var(--accent);
		color: #fff !important;
		padding: 0.5rem 1.1rem;
		border-radius: 5px;
		font-size: 0.8rem;
		font-weight: 600;
	}
	.a-sign:hover {
		background: var(--accent-light);
	}

	.a-footer {
		border-top: 1px solid var(--border);
		background: var(--bg-alt);
		margin-top: 4rem;
	}
	.a-footer-inner {
		max-width: var(--content);
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}
	.a-flogo {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}
	.a-flogo span {
		color: var(--accent);
	}
	.a-footer-inner p {
		font-size: 0.82rem;
		color: var(--dim);
		line-height: 1.6;
		margin-bottom: 1.25rem;
	}
	.a-footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
	}
	.a-footer-links a {
		color: var(--text);
		text-decoration: none;
		font-size: 0.85rem;
	}
	.a-footer-links a:hover {
		color: var(--accent);
	}

	@media (max-width: 600px) {
		.a-links a:not(.a-sign) {
			display: none;
		}
	}
</style>
