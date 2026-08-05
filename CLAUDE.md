# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server (also rewrites the nextjs-agent-rules block in AGENTS.md)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # typecheck; the build does this too
```

No test runner is configured yet.

## What this project is

Marketing site + client portal for **DIS Studio**, an interior-design studio (design office in Canada/Québec, production team in Tunisia). Two audiences with distinct funnels: B2C/B2B direct clients, and design studios buying overflow production capacity.

**The site is in French.** All UI copy, route segments, and content are French (`/portfolio/[projet]`, `/espace-client`, `/partenaire-production`). `app/layout.tsx` still carries `lang="en"` from the scaffold — set it to `fr` when the real layout lands. Architecture should stay i18n-ready, but multilingual is explicitly out of scope for v1.

The repo is still at the `create-next-app` scaffold stage: `app/` contains only the generated `layout.tsx`, `page.tsx`, and `globals.css`. Essentially all feature work is greenfield.

## Planning documents — read before building features

Three untracked docs are the specification. They are not background reading; they define scope and visual direction.

- [cahier-de-charge.md](cahier-de-charge.md) — functional spec (French). Actors (visiteur/client/administrateur), request lifecycle states, client space, admin back-office, loyalty-points program. Section 10 lists what is deliberately **out of scope for v1**: online payment, booking, blog, newsletter, social integration, live chat, automatic project estimation.
- [design-ref.md](design-ref.md) — brand and art direction. Color tokens (Os `#F7F3EC`, Sable `#EDE6DA`, Encre `#26221E`, gris chaud `#8A8178`, Argile `#B15C3C`), spacing scale, typography rules, motion timings, the MVP vs. Phase-2 route tree, and three named landing-page concept variations.
- [skills/impeccable/](skills/impeccable/) — a design skill with references on typography, color/contrast, motion, spatial and responsive design.

Non-negotiables from the art direction that are easy to violate by habit: no pure `#FFFFFF` backgrounds and no pure `#000000` text; clay accent reserved for real CTAs and active states only; no drop shadows or framed cards (section rhythm comes from the two warm neutrals); thin-stroke icons only; no emoji anywhere in the UI.

`globals.css` currently holds the scaffold's neutral light/dark tokens and a `prefers-color-scheme: dark` block. The brand direction is a single warm light palette — replace these tokens rather than layering on top of them.

## Portfolio assets

`public/DIS STUDIO/` is the real client asset dump and the source of truth for portfolio content. It is organized by **software** — `AutoCAD/`, `3DS MAX/`, `REVIT/`, `SKETCHUP/` — then by project type (`Habitation/`, `Bureautique/`, `Maison de culture/`, `Yacht en 3D/`, …). Most files are PDFs (technical drawings, execution dossiers) with some JPG renders.

That software-first layout is a delivery artifact, not the site's information architecture: the site presents projects by category with galleries, while software mastery is a separate credibility signal. Expect to build a mapping layer rather than deriving routes from the directory tree. Paths contain spaces and accented characters, so URL-encode when referencing them.

## Next.js specifics

Next.js 16 with the App Router, React 19, Tailwind CSS v4, TypeScript strict mode, `@/*` aliased to the repo root.

Per [AGENTS.md](AGENTS.md), consult `node_modules/next/dist/docs/` before writing framework code — this version differs from older training data. In particular, route component prop types are **globally generated**, not imported: `layout.tsx` uses `LayoutProps<"/">`, and pages use `PageProps<"/route">`. Don't hand-write `params`/`searchParams` interfaces.

Tailwind v4 is configured through CSS (`@import "tailwindcss"` plus `@theme inline` in `globals.css`) and PostCSS — there is no `tailwind.config.js`, and adding one is not how you extend the theme.

`next dev` regenerates the `nextjs-agent-rules` block in [AGENTS.md](AGENTS.md); commit it with your work instead of reverting it.
