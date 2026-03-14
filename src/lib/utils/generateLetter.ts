import { jsPDF } from 'jspdf';

interface LetterParams {
	recipientName: string;
	recipientTitle: string;
	fn: string;
	ln: string;
	city: string;
	prov: string;
	email: string;
	msg: string;
}

const RECIPIENT_DETAILS: Record<string, { title: string; line: string; emailAddr: string }> = {
	'Dr Dhlomo': {
		title: 'Chairperson: Portfolio Committee on Health',
		line: 'National Assembly, Parliament of the Republic of South Africa',
		emailAddr: 'sdhlomo@parliament.gov.za',
	},
	'Mrs Clarke': {
		title: 'DA Member, Portfolio Committee on Health',
		line: 'National Assembly, Parliament of the Republic of South Africa',
		emailAddr: 'mclarke@parliament.gov.za',
	},
	'Ms Majalamba': {
		title: 'Secretary, Portfolio Committee on Health',
		line: 'National Assembly, Parliament of the Republic of South Africa',
		emailAddr: 'vmajalamba@parliament.gov.za',
	},
	'Cullinan & Associates': {
		title: 'Attorneys',
		line: 'Legal representatives in Cromhout & Ferguson v Minister of Justice',
		emailAddr: 'info@cullinans.co.za',
	},
};

export function generateSignedLetter(params: LetterParams): string {
	const { recipientName, fn, ln, city, prov, email, msg } = params;
	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	const pageW = doc.internal.pageSize.getWidth();
	const pageH = doc.internal.pageSize.getHeight();
	const margin = 22;
	const contentW = pageW - margin * 2;
	let y = 22;

	const details = RECIPIENT_DETAILS[recipientName] || RECIPIENT_DETAILS['Dr Dhlomo'];
	const isCull = recipientName === 'Cullinan & Associates';

	// ── Sender details ──
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(11);
	doc.setTextColor(30, 30, 30);
	doc.text(`${fn} ${ln}`, margin, y);
	y += 5;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(80, 80, 80);
	doc.text(`${city}, ${prov}`, margin, y);
	y += 4;
	doc.text(email, margin, y);
	y += 8;

	// Date
	const date = new Date().toLocaleDateString('en-ZA', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
	doc.setTextColor(60, 60, 60);
	doc.text(date, margin, y);
	y += 10;

	// ── Recipient ──
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10);
	doc.setTextColor(30, 30, 30);
	doc.text(recipientName, margin, y);
	y += 5;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(80, 80, 80);
	doc.text(details.title, margin, y);
	y += 4;
	doc.text(details.line, margin, y);
	y += 4;
	doc.text(`Email: ${details.emailAddr}`, margin, y);
	y += 4;
	if (!isCull) {
		doc.setFont('helvetica', 'italic');
		doc.setFontSize(8);
		doc.text('CC: vmajalamba@parliament.gov.za (Committee Secretary)', margin, y);
		y += 4;
	}
	y += 4;

	// ── Salutation ──
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(30, 30, 30);
	doc.text(`Dear ${recipientName},`, margin, y);
	y += 8;

	if (isCull) {
		// Shorter letter for Cullinan
		const cullBody = [
			`I signed the Free The Fungi petition and would like to support the Cromhout case (Case No: 2024-040119). Is there a legal defence fund or other way to contribute?`,
			msg ? `Personal note: ${msg}` : '',
		].filter(Boolean);

		doc.setFontSize(9.5);
		doc.setTextColor(40, 40, 40);
		for (const para of cullBody) {
			const lines = doc.splitTextToSize(para, contentW);
			doc.text(lines, margin, y);
			y += lines.length * 4.5 + 3;
		}
	} else {
		// ── Subject line ──
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(9);
		doc.text('RE: THE CONSTITUTIONAL AND SCIENTIFIC CASE FOR THE DECRIMINALISATION OF PSILOCYBIN IN SOUTH AFRICA', margin, y, { maxWidth: contentW });
		y += 10;

		// ── Body ──
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9.5);
		doc.setTextColor(40, 40, 40);

		const sections = [
			{
				text: `I write to you as a concerned South African citizen and resident of ${city} to respectfully urge the Portfolio Committee on Health to proactively engage with the question of psilocybin reform, rather than waiting to respond reactively to a court order. The Gauteng Division of the High Court is presently considering the constitutional challenge brought by Monica Cromhout and Melinda Ferguson (Case No: 2024-040119), and the outcome of that case may well require Parliament to act within a defined timeframe. I believe the Committee and Parliament would be better served by leading this process than by being compelled into it.`,
			},
			{
				heading: '1. The Cannabis Precedent Has Already Laid the Groundwork',
				text: `In 2018, the Constitutional Court in Minister of Justice and Constitutional Development v Prince declared the criminalisation of private cannabis use unconstitutional on the grounds that it violated the right to privacy under Section 14 of the Constitution. The same constitutional reasoning applies with even greater force to psilocybin. The scientific evidence demonstrates that psilocybin is significantly less harmful than cannabis, alcohol, or tobacco, carries no meaningful risk of physical dependence, and has demonstrated therapeutic benefits.`,
			},
			{
				heading: '2. The Scientific Evidence Is Overwhelming',
				text: `Psilocybin is classified as Schedule 7 under SAHPRA, alongside heroin and fentanyl. This classification requires a substance to be harmful, have no medical use, and carry high dependence risk. The evidence contradicts all three: Professor David Nutt describes psilocybin as among the safest drugs known to science; clinical trials at Johns Hopkins and Imperial College show sustained efficacy for depression, PTSD, anxiety, and addiction; and both animal and human research confirm psilocybin is not addictive. Australia approved prescription use in 2023. The US FDA granted breakthrough therapy designation.`,
			},
			{
				heading: '3. Constitutional Rights at Stake',
				text: `The applicants argue psilocybin criminalisation infringes the right to privacy (Section 14), dignity and autonomy (Section 10), bodily and psychological integrity (Section 12(2)), freedom of conscience and belief (Section 15), equality (Section 9), and access to healthcare (Section 27). Legal scholars have argued that the right to cognitive liberty is protected under Section 12(2) and directly violated by psilocybin prohibition.`,
			},
			{
				heading: '4. South Africa\'s Mental Health Crisis Demands Action',
				text: `One in six South Africans suffers from depression, anxiety, or substance abuse. There are an estimated 23 suicides per day. The public mental healthcare system is severely under-resourced and conventional treatments fail a significant proportion of patients. Criminalising a substance with demonstrated therapeutic potential while permitting alcohol and tobacco is both irrational and unjust.`,
			},
			{
				heading: '5. What I Respectfully Ask',
				text: `I respectfully request that the Portfolio Committee on Health: (a) proactively engage with the scientific evidence by inviting expert briefings; (b) recommend that SAHPRA review the Schedule 7 classification; (c) consider a regulatory framework permitting adult private use, supervised therapeutic use, and further research; and (d) ensure any future regulation accounts for harm reduction, education, and equitable access.`,
			},
		];

		for (const section of sections) {
			// Check if we need a new page
			if (y > pageH - 40) {
				doc.addPage();
				y = 22;
			}

			if (section.heading) {
				doc.setFont('helvetica', 'bold');
				doc.setFontSize(9.5);
				doc.setTextColor(30, 30, 30);
				doc.text(section.heading, margin, y);
				y += 5.5;
			}

			doc.setFont('helvetica', 'normal');
			doc.setFontSize(9.5);
			doc.setTextColor(40, 40, 40);
			const lines = doc.splitTextToSize(section.text, contentW);
			// Check page break for long paragraphs
			if (y + lines.length * 4.2 > pageH - 30) {
				doc.addPage();
				y = 22;
			}
			doc.text(lines, margin, y);
			y += lines.length * 4.2 + 4;
		}

		if (msg) {
			if (y > pageH - 30) { doc.addPage(); y = 22; }
			doc.setFont('helvetica', 'italic');
			doc.setFontSize(9.5);
			const msgLines = doc.splitTextToSize(`Personal note: ${msg}`, contentW);
			doc.text(msgLines, margin, y);
			y += msgLines.length * 4.2 + 4;
		}

		if (y > pageH - 50) { doc.addPage(); y = 22; }

		// Closing paragraph
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9.5);
		const closing = doc.splitTextToSize(
			`South Africa has an opportunity to lead on this issue, just as it did with cannabis. The constitutional framework, the scientific evidence, and the moral case all point in the same direction. I urge the Committee to act with courage and commitment to evidence-based policy.`,
			contentW
		);
		doc.text(closing, margin, y);
		y += closing.length * 4.2 + 4;
	}

	y += 4;

	// ── Signature block ──
	if (y > pageH - 45) { doc.addPage(); y = 22; }

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(30, 30, 30);
	doc.text('Yours faithfully,', margin, y);
	y += 12;

	// Cursive signature
	doc.setFont('times', 'bolditalic');
	doc.setFontSize(24);
	doc.setTextColor(20, 20, 70);
	doc.text(`${fn} ${ln}`, margin, y);
	y += 3;
	const sigWidth = doc.getTextWidth(`${fn} ${ln}`);
	doc.setDrawColor(20, 20, 70);
	doc.setLineWidth(0.2);
	doc.line(margin, y, margin + sigWidth, y);
	y += 8;

	// Printed details
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(60, 60, 60);
	doc.text(`${fn} ${ln}`, margin, y);
	y += 4;
	doc.text('South African Citizen', margin, y);
	y += 4;
	doc.text(`${city}, ${prov}`, margin, y);
	y += 10;

	// CC block for parliament letters
	if (!isCull) {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(8);
		doc.setTextColor(80, 80, 80);
		doc.text('CC:', margin, y);
		y += 4;
		doc.setFont('helvetica', 'italic');
		doc.setFontSize(7.5);
		const ccs = [
			'Committee Secretary, Portfolio Committee on Health (vmajalamba@parliament.gov.za)',
			'Mrs Michéle Clarke, MP — DA Member, Portfolio Committee on Health (mclarke@parliament.gov.za)',
			'Minister of Health',
			'Minister of Justice and Constitutional Development',
		];
		for (const cc of ccs) {
			doc.text(cc, margin + 5, y);
			y += 3.5;
		}
	}

	// Footer
	y = pageH - 8;
	doc.setDrawColor(200, 200, 200);
	doc.setLineWidth(0.15);
	doc.line(margin, y - 3, pageW - margin, y - 3);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(6.5);
	doc.setTextColor(170, 170, 170);
	doc.text('Generated by Free The Fungi — https://free-the-fungi.pages.dev', margin, y);

	return doc.output('datauristring').split(',')[1];
}
