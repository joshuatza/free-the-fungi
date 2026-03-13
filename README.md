# Free The Fungi

A petition landing page supporting the constitutional challenge to decriminalise psilocybin in South Africa. Built with SvelteKit, Three.js, and Rapier 3D physics.

**Live:** [free-the-fungi.pages.dev](https://free-the-fungi.pages.dev)

## Tech Stack

- **SvelteKit** — app framework with Cloudflare Pages adapter
- **Three.js** — 3D scene with floating spore/mushroom particles
- **Rapier 3D** — physics engine (low gravity, buoyancy, mouse repulsion)
- **TypeScript** — type safety throughout
- **Cloudflare Pages** — edge deployment with zero egress fees

## Features

- Interactive 3D physics background with 60 floating particles
- Petition form with localStorage persistence
- Reactive signature counters and progress bars
- Pre-written email links to Parliament decision-makers
- Share to X / WhatsApp / clipboard
- Fully responsive, accessible, reduced-motion support

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

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── PhysicsScene.svelte   # Three.js + Rapier 3D background
│   │   ├── Nav.svelte            # Sticky navigation
│   │   ├── PetitionForm.svelte   # Sign form + success state
│   │   └── SignatureList.svelte  # Signature display
│   └── stores/
│       └── signatures.ts         # Svelte store + localStorage
├── routes/
│   ├── +layout.svelte            # Global styles
│   ├── +layout.ts                # Prerender config
│   └── +page.svelte              # Full landing page
├── app.html
└── app.d.ts
```

## Context

Psilocybin mushrooms are classified as Schedule 7 in South Africa — alongside heroin — despite evidence they are non-addictive, non-toxic, and therapeutically valuable. A constitutional challenge (*Cromhout & Ferguson v Minister of Justice*, Case No: 2024-040119) is pending in the Gauteng High Court, represented by Cullinan & Associates — the same firm that decriminalised cannabis in 2018.

This site supports that case by collecting public signatures and connecting signers with their parliamentary representatives.
