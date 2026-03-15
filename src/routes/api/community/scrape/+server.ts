import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Category } from '$lib/community/ranking';

interface FeedItem {
	title: string;
	url: string;
	category: Category;
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
	'south-africa': [
		'south africa', 'cape town', 'johannesburg', 'pretoria', 'durban',
		'sahpra', 'medicines control', 'za ', 'african'
	],
	'legal': [
		'law', 'legal', 'legislation', 'regulation', 'decriminal', 'reschedul',
		'bill', 'policy', 'court', 'fda', 'dea', 'ban', 'prohibit', 'reform',
		'amendment', 'schedule', 'controlled substance', 'enforce', 'crimina'
	],
	'therapy': [
		'therap', 'clinical', 'ptsd', 'depression', 'anxiety', 'mental health',
		'psychiatr', 'psychologist', 'treatment', 'patient', 'dose', 'dosing',
		'trial', 'mdma', 'ketamine', 'healing', 'wellness', 'retreat'
	],
	'science': [
		'study', 'research', 'neurosci', 'brain', 'receptor', 'serotonin',
		'compound', 'molecule', 'pharma', 'biotech', 'journal', 'university',
		'finding', 'data', 'evidence', 'mechanism', 'paper', 'publish'
	],
	'harm-reduction': [
		'harm reduction', 'safe use', 'test kit', 'reagent', 'overdose',
		'safety', 'risk', 'interaction', 'contraindic', 'set and setting',
		'integration', 'bad trip', 'guide', 'sitter'
	],
	'growing': [
		'grow', 'cultivat', 'substrate', 'mycelium', 'spore', 'fruiting',
		'coloniz', 'monotub', 'agar', 'inocul', 'harvest', 'flush',
		'contam', 'tek', 'grain', 'bulk'
	],
	'culture': [
		'indigenous', 'tradition', 'ritual', 'ceremon', 'shaman', 'spirit',
		'entheogen', 'sacred', 'philosophy', 'art', 'music', 'festival',
		'communit', 'movement', 'histor', 'ancient'
	],
	'general': []
};

function categorizeByTitle(title: string, feedDefault: Category): Category {
	const lower = title.toLowerCase();

	let bestCategory: Category = feedDefault;
	let bestScore = 0;

	for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
		if (category === 'general') continue;
		let score = 0;
		for (const kw of keywords) {
			if (lower.includes(kw)) score++;
		}
		if (score > bestScore) {
			bestScore = score;
			bestCategory = category as Category;
		}
	}

	return bestCategory;
}

function decodeEntities(str: string): string {
	return str
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&#x27;/g, "'")
		.replace(/&#x2F;/g, '/');
}

async function fetchRSS(feedUrl: string, feedDefault: Category): Promise<FeedItem[]> {
	try {
		const res = await fetch(feedUrl);
		if (!res.ok) return [];
		const text = await res.text();

		const items: FeedItem[] = [];
		const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
		let match;
		while ((match = itemRegex.exec(text)) !== null) {
			const itemXml = match[1];
			const title = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
			const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1]?.trim();
			if (title && link) {
				items.push({
					title: decodeEntities(title),
					url: link,
					category: categorizeByTitle(title, feedDefault)
				});
			}
		}
		return items.slice(0, 10);
	} catch {
		return [];
	}
}

const FEEDS: { url: string; category: Category }[] = [
	{ url: 'https://psychedelicalpha.com/feed', category: 'science' },
	{ url: 'https://maps.org/feed/', category: 'therapy' },
	{ url: 'https://chacruna.net/feed/', category: 'culture' },
	{ url: 'https://www.lucid.news/feed/', category: 'science' },
	{ url: 'https://www.reddit.com/r/PsilocybinMushrooms/.rss', category: 'general' },
	{ url: 'https://www.reddit.com/r/Psychedelics/.rss', category: 'general' },
	{ url: 'https://news.google.com/rss/search?q=psilocybin+South+Africa&hl=en-ZA&gl=ZA&ceid=ZA:en', category: 'south-africa' }
];

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB;
	const secret = platform?.env?.SCRAPE_SECRET;
	if (!db || !secret) return json({ error: 'Service unavailable' }, { status: 500 });

	// Verify shared secret
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${secret}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let inserted = 0;
	let skipped = 0;

	for (const feed of FEEDS) {
		const items = await fetchRSS(feed.url, feed.category);

		for (const item of items) {
			// Dedup by URL
			const existing = await db
				.prepare('SELECT id FROM posts WHERE url = ?1')
				.bind(item.url)
				.first();

			if (existing) {
				skipped++;
				continue;
			}

			const id = crypto.randomUUID();
			await db
				.prepare(
					`INSERT INTO posts (id, user_id, title, url, post_type, category)
					VALUES (?1, 'ftf-bot', ?2, ?3, 'scraped', ?4)`
				)
				.bind(id, item.title, item.url, item.category)
				.run();
			inserted++;
		}
	}

	return json({ ok: true, inserted, skipped });
};
