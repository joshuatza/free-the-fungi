<script lang="ts">
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(:root) {
		--bg: #fafaf8;
		--bg-alt: #f4f3ef;
		--surface: #fff;
		--border: #e2e0d8;
		--border-light: #edece7;
		--text: #1a1a18;
		--dim: #6b6a64;
		--dim-light: #9c9b94;
		--accent: #2d6b4a;
		--accent-light: #3a8a5e;
		--accent-bg: rgba(45, 107, 74, 0.06);
		--glow-1: #e8d5f5;
		--glow-2: #d5ede0;
		--glow-3: #f5ecd5;
		--glow-4: #d5e0f5;
		--glow-5: #f2d5e8;
		--red: #a83b2a;
		--red-bg: rgba(168, 59, 42, 0.07);
		--serif: 'Source Serif 4', Georgia, serif;
		--sans: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
		--content: 680px;
		--wide: 1080px;
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
		-webkit-font-smoothing: antialiased;
	}

	:global(body) {
		font-family: var(--sans);
		background: var(--bg);
		color: var(--text);
		font-size: 16px;
		line-height: 1.75;
		overflow-x: hidden;
	}

	@keyframes -global-glowShift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	@keyframes -global-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	@keyframes -global-breathe {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.9;
		}
	}

	/* GLOW LINE */
	:global(.glow-line) {
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--glow-2),
			var(--glow-1),
			var(--glow-4),
			var(--glow-2),
			transparent
		);
		background-size: 200% 100%;
		animation: glowShift 8s ease-in-out infinite;
		opacity: 0.5;
	}

	/* HERO */
	:global(.hero) {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 5rem 1.5rem 4rem;
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 4rem;
		align-items: start;
		position: relative;
	}
	:global(.hero-content) {
		max-width: 620px;
	}
	:global(.hero-tag) {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		background: var(--accent-bg);
		color: var(--accent);
		padding: 0.35rem 0.85rem;
		border-radius: 100px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		margin-bottom: 1.75rem;
	}
	:global(.pulse) {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		animation: pulse 2s infinite;
	}
	:global(.hero h1) {
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3.4rem);
		line-height: 1.12;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-bottom: 1.25rem;
		color: var(--text);
	}
	:global(.hero h1 em) {
		font-style: italic;
		font-weight: 400;
		background: linear-gradient(135deg, #2d6b4a, #5b8a6f, #7b6baa);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	:global(.hero-sub) {
		font-size: 1.08rem;
		color: var(--dim);
		line-height: 1.8;
		margin-bottom: 2rem;
	}
	:global(.hero-ctas) {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	:global(.btn-p) {
		background: var(--accent);
		color: #fff;
		padding: 0.75rem 1.6rem;
		border: none;
		border-radius: 5px;
		font-family: var(--sans);
		font-weight: 600;
		font-size: 0.88rem;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
		position: relative;
		overflow: hidden;
	}
	:global(.btn-p:hover) {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(45, 107, 74, 0.15);
	}
	:global(.btn-s) {
		background: var(--surface);
		color: var(--text);
		padding: 0.75rem 1.6rem;
		border: 1px solid var(--border);
		border-radius: 5px;
		font-family: var(--sans);
		font-weight: 500;
		font-size: 0.88rem;
		cursor: pointer;
		transition: all 0.15s;
		text-decoration: none;
		display: inline-block;
	}
	:global(.btn-s:hover) {
		border-color: var(--dim-light);
		background: var(--bg-alt);
	}

	/* HERO SIDEBAR */
	:global(.hero-petition) {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 1.75rem;
		position: sticky;
		top: 72px;
		overflow: hidden;
	}
	:global(.hero-petition::before) {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(
			90deg,
			var(--glow-2),
			var(--glow-1),
			var(--glow-4),
			var(--glow-2)
		);
		background-size: 300% 100%;
		animation: glowShift 6s ease-in-out infinite;
	}
	:global(.hp-count) {
		font-family: var(--serif);
		font-size: 2.8rem;
		font-weight: 700;
		color: var(--accent);
		line-height: 1;
	}
	:global(.hp-label) {
		font-size: 0.85rem;
		color: var(--dim);
		margin-bottom: 1.25rem;
	}
	:global(.hp-bar) {
		width: 100%;
		height: 5px;
		background: var(--bg-alt);
		border-radius: 3px;
		margin-bottom: 0.4rem;
		overflow: hidden;
	}
	:global(.hp-fill) {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), #7b6baa);
		border-radius: 3px;
		transition: width 1.2s ease;
	}
	:global(.hp-target) {
		font-size: 0.75rem;
		color: var(--dim-light);
		margin-bottom: 1.5rem;
	}
	:global(.hp-recent) {
		border-top: 1px solid var(--border-light);
		padding-top: 1rem;
	}
	:global(.hp-recent h4) {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--dim-light);
		margin-bottom: 0.75rem;
	}

	/* STATS */
	:global(.stats-strip) {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 3rem 1.5rem;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
	}
	:global(.stat-item) {
		text-align: center;
		padding: 0 1rem;
	}
	:global(.stat-item .n) {
		font-family: var(--serif);
		font-size: 2rem;
		font-weight: 700;
		color: var(--text);
		line-height: 1;
		margin-bottom: 0.35rem;
	}
	:global(.stat-item .l) {
		font-size: 0.78rem;
		color: var(--dim);
		line-height: 1.4;
	}

	/* ARTICLE */
	:global(.article) {
		max-width: var(--content);
		margin: 0 auto;
		padding: 4rem 1.5rem;
	}
	:global(.label) {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 0.75rem;
	}
	:global(.article h2),
	:global(.wide-inner h2) {
		font-family: var(--serif);
		font-size: clamp(1.6rem, 3.5vw, 2.2rem);
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.015em;
		margin-bottom: 1rem;
	}
	:global(.lead) {
		font-size: 1.05rem;
		color: var(--dim);
		line-height: 1.8;
		margin-bottom: 2.5rem;
	}
	:global(.article p) {
		margin-bottom: 1.5rem;
		color: var(--text);
		line-height: 1.8;
	}

	/* EVIDENCE CARDS */
	:global(.ev-cards) {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	:global(.ev-card) {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1.5rem 1.75rem;
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 1.25rem;
		align-items: start;
		transition: all 0.25s;
		position: relative;
		overflow: hidden;
	}
	:global(.ev-card:hover) {
		border-color: var(--dim-light);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
	}
	:global(.ev-num) {
		font-family: var(--serif);
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--dim-light);
		line-height: 1;
	}
	:global(.ev-body h3) {
		font-family: var(--serif);
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.35rem;
	}
	:global(.ev-body p) {
		font-size: 0.9rem;
		color: var(--dim);
		line-height: 1.65;
		margin: 0;
	}
	:global(.ev-verdict) {
		padding: 0.3rem 0.7rem;
		border-radius: 100px;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		background: var(--red-bg);
		color: var(--red);
		white-space: nowrap;
		align-self: center;
	}

	/* HOPE */
	:global(.hope-break) {
		padding: 4rem 1.5rem;
		text-align: center;
		position: relative;
		overflow: hidden;
	}
	:global(.hope-orbs) {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.hope-orb) {
		position: absolute;
		border-radius: 50%;
		filter: blur(50px);
	}
	:global(.hope-orb:nth-child(1)) {
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, rgba(168, 130, 200, 0.12), transparent);
		animation: breathe 6s ease-in-out infinite;
	}
	:global(.hope-orb:nth-child(2)) {
		width: 250px;
		height: 250px;
		background: radial-gradient(circle, rgba(130, 190, 160, 0.12), transparent);
		animation: breathe 6s ease-in-out infinite 2s;
		left: 30%;
	}
	:global(.hope-orb:nth-child(3)) {
		width: 280px;
		height: 280px;
		background: radial-gradient(circle, rgba(130, 160, 200, 0.1), transparent);
		animation: breathe 6s ease-in-out infinite 4s;
		right: 20%;
	}
	:global(.hope-text) {
		position: relative;
		z-index: 1;
		max-width: 560px;
		margin: 0 auto;
	}
	:global(.hope-text h2) {
		font-family: var(--serif);
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 400;
		font-style: italic;
		line-height: 1.35;
		margin-bottom: 0.75rem;
		background: linear-gradient(135deg, #2d6b4a, #7b6baa, #5b8a6f);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	:global(.hope-text p) {
		font-size: 0.95rem;
		color: var(--dim);
		line-height: 1.7;
	}

	/* RIGHTS */
	:global(.wide-section) {
		background: var(--bg-alt);
		position: relative;
		overflow: hidden;
	}
	:global(.wide-inner) {
		max-width: var(--content);
		margin: 0 auto;
		padding: 4rem 1.5rem;
		position: relative;
	}
	:global(.rights-grid) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}
	:global(.right-item) {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1.25rem 1.5rem;
		transition: all 0.25s;
	}
	:global(.right-item:hover) {
		border-color: var(--accent);
		transform: translateY(-1px);
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.03);
	}
	:global(.sec) {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 0.3rem;
	}
	:global(.right-item h3) {
		font-family: var(--serif);
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.3rem;
	}
	:global(.right-item p) {
		font-size: 0.82rem;
		color: var(--dim);
		line-height: 1.55;
		margin: 0;
	}

	/* TIMELINE */
	:global(.tl) {
		position: relative;
		padding-left: 2rem;
		margin-bottom: 2rem;
	}
	:global(.tl::before) {
		content: '';
		position: absolute;
		top: 6px;
		bottom: 6px;
		left: 5px;
		width: 1px;
		background: linear-gradient(to bottom, var(--accent), rgba(123, 107, 170, 0.4), var(--border));
	}
	:global(.tl-item) {
		position: relative;
		padding-bottom: 2rem;
		padding-left: 0.5rem;
	}
	:global(.tl-item:last-child) {
		padding-bottom: 0;
	}
	:global(.tl-dot) {
		position: absolute;
		left: -2rem;
		top: 6px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		border: 2px solid var(--accent);
		background: var(--bg);
	}
	:global(.tl-dot.filled) {
		background: var(--accent);
		box-shadow: 0 0 8px rgba(45, 107, 74, 0.2);
	}
	:global(.tl-dot.dashed) {
		border-style: dashed;
		border-color: var(--dim-light);
	}
	:global(.tl-date) {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 0.15rem;
	}
	:global(.tl-item h3) {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		margin-bottom: 0.2rem;
	}
	:global(.tl-item p) {
		font-size: 0.88rem;
		color: var(--dim);
		line-height: 1.65;
		margin: 0;
	}

	/* BLOCKQUOTE */
	:global(.bq) {
		border-left: 3px solid transparent;
		border-image: linear-gradient(to bottom, var(--accent), rgba(123, 107, 170, 0.6)) 1;
		padding: 1.5rem 0 1.5rem 1.75rem;
		margin: 3rem 0;
	}
	:global(.bq blockquote) {
		font-family: var(--serif);
		font-size: 1.3rem;
		font-style: italic;
		line-height: 1.45;
		color: var(--text);
		margin-bottom: 0.5rem;
	}
	:global(.bq cite) {
		font-family: var(--sans);
		font-style: normal;
		font-size: 0.8rem;
		color: var(--dim);
		font-weight: 500;
	}

	/* PETITION */
	:global(.petition-full) {
		background: var(--surface);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		position: relative;
		overflow: hidden;
	}
	:global(.petition-inner) {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 4rem 1.5rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: start;
		position: relative;
	}
	:global(.pet-count) {
		font-family: var(--serif);
		font-size: 4rem;
		font-weight: 700;
		line-height: 1;
		background: linear-gradient(135deg, var(--accent), #7b6baa);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	:global(.pet-label) {
		font-size: 0.95rem;
		color: var(--dim);
		margin-bottom: 1.5rem;
	}
	:global(.pet-bar) {
		width: 100%;
		height: 6px;
		background: var(--bg-alt);
		border-radius: 3px;
		margin-bottom: 0.4rem;
		overflow: hidden;
	}
	:global(.pet-fill) {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), #7b6baa, var(--accent-light));
		background-size: 200% 100%;
		animation: glowShift 4s ease-in-out infinite;
		border-radius: 3px;
		transition: width 1.5s ease;
	}
	:global(.pet-target) {
		font-size: 0.8rem;
		color: var(--dim-light);
		margin-bottom: 2.5rem;
	}
	:global(.pet-demand) {
		background: var(--accent-bg);
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(45, 107, 74, 0.08);
	}
	:global(.pet-demand h3) {
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--accent);
	}
	:global(.pet-demand p) {
		font-size: 0.88rem;
		color: var(--dim);
		line-height: 1.65;
		margin: 0;
	}
	:global(.pet-recent h4) {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--dim-light);
		margin-bottom: 0.75rem;
	}

	/* FLOATING COUNTER */
	:global(.float-cta) {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 90;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1rem 1.25rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		cursor: pointer;
		transition: all 0.25s;
		max-width: 180px;
	}
	:global(.float-cta:hover) {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
	}
	:global(.fc-n) {
		font-family: var(--serif);
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--accent);
		line-height: 1;
	}
	:global(.fc-l) {
		font-size: 0.68rem;
		color: var(--dim);
		letter-spacing: 0.04em;
	}
	:global(.fc-bar) {
		width: 100%;
		height: 3px;
		background: var(--bg-alt);
		border-radius: 2px;
		margin-top: 0.5rem;
		overflow: hidden;
	}
	:global(.fc-fill) {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), #7b6baa);
		border-radius: 2px;
		transition: width 1s ease;
	}

	/* FOOTER */
	:global(footer) {
		border-top: 1px solid var(--border);
		background: var(--bg-alt);
		position: relative;
	}
	:global(.footer-inner) {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 3.5rem 1.5rem;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 2.5rem;
	}
	:global(.flogo) {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}
	:global(.flogo span) {
		color: var(--accent);
	}
	:global(.footer-about p) {
		font-size: 0.82rem;
		color: var(--dim);
		line-height: 1.6;
	}
	:global(.fcol h4) {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--dim-light);
		margin-bottom: 0.75rem;
	}
	:global(.fcol a) {
		display: block;
		color: var(--text);
		text-decoration: none;
		font-size: 0.85rem;
		padding: 0.25rem 0;
		transition: color 0.15s;
	}
	:global(.fcol a:hover) {
		color: var(--accent);
	}
	:global(.footer-bot) {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 1.5rem;
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--dim-light);
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	/* RESPONSIVE */
	@media (max-width: 900px) {
		:global(.hero) {
			grid-template-columns: 1fr;
			gap: 2rem;
			padding: 3.5rem 1.5rem 2.5rem;
		}
		:global(.hero-petition) {
			position: static;
			order: -1;
		}
		:global(.stats-strip) {
			grid-template-columns: repeat(2, 1fr);
			gap: 0;
		}
		:global(.stat-item) {
			padding: 1rem;
			border-bottom: 1px solid var(--border-light);
		}
		:global(.rights-grid) {
			grid-template-columns: 1fr;
		}
		:global(.petition-inner) {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
		:global(.footer-inner) {
			grid-template-columns: 1fr 1fr;
		}
		:global(.ev-card) {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		:global(.ev-verdict) {
			justify-self: start;
		}
		:global(.ev-num) {
			display: none;
		}
	}

	@media (max-width: 600px) {
		:global(.hero) {
			padding: 2.5rem 1.25rem 2rem;
		}
		:global(.hero h1) {
			font-size: 1.9rem;
		}
		:global(.stats-strip) {
			grid-template-columns: 1fr;
		}
		:global(.article) {
			padding: 2.5rem 1.25rem;
		}
		:global(.wide-inner) {
			padding: 2.5rem 1.25rem;
		}
		:global(.petition-inner) {
			padding: 2.5rem 1.25rem;
		}
		:global(.footer-inner) {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		:global(.float-cta) {
			bottom: 0.75rem;
			right: 0.75rem;
		}
		:global(.hope-break) {
			padding: 3rem 1.25rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.hope-orb) {
			animation: none !important;
			opacity: 0.5 !important;
		}
		:global(.glow-line),
		:global(.pet-fill) {
			animation: none !important;
		}
	}
</style>
