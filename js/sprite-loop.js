/* ============================================================
   SPRITE LOOP — a small reusable canvas-based looping sprite
   player (true alpha transparency, works in every browser,
   unlike <video> alpha which isn't reliably supported). Used
   for the loader's running ninja and the experience section's
   flying paper plane.

   Usage:
     const loop = SpriteLoop.create(canvasEl, {
       path: i => `assets/loader/f${String(i).padStart(3,'0')}.webp`,
       count: 120,
       fps: 24,
     });
     loop.start();   // begins auto-advancing playback
     loop.stop();
   ============================================================ */
(function () {
  function create(canvas, { path, count, fps = 24 }) {
    const ctx = canvas.getContext('2d');
    const images = new Array(count);
    let loaded = 0;
    let current = 0;
    let raf = null;
    let lastT = 0;
    const frameDuration = 1000 / fps;

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    function draw(index) {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      // contain-fit — these are small UI sprites, never crop them
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = w / h;
      let dw, dh, dx, dy;
      if (imgRatio > boxRatio) {
        dw = w; dh = w / imgRatio; dx = 0; dy = (h - dh) / 2;
      } else {
        dh = h; dw = h * imgRatio; dx = (w - dw) / 2; dy = 0;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.src = path(i + 1);
      img.onload = () => { loaded++; if (i === 0) draw(0); };
      images[i] = img;
    }

    function tick(t) {
      if (t - lastT >= frameDuration) {
        lastT = t;
        current = (current + 1) % count;
        draw(current);
      }
      raf = requestAnimationFrame(tick);
    }

    return {
      start() { if (!raf) raf = requestAnimationFrame(tick); },
      stop() { if (raf) cancelAnimationFrame(raf); raf = null; },
      get loadedCount() { return loaded; },
    };
  }

  window.SpriteLoop = { create };
})();
