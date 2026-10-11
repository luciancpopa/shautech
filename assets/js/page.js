/* =========================================================
   shautech — shared behaviour for secondary pages
   (labs index, pulse, legal, 404). © 2026 shautech.
   Vanilla JS, zero dependencies, works from file://
   ========================================================= */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const safe = fn => { try { fn(); } catch (e) { console.error(e); } };

  /* nav: scrolled state, progress, burger */
  safe(() => {
    const nav = $('#nav'), prog = $('#navProgress'), burger = $('#burger'), links = $('#navLinks');
    if (nav) {
      const onScroll = () => {
        const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
        nav.classList.toggle('scrolled', y > 24);
        if (prog) prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      };
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
    if (burger && links) {
      burger.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open));
      });
      links.addEventListener('click', e => { if (e.target.tagName === 'A') { links.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
    }
  });

  /* reveal on scroll */
  safe(() => {
    const els = $$('[data-reveal], .split');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(e => io.observe(e));
    // anything already in view on load
    setTimeout(() => els.forEach(e => { const r = e.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) e.classList.add('in'); }), 60);
  });

  /* booking badge: always "next month" */
  safe(() => {
    const b = $('[data-booking]'); if (!b) return;
    const d = new Date(); d.setMonth(d.getMonth() + 1, 1);
    b.textContent = 'Now booking · ' + d.toLocaleString('en-GB', { month: 'long' }) + ' ' + d.getFullYear();
  });

  /* year */
  safe(() => { $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear()); });
})();
