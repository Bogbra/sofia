# Sofia's Photography

A photography portfolio built with Next.js, React Three Fiber, Three.js and GSAP. The landing page presents selected work in a draggable, full-bleed spherical gallery — click any image to open it in a lightbox.

## Stack

- Next.js App Router
- React + TypeScript
- Three.js via React Three Fiber
- GSAP

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Pages

- `/` — Collection (interactive 3D gallery)
- `/about` — About
- `/contact` — Contact
- `/impressum` — Impressum
- `/datenschutz` — Privacy policy (Datenschutzerklärung)

Navigation is a fullscreen hamburger menu on every screen size.

## Environment variables

- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` — required for the contact form to actually send mail. Get a free key at [web3forms.com](https://web3forms.com/) (just an email address, no dashboard login) and set it in `.env.local` for local development and in the Vercel project's Environment Variables for production.
- `NEXT_PUBLIC_SITE_URL` — the canonical production URL (e.g. `https://sofia-photography.de`), used for `metadataBase`, OpenGraph/Twitter URLs, `sitemap.xml` and `robots.txt` (see `lib/site.ts`). Falls back to `https://sofias-photography.vercel.app` if unset. Update this instead of editing `app/layout.tsx`/`app/robots.ts`/`app/sitemap.ts` when the domain changes.

## Notes

- The contact form requires `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to be set (see above); without it, submission is blocked client-side and shows an error instead of silently failing.
- `components/FloatingGallery.tsx` loads downscaled copies of the artwork from `public/artworks/gallery/` (max ~1500 px edge) as WebGL textures to keep GPU memory and transfer size reasonable; the Lightbox still shows the full-resolution originals from `public/artworks/`.
- Impressum and Datenschutz already contain the real operator name, address, email and hosting/service disclosures — review them against the actual operator and hosting setup before relying on them.

## Design system

- Background: `#D9D9D9` (light theme, default) / `#090909` (dark theme)
- Headings: Bebas Neue via `next/font`
- Body copy: Inter via `next/font`
- Body copy size: 18–22 px depending on viewport
- Header and legal navigation: 18–20 px with high-contrast text

## Theme

Light mode is the default. The toggle button (bottom-left, always visible) switches to dark mode and stores the choice in `localStorage`; a small inline script in `app/layout.tsx` applies it before first paint to avoid a flash of the wrong theme. `--paper`/`--ink`/`--muted` in `app/globals.css` swap per theme via `:root[data-theme="dark"]`. The mix-blend-mode "invert" elements (hero text, logo, custom cursor) and the fullscreen overlays (nav menu, lightbox) intentionally use fixed, theme-independent colors (`--mark`, `--black`) so they keep working the same way in both themes. The contact form is deliberately inverted relative to the page theme (dark card in light mode, light card in dark mode) via `--form-bg`/`--form-fg`/`--form-border`.

## Accessibility

The shared frame includes a keyboard skip link, visible focus rings, semantic navigation landmarks, `aria-current` for the active page, and high-contrast text. The navigation overlay and image lightbox move focus to their close control on open, trap focus while open, restore focus to the trigger on close, and are dismissible with `Escape`. Since the collection images live inside a WebGL canvas, `components/FloatingGallery.tsx` also renders a visually-hidden (focus-visible) list of buttons so the collection is reachable and operable by keyboard and screen readers, not just by pointer. `prefers-reduced-motion` is honored both in CSS and in the GSAP/`useFrame` animations (entrance tweens, the floating gallery's idle auto-rotation and bobbing).
