(() => {
  'use strict';
  const track = document.querySelector('#sample-track');
  if (!track) return;
  const slides = [...track.querySelectorAll('.sample')];
  const videos = slides.map(slide => slide.querySelector('video'));
  const previous = document.querySelector('[aria-label="Previous sample"]');
  const next = document.querySelector('[aria-label="Next sample"]');
  const position = document.querySelector('.sample-position');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  const update = () => {
    index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    slides.forEach((slide, n) => {
      if (n !== index) {
        videos[n].pause();
        // Move focus before making an outgoing player's native controls inert.
        if (slide.contains(document.activeElement)) track.focus({preventScroll: true});
      }
      slide.inert = n !== index;
    });
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    const label = `${index + 1} of ${slides.length}`;
    if (position.textContent !== label) position.textContent = label;
  };
  const advance = delta => {
    track.scrollTo({left: Math.max(0, Math.min(slides.length - 1, index + delta)) * track.clientWidth,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance(1));
  // Leave native video seeking and every touch gesture to the browser.
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    advance(event.key === 'ArrowLeft' ? -1 : 1);
  });
  track.addEventListener('scroll', update, {passive: true});
  videos.forEach((video, n) => video.addEventListener('play', () => {
    if (n !== index) video.pause();
    videos.forEach((other, i) => { if (i !== n) other.pause(); });
  }));
  let width = track.clientWidth;
  new ResizeObserver(() => {
    if (track.clientWidth === width) return;
    width = track.clientWidth;
    track.scrollTo({left: index * width, behavior: 'instant'});
    update();
  }).observe(track);
  update();
})();
