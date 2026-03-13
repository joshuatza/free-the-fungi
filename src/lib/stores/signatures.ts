import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface Signature {
	fn: string;
	ln: string;
	email: string;
	city: string;
	prov: string;
	msg: string;
	auto: boolean;
	ts: number;
}

const SK = 'ftf_sigs';
const GOAL = 10000;

function loadSigs(): Signature[] {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(SK) || '[]');
	} catch {
		return [];
	}
}

export const signatures = writable<Signature[]>(loadSigs());
export const goal = GOAL;

export const count = derived(signatures, ($s) => $s.length);
export const progress = derived(signatures, ($s) => Math.min($s.length / GOAL * 100, 100));

export function addSignature(sig: Signature) {
	signatures.update((sigs) => {
		const updated = [sig, ...sigs];
		if (browser) localStorage.setItem(SK, JSON.stringify(updated));
		return updated;
	});
}

export const avColors = [
	'rgba(168,130,200,0.12)',
	'rgba(130,190,160,0.12)',
	'rgba(130,160,200,0.12)',
	'rgba(200,175,130,0.12)',
	'rgba(180,130,150,0.12)'
];
export const avText = ['#7B6BAA', '#3A8A5E', '#5577AA', '#AA8833', '#AA5577'];
