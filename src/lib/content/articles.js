// src/lib/content/articles.js
// Article content shared by the SvelteKit app (/articles routes, sitemap) and
// the article generator (scripts/generate-article.js). Plain data (no Svelte),
// so Node can import it directly at build time and in the generator.
//
// All articles are educational reference content about psilocybin science,
// law, policy, history and harm-reduction context. They never contain
// cultivation ("growing") instructions, dosing guidance, or sourcing advice.

import generatedArticles from './generated-articles.js';

/**
 * @typedef {Object} ArticleSection
 * @property {string|null} heading
 * @property {string[]} paragraphs
 * @property {string[]=} list
 */
/**
 * @typedef {Object} ArticleRef
 * @property {string} title
 * @property {string} url
 */
/**
 * @typedef {Object} Article
 * @property {string} slug
 * @property {string} title
 * @property {string} description
 * @property {string} datePublished
 * @property {string} dateModified
 * @property {string[]=} tags
 * @property {string=} topicId
 * @property {boolean=} automated
 * @property {ArticleSection[]} sections
 * @property {ArticleRef[]=} references
 */

export const SITE_URL = 'https://free-the-fungi.pages.dev';
export const SITE_NAME = 'Free The Fungi';
export const OG_IMAGE = `${SITE_URL}/icon-512.png`;

/** @type {Article[]} */
const SEED_ARTICLES = [
  {
    slug: 'psilocybin-legal-status-south-africa',
    title: 'Psilocybin’s Legal Status in South Africa: Schedule 7 and the Constitutional Challenge',
    description:
      'How psilocybin is classified under South African law, why it sits in Schedule 7 alongside heroin, and the constitutional challenge arguing for reform.',
    datePublished: '2026-07-22',
    dateModified: '2026-07-22',
    tags: ['south africa', 'legal', 'policy', 'schedule 7'],
    sections: [
      {
        heading: '',
        paragraphs: [
          'In South Africa, psilocybin — the naturally occurring compound found in certain mushrooms — is one of the most tightly controlled substances in the country. It is listed in Schedule 7 of the Medicines and Related Substances Act, the most restrictive schedule, the same tier that contains heroin. This article explains what that classification means in law and outlines the constitutional challenge that seeks to change it. It is general legal-context information, not legal advice.',
        ],
      },
      {
        heading: 'What Schedule 7 means',
        paragraphs: [
          'South Africa’s Medicines and Related Substances Act (Act 101 of 1965) sorts substances into schedules from 0 to 8, administered by the South African Health Products Regulatory Authority (SAHPRA). Higher schedules carry tighter controls. Schedule 7 covers substances deemed to have a high potential for abuse and no recognised medical use in the ordinary regulatory sense, which means possession, use, manufacture and supply are prohibited without a specific permit from the Director-General of Health.',
          'Because psilocybin and psilocin sit in Schedule 7, they are treated in law much like heroin, even though their pharmacology and risk profile differ substantially. Researchers wishing to study them must obtain permits, which has historically slowed formal clinical work in the country.',
        ],
      },
      {
        heading: 'The cannabis precedent',
        paragraphs: [
          'The legal landscape shifted in 2018 when the Constitutional Court, in Minister of Justice and Constitutional Development v Prince, decriminalised the private use and cultivation of cannabis by adults in private. The Court held that the blanket prohibition unjustifiably limited the constitutional right to privacy. That judgment established a template: a criminal prohibition on a substance can be tested against the Bill of Rights, and can fall if the state cannot justify it.',
          'Advocates for psilocybin reform point to this precedent as a route to re-examine Schedule 7’s treatment of psilocybin, arguing that similar privacy and dignity considerations apply.',
        ],
      },
      {
        heading: 'The constitutional challenge',
        paragraphs: [
          'A constitutional challenge to the scheduling of psilocybin has argued that criminalising personal, private use infringes rights to privacy, freedom of belief, and cognitive liberty, and that the state lacks a rational, evidence-based justification for placing psilocybin in the most restrictive schedule. The core legal question mirrors the cannabis case: whether a total prohibition is a proportionate limitation of constitutional rights given the current scientific understanding of the substance.',
          'Litigation of this kind typically moves slowly through the High Court and, potentially, to the Constitutional Court. Regardless of outcome, the case has drawn public attention to how South Africa classifies psychedelic compounds.',
        ],
      },
      {
        heading: 'Where reform stands',
        paragraphs: [
          'As of this writing, psilocybin remains in Schedule 7 and personal use remains unlawful pending any change in legislation or a court ruling to the contrary. Reform efforts focus on rescheduling to enable research and regulated therapeutic access rather than on unrestricted availability. Anyone seeking the current legal position should consult SAHPRA and the published schedules directly, as the law can change.',
        ],
      },
    ],
    references: [
      { title: 'SAHPRA — South African Health Products Regulatory Authority', url: 'https://www.sahpra.org.za/' },
      { title: 'Medicines and Related Substances Act (South African Government)', url: 'https://www.gov.za/documents/medicines-and-related-substances-act' },
      { title: 'Constitutional Court of South Africa', url: 'https://www.concourt.org.za/' },
    ],
  },
  {
    slug: 'psilocybin-mental-health-research-overview',
    title: 'What the Science Says: Psilocybin and Mental-Health Research',
    description:
      'A plain-language overview of the clinical research into psilocybin for conditions like depression and PTSD — what studies have found, and what remains uncertain.',
    datePublished: '2026-07-21',
    dateModified: '2026-07-21',
    tags: ['science', 'research', 'mental health', 'clinical trials'],
    sections: [
      {
        heading: '',
        paragraphs: [
          'Over the past two decades, psilocybin has moved from the fringes of science back into mainstream clinical research. Universities including Johns Hopkins and Imperial College London have run controlled trials examining whether psilocybin, given in carefully supervised settings, can help with hard-to-treat mental-health conditions. This article summarises what that research has and has not shown. It is an overview of published science, not medical advice, and it contains no dosing or treatment guidance.',
        ],
      },
      {
        heading: 'How psilocybin works in the brain',
        paragraphs: [
          'Psilocybin is a prodrug: the body converts it to psilocin, which acts primarily on the brain’s serotonin 2A (5-HT2A) receptors. Activating these receptors produces temporary changes in perception, mood and thought. Neuroimaging studies suggest psilocybin transiently increases communication between brain networks that are normally more segregated — a change some researchers link to its psychological effects. The precise mechanisms behind any lasting benefit are still being investigated.',
        ],
      },
      {
        heading: 'What the trials have found',
        paragraphs: [
          'Several small-to-medium randomised trials have reported that supervised psilocybin sessions, combined with psychological support, were associated with reductions in symptoms of depression and anxiety, including in people with cancer-related distress and treatment-resistant depression. A number of these studies reported effects that persisted for weeks or months after a single or small number of sessions.',
          'These findings have been encouraging enough that regulators, including the US Food and Drug Administration, have granted psilocybin-based therapies "breakthrough therapy" designation to speed up research — a signal of promise, not an approval.',
        ],
      },
      {
        heading: 'What remains uncertain',
        paragraphs: [
          'The research base, while growing, is still limited. Many trials have been small, and blinding is difficult because participants can often tell whether they received an active substance. Long-term safety, the durability of benefits, and how results generalise beyond carefully screened volunteers in supervised settings all remain open questions. Psilocybin is not risk-free: it can cause acute anxiety or confusion, and it is generally contraindicated for people with certain psychiatric conditions or family histories.',
          'Crucially, the benefits reported in trials occur within a tightly controlled clinical framework — screening, preparation, professional supervision and follow-up — not from unsupervised use.',
        ],
      },
      {
        heading: 'Why it matters for policy',
        paragraphs: [
          'The renewed scientific interest is one reason reform advocates argue that psilocybin’s classification should be re-examined. A substance being studied as a potential therapy sits awkwardly in the most restrictive legal schedule. Whatever one’s view, the policy debate is increasingly informed by peer-reviewed evidence rather than assumption.',
        ],
      },
    ],
    references: [
      { title: 'Johns Hopkins Center for Psychedelic and Consciousness Research', url: 'https://hopkinspsychedelic.org/' },
      { title: 'Imperial College London — Centre for Psychedelic Research', url: 'https://www.imperial.ac.uk/psychedelic-research-centre/' },
      { title: 'US Food and Drug Administration', url: 'https://www.fda.gov/' },
    ],
  },
];

// Seed (hand-written) + generated articles, newest first.
/** @type {Article[]} */
export const ARTICLES = [...SEED_ARTICLES, ...generatedArticles].sort((a, b) =>
  b.datePublished.localeCompare(a.datePublished)
);

/**
 * @param {string} slug
 * @returns {Article | null}
 */
export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

// Related articles for internal linking: ranked by shared tags, tie-broken by
// recency, falling back to the most recent other articles.
/**
 * @param {string} slug
 * @param {number} [limit]
 * @returns {Article[]}
 */
export function getRelatedArticles(slug, limit = 3) {
  const current = ARTICLES.find((a) => a.slug === slug);
  if (!current) return [];
  const curTags = new Set((current.tags || []).map((t) => t.toLowerCase()));
  return ARTICLES.filter((a) => a.slug !== slug)
    .map((a) => ({
      a,
      score: (a.tags || []).filter((t) => curTags.has(t.toLowerCase())).length,
    }))
    .sort((x, y) => y.score - x.score || y.a.datePublished.localeCompare(x.a.datePublished))
    .slice(0, limit)
    .map((x) => x.a);
}
