/* ============================================================
   PAGE WIPE — a lighter version of the homepage loader, used on
   case-study pages: just the colored strips (no ninja sprite,
   no progress bar), held briefly then GSAP-staggered away to
   reveal the page. Color comes from --loader-color, set per
   page via a small inline <style> override in <head>.
   ============================================================ */
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');
  const strips = Array.from(loader.querySelectorAll('.curtain-strip'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal() {
    document.body.classList.remove('loading');

    if (reduceMotion || !window.gsap) {
      loader.remove();
      return;
    }

    gsap.to(strips, {
      scaleY: 0,
      duration: 0.7,
      ease: 'power4.inOut',
      stagger: 0.04,
      onComplete: () => loader.remove(),
    });
  }

  // Brief hold so the wipe reads as a deliberate transition, not a flicker
  setTimeout(reveal, 320);
})();
