<script lang="ts">
	import { addSignature, type Signature } from '$lib/stores/signatures';
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

	// Email link state
	let emailLinks = $state({
		dhlomo: '',
		clarke: '',
		sec: '',
		cull: '',
		shareX: '',
		shareWA: ''
	});

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

		setTimeout(() => {
			addSignature(sig);
			signerName = sig.fn;
			buildEmailLinks(sig);
			signed = true;
			signing = false;

			if (sig.auto) {
				const subj = encodeURIComponent('Constituent Call for Psilocybin Reform');
				const body = buildBody(sig, 'Members of the Portfolio Committee on Health');
				setTimeout(() => {
					window.open(
						`mailto:sdhlomo@parliament.gov.za,mclarke@parliament.gov.za,vmajalamba@parliament.gov.za?subject=${subj}&body=${body}`,
						'_blank'
					);
				}, 600);
			}
		}, 500);
	}

	function buildBody(s: Signature, recipient: string) {
		return encodeURIComponent(
			`Dear ${recipient},\n\nI am writing as a South African citizen from ${s.city}, ${s.prov} to add my voice to the call for psilocybin reform.\n\nI have signed the Free The Fungi petition calling on the Portfolio Committee on Health and SAHPRA to review the Schedule 7 classification of psilocybin, which is not supported by scientific evidence.\n\nThe pending constitutional challenge (Cromhout and Ferguson v Minister of Justice, Case No: 2024-040119) and the 2018 cannabis precedent both show this prohibition is constitutionally vulnerable. I urge the Committee to engage proactively.\n\n${s.msg ? 'Personal note: ' + s.msg + '\n\n' : ''}Yours faithfully,\n${s.fn} ${s.ln}\n${s.city}, ${s.prov}`
		);
	}

	function buildEmailLinks(s: Signature) {
		const subj = encodeURIComponent('Constituent Call for Psilocybin Reform');
		emailLinks = {
			dhlomo: `mailto:sdhlomo@parliament.gov.za?subject=${subj}&body=${buildBody(s, 'Dr Dhlomo')}`,
			clarke: `mailto:mclarke@parliament.gov.za?subject=${subj}&body=${buildBody(s, 'Mrs Clarke')}`,
			sec: `mailto:vmajalamba@parliament.gov.za?subject=${subj}&body=${buildBody(s, 'Ms Majalamba')}`,
			cull: `mailto:info@cullinans.co.za?subject=${encodeURIComponent('Supporting the Cromhout Psilocybin Case')}&body=${encodeURIComponent(`Dear Cullinan & Associates,\n\nI signed the Free The Fungi petition and would like to support the Cromhout case. Is there a legal defence fund or other way to contribute?\n\nKind regards,\n${s.fn} ${s.ln}\n${s.city}, ${s.prov}`)}`,
			shareX: `https://twitter.com/intent/tweet?text=${encodeURIComponent('I signed the petition to decriminalise psilocybin in South Africa. The science is clear. Add your name: ')}&url=${encodeURIComponent(typeof window !== 'undefined' ? location.href : '')}`,
			shareWA: `https://wa.me/?text=${encodeURIComponent('I signed the petition to decriminalise psilocybin in South Africa. The science is clear. Add your name: ' + (typeof window !== 'undefined' ? location.href : ''))}`
		};
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
					<a class="fu-btn" href={emailLinks.dhlomo} target="_blank">Send Email →</a>
				</div>
				<div class="fu-card">
					<div class="fu-info">
						<div class="fu-name">Mrs Michéle Clarke, MP</div>
						<div class="fu-role">DA Member, Portfolio Committee on Health</div>
					</div>
					<a class="fu-btn" href={emailLinks.clarke} target="_blank">Send Email →</a>
				</div>
				<div class="fu-card">
					<div class="fu-info">
						<div class="fu-name">Vuyokazi Majalamba</div>
						<div class="fu-role">Secretary, Portfolio Committee on Health</div>
					</div>
					<a class="fu-btn" href={emailLinks.sec} target="_blank">Send Email →</a>
				</div>
				<div class="fu-card">
					<div class="fu-info">
						<div class="fu-name">Cullinan & Associates</div>
						<div class="fu-role">Legal team — ask how to support</div>
					</div>
					<a class="fu-btn" href={emailLinks.cull} target="_blank">Reach Out →</a>
				</div>
			</div>
			<div class="share-row">
				<a class="share-btn" href={emailLinks.shareX} target="_blank">Share on X</a>
				<a class="share-btn" href={emailLinks.shareWA} target="_blank">Share on WhatsApp</a>
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
	}
	.fu-btn:hover {
		background: var(--accent-light);
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
