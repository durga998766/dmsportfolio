# Durgam Sahoo — Portfolio (demo build)

White + red, Japanese ink / hanko-seal themed portfolio. Built with plain
HTML/CSS/JS, Three.js (hero shuriken), and GSAP (scroll reveals) — no
build step, just open `index.html` in a browser or upload the folder to
any static host (Vercel, Netlify, GitHub Pages, Framer, etc).

## Files

```
index.html        → home page: hero, projects grid, about, skills, resume
accuknox.html      → case study 1
zurie.html         → case study 2
pmgx.html          → case study 3
cowboy.html        → case study 4 (brand identity, incl. Medini)
css/style.css      → all design tokens + styles in one file
js/hero3d.js       → the 3D shuriken hero animation
js/main.js         → nav behaviour, scroll progress, GSAP reveals
```

## What's a placeholder right now

Everything marked **"— placeholder"** or wrapped in **[brackets]** is a
stand-in, ready for your real content:

- Project cover shots + in-page screenshots (`.project-card-visual`,
  `.detail-cover`, `.detail-shot`) — replace the `<div>` with an
  `<img>`/`<video>` tag pointing at your file.
- About section portrait + 4 photo tiles (`.about-portrait`, `.ph`).
- Skills section 6 tiles (`.skill-card`) — photography, 2D game, SaaS
  platform, motion graphics, parallax reel, VFX reel. Swap the `.bg` div
  for a video/gif/image.
- Resume buttons (`#resume .btn`) — point the `href` at your resume PDF.
- Case-study body copy — every `[bracketed]` paragraph is a prompt for
  your real write-up (overview, process, outcome).
- Footer social links.

## What's new in this pass

- **Loading screen**: a small running-ninja SVG plays while the page loads,
  then the whole overlay lifts up (curtain-reveal) into the hero. Has a
  6-second CSS-only failsafe in case JS never runs, plus a `<noscript>` hide.
- **Cinematic hero**: the hero pins for ~3 screens of scroll while the 3D
  camera pushes from a wide shot → face close-up (masked eye-slit) → katana
  close-up, with two captions crossfading in sync. Logic lives in
  `js/hero3d.js` (`window.NinjaHero.setProgress`) driven by a ScrollTrigger
  in `js/main.js`.
- **About → "Village" section**: real resume data now lives here — a small
  runner crosses a night rooftop skyline as you scroll, and 4 checkpoint
  cards (education + 3 roles) reveal as it passes them. Skills are listed
  below as tags.
- **Resume wired up**: `assets/durgamadhaba-sahoo-resume.pdf` is the file
  the Resume section's two buttons point to (view + download).
- **Footer**: Email (mailto) and Behance now link out for real; LinkedIn is
  still a placeholder `#` since no URL was provided.

### Honest note on the 3D ninja
This is a **stylised, masked low-poly figure** built from primitives
(capsules/spheres/boxes) — not a sculpted or scanned photorealistic human
model. That's a deliberate trade-off: a real face wouldn't read well at
this fidelity anyway, so the mask (a single pale eye-slit on a featureless
head) does double duty — it's on-theme *and* it hides the lack of facial
detail. If you want a genuinely photoreal character later, that needs an
actual 3D character asset (sculpted/scanned + rigged), which isn't
something I can generate from scratch here.

## Notes on the build

- **Name**: hero + nav currently say "Durgam Sahoo" (from your Behance
  handle) — change every instance in the 5 HTML files if you go by
  something else.
- **Theme**: white / hanko-red (#C81034) / ink black, Shippori Mincho +
  Yuji Mai (brush accent) + Inter. All colors are CSS variables at the
  top of `css/style.css` — change once, applies everywhere.
- **Kanji numerals** (壱弐参四) are used instead of 01/02/03/04 for the
  project index, and 伍/六 continue the sequence in the skills grid.
- Respects `prefers-reduced-motion`, has visible keyboard focus states,
  and is responsive down to mobile (hamburger nav below 780px).
- Once you have real assets, tell me and I'll wire them in and refine
  the layout around them.
