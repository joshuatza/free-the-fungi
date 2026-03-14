<script lang="ts">
	import { addSignature, type Signature } from '$lib/stores/signatures';
	import { generateSignedLetter } from '$lib/utils/generateLetter';
	import SignatureList from './SignatureList.svelte';

	let signed = $state(false);
	let signing = $state(false);
	let signerName = $state('');

	let fn = $state('');
	let ln = $state('');
	let em = $state('');
	let ct = $state('');
	let pv = $state('');
	let msg = $state('');
	let con = $state(false);
	let autoEmail = $state(false);

	// Share links
	let shareLinks = $state({ x: '', wa: '' });

	// Email sending state per recipient
	let emailStatus = $state<Record<string, 'idle' | 'sending' | 'sent' | 'error'>>({
		dhlomo: 'idle',
		clarke: 'idle',
		sec: 'idle',
		cull: 'idle'
	});

	let currentSig: Signature | null = $state(null);

	function handleSign(e: Event) {
		e.preventDefault();
		signing = true;

		const sig: Signature = {
			fn: fn.trim(),
			ln: ln.trim(),
			email: em.trim(),
			city: ct.trim(),
			prov: pv,
			msg: msg.trim(),
			auto: autoEmail,
			ts: Date.now()
		};

		setTimeout(async () => {
			addSignature(sig);
			signerName = sig.fn;
			currentSig = sig;
			shareLinks = {
				x: `https://twitter.com/intent/tweet?text=${encodeURIComponent('I signed the petition to decriminalise psilocybin in South Africa. The science is clear. Add your name: ')}&url=${encodeURIComponent(location.href)}`,
				wa: `https://wa.me/?text=${encodeURIComponent('I signed the petition to decriminalise psilocybin in South Africa. The science is clear. Add your name: ' + location.href)}`
			};
			signed = true;
			signing = false;

			// Auto-send to all committee members if checked
			if (sig.auto) {
				await sendEmails(['dhlomo', 'clarke', 'sec']);
			}
		}, 500);
	}

	const recipientNames: Record<string, string> = {
		dhlomo: 'Dr Dhlomo',
		clarke: 'Mrs Clarke',
		sec: 'Ms Majalamba',
		cull: 'Cullinan & Associates'
	};

	async function sendEmails(recipients: string[]) {
		if (!currentSig) return;

		for (const key of recipients) {
			emailStatus[key] = 'sending';
		}

		// Generate a signed PDF for each recipient
		const pdfs: Record<string, string> = {};
		for (const key of recipients) {
			pdfs[key] = generateSignedLetter({
				recipientName: recipientNames[key] || key,
				recipientTitle: '',
				fn: currentSig.fn,
				ln: currentSig.ln,
				city: currentSig.city,
				prov: currentSig.prov,
				email: currentSig.email,
				msg: currentSig.msg
			});
		}

		try {
			const res = await fetch('/api/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fn: currentSig.fn,
					ln: currentSig.ln,
					city: currentSig.city,
					prov: currentSig.prov,
					msg: currentSig.msg,
					recipients,
					pdfs
				})
			});

			const data = await res.json();

			if (data.results) {
				for (const r of data.results) {
					emailStatus[r.key] = r.success ? 'sent' : 'error';
				}
			} else {
				for (const key of recipients) {
					emailStatus[key] = 'error';
				}
			}
		} catch {
			for (const key of recipients) {
				emailStatus[key] = 'error';
			}
		}
	}

	async function sendSingleEmail(key: string) {
		await sendEmails([key]);
	}

	function emailBtnText(key: string): string {
		switch (emailStatus[key]) {
			case 'sending': return 'Sending...';
			case 'sent': return 'Sent ✓';
			case 'error': return 'Retry →';
			default: return key === 'cull' ? 'Reach Out →' : 'Send Email →';
		}
	}

	let copyText = $state('Copy Link');
	function copyLink() {
		navigator.clipboard.writeText(location.href).then(() => {
			copyText = '✓ Copied!';
			setTimeout(() => (copyText = 'Copy Link'), 2000);
		});
	}

	const provinces = [
		'Eastern Cape',
		'Free State',
		'Gauteng',
		'KwaZulu-Natal',
		'Limpopo',
		'Mpumalanga',
		'North West',
		'Northern Cape',
		'Western Cape'
	];
</script>

<div>
	{#if !signed}
		<div class="pet-form">
			<h3>Add Your Name</h3>
			<p class="fsub">
				Your signature sends a message to Parliament. After signing, we'll help you email the
				decision-makers directly.
			</p>
			<form onsubmit={handleSign}>
				<div class="frow">
					<div class="fg">
						<label for="fn">First Name *</label>
						<input id="fn" required placeholder="Thabo" bind:value={fn} />
					</div>
					<div class="fg">
						<label for="ln">Last Name *</label>
						<input id="ln" required placeholder="Mokoena" bind:value={ln} />
					</div>
				</div>
				<div class="fg">
					<label for="em">Email *</label>
					<input type="email" id="em" required placeholder="you@example.com" bind:value={em} />
				</div>
				<div class="frow">
					<div class="fg">
						<label for="ct">City *</label>
						<input id="ct" required placeholder="Cape Town" bind:value={ct} />
					</div>
					<div class="fg">
						<label for="pv">Province *</label>
						<select id="pv" required bind:value={pv}>
							<option value="">Select</option>
							{#each provinces as p}
								<option>{p}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="fg">
					<label for="msg"
						>Why This Matters to You <span class="opt">(optional)</span></label
					>
					<textarea id="msg" placeholder="Share your story..." bind:value={msg}></textarea>
				</div>
				<div class="fcheck">
					<input type="checkbox" id="con" required bind:checked={con} />
					<label for="con"
						>I consent to my first name, city, and province being displayed. My email will never be
						shared.</label
					>
				</div>
				<div class="fcheck">
					<input type="checkbox" id="autoEmail" bind:checked={autoEmail} />
					<label for="autoEmail"
						>Also send a pre-written email to the Portfolio Committee on Health on my behalf.</label
					>
				</div>
				<button type="submit" class="btn-sign" disabled={signing}>
					{signing ? 'Signing...' : 'Sign This Petition'}
				</button>
				<p class="fnote">Your data is stored securely. We never share your email.</p>
			</form>
		</div>
	{:else}
		<div class="sign-ok">
			<div class="chk">✓</div>
			<h3>Thank you, {signerName}.</h3>
			<p class="ok-sub">
				Your signature is recorded. Now amplify your impact — email the decision-makers directly.
			</p>
			<div class="fu-actions">
				<h4>Email These Decision-Makers</h4>
				<div class="fu-card">
					<div class="fu-info">
						<div class="fu-name">Dr Sibongiseni Dhlomo, MP</div>
						<div class="fu-role">Chair, Portfolio Committee on Health</div>
					</div>
					<button class="fu-btn" class:sent={emailStatus.dhlomo === 'sent'} disabled={emailStatus.dhlomo === 'sending'} onclick={() => sendSingleEmail('dhlomo')}>{emailBtnText('dhlomo')}</button>
				</div>
				<div class="fu-card">
					<div class="fu-info">
						<div class="fu-name">Mrs Michéle Clarke, MP</div>
						<div class="fu-role">DA Member, Portfolio Committee on Health</div>
					</div>
					<button class="fu-btn" class:sent={emailStatus.clarke === 'sent'} disabled={emailStatus.clarke === 'sending'} onclick={() => sendSingleEmail('clarke')}>{emailBtnText('clarke')}</button>
				</div>
				<div class="fu-card">
					<div class="fu-info">
						<div class="fu-name">Vuyokazi Majalamba</div>
						<div class="fu-role">Secretary, Portfolio Committee on Health</div>
					</div>
					<button class="fu-btn" class:sent={emailStatus.sec === 'sent'} disabled={emailStatus.sec === 'sending'} onclick={() => sendSingleEmail('sec')}>{emailBtnText('sec')}</button>
				</div>
				<div class="fu-card">
					<div class="fu-info">
						<div class="fu-name">Cullinan & Associates</div>
						<div class="fu-role">Legal team — ask how to support</div>
					</div>
					<button class="fu-btn" class:sent={emailStatus.cull === 'sent'} disabled={emailStatus.cull === 'sending'} onclick={() => sendSingleEmail('cull')}>{emailBtnText('cull')}</button>
				</div>
			</div>
			<div class="share-row">
				<a class="share-btn" href={shareLinks.x} target="_blank">Share on X</a>
				<a class="share-btn" href={shareLinks.wa} target="_blank">Share on WhatsApp</a>
				<button class="share-btn" onclick={copyLink}>{copyText}</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.pet-form {
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 2rem;
		position: relative;
		overflow: hidden;
	}
	.pet-form::before {
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
	.pet-form h3 {
		font-family: var(--serif);
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 0.35rem;
	}
	.fsub {
		font-size: 0.88rem;
		color: var(--dim);
		margin-bottom: 1.75rem;
	}
	.fg {
		margin-bottom: 1rem;
	}
	.fg label {
		display: block;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--dim);
		margin-bottom: 0.3rem;
	}
	.opt {
		text-transform: none;
		font-weight: 400;
	}
	.fg input,
	.fg textarea,
	.fg select {
		width: 100%;
		padding: 0.7rem 0.85rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 5px;
		color: var(--text);
		font-family: var(--sans);
		font-size: 0.9rem;
		transition: all 0.2s;
		outline: none;
	}
	.fg input:focus,
	.fg textarea:focus,
	.fg select:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px rgba(45, 107, 74, 0.06);
	}
	.fg textarea {
		resize: vertical;
		min-height: 70px;
	}
	.frow {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}
	.fcheck {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.fcheck input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: var(--accent);
		margin-top: 2px;
		flex-shrink: 0;
	}
	.fcheck label {
		font-size: 0.82rem;
		color: var(--dim);
		line-height: 1.45;
		cursor: pointer;
	}
	.btn-sign {
		width: 100%;
		background: var(--accent);
		color: #fff;
		padding: 0.85rem;
		border: none;
		border-radius: 5px;
		font-family: var(--sans);
		font-weight: 700;
		font-size: 0.92rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-sign:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(45, 107, 74, 0.15);
	}
	.btn-sign:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
	.fnote {
		font-size: 0.72rem;
		color: var(--dim-light);
		margin-top: 0.75rem;
		text-align: center;
	}

	/* Success state */
	.sign-ok {
		text-align: center;
		padding: 1.5rem 0;
	}
	.chk {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(130, 190, 160, 0.15), rgba(168, 130, 200, 0.12));
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.25rem;
		font-size: 1.4rem;
		color: var(--accent);
		animation: breathe 4s ease-in-out infinite;
	}
	.sign-ok h3 {
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 600;
		margin-bottom: 0.35rem;
	}
	.ok-sub {
		color: var(--dim);
		font-size: 0.9rem;
		margin-bottom: 2rem;
	}
	.fu-actions {
		text-align: left;
	}
	.fu-actions h4 {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 1rem;
		text-align: center;
	}
	.fu-card {
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 1rem 1.25rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		transition: all 0.2s;
		flex-wrap: wrap;
	}
	.fu-card:hover {
		border-color: var(--accent);
		background: rgba(45, 107, 74, 0.02);
	}
	.fu-name {
		font-size: 0.88rem;
		font-weight: 600;
	}
	.fu-role {
		font-size: 0.75rem;
		color: var(--dim);
	}
	.fu-btn {
		background: var(--accent);
		color: #fff;
		padding: 0.45rem 0.9rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.15s;
		white-space: nowrap;
		flex-shrink: 0;
		border: none;
		cursor: pointer;
		font-family: var(--sans);
	}
	.fu-btn:hover {
		background: var(--accent-light);
	}
	.fu-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.fu-btn.sent {
		background: rgba(45, 107, 74, 0.12);
		color: var(--accent);
	}
	.share-row {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		margin-top: 1.75rem;
		flex-wrap: wrap;
	}
	.share-btn {
		padding: 0.5rem 1rem;
		border-radius: 5px;
		font-size: 0.78rem;
		font-weight: 500;
		text-decoration: none;
		border: 1px solid var(--border);
		color: var(--text);
		transition: all 0.15s;
		background: none;
		cursor: pointer;
		font-family: var(--sans);
	}
	.share-btn:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	@keyframes breathe {
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

	@media (max-width: 600px) {
		.frow {
			grid-template-columns: 1fr;
		}
		.fu-card {
			flex-direction: column;
			align-items: flex-start;
		}
		.share-row {
			flex-direction: column;
		}
	}
</style>
