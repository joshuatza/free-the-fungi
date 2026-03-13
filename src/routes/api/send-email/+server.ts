import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import type { RequestHandler } from './$types';

const RECIPIENTS: Record<string, { name: string; email: string }> = {
	dhlomo: { name: 'Dr Dhlomo', email: 'sdhlomo@parliament.gov.za' },
	clarke: { name: 'Mrs Clarke', email: 'mclarke@parliament.gov.za' },
	sec: { name: 'Ms Majalamba', email: 'vmajalamba@parliament.gov.za' },
	cull: { name: 'Cullinan & Associates', email: 'info@cullinans.co.za' },
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const apiKey = (platform?.env as Record<string, string>)?.RESEND_API_KEY;

	if (!apiKey) {
		return json({ error: 'Email service not configured' }, { status: 500 });
	}

	const resend = new Resend(apiKey);

	let body: {
		fn: string;
		ln: string;
		city: string;
		prov: string;
		msg: string;
		recipients: string[];
	};

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { fn, ln, city, prov, msg, recipients: recipientKeys } = body;

	if (!fn || !ln || !city || !prov || !recipientKeys?.length) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const results = [];

	for (const key of recipientKeys) {
		const recipient = RECIPIENTS[key];
		if (!recipient) continue;

		const isCull = key === 'cull';
		const subject = isCull
			? 'Supporting the Cromhout Psilocybin Case'
			: 'Constituent Call for Psilocybin Reform';

		const emailBody = isCull
			? `Dear Cullinan & Associates,

I signed the Free The Fungi petition and would like to support the Cromhout case. Is there a legal defence fund or other way to contribute?

Kind regards,
${fn} ${ln}
${city}, ${prov}`
			: `Dear ${recipient.name},

I am writing as a South African citizen from ${city}, ${prov} to add my voice to the call for psilocybin reform.

I have signed the Free The Fungi petition calling on the Portfolio Committee on Health and SAHPRA to review the Schedule 7 classification of psilocybin, which is not supported by scientific evidence.

The pending constitutional challenge (Cromhout and Ferguson v Minister of Justice, Case No: 2024-040119) and the 2018 cannabis precedent both show this prohibition is constitutionally vulnerable. I urge the Committee to engage proactively.

${msg ? `Personal note: ${msg}\n\n` : ''}Yours faithfully,
${fn} ${ln}
${city}, ${prov}`;

		try {
			const { error } = await resend.emails.send({
				from: 'Free The Fungi <petition@free-the-fungi.pages.dev>',
				to: [recipient.email],
				subject,
				text: emailBody,
			});

			if (error) {
				results.push({ key, success: false, error: error.message });
			} else {
				results.push({ key, success: true });
			}
		} catch (err) {
			results.push({ key, success: false, error: String(err) });
		}
	}

	return json({ results });
};
