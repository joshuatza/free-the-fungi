<script lang="ts">
	import PhysicsScene from '$lib/components/PhysicsScene.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import SignatureList from '$lib/components/SignatureList.svelte';
	import PetitionForm from '$lib/components/PetitionForm.svelte';
	import { count, progress, goal, signatures } from '$lib/stores/signatures';
</script>

<svelte:head>
	<title>Free The Fungi — Petition to Decriminalise Psilocybin in South Africa</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,300;1,8..60,400;1,8..60,500&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<PhysicsScene />
<Nav />

<!-- FLOATING COUNTER -->
<div
	class="float-cta"
	role="button"
	tabindex="0"
	onclick={() => document.getElementById('petition')?.scrollIntoView({ behavior: 'smooth' })}
	onkeydown={(e) => e.key === 'Enter' && document.getElementById('petition')?.scrollIntoView({ behavior: 'smooth' })}
>
	<div class="fc-n">{$count.toLocaleString()}</div>
	<div class="fc-l">signatures</div>
	<div class="fc-bar"><div class="fc-fill" style="width:{$progress}%"></div></div>
</div>

<!-- HERO -->
<section class="hero" id="top">
	<div class="hero-content">
		<div class="hero-tag"><span class="pulse"></span> Constitutional challenge pending</div>
		<h1>South Africa Decriminalised Cannabis. <em>Psilocybin Is Next.</em></h1>
		<p class="hero-sub">
			Psilocybin mushrooms are classified alongside heroin under Schedule 7 — despite overwhelming
			evidence that they are non-addictive, non-toxic, and therapeutically valuable. A landmark
			court case could change everything. Add your name.
		</p>
		<div class="hero-ctas">
			<a href="#petition" class="btn-p">Sign the Petition</a>
			<a href="#evidence" class="btn-s">Read the Evidence</a>
		</div>
	</div>
	<div class="hero-petition">
		<div class="hp-count">{$count.toLocaleString()}</div>
		<div class="hp-label">people have signed</div>
		<div class="hp-bar"><div class="hp-fill" style="width:{$progress}%"></div></div>
		<div class="hp-target">
			{$count >= goal ? 'Goal reached!' : `Goal: ${goal.toLocaleString()}`}
		</div>
		<div class="hp-recent">
			<h4>Recent Signatures</h4>
			<SignatureList max={4} />
		</div>
	</div>
</section>

<!-- STATS -->
<div class="glow-line"></div>
<div class="stats-strip">
	<div class="stat-item">
		<div class="n">1 in 6</div>
		<div class="l">South Africans suffer from depression, anxiety, or substance abuse</div>
	</div>
	<div class="stat-item">
		<div class="n">23</div>
		<div class="l">suicides per day in South Africa</div>
	</div>
	<div class="stat-item">
		<div class="n">0</div>
		<div class="l">known lethal overdoses from psilocybin</div>
	</div>
	<div class="stat-item">
		<div class="n">R35bn</div>
		<div class="l">annual cost of mental health disorders</div>
	</div>
</div>
<div class="glow-line"></div>

<!-- EVIDENCE -->
<article class="article" id="evidence">
	<div class="label">The Science</div>
	<h2>Schedule 7 Requires a Substance to Be Harmful, Addictive, and Without Medical Use</h2>
	<p class="lead">
		SAHPRA classifies psilocybin as Schedule 7 — alongside heroin and fentanyl. That
		classification requires three criteria. Psilocybin fails all three.
	</p>
	<div class="ev-cards">
		<div class="ev-card">
			<div class="ev-num">01</div>
			<div class="ev-body">
				<h3>"Harmful"</h3>
				<p>
					Professor David Nutt describes psilocybin as among the safest drugs known to science.
					Extremely low toxicity. Virtually no risk of lethal overdose.
				</p>
			</div>
			<div class="ev-verdict">Not supported</div>
		</div>
		<div class="ev-card">
			<div class="ev-num">02</div>
			<div class="ev-body">
				<h3>"Dependence-Producing"</h3>
				<p>
					Animal and human research confirm psilocybin is not addictive. Described as
					"anti-addictive" — actively used to treat nicotine and alcohol addiction.
				</p>
			</div>
			<div class="ev-verdict">Not supported</div>
		</div>
		<div class="ev-card">
			<div class="ev-num">03</div>
			<div class="ev-body">
				<h3>"No Medical Use"</h3>
				<p>
					Clinical trials at Johns Hopkins and Imperial College London show sustained efficacy for
					depression, PTSD, anxiety, and addiction. Australia approved prescription use in 2023.
				</p>
			</div>
			<div class="ev-verdict">Not supported</div>
		</div>
	</div>
</article>

<!-- HOPE BREAK -->
<section class="hope-break">
	<div class="hope-orbs">
		<div class="hope-orb"></div>
		<div class="hope-orb"></div>
		<div class="hope-orb"></div>
	</div>
	<div class="hope-text">
		<h2>Healing should not be a crime.</h2>
		<p>
			Thousands of South Africans living with depression, trauma, and addiction deserve access to
			every safe, evidence-based treatment available. The science is clear. The law must follow.
		</p>
	</div>
</section>

<!-- RIGHTS -->
<section class="wide-section" id="rights">
	<div class="wide-inner">
		<div class="label">Constitutional Rights</div>
		<h2>The Same Constitution That Freed Cannabis</h2>
		<p class="lead">
			In 2018, the Constitutional Court ruled in <em>Prince</em> that private cannabis use was
			protected by the right to privacy. The same reasoning applies with even greater force to
			psilocybin.
		</p>
		<div class="rights-grid">
			<div class="right-item">
				<div class="sec">Section 14</div>
				<h3>Privacy</h3>
				<p>The choice to ingest a substance in private lies at the core of personal liberty.</p>
			</div>
			<div class="right-item">
				<div class="sec">Section 10</div>
				<h3>Dignity</h3>
				<p>Subjecting intimate personal choices to criminal law infringes human dignity.</p>
			</div>
			<div class="right-item">
				<div class="sec">Section 12(2)</div>
				<h3>Bodily & Psychological Integrity</h3>
				<p>
					The right to cognitive liberty — self-determination over one's mind — is violated.
				</p>
			</div>
			<div class="right-item">
				<div class="sec">Section 27</div>
				<h3>Access to Healthcare</h3>
				<p>Criminalising a proven therapeutic substance denies access to treatment.</p>
			</div>
			<div class="right-item">
				<div class="sec">Section 15</div>
				<h3>Freedom of Belief</h3>
				<p>
					Forcing a choice between spiritual practice and law contradicts the Constitution.
				</p>
			</div>
			<div class="right-item">
				<div class="sec">Section 9</div>
				<h3>Equality</h3>
				<p>
					Criminalising psilocybin while permitting far more harmful alcohol and tobacco is
					irrational.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- TIMELINE -->
<article class="article" id="timeline">
	<div class="label">The Court Case</div>
	<h2>Cromhout & Ferguson v Minister of Justice</h2>
	<p class="lead">
		Case No: 2024-040119, Gauteng High Court. Represented by Cullinan & Associates — the same
		firm that decriminalised cannabis.
	</p>
	<div class="tl">
		<div class="tl-item">
			<div class="tl-dot filled"></div>
			<div class="tl-date">December 2014</div>
			<h3>Monica Cromhout arrested</h3>
			<p>
				A retired trauma counsellor faces 15 years for facilitating psilocybin sessions.
			</p>
		</div>
		<div class="tl-item">
			<div class="tl-dot filled"></div>
			<div class="tl-date">September 2018</div>
			<h3>Cannabis decriminalised</h3>
			<p>
				The Constitutional Court rules in <em>Prince</em> that private cannabis use is protected.
			</p>
		</div>
		<div class="tl-item">
			<div class="tl-dot filled"></div>
			<div class="tl-date">12 April 2024</div>
			<h3>Application filed</h3>
			<p>Cromhout and author Melinda Ferguson launch a constitutional challenge.</p>
		</div>
		<div class="tl-item">
			<div class="tl-dot filled"></div>
			<div class="tl-date">6 December 2024</div>
			<h3>State opposes</h3>
			<p>
				Only the DG of Health opposed. Ministers of Justice, Police, and Social Development did
				not.
			</p>
		</div>
		<div class="tl-item">
			<div class="tl-dot dashed"></div>
			<div class="tl-date">Pending</div>
			<h3>Judgment awaited</h3>
			<p>
				If successful: prohibition declared unconstitutional, Parliament given 24 months to
				regulate.
			</p>
		</div>
	</div>
	<div class="bq">
		<blockquote>
			"The law allows far more harmful substances — alcohol, tobacco, and now cannabis."
		</blockquote>
		<cite>Monica Cromhout — Court Application, 2024</cite>
	</div>
</article>

<!-- PETITION -->
<section class="petition-full" id="petition">
	<div class="petition-inner">
		<div class="pet-left">
			<div class="label">Sign the Petition</div>
			<div class="pet-count">{$count.toLocaleString()}</div>
			<div class="pet-label">people have signed this petition</div>
			<div class="pet-bar"><div class="pet-fill" style="width:{$progress}%"></div></div>
			<div class="pet-target">
				{$count >= goal
					? 'Goal reached — keep going!'
					: `${(goal - $count).toLocaleString()} more needed`}
			</div>
			<div class="pet-demand">
				<h3>What We're Asking</h3>
				<p>
					We call on the Portfolio Committee on Health and SAHPRA to review the Schedule 7
					classification of psilocybin, engage with the pending constitutional challenge, and
					consider a framework for adult private use, supervised therapy, and research.
				</p>
			</div>
			<div class="pet-recent">
				<h4>Recent Signatures</h4>
				<SignatureList max={8} />
			</div>
		</div>
		<div>
			<PetitionForm />
		</div>
	</div>
</section>

<!-- FOOTER -->
<footer>
	<div class="footer-inner">
		<div class="footer-about">
			<div class="flogo">Free The <span>Fungi</span></div>
			<p>
				A citizen-led campaign supporting the constitutional challenge to decriminalise psilocybin
				in South Africa. We are South Africans who believe in evidence-based drug policy and
				constitutional rights.
			</p>
		</div>
		<div class="fcol">
			<h4>Organisations</h4>
			<a href="https://www.psychedelicsociety.co.za" target="_blank">Psychedelic Society SA</a>
			<a href="https://www.myshrooms.co.za" target="_blank">MyShrooms</a>
			<a href="https://psychonauts.co.za" target="_blank">Psychonauts Podcast</a>
			<a href="https://cullinans.co.za" target="_blank">Cullinan & Associates</a>
		</div>
		<div class="fcol">
			<h4>Research</h4>
			<a href="https://journals.co.za/doi/10.1080/02587203.2023.2202875" target="_blank"
				>Cognitive Liberty (SAJHR)</a
			>
			<a
				href="https://scielo.org.za/scielo.php?script=sci_arttext&pid=S2077-49072023000100001"
				target="_blank">Right to Privacy (PER)</a
			>
		</div>
		<div class="fcol">
			<h4>Parliament</h4>
			<a href="https://www.parliament.gov.za/committee-details/261" target="_blank"
				>Portfolio Committee on Health</a
			>
			<a href="https://pa.org.za/write/recipients/" target="_blank">Write to Your MP</a>
			<a href="https://www.saflii.org" target="_blank">SAFLII</a>
		</div>
	</div>
	<div class="footer-bot">
		<span>Not legal advice. Consult a qualified attorney.</span>
		<span>Built by citizens, for citizens.</span>
	</div>
</footer>
