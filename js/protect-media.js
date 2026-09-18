/* ============================================================
   PROTECT MEDIA — casual deterrents against right-click
   "Save image as / Copy image / Download video" on this site's
   own photos and videos. NOTE: this is a speed-bump for average
   visitors, not real DRM — anyone using browser devtools, view-
   source, or a screenshot can still get the file. There is no
   way to make an image on the open web truly uncopyable.
   ============================================================ */
(function () {
  // Block the right-click context menu on every image and video
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('img, video')) e.preventDefault();
  });

  // Stop the native drag-out-to-save-as gesture on images
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('img, video')) e.preventDefault();
  });

  // Hide the "Download" button from the built-in video controls
  // (only matters for any <video> you later add with controls on —
  // the hero/CTA clips already autoplay without controls)
  document.querySelectorAll('video').forEach((v) => {
    v.setAttribute('controlsList', 'nodownload noremoteplayback');
    v.setAttribute('disablePictureInPicture', '');
  });
})();
