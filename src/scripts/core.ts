import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;

/* ---------- smooth scroll (desktop only; native on touch) ---------- */
let lenis: Lenis | null = null;
if (!reduced && !coarse) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis');
}
(window as any).__lenis = lenis;

/* anchor links through lenis */
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(el as HTMLElement, { offset: -80 }) : el.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- reveals ---------- */
const io = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    }
  },
  { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
);
document.querySelectorAll('[data-reveal], [data-reveal-stagger], .mask-lines').forEach((el) => io.observe(el));

/* ---------- count-up numbers ---------- */
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const target = parseFloat(el.dataset.count!);
  const decimals = (el.dataset.count!.split('.')[1] || '').length;
  const suffix = el.dataset.suffix ?? '';
  const obj = { v: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (reduced) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: 'power3.out',
        onUpdate: () => (el.textContent = obj.v.toFixed(decimals) + suffix),
      });
    },
  });
});

/* ---------- parallax images ---------- */
if (!reduced) {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax || '12');
    gsap.fromTo(
      el,
      { yPercent: -amt },
      {
        yPercent: amt,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

/* ---------- magnetic buttons (fine pointer only) ---------- */
if (!coarse && !reduced) {
  document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
    const strength = 0.25;
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
  });
}

export { lenis, gsap, ScrollTrigger };
