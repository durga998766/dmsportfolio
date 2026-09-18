/* ============================================================
   LOADER — running-ninja loop while real assets load, then a
   colored stagger-wipe: strips cascade upward, revealing the
   hero. Rebuilt on GSAP (already loaded on this page) instead
   of raw CSS transitions — GSAP drives the animation directly
   via inline styles every frame, which sidesteps every class-
   toggle/reflow/timing edge case that raw CSS transitions can
   silently fail on. Guarded against double-invocation.
   ============================================================ */
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');
  const fill    = loader.querySelector('.fill');
  const strips  = Array.from(loader.querySelectorAll('.curtain-strip'));
  const content = loader.querySelector('.loader-content');
  const grid    = loader.querySelector('.loader-grid');

  // running-ninja sprite loop (canvas-based, true alpha transparency)
  const runnerCanvas = document.getElementById('loaderRunnerCanvas');
  let runnerLoop = null;
  if (runnerCanvas && window.SpriteLoop) {
    runnerLoop = window.SpriteLoop.create(runnerCanvas, {
      path:  (i) => `assets/loader/f${String(i).padStart(3, '0')}.webp`,
      count: 120,
      fps:   24,
    });
    runnerLoop.start();
  }

  // Fake progress bar that eases toward 92%, then snaps to 100% on finish
  let progress = 0;
  const tick = setInterval(() => {
    progress += (92 - progress) * 0.08 + 0.4;
    if (progress > 92) progress = 92;
    if (fill) fill.style.width = progress + '%';
  }, 80);

  let hasFinished = false; // guard: 'load' event + the 3.2s safety net
                            // can both fire — only run the reveal once
  function finish() {
    if (hasFinished) return;
    hasFinished = true;

    clearInterval(tick);
    if (fill) fill.style.width = '100%';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lift = () => {
      document.body.classList.remove('loading');

      if (reduceMotion || !window.gsap) {
        if (runnerLoop) runnerLoop.stop();
        loader.remove();
        return;
      }

      if (content) gsap.to(content, { opacity: 0, duration: 0.3, ease: 'power1.out' });
      if (grid)    gsap.to(grid,    { opacity: 0, duration: 0.3, ease: 'power1.out' });

      gsap.to(strips, {
        scaleY: 0,
        duration: 0.78,
        ease: 'power4.inOut',
        stagger: 0.045,
        onComplete: () => {
          if (runnerLoop) runnerLoop.stop();
          loader.remove();
        },
      });
    };
    // Short pause after 100% bar fill before starting the wipe
    setTimeout(lift, 180);
  }

  if (document.readyState === 'complete') {
    setTimeout(finish, 500);
  } else {
    window.addEventListener('load', finish);
    setTimeout(finish, 3200);
  }
})();
