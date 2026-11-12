/* TJ Tintas — interações nativas, sem bibliotecas. */
'use strict';

// Hero: primeira foto fixa no HTML, troca suave e pausa acessível.
(() => {
  const hero = document.getElementById('hero');
  const slides = [...hero.querySelectorAll('.hero-slide')];
  const dots = [...hero.querySelectorAll('[data-hero-slide]')];
  const pause = hero.querySelector('.hero-pause');
  if (slides.length < 2 || !pause) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = reduced.matches, timer;
  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
  }
  function schedule() {
    clearInterval(timer);
    if (!paused && !document.hidden) timer = setInterval(() => show(index + 1), 6000);
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Retomar troca automática' : 'Pausar troca automática');
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); schedule(); }));
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { paused = reduced.matches; schedule(); });
  schedule();
})();

const toggle = document.getElementById('mobile-toggle');
const navigation = document.getElementById('main-nav');

function closeMenu() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu de navegação');
}

toggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 1101px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const filters = document.querySelectorAll('[data-filter]');
const products = document.querySelectorAll('.product-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  products.forEach(product => {
    product.hidden = button.dataset.filter !== 'all' && product.dataset.category !== button.dataset.filter;
  });
}));

// O FAQ usa <details>/<summary>, com teclado e sem depender de JavaScript.
// As duas respostas abertas no Figma permanecem abertas inicialmente.
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    const icon = item.querySelector('.faq-chevron');
    icon.src = item.open ? icon.dataset.openSrc : icon.dataset.closedSrc;
  });
});
document.querySelectorAll('[data-modal]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.modal);
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      button.focus();
    }, { once: true });
  });
});
document.querySelectorAll('.legal-dialog').forEach(dialog => {
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
});
