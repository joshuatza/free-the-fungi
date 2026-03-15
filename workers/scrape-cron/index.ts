interface Env {
	SCRAPE_SECRET: string;
	SCRAPE_URL: string;
}

export default {
	async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
		const url = env.SCRAPE_URL || 'https://free-the-fungi.pages.dev/api/community/scrape';

		const res = await fetch(url, {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.SCRAPE_SECRET}` }
		});

		const body = await res.text();
		console.log(`Scrape result (${res.status}): ${body}`);
	}
};
