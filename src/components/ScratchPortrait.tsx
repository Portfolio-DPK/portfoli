import React, { useEffect, useRef } from 'react';

/**
 * About-section portrait.
 *   - By default you see the real photo.
 *   - The Spider-Man version of the same photo sits on top, hidden behind a soft circular mask that follows the cursor:
 *     move the mouse over the portrait and Spider-Man appears right where it is (a spotlight that grows on enter,
 *     eases after the cursor, and shrinks away on leave). Nothing is painted or erased.
 * Both images share the same framing so they line up exactly.
 */
interface Props {
  real?: string;
  cover?: string;
  alt?: string;
  className?: string;
}

const ASPECT = 1400 / 1574;
/** spotlight radius as a fraction of the portrait width */
const RADIUS = 0.36;

export const ScratchPortrait: React.FC<Props> = ({ real = '/about/me-real.webp', cover = '/about/me-spider.webp', alt = 'Portrait', className = '' }) => {
  const box = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLImageElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const s = useRef({ x: 0, y: 0, tx: 0, ty: 0, r: 0, tr: 0, raf: 0, inside: false });

  const render = () => {
    const st = s.current;
    const el = layer.current;
    const b = box.current;
    if (!el || !b) return;
    st.x += (st.tx - st.x) * 0.1;
    st.y += (st.ty - st.y) * 0.1;
    st.r += (st.tr - st.r) * (st.tr > st.r ? 0.055 : 0.07);
    const feather = st.r * 0.6;
    const m = `radial-gradient(circle ${Math.max(st.r, 0.01)}px at ${st.x}px ${st.y}px, #000 ${Math.max(st.r - feather, 0)}px, transparent ${st.r}px)`;
    el.style.maskImage = m;
    el.style.webkitMaskImage = m;
    // the real photo gets the exact opposite mask, so inside the spotlight only Spider-Man is seen
    if (base.current) {
      const inv = `radial-gradient(circle ${Math.max(st.r, 0.01)}px at ${st.x}px ${st.y}px, transparent ${Math.max(st.r - feather, 0)}px, #000 ${st.r}px)`;
      base.current.style.maskImage = inv;
      base.current.style.webkitMaskImage = inv;
    }
    if (dot.current) dot.current.style.transform = `translate(${st.tx}px, ${st.ty}px) translate(-50%, -50%)`;
    const moving = Math.abs(st.tx - st.x) > 0.2 || Math.abs(st.ty - st.y) > 0.2 || Math.abs(st.tr - st.r) > 0.3;
    st.raf = moving ? requestAnimationFrame(render) : 0;
  };
  const kick = () => {
    if (!s.current.raf) s.current.raf = requestAnimationFrame(render);
  };

  useEffect(() => {
    const el = layer.current;
    if (el) {
      el.style.maskImage = 'radial-gradient(circle 0.01px at 0 0, #000, transparent)';
      el.style.webkitMaskImage = el.style.maskImage;
    }
    return () => cancelAnimationFrame(s.current.raf);
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width };
  };
  const enter = (e: React.PointerEvent) => {
    const p = pos(e);
    const st = s.current;
    if (!st.inside) {
      st.x = p.x;
      st.y = p.y;
      st.inside = true;
    }
    st.tx = p.x;
    st.ty = p.y;
    st.tr = p.w * RADIUS;
    if (dot.current) dot.current.style.opacity = '1';
    kick();
  };
  const move = (e: React.PointerEvent) => {
    const p = pos(e);
    const st = s.current;
    st.tx = p.x;
    st.ty = p.y;
    st.tr = p.w * RADIUS;
    kick();
  };
  const leave = () => {
    const st = s.current;
    st.inside = false;
    st.tr = 0;
    if (dot.current) dot.current.style.opacity = '0';
    kick();
  };

  return (
    <div
      ref={box}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`relative cursor-none select-none ${className}`}
      style={{ aspectRatio: ASPECT, touchAction: 'pan-y' }}
    >
      <div className="absolute inset-x-[14%] top-[10%] bottom-[5%] rounded-full bg-[#2563eb]/20 blur-[80px]" aria-hidden />
      {/* real photo */}
      <img ref={base} src={real} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-contain object-bottom pointer-events-none" />
      {/* Spider-Man (black & gold suit), revealed only inside the cursor spotlight */}
      <img
        ref={layer}
        src={cover}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain object-bottom pointer-events-none"
      />
      <div ref={dot} aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-opacity duration-150">
        <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_0_2px_rgba(37,99,235,.5)]" />
      </div>
    </div>
  );
};

export default ScratchPortrait;



