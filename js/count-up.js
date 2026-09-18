/* ============================================================
   COUNT UP — animates each .impact-num from 0 to its
   data-count value once it scrolls into view.
   ============================================================ */
(function () {
  const nums = document.querySelectorAll('.impact-num[data-count]');
  if (!nums.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function format(n) {
    return Math.round(n).toLocaleString('en-IN');
  }

  function animate(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.textContent = format(target) + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = format(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach((el) => io.observe(el));
})();
