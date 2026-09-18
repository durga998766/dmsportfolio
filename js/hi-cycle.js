/* ============================================================
   HI CYCLE — the "Hi" in the hero greet swaps through a small
   set of languages (English, Japanese, Italian, Persian,
   Russian, Hindi, Tamil, Telugu, Marathi, Odia) with a soft
   fade, looping forever.
   ============================================================ */
(function () {
  const el = document.getElementById('hiCycle');
  if (!el) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // leave it on the static "Hi"

  const greetings = [
    'Hi',            // English
    'こんにちは',      // Japanese
    'Ciao',          // Italian
    'سلام',          // Persian (Farsi)
    'Привет',        // Russian
    'नमस्ते',         // Hindi
    'வணக்கம்',        // Tamil
    'నమస్కారం',       // Telugu
    'नमस्कार',        // Marathi
    'ନମସ୍କାର',       // Odia
  ];

  let i = 0;
  setInterval(() => {
    i = (i + 1) % greetings.length;
    el.classList.add('is-swapping');
    setTimeout(() => {
      el.textContent = greetings[i];
      el.classList.remove('is-swapping');
    }, 220);
  }, 2000);
})();
