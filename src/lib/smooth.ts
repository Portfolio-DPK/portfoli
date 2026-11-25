import Lenis from 'lenis';

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: 'smooth' });
};

/** Freeze / release the page scroll (used while a modal is open so the wheel only scrolls the modal). */
export const setPageScrollLocked = (locked: boolean) => {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
};

/**
 * A slow, cinematic auto-scroll (ease-in-out: it picks up speed, glides, then settles).
 * Lenis lets the user interrupt it at any time by wheeling or touching.
 */
export const cinematicScrollTo = (id: string, duration = 3.4, offset = 0) => {
  const el = document.getElementById(id);
  if (!el) return;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  if (instance) instance.scrollTo(el, { duration, easing: ease, offset });
  else el.scrollIntoView({ behavior: 'smooth' });
};

