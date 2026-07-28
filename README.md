# NOIRÉ — Maison de Parfum

A cinematic, production-ready marketing site for a fictional premium
perfume house, built as a proper React + TypeScript application (not a
single-file demo).

## Stack

- Vite + React + TypeScript
- Plain CSS per component/section (scoped by class-name prefixes)
- [`motion`](https://motion.dev) for the mobile menu and small UI transitions
- GSAP + ScrollTrigger for reveal, parallax, and the pinned 3D scroll scene
- `three` + `@react-three/fiber` + `@react-three/drei` for the 3D bottle
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build locally
```

## The 3D bottle model

The hero and the pinned scroll scene render a 3D perfume bottle loaded from:

```
public/models/perfume-bottle.glb
```

This file is **not included** and is not fetched from any URL at runtime —
download it yourself and place it at that exact path. A suggested source:

https://pixabay.com/3d-models/glb-perfume-bottle-glass-vial-4060/

**The site works perfectly without this file.** If the GLB is missing, fails
to parse, or WebGL isn't available, an `ErrorBoundary` around the `<Canvas>`
swaps in a hand-built CSS bottle (`src/three/BottleFallback.tsx`) with the
same silhouette, gold cap, floating/rotation animation and glow — no blank
canvas, no crash. In development mode a small console warning (and an
on-screen dev-only badge) tells you the fallback is active.

## Project structure

```
src/
  components/     Preloader, Header, CustomCursor, NoiseOverlay,
                   MagneticButton, SectionHeading, ErrorBoundary
  sections/       Hero, Notes, PinnedScene, Story, Collection, CTA, Footer
  three/          PerfumeBottleScene, BottleModel, BottleFallback,
                   BottleGroup, SceneLights, SceneParticles
  hooks/          useReducedMotion, useMediaQuery, useScrollProgress,
                   useMagnetic, useRevealOnScroll
  lib/            gsap.ts (single ScrollTrigger registration), utils.ts
  data/           notes.ts, fragrances.ts
  types/          shared TypeScript interfaces
  styles/         reset.css, variables.css (design tokens), typography.css,
                   global.css
public/
  models/         put perfume-bottle.glb here
  images/, fonts/ optional local assets
```

## Design system

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0d0b0b` | primary background |
| `--color-bg-alt` | `#171313` | secondary background |
| `--color-cream` | `#f4eee5` | warm white text |
| `--color-gold` | `#d9b982` | champagne gold accent |
| `--color-gold-dark` | `#8c6a39` | dark gold accent |
| `--color-grey-beige` | `#aaa19a` | muted body text |

All tokens live in `src/styles/variables.css`.

## Motion system

- **Preloader** — logo blur/opacity/scale-in, animated gold progress line,
  blur-out exit, hard-capped at 4s so it never hangs.
- **Hero** — letter-by-letter kinetic title reveal, staggered subtitle/CTA
  entrance, bottle scale/opacity/translate entrance with a one-shot gold
  sheen sweep, scroll-scrubbed background/copy parallax, pointer-driven
  ambient glow.
- **Notes** — scroll-triggered card reveal with stagger, hover lift, and an
  animated SVG line reveal connecting the notes to a central glyph.
- **Pinned scene** — a GSAP ScrollTrigger `pin` over a tall track scrubs the
  bottle through a full 360° rotation, shifts the rim light from cool to
  warm gold, and steps through four copy/note phases in sync.
- **Story** — line-by-line title/paragraph reveal with a clip-path wipe on
  the decorative panel and a scrub parallax on its background.
- **Collection** — reveal-on-scroll cards with a pointer-driven 3D tilt and
  a real "add to selection" toggle (no dead buttons).
- **CTA** — reveal-on-scroll copy, magnetic gold button, rotating conic
  gradient border.
- Global: custom cursor (desktop only), film-grain overlay, and full
  `prefers-reduced-motion` support — rotation, parallax, particles, and
  stagger are all disabled or drastically shortened, ending in the same
  final, readable state.

## Accessibility & performance notes

- Semantic landmarks (`header`, `main`, `section`, `nav`, `footer`),
  real `button`/`a` elements throughout, visible `:focus-visible` states.
- `prefers-reduced-motion` is respected everywhere motion is added (hooks,
  GSAP timelines, and a CSS-level safety net in `reset.css`).
- The 3D scene uses procedural drei `Lightformer`/`Environment` (no external
  HDR fetch), capped `dpr`, fewer particles and no contact shadows on mobile,
  and never renders a blank screen.
- No CDN script tags — every dependency is a local npm package.

## Known limitations

- The GLB model is not bundled (by design/instructions); until you add one,
  every 3D surface renders the CSS fallback bottle, which is intentional and
  fully art-directed rather than a placeholder.
- Fragrance imagery is CSS-composited (gradients/shadows), not photography —
  swap in real product photos under `public/images/` if you have them.
- Copy, pricing and the brand itself are fictional, created for this demo.
