<script lang="ts">
	import { page } from '$app/stores';

	let { user }: { user: { id: string; username: string; email: string } | null } = $props();

	const pathname = $derived($page.url.pathname);

	async function logout() {
		await fetch('/api/community/auth/logout', { method: 'POST' });
		window.location.href = '/community/new';
	}
</script>

<nav class="community-nav">
	<div class="nav-inner">
		<a href="/" class="nav-logo">Free The <span>Fungi</span></a>
		<div class="nav-links">
			<a href="/community/new" class="nav-tab" class:active={pathname.startsWith('/community/new')}>New</a>
			<a href="/community/threads" class="nav-tab" class:active={pathname.startsWith('/community/threads')}>Threads</a>
			<a href="/community/ask" class="nav-tab" class:active={pathname.startsWith('/community/ask')}>Ask</a>
			<a href="/community/submit" class="nav-tab" class:active={pathname === '/community/submit'}>Submit</a>
		</div>
		<div class="nav-auth">
			{#if user}
				<a href="/community/user/{user.username}" class="nav-user">{user.username}</a>
				<button class="nav-logout" onclick={logout}>log out</button>
			{:else}
				<a href="/community/login" class="nav-login">Log in</a>
			{/if}
		</div>
	</div>
</nav>

<style>
	.community-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(250, 250, 248, 0.92);
		backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--border-light);
		padding: 0 1rem;
	}
	.nav-inner {
		max-width: 780px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		height: 48px;
		gap: 1.5rem;
	}
	.nav-logo {
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text);
		text-decoration: none;
		white-space: nowrap;
	}
	.nav-logo span {
		color: var(--accent);
	}
	.nav-links {
		display: flex;
		gap: 0.25rem;
		flex: 1;
	}
	.nav-tab {
		padding: 0.3rem 0.65rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--dim);
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.15s;
	}
	.nav-tab:hover {
		color: var(--text);
		background: var(--bg-alt);
	}
	.nav-tab.active {
		color: var(--accent);
		background: var(--accent-bg);
		font-weight: 600;
	}
	.nav-auth {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		white-space: nowrap;
	}
	.nav-user {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--accent);
		text-decoration: none;
	}
	.nav-user:hover {
		text-decoration: underline;
	}
	.nav-logout {
		font-size: 0.75rem;
		color: var(--dim);
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--sans);
	}
	.nav-logout:hover {
		color: var(--text);
	}
	.nav-login {
		font-size: 0.8rem;
		font-weight: 600;
		color: #fff;
		background: var(--accent);
		padding: 0.35rem 0.85rem;
		border-radius: 4px;
		text-decoration: none;
		transition: background 0.15s;
	}
	.nav-login:hover {
		background: var(--accent-light);
	}
	@media (max-width: 600px) {
		.nav-inner {
			gap: 0.75rem;
		}
		.nav-logo {
			font-size: 0.85rem;
		}
	}
</style>
