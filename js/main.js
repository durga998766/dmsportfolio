/* ============================================================
   MAIN — pill-nav behaviour, scroll progress, GSAP reveals
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const pillNav = document.getElementById('pillNav');
  const progress = document.querySelector('.scroll-progress');

  // pill-nav starts expanded (full links visible) at the top of the
  // page, then collapses to avatar + name + dots once scrolled —
  // hovering a collapsed pill re-reveals the links (handled in CSS)
  function onScroll() {
    const y = window.scrollY;
    pillNav && pillNav.classList.toggle('collapsed', y > 120);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? `${(y / h) * 100}%` : '0%';
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // active link highlight by section in view
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.pill-links a[href^="#"]');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove('active'));
            const match = document.querySelector(`.pill-links a[href="#${entry.target.id}"]`);
            if (match) match.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }

  // GSAP scroll reveals
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      gsap.utils.toArray('.reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: (i % 4) * 0.06,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // hero entrance
      gsap.from('.hero-name-block', {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });
      gsap.from('.hero-char-stage', {
        opacity: 0,
        scale: 0.92,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.15,
      });
    } else {
      gsap.set('.reveal', { opacity: 1, y: 0 });
    }
  } else {
    // GSAP not loaded — ensure content is still visible
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }
});



/* ============================================================
   EXPERIENCE — pins the row and scrubs it horizontally as the
   page scrolls, with a paper plane tracking progress above the
   cards (classic horizontal-scroll-hijack pattern).
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const pinSpace = document.querySelector('.exp-pin-space');
  const viewport = document.querySelector('.exp-viewport');
  const track = document.querySelector('.exp-track');
  if (!pinSpace || !viewport || !track || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const plane = document.querySelector('.exp-plane');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const planeCanvas = document.getElementById('expPlaneCanvas');
  if (planeCanvas && window.SpriteLoop && !reduceMotion) {
    window.SpriteLoop.create(planeCanvas, {
      path: (i) => `assets/experience/f${String(i).padStart(3, '0')}.webp`,
      count: 120,
      fps: 24,
    }).start();
  }

  if (reduceMotion) {
    viewport.style.overflowX = 'auto';
    viewport.style.height = 'auto';
    if (plane) plane.style.display = 'none';
    return;
  }

  let st;

  function build() {
    if (st) st.kill();
    const scrollAmount = track.scrollWidth - viewport.clientWidth;
    if (scrollAmount <= 0) return;

    gsap.set(track, { x: 0 });

    st = ScrollTrigger.create({
      trigger: pinSpace,
      start: 'top top',
      end: () => `+=${scrollAmount}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(track, { x: -p * scrollAmount });
        if (plane) {
          const planeRange = viewport.clientWidth - 60;
          const bob = Math.sin(p * Math.PI * 8) * 6;
          plane.style.transform = `translateX(${p * planeRange}px) translateY(${bob}px) rotate(${bob * 1.5}deg)`;
        }
      },
    });
  }

  build();
  window.addEventListener('resize', () => ScrollTrigger.refresh());
});

/* ============================================================
   WORD REVEAL — ports the attached React/Motion component's
   exact math to vanilla JS + GSAP ScrollTrigger: each word's
   opacity ramps from a dim baseline to fully lit as the
   section scrolls, staggered word by word.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const heading = document.getElementById('wordRevealHeading');
  const section = document.getElementById('word-reveal');
  if (!heading || !section || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const START_OPACITY = 0.15;
  const SPREAD = 0.8;
  const WORD_DURATION = 0.2;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wrap every word in its own span, preserving the spaces between them.
  // Preserve any existing .brush-accent-html child spans (inline HTML accents).
  const words = heading.textContent.trim().split(/\s+/);
  heading.setAttribute('aria-label', heading.textContent.trim());
  heading.innerHTML = '';
  const spans = words.map((word, i) => {
    const span = document.createElement('span');
    const clean = word.replace(/[.,!?]/g, '');
    // accent target: "simple" gets brush treatment (the comma is trimmed above)
    if (clean.toLowerCase() === 'simple') {
      span.classList.add('brush-accent', 'brush-accent-html');
    }
    span.textContent = word;
    span.setAttribute('aria-hidden', 'true');
    heading.appendChild(span);
    if (i < words.length - 1) heading.appendChild(document.createTextNode(' '));
    return span;
  });

  const count = spans.length;
  const ranges = spans.map((_, i) => {
    const start = count <= 1 ? 0 : (i / (count - 1)) * SPREAD;
    return { start, end: Math.min(1, start + WORD_DURATION) };
  });

  const bar = section.querySelector('.word-reveal-bar i');

  if (reduceMotion) {
    spans.forEach((s) => { s.style.opacity = 1; });
    if (bar) bar.style.height = '100%';
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      const p = self.progress;
      if (bar) bar.style.height = (p * 100) + '%';
      spans.forEach((span, i) => {
        const { start, end } = ranges[i];
        let opacity = START_OPACITY;
        if (p >= end) opacity = 1;
        else if (p > start) {
          const local = (p - start) / (end - start);
          opacity = START_OPACITY + (1 - START_OPACITY) * local;
        }
        span.style.opacity = opacity;
      });
    },
  });
});

/* ============================================================
   ABOUT ME — scroll-driven RANDOM word fly-in (Fix #6)
   Each word starts from a unique randomized offset (computed
   ONCE per word at load time, stored per span) and animates
   into its natural resting position as the section scrolls.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const story   = document.getElementById('aboutStory');
  const section = document.getElementById('about');
  if (!story || !section || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    if (story.querySelector('p')) story.querySelector('p').style.opacity = '1';
    return;
  }

  // Helper: seeded pseudo-random to avoid re-computing on each frame
  function rnd(lo, hi, seed) {
    // simple deterministic offset per index
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return lo + (x - Math.floor(x)) * (hi - lo);
  }

  // Wrap every word in a <span> — preserve accent spans in innerHTML
  const p = story.querySelector('p');
  if (!p) return;
  const rawHTML = p.innerHTML;
  // Temporarily strip accent spans to get plain text, then rebuild
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = rawHTML;
  const rawText = tempDiv.textContent.trim();
  const words = rawText.split(/\s+/);
  p.setAttribute('aria-label', rawText);

  // Re-build the paragraph with every word wrapped in a <span>
  // Accent spans (.story-accent) are re-inserted by matching EACH word inside them.
  const accentWords = {};
  tempDiv.querySelectorAll('.story-accent').forEach(el => {
    el.textContent.trim().split(/\s+/).forEach(w => {
      accentWords[w.toLowerCase().replace(/[^a-z]/g, '')] = el.className;
    });
  });

  p.innerHTML = '';
  const wordSpans = words.map((word, i) => {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    const wordKey = word.toLowerCase().replace(/[^a-z]/g, '');
    if (accentWords[wordKey]) {
      span.className = accentWords[wordKey];
    }
    span.textContent = word;

    // Uniform, clean rise-and-fade for every word (no random scatter/rotation —
    // reads as one smooth cascading fly-in instead of a chaotic jumble)
    const tx  = 0;
    const ty  = 22;
    const rot = 0;
    span._flyTx  = tx;
    span._flyTy  = ty;
    span._flyRot = rot;

    span.style.cssText = [
      'display:inline-block',
      'opacity:0',
      `transform:translate(${tx}px,${ty}px) rotate(${rot}deg)`,
      'will-change:transform,opacity',
    ].join(';');

    p.appendChild(span);
    if (i < words.length - 1) p.appendChild(document.createTextNode(' '));
    return span;
  });

  const total  = wordSpans.length;
  const SPREAD = 0.85;   // all words animate within 85% of scroll range
  const WIN    = 0.12;   // each word's individual animation window

  ScrollTrigger.create({
    trigger: section,
    start:   'top 75%',
    end:     'bottom 25%',
    scrub:   0.4,
    onUpdate(self) {
      const p = self.progress;
      wordSpans.forEach((span, i) => {
        const start = (i / total) * SPREAD;
        const end   = Math.min(1, start + WIN);
        let local;
        if      (p >= end)   local = 1;
        else if (p > start)  local = (p - start) / (end - start);
        else                 local = 0;
        const t = 1 - local;
        span.style.opacity   = local;
        span.style.transform = `translate(${span._flyTx * t}px,${span._flyTy * t}px) rotate(${span._flyRot * t}deg)`;
      });
    },
  });
});

/* ============================================================
   POLAROID — click / tap to advance (Fix #3, round 3).
   Each click advances photo-1 → photo-2 → … → photo-7 → loops.
   Click feedback: quick scale-down/up via CSS transition.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('polaroidImg');
  if (!img) return;
  const total = 7;
  let current = 1;

  // Signal that it's clickable
  img.style.cursor = 'pointer';

  img.addEventListener('click', () => {
    current = current >= total ? 1 : current + 1;

    // Scale-down tap feedback, then swap image, then scale back up
    img.style.transition = 'transform 0.08s ease, opacity 0.15s ease';
    img.style.transform  = 'scale(0.93)';
    img.style.opacity    = '0';

    setTimeout(() => {
      img.src = `assets/photos/photo-${current}.webp`;
      img.style.transform = 'scale(1)';
      img.style.opacity   = '1';
    }, 150);
  });
});

/* ============================================================
   FLOATING BACK-LINK (case study pages) — hides while the user
   is actively scrolling, reappears once scrolling settles (or
   whenever they're near the top), so it's out of the way while
   reading but always one idle-moment away.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const backLink = document.querySelector('.back-link-float');
  if (!backLink) return;

  let scrollTimer = null;
  function onScroll() {
    if (window.scrollY < 80) {
      backLink.classList.remove('is-hidden');
      return;
    }
    backLink.classList.add('is-hidden');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => backLink.classList.remove('is-hidden'), 220);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
});
