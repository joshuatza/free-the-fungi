# Free The Fungi

A petition landing page supporting the constitutional challenge to decriminalise psilocybin in South Africa. Built with SvelteKit, Three.js, and Rapier 3D physics.

**Live:** [free-the-fungi.pages.dev](https://free-the-fungi.pages.dev)

## Tech Stack

- **SvelteKit** — app framework with Cloudflare Pages adapter
- **Three.js** — 3D mushroom scene with 5 distinct varieties
- **Rapier 3D** — physics engine (spring forces, scroll reactivity, mouse interaction)
- **Resend** — server-side email delivery to Parliament members
- **jsPDF** — generates signed PDF petition letters with embedded cursive font
- **TypeScript** — type safety throughout
- **Cloudflare Pages** — edge deployment with zero egress fees

## Features

- **Interactive 3D background** — 18 mushrooms (rounded cap, parasol, liberty cap, cluster, portobello) along page margins, connected by mycelium lines
- **Scroll-reactive physics** — mushrooms wiggle, sway, and chain-react individually as you scroll, with cascading timing based on position
- **Mouse interaction** — mushrooms gently push away from cursor, connection lines brighten on hover
- **Petition form** with localStorage persistence and reactive signature counters
- **Server-side email** via Resend — sends personalised emails to Portfolio Committee on Health members
- **Signed PDF attachment** — generates a formal A4 petition letter (based on real court case template) with Dancing Script cursive signature from the signer's name
- **Share** to X / WhatsApp / clipboard
- **SEO** — Open Graph, Twitter Card, JSON-LD structured data, sitemap
- **Fully responsive**, accessible, reduced-motion support

## Getting Started

```sh
npm install
npm run dev
```

## Deploy

Deployed to Cloudflare Pages via Wrangler:

```sh
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare --project-name free-the-fungi
```

Or connect the GitHub repo in the Cloudflare dashboard for automatic deployments:

- **Build command:** `npm run build`
- **Build output directory:** `.svelte-kit/cloudflare`

### Environment Variables

Set as Cloudflare Pages secrets:

- `RESEND_API_KEY` — API key for email delivery (sender domain must be verified in Resend)

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── PhysicsScene.svelte    # Three.js + Rapier 3D background
│   │   ├── Nav.svelte             # Sticky navigation
│   │   ├── PetitionForm.svelte    # Sign form + email sending + success state
│   │   └── SignatureList.svelte   # Signature display
│   ├── stores/
│   │   └── signatures.ts          # Svelte store + localStorage
│   └── utils/
│       ├── generateLetter.ts      # PDF letter generation with jsPDF
│       └── dancingScript.ts       # Embedded cursive font (base64)
├── routes/
│   ├── api/send-email/+server.ts  # Resend email API endpoint
│   ├── +layout.svelte             # Global styles
│   ├── +layout.ts                 # SSR config
│   └── +page.svelte               # Full landing page
├── app.html
└── app.d.ts
```

## Context

Psilocybin mushrooms are classified as Schedule 7 in South Africa — alongside heroin — despite evidence they are non-addictive, non-toxic, and therapeutically valuable. A constitutional challenge (*Cromhout & Ferguson v Minister of Justice*, Case No: 2024-040119) is pending in the Gauteng High Court, represented by Cullinan & Associates — the same firm that decriminalised cannabis in 2018.

This site supports that case by collecting public signatures, generating signed petition letters, and connecting signers directly with their parliamentary representatives via email.
