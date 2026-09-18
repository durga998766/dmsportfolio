# Durgamadhaba Sahoo — Portfolio

Static HTML/CSS/JS portfolio for a UI/UX designer. Ninja-themed,
white/red/ink color system. **No build step, no framework** — plain
files, open `index.html` directly or serve with Live Server.

## Structure

```
index.html              → home: hero, projects, about-me, word-reveal,
                           impact stats, experience cards, skills, resume
accuknox.html            → case study
zurie.html               → case study
pmgx.html                → case study
cowboy.html              → case study (currently unlinked — project
                           card on index.html shows a "locked/in
                           progress" state instead of linking here)
css/style.css            → single stylesheet, all design tokens as
                           CSS variables at the top of the file
js/main.js               → nav, GSAP ScrollTrigger reveals, word-reveal
                           logic, polaroid slideshow, experience
                           horizontal-scroll-pin
js/hero-sequence.js      → draws a WebP frame sequence to <canvas>,
                           scrubbed by scroll via
                           window.HeroSequence.setProgress(p)
js/loader.js             → page-load curtain-stagger-wipe intro
assets/hero-frames/      → 146 WebP frames (extracted from the ninja
                           video) — the hero "video"
assets/accuknox/         → AccuKnox case-study images
assets/zurie/            → Zurie case-study images
assets/pmgx/             → PMGX case-study images
assets/cowboy/           → cowboy project cover (case study itself
                           not built yet)
assets/photos/           → 7 personal photos, cycled in the About Me
                           polaroid slideshow
assets/decor/katana.webp → decorative separator image
assets/profile/          → nav pill avatar
assets/durgamadhaba-sahoo-resume.pdf
```

## Libraries (via CDN — no npm/package.json)

GSAP + ScrollTrigger only. That's it. No React, no Three.js (removed
on purpose — see below), no build tools.

## Design system — don't introduce new values, reuse these

- **Colors** (CSS vars in `:root`): `--white`, `--paper` (off-white),
  `--ink` (near-black), `--red` (#C81034), `--gray`
- **Fonts**: `--display` (Shippori Mincho, serif — headings),
  `--brush` (Yuji Mai, handwritten — **use sparingly, single words
  only**, e.g. one accent word in a sentence), `--body` (Inter)
- **Motifs**: kanji numerals (壱弐参四) instead of 1/2/3/4 for
  numbered lists; a hanko-seal (忍) logo mark; thin red accent
  lines/borders; `.reveal` class + IntersectionObserver-driven GSAP
  fade-in for scroll reveals (see `main.js`)

## Intentional decisions (won't be obvious from reading code alone)

- **Hero has gone through several iterations**: 3D puppet →
  scroll-scrubbed AI video frame sequence → current version:
  a genuinely INTERACTIVE cursor-tracking character. The character
  is a Pixar-style 3D ninja, green-screen filmed doing one continuous
  178-frame sword-sweep motion, chroma-keyed to alpha WebP frames
  (assets/hero-char/f001.webp...f178.webp). js/hero-char.js maps
  real mouse X position (not scroll!) to a frame index, smoothly
  eased, and draws it on a canvas. This is NOT a video element —
  video can't respond to real cursor position, only canvas+frames can.
  Don't replace this with a <video> tag; the whole point is real
  interactivity.
- **Hero background is red with a CSS-only golden-ratio grid**
  (`.hero-grid-bg`) — no image/video asset, pure CSS gradients at the
  φ (0.382/0.618) split points. Matches the site's --red brand color.
- **Custom cursor**: the whole site uses a kunai-shaped cursor
  (assets/cursor/kunai-2.png) via CSS `cursor: url(...)`. If you add
  new interactive elements, keep them included in the cursor rule.
- **Pill nav** (`#pillNav`): expanded (full links) at page top,
  collapses to avatar+name+dots on scroll past ~120px, re-expands on
  hover while collapsed. This mimics a specific reference recording
  the client provided — don't simplify to a standard always-expanded
  navbar.
- **Experience section** is a pinned, horizontally-scrolling row of
  cards (GSAP ScrollTrigger `pin` + manual `x` transform), not a
  vertical stack. A paper-plane icon tracks scroll progress above the
  row.
- **Loader** uses a 5-strip "curtains stagger wipe" reveal (exact
  client-provided reference), not a simple fade or slide.
- **Cowboy project** is intentionally locked/non-clickable on the
  projects grid — the case study isn't finished yet. Don't wire it up
  to `cowboy.html` without being asked.
- **Word-reveal section** ("What I Do") ports a specific
  React/Motion component's math (`START_OPACITY=0.15, SPREAD=0.8,
  WORD_DURATION=0.2`) to vanilla JS — keep those constants if editing.

## When making a fix

1. Find the existing section/class before writing new code.
2. Match existing patterns (`.reveal` for fades, ScrollTrigger for
   scroll-driven motion, CSS vars for all colors/fonts).
3. Don't add a new library unless asked.
4. Test at least one real hero frame's positioning if touching hero
   text — the "free space" text placement is intentional and
   frame-checked.
