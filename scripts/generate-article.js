// scripts/generate-article.js
// Daily article generator for Free The Fungi. Picks the next unpublished topics
// from src/lib/content/topics.js, asks the model for a structured educational
// article for each, validates it, and appends to
// src/lib/content/generated-articles.js.
//
// Generates up to ARTICLES_PER_RUN articles per run (default 3).
//
// Requires SYNTHETIC_API_KEY (api.synthetic.new, OpenAI-compatible).
// Optional: SYNTHETIC_MODEL (default "syn:large:text"), ARTICLES_PER_RUN (3).
//
// Flags:
//   --dry-run   generate + validate but don't write the content file
//   --mock      skip the API and use a canned article (plumbing test)
//   --topic ID  force a specific topic id (implies a single article)
//   --count N   override ARTICLES_PER_RUN for this invocation
//
// SAFETY: the system prompt hard-forbids cultivation/"growing" instructions,
// dosing/consumption guidance, sourcing/where-to-obtain advice, wild-mushroom
// identification/foraging, and synthesis/extraction. Content is strictly
// educational: science, law, policy, history, harm-reduction context, culture.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TOPICS } from '../src/lib/content/topics.js';
import { ARTICLES, SITE_NAME } from '../src/lib/content/articles.js';
import generatedArticles from '../src/lib/content/generated-articles.js';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const MOCK = args.includes('--mock');
const FORCED_TOPIC = args.includes('--topic') ? args[args.indexOf('--topic') + 1] : null;
const COUNT_FLAG = args.includes('--count') ? Number(args[args.indexOf('--count') + 1]) : null;

const PER_RUN = FORCED_TOPIC
  ? 1
  : Math.max(1, COUNT_FLAG || Number(process.env.ARTICLES_PER_RUN) || 3);

const generatedFile = join(
  dirname(fileURLToPath(import.meta.url)),
  '..', 'src', 'lib', 'content', 'generated-articles.js'
);

// --- pick the next topics --------------------------------------------------
const doneTopicIds = new Set(generatedArticles.map((a) => a.topicId));
let queue;
if (FORCED_TOPIC) {
  const t = TOPICS.find((x) => x.id === FORCED_TOPIC);
  if (!t) { console.log(`unknown topic id: ${FORCED_TOPIC}`); process.exit(1); }
  queue = [t];
} else {
  queue = TOPICS.filter((t) => !doneTopicIds.has(t.id)).slice(0, PER_RUN);
}

if (queue.length === 0) {
  console.log('all topics exhausted — nothing to generate');
  process.exit(0);
}
console.log(`generating ${queue.length} article(s): ${queue.map((t) => t.id).join(', ')}`);

// --- article JSON schema (structured outputs) ------------------------------
const ARTICLE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['slug', 'title', 'description', 'tags', 'sections', 'references'],
  properties: {
    slug: { type: 'string', description: 'URL slug: lowercase words separated by hyphens, no dates' },
    title: { type: 'string' },
    description: { type: 'string', description: 'Meta description, one or two sentences, ~140-160 characters' },
    tags: { type: 'array', items: { type: 'string' } },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['heading', 'paragraphs'],
        properties: {
          heading: { type: 'string', description: 'Section heading; empty string for the untitled intro section' },
          paragraphs: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    references: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'url'],
        properties: {
          title: { type: 'string' },
          url: { type: 'string', format: 'uri' },
        },
      },
    },
  },
};

const SYSTEM_PROMPT = `You write plain-language, educational reference articles for ${SITE_NAME} (free-the-fungi.pages.dev), an independent, non-commercial campaign for evidence-based psilocybin policy reform in South Africa.

HARD SAFETY RULES — these are absolute and override everything else:
- NEVER provide instructions, quantities, methods, or protocols for cultivating or "growing" mushrooms (no substrate, spores, colonisation, fruiting, tek, harvesting, etc.).
- NEVER provide dosing, consumption, preparation, or "how to take" guidance of any kind — no amounts, no protocols, no microdosing schedules.
- NEVER explain how to source, buy, find, forage, or identify psilocybin mushrooms in the wild.
- NEVER provide chemical synthesis or extraction methods.
- Do NOT encourage anyone to break the law or to use a controlled substance. Note that psilocybin is illegal (Schedule 7) in South Africa where relevant.
If a topic edges toward any of the above, write about it only at the level of science, law, policy, history, ethics, or public-health context — never operational detail.

HOUSE RULES — all mandatory:
- Educational reference content only: the science, the law, drug policy, history, harm-reduction as a public-health philosophy, ethics, and culture.
- Neutral and factual. This is not activism copy: present evidence and multiple views, and be honest about uncertainty. Prefer "commonly", "research suggests", "generally" over absolute claims. No invented statistics.
- Plain UK/South African English. Explain jargon on first use. Comfortable, readable prose — around 700–1000 words.
- Structure: an untitled intro section (heading = ""), then 3–5 titled sections, one or two paragraphs each.
- Where natural, connect to the South African context (Schedule 7, the Medicines Act, SAHPRA, the cannabis precedent) — but keep it globally relevant.
- References: 2–4 links to official/authoritative sources ONLY (SAHPRA, gov.za, peer-reviewed journals, universities like Johns Hopkins or Imperial College, the FDA/EMA/TGA, the UN). Use only URLs you are certain exist — prefer top-level pages over deep links.
- The site automatically appends a disclaimer to every article; do not write your own.`;

// --- generate ---------------------------------------------------------------
async function generate(topic, knownSlugs) {
  if (MOCK) {
    return {
      slug: `mock-article-${topic.id}`,
      title: `Mock article: ${topic.title}`,
      description: 'A mock article used to test the generation pipeline end to end without calling the API.',
      tags: ['mock'],
      sections: [
        { heading: '', paragraphs: ['Intro paragraph for the mock article.'] },
        { heading: 'A section', paragraphs: ['Body paragraph one.', 'Body paragraph two.'] },
      ],
      references: [{ title: 'SAHPRA', url: 'https://www.sahpra.org.za/' }],
    };
  }

  const apiKey = process.env.SYNTHETIC_API_KEY;
  if (!apiKey) throw new Error('SYNTHETIC_API_KEY not set');
  const model = process.env.SYNTHETIC_MODEL || 'syn:large:text';
  const existingSlugs = knownSlugs.join(', ');

  const res = await fetch('https://api.synthetic.new/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 16000,
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'article', strict: true, schema: ARTICLE_SCHEMA },
      },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Write today's article.

Topic: ${topic.title}
Angle: ${topic.angle}

Existing article slugs (your slug must differ from all of these): ${existingSlugs}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Synthetic API error ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  let text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('empty completion');
  text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('no JSON object in completion');
  return JSON.parse(text.slice(start, end + 1));
}

// --- validate ---------------------------------------------------------------
// Words that would signal the model drifted into operational how-to content.
const BANNED_PATTERNS = [
  /\bsubstrate\b/i, /\bmycelium\b/i, /\binocul/i, /\bcoloni[sz]/i, /\bfruiting\b/i,
  /\bmonotub\b/i, /\bagar\b/i, /\bspore syringe\b/i, /\bgrain spawn\b/i,
  /\bhow to (grow|cultivat|take|use|dose|make|extract)/i,
  /\bmicrodos(e|ing) (protocol|schedule|regimen)\b/i,
  /\b\d+\s?(mg|milligram|gram|g)\b.*\b(dose|take|ingest|consume)/i,
];

function validate(a, knownSlugs) {
  const fail = (msg) => { throw new Error(`validation failed: ${msg}`); };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug)) fail(`bad slug "${a.slug}"`);
  if (knownSlugs.has(a.slug)) fail(`duplicate slug "${a.slug}"`);
  if (!a.title || a.title.length > 130) fail('title missing or too long');
  if (!a.description || a.description.length < 50 || a.description.length > 320) fail('description missing or wrong length');
  if (!Array.isArray(a.sections) || a.sections.length < 3 || a.sections.length > 8) fail('need 3-8 sections');
  const allText = a.sections.flatMap((s) => s.paragraphs).join('\n');
  for (const re of BANNED_PATTERNS) {
    if (re.test(allText)) fail(`banned operational content matched ${re}`);
  }
  for (const s of a.sections) {
    if (!Array.isArray(s.paragraphs) || s.paragraphs.length === 0) fail('empty section');
    for (const p of s.paragraphs) {
      if (typeof p !== 'string' || p.trim().length < 40) fail('paragraph too short');
    }
  }
  if (!Array.isArray(a.references) || a.references.length < 1 || a.references.length > 6) fail('need 1-6 references');
  for (const r of a.references) {
    if (!/^https:\/\/[^\s"']+$/.test(r.url)) fail(`bad reference url "${r.url}"`);
  }
  const wordCount = allText.split(/\s+/).length;
  if (wordCount < 350) fail(`too short (${wordCount} words)`);
}

// --- build one article from a topic -----------------------------------------
async function buildArticle(topic, knownSlugs, today) {
  const raw = await generate(topic, [...knownSlugs]);
  if (Array.isArray(raw.references)) {
    raw.references = raw.references.map((r) => ({
      ...r,
      url: typeof r.url === 'string' ? r.url.replace(/^http:\/\//, 'https://') : r.url,
    }));
  }
  if (!MOCK) validate(raw, knownSlugs);

  return {
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    datePublished: today,
    dateModified: today,
    tags: raw.tags || [],
    topicId: topic.id,
    automated: true,
    sections: raw.sections.map((s) => ({
      heading: s.heading && s.heading.trim() ? s.heading.trim() : null,
      paragraphs: s.paragraphs.map((p) => p.trim()),
    })),
    references: raw.references,
  };
}

// --- main -------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const knownSlugs = new Set(ARTICLES.map((a) => a.slug));
const newArticles = [];

for (const topic of queue) {
  try {
    console.log(`topic: ${topic.id} — ${topic.title}`);
    const article = await buildArticle(topic, knownSlugs, today);
    knownSlugs.add(article.slug);
    newArticles.push(article);
    console.log(`  ok: ${article.slug}`);
  } catch (err) {
    console.error(`  skipped ${topic.id}: ${err.message}`);
  }
}

if (newArticles.length === 0) {
  console.error('no articles produced this run');
  process.exit(1);
}

if (DRY_RUN) {
  console.log(JSON.stringify(newArticles, null, 2));
  console.log(`dry run — ${newArticles.length} article(s) not persisted`);
  process.exit(0);
}

const updated = [...generatedArticles, ...newArticles];
writeFileSync(
  generatedFile,
  `// Generated by scripts/generate-article.js — do not edit by hand.\n` +
  `// Each entry is one automatically generated article (marked automated: true).\n` +
  `export default ${JSON.stringify(updated, null, 2)};\n`
);
console.log(`persisted ${newArticles.length} new article(s): ${newArticles.map((a) => a.slug).join(', ')} (${updated.length} generated total)`);
