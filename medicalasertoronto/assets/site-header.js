// Scoped HP-style header behavior. No tracking or external dependencies.
(() => {
  const nav = document.querySelector('.site-nav');
  const button = document.querySelector('.site-menu-button');
  const menu = document.getElementById('site-mobile-menu');
  const background = [...document.querySelectorAll('.section-jumps, main, footer, .skip')];
  const mobile = window.matchMedia('(max-width: 860px)');
  let previousOverflow = '';
  let previousInert = [];
  function setOpen(open, restoreFocus = true) {
    if (open === (button.getAttribute('aria-expanded') === 'true')) return;
    button.classList.toggle('active', open);
    menu.classList.toggle('active', open);
    menu.inert = !open;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      previousOverflow = document.body.style.overflow;
      previousInert = background.map(element => element.inert);
      document.body.style.overflow = 'hidden';
      background.forEach(element => { element.inert = true; });
      menu.querySelector('a').focus();
    } else {
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      if (restoreFocus) button.focus();
    }
  }
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (button.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key === 'Tab') {
      const controls = [button, ...menu.querySelectorAll('a')];
      const index = controls.indexOf(document.activeElement);
      event.preventDefault();
      controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
  });
  mobile.addEventListener('change', () => { if (!mobile.matches) setOpen(false, false); });
  window.addEventListener('pagehide', () => setOpen(false, false));
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
