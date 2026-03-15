export function hnScore(votes: number, createdAt: string): number {
	const ageMs = Date.now() - new Date(createdAt + 'Z').getTime();
	const ageHours = ageMs / (1000 * 60 * 60);
	return Math.pow(Math.max(votes - 1, 0), 0.8) / Math.pow(ageHours + 2, 1.8);
}

export function timeAgo(dateStr: string): string {
	const seconds = Math.floor((Date.now() - new Date(dateStr + 'Z').getTime()) / 1000);

	if (seconds < 60) return 'just now';
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d ago`;
	const months = Math.floor(days / 30);
	return `${months}mo ago`;
}

export function extractDomain(url: string): string {
	try {
		return new URL(url).hostname.replace('www.', '');
	} catch {
		return '';
	}
}

export const CATEGORIES = [
	'general',
	'science',
	'legal',
	'therapy',
	'south-africa',
	'culture',
	'harm-reduction',
	'growing'
] as const;

export type Category = (typeof CATEGORIES)[number];
