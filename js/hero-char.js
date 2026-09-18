/* ============================================================
   HERO CHARACTER — cursor-tracking sprite player. A Pixar-style
   ninja (extracted from a green-screen video into 178 alpha
   WebP frames) sweeps his sword through a wide arc; mouse X
   position across the hero picks the matching frame, so the
   character appears to track the cursor left-to-right in real
   time. Same reliable canvas + preloaded-Image approach as
   hero-sequence.js / sprite-loop.js.
   ============================================================ */
(function () {
  const canvas = document.getElementById('heroCharCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const stage = canvas.parentElement; // .hero-char-stage (fills the hero)

  const FRAME_COUNT = 178;
  const FRAME_PATH = (i) => `assets/hero-char/f${String(i).padStart(3, '0')}.webp`;

  const images = new Array(FRAME_COUNT);
  let currentIndex = Math.round(FRAME_COUNT / 2); // start centered
  let targetIndex = currentIndex;
  let firstPaintDone = false;

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.clientWidth;
    const h = rect.height || canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    // contain-fit — never crop the character
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = w / h;
    let dw, dh, dx, dy;
    if (imgRatio > boxRatio) {
      dw = w; dh = w / imgRatio; dx = 0; dy = (h - dh) / 2;
    } else {
      dh = h; dw = h * imgRatio; dx = (w - dw) / 2; dy = 0;
    }
    ctx.drawImage(img, dx, dy, dw, dh);

    if (!firstPaintDone) {
      firstPaintDone = true;
    }
  }

  // preload all frames; draw the centered frame as soon as it's ready
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.src = FRAME_PATH(i + 1);
    img.onload = () => {
      if (i === currentIndex) drawFrame(currentIndex);
    };
    images[i] = img;
  }

  // Canvas has a fixed intrinsic aspect ratio (from the source frames);
  // set its CSS size to match so sizeCanvas() has real dimensions.
  const aspectProbe = new Image();
  aspectProbe.src = FRAME_PATH(1);
  aspectProbe.onload = () => {
    const ratio = aspectProbe.naturalWidth / aspectProbe.naturalHeight;
    canvas.style.width = `calc(min(78vh, 900px) * ${ratio})`;
    sizeCanvas();
    drawFrame(currentIndex);
  };

  window.addEventListener('resize', () => { sizeCanvas(); drawFrame(currentIndex); });

  // ---- cursor tracking -------------------------------------------------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onPointerMove(e) {
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1 across the hero
    const clamped = Math.max(0, Math.min(1, px));
    targetIndex = Math.round(clamped * (FRAME_COUNT - 1));
  }
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerleave', () => {
    targetIndex = Math.round(FRAME_COUNT / 2); // relax back to center
  });

  if (reduceMotion) {
    // static centered pose, no animation loop
    return;
  }

  // ease currentIndex toward targetIndex every frame for a smooth,
  // slightly weighted follow rather than a hard frame-snap
  function loop() {
    requestAnimationFrame(loop);
    if (currentIndex !== targetIndex) {
      currentIndex += (targetIndex - currentIndex) * 0.18;
      const rounded = Math.round(currentIndex);
      drawFrame(Math.max(0, Math.min(FRAME_COUNT - 1, rounded)));
      if (Math.abs(targetIndex - currentIndex) < 0.4) currentIndex = targetIndex;
    }
  }
  requestAnimationFrame(loop);
})();
