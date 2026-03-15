declare global {
	namespace App {
		interface Locals {
			user: { id: string; username: string; email: string } | null;
		}
		interface Platform {
			env: {
				DB: D1Database;
				SESSIONS: KVNamespace;
				RESEND_API_KEY: string;
				SCRAPE_SECRET: string;
			};
		}
	}
}

export {};
