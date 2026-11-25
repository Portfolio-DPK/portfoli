import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Hand-drawn (vector) spider-hero hanging upside-down in a tucked pose: feet together at the thread,
 * hands gripping it, body curled. Flat cartoon style with a thick dark outline.
 *
 * It is alive:
 *  - the head turns toward the mouse (the face is a faux-3D mask: features slide, the far lens narrows)
 *  - the lenses squint when you hover him and glare while you pull the web
 *  - the whole body leans toward the cursor, breathes, and the limbs sway a little
 *
 * ViewBox is 460 × 690; the thread is tied at (230, 14). Switch SUIT to 'classic' for the red-and-blue suit.
 */
type Suit = 'upgraded' | 'classic';
const SUIT: Suit = 'upgraded';

const PALETTE = {
  upgraded: { red: '#cf3128', redDark: '#2a0a0c', limb: '#3d3d41', limbLight: '#5a5a60', shin: '#cf3128' },
  classic: { red: '#d2202f', redDark: '#2a0a0c', limb: '#1f43a0', limbLight: '#3a62c8', shin: '#1f43a0' },
}[SUIT];
const { red: RED, redDark: WEB, limb: LIMB, limbLight: LIMB_LIGHT, shin: SHIN } = PALETTE;
const INK = '#141416';
const OUT = 4.5;

/** the lens drawn for the upright face; it is mirrored for the other eye */
const LENS = 'M-24 -12 C-14 -21 6 -9 13 8 C5 23 -17 23 -26 8 C-30 1 -29 -6 -24 -12 Z';
const HEAD_C = { x: 262, y: 556 };
const NECK = { x: 262, y: 506 };

interface Props {
  /** 'drag' while the web is being pulled — the lenses narrow */
  mood?: 'idle' | 'drag';
}

const Figure: React.FC<Props> = ({ mood = 'idle' }) => {
  const svg = useRef<SVGSVGElement>(null);
  const lean = useRef<SVGGElement>(null);
  const legs = useRef<SVGGElement>(null);
  const lower = useRef<SVGGElement>(null);
  const torso = useRef<SVGGElement>(null);
  const head = useRef<SVGGElement>(null);
  const face = useRef<SVGGElement>(null);
  const lensA = useRef<SVGGElement>(null); // local-left of the upright face  → ends up on the screen's right
  const lensB = useRef<SVGGElement>(null); // local-right → screen's left
  const state = useRef({ hover: false, mood: 'idle' as 'idle' | 'drag' });

  useEffect(() => {
    state.current.mood = mood;
    applySquint();
  }, [mood]);

  const applySquint = () => {
    const s = state.current;
    const squint = s.mood === 'drag' ? 0.58 : s.hover ? 0.78 : 1;
    const tilt = s.mood === 'drag' ? 9 : s.hover ? 4 : 0;
    gsap.to([lensA.current, lensB.current], { scaleY: squint, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(lensA.current, { rotation: tilt, duration: 0.25, overwrite: 'auto' });
    gsap.to(lensB.current, { rotation: -tilt, duration: 0.25, overwrite: 'auto' });
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.set(lean.current, { svgOrigin: '230 14' });
      gsap.set(legs.current, { svgOrigin: '230 14' });
      gsap.set(lower.current, { svgOrigin: '232 192' });
      gsap.set(torso.current, { svgOrigin: '238 430' });
      gsap.set(head.current, { svgOrigin: `${NECK.x} ${NECK.y}`, rotation: 22 });
      gsap.set([lensA.current, lensB.current], { transformOrigin: '50% 50%' });

      // ---- idle life ----
      if (!reduce) {
        gsap.to(lower.current, { rotation: 2.2, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(legs.current, { rotation: -1.6, duration: 3.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(torso.current, { scale: 1.022, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }

      // ---- mouse tracking ----
      const to = {
        headRot: gsap.quickTo(head.current, 'rotation', { duration: 0.45, ease: 'power3.out' }),
        faceX: gsap.quickTo(face.current, 'x', { duration: 0.35, ease: 'power3.out' }),
        faceY: gsap.quickTo(face.current, 'y', { duration: 0.35, ease: 'power3.out' }),
        lensAx: gsap.quickTo(lensA.current, 'scaleX', { duration: 0.35, ease: 'power3.out' }),
        lensBx: gsap.quickTo(lensB.current, 'scaleX', { duration: 0.35, ease: 'power3.out' }),
        lean: gsap.quickTo(lean.current, 'rotation', { duration: 0.8, ease: 'power3.out' }),
      };

      let raf = 0;
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      const follow = () => {
        raf = 0;
        const el = head.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        const yaw = clamp((mx - cx) / (window.innerWidth * 0.3)); // −1 = cursor far left, +1 = far right
        const pitch = clamp((my - cy) / (window.innerHeight * 0.4)); // +1 = cursor below
        to.headRot(22 + yaw * 20);
        // the face is drawn rotated by 180°, so screen offsets are negated in its own space
        to.faceX(-yaw * 17);
        to.faceY(-pitch * 9);
        // the lens on the far side narrows, the near side widens — a cheap head-turn
        to.lensAx(1 + (yaw > 0 ? 0.1 : -0.46) * Math.abs(yaw)); // screen-right lens
        to.lensBx(1 + (yaw > 0 ? -0.46 : 0.1) * Math.abs(yaw)); // screen-left lens
        to.lean(clamp((mx - window.innerWidth * 0.86) / (window.innerWidth * 0.6)) * 7);
      };
      const onMove = (e: PointerEvent) => {
        mx = e.clientX;
        my = e.clientY;
        if (!raf) raf = requestAnimationFrame(follow);
      };
      if (!reduce) window.addEventListener('pointermove', onMove, { passive: true });
      follow();
      return () => {
        window.removeEventListener('pointermove', onMove);
        if (raf) cancelAnimationFrame(raf);
      };
    }, svg);
    return () => ctx.revert();
  }, []);

  const pe = () => {
    state.current.hover = true;
    applySquint();
  };
  const pl = () => {
    state.current.hover = false;
    applySquint();
  };

  return (
    <svg ref={svg} viewBox="0 0 460 690" className="block h-full w-auto overflow-visible" aria-hidden onPointerEnter={pe} onPointerLeave={pl}>
      <defs>
        {/* web lines over the suit: fine black strands in a diagonal weave */}
        <pattern id="webTex" width="19" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <path d="M0 9.5 H19 M9.5 0 V19" stroke={WEB} strokeWidth="1.25" fill="none" opacity=".85" />
          <path d="M0 0 L19 19 M19 0 L0 19" stroke={WEB} strokeWidth=".8" fill="none" opacity=".55" />
        </pattern>
        <linearGradient id="spShadeV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".1" />
          <stop offset="1" stopColor="#000" stopOpacity=".3" />
        </linearGradient>
        <radialGradient id="lensShade" cx=".5" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".7" stopColor="#f1f1f4" />
          <stop offset="1" stopColor="#c9c9d2" />
        </radialGradient>
        <clipPath id="headClip">
          <ellipse cx="0" cy="0" rx="50" ry="60" />
        </clipPath>
      </defs>

      {/* the thread + the frayed bundle where it is tied */}
      <g stroke="#e9e9ee" strokeLinecap="round" fill="none">
        <path d="M230 -400 V30" strokeWidth="1.8" />
        <path d="M226 -40 Q221 -14 224 30 M234 -50 Q239 -20 236 30 M229 -70 Q224 -30 228 28" strokeWidth="1" opacity=".75" />
        <path d="M219 -60 L228 -8 M241 -66 L233 -10" strokeWidth=".9" opacity=".6" />
      </g>

      <g ref={lean}>
        {/* ===== legs: red/blue shins up to the feet, dark thighs folded back ===== */}
        <g ref={legs}>
          <path d="M82 238 C64 292 98 352 152 364" fill="none" stroke={INK} strokeWidth={50 + OUT * 2} strokeLinecap="round" />
          <path d="M82 238 C64 292 98 352 152 364" fill="none" stroke={LIMB} strokeWidth="50" strokeLinecap="round" />
          <path d="M378 238 C396 292 362 352 308 364" fill="none" stroke={INK} strokeWidth={50 + OUT * 2} strokeLinecap="round" />
          <path d="M378 238 C396 292 362 352 308 364" fill="none" stroke={LIMB} strokeWidth="50" strokeLinecap="round" />
          <path d="M212 48 L90 230" fill="none" stroke={INK} strokeWidth={54 + OUT * 2} strokeLinecap="round" />
          <path d="M212 48 L90 230" fill="none" stroke={SHIN} strokeWidth="54" strokeLinecap="round" />
          <path d="M212 48 L90 230" fill="none" stroke="url(#webTex)" strokeWidth="54" strokeLinecap="round" />
          <path d="M248 48 L370 230" fill="none" stroke={INK} strokeWidth={54 + OUT * 2} strokeLinecap="round" />
          <path d="M248 48 L370 230" fill="none" stroke={SHIN} strokeWidth="54" strokeLinecap="round" />
          <path d="M248 48 L370 230" fill="none" stroke="url(#webTex)" strokeWidth="54" strokeLinecap="round" />
          {/* moon-side highlight along the right shins */}
          <path d="M262 62 L356 200" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="6" strokeLinecap="round" />
          <path d="M52 214 L108 192 L124 228 L72 256 Z" fill={LIMB_LIGHT} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
          <path d="M408 214 L352 192 L336 228 L388 256 Z" fill={LIMB_LIGHT} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
          {/* feet: soles pointing up, pressed together */}
          <path d="M200 22 Q216 4 228 24 L232 96 L196 100 Z" fill={RED} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
          <path d="M232 24 Q244 4 260 22 L264 100 L228 96 Z" fill={RED} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
          <path d="M200 22 Q216 4 228 24 L232 96 L196 100 Z M232 24 Q244 4 260 22 L264 100 L228 96 Z" fill="url(#webTex)" />
        </g>

        {/* ===== torso, arms and head swing as one pendulum about the fists ===== */}
        <g ref={lower}>
          <g ref={torso}>
            <path d="M158 352 C196 330 280 330 316 356 C330 410 322 470 290 506 C262 528 214 528 186 506 C152 470 146 410 158 352 Z" fill={RED} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
            <path d="M158 352 C196 330 280 330 316 356 C330 410 322 470 290 506 C262 528 214 528 186 506 C152 470 146 410 158 352 Z" fill="url(#webTex)" />
            <path d="M158 352 C196 330 280 330 316 356 C330 410 322 470 290 506 C262 528 214 528 186 506 C152 470 146 410 158 352 Z" fill="url(#spShadeV)" />
            <g fill={INK} stroke={INK} strokeWidth="2" strokeLinecap="round">
              <ellipse cx="238" cy="440" rx="6" ry="8" />
              <circle cx="238" cy="451" r="3.6" />
              <path d="M232 436 L220 428 M232 441 L218 441 M232 446 L220 455 M244 436 L256 428 M244 441 L258 441 M244 446 L256 455" fill="none" />
            </g>
          </g>

          {/* arms in front of the torso: forearms up to the fists, upper arms back to the shoulders */}
          <path d="M228 194 L188 292 L176 364" fill="none" stroke={INK} strokeWidth={36 + OUT * 2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M228 194 L188 292 L176 364" fill="none" stroke={LIMB} strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M236 194 L284 296 L304 366" fill="none" stroke={INK} strokeWidth={36 + OUT * 2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M236 194 L284 296 L304 366" fill="none" stroke={LIMB} strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M190 304 L180 352 M282 304 L298 354" stroke={LIMB_LIGHT} strokeWidth="14" strokeLinecap="round" />
          <path d="M203 236 L222 246 M262 244 L276 258" stroke={RED} strokeWidth="9" strokeLinecap="round" />
          {/* fists on the thread */}
          <circle cx="224" cy="192" r="17" fill={RED} stroke={INK} strokeWidth={OUT} />
          <circle cx="240" cy="192" r="17" fill={RED} stroke={INK} strokeWidth={OUT} />
          <circle cx="224" cy="192" r="17" fill="url(#webTex)" opacity=".9" />
          <circle cx="240" cy="192" r="17" fill="url(#webTex)" opacity=".9" />

          {/* ===== head: hangs from the neck, turns toward the cursor ===== */}
          <g ref={head}>
            <g transform={`translate(${HEAD_C.x} ${HEAD_C.y})`}>
              <ellipse cx="0" cy="0" rx="50" ry="60" fill={RED} stroke={INK} strokeWidth={OUT} />
              <g clipPath="url(#headClip)">
                {/* the mask is drawn upright and flipped 180° because he is upside-down */}
                <g transform="rotate(180)">
                  <g ref={face}>
                    {/* web lines radiate from the crown and wrap around the face */}
                    <g stroke={WEB} strokeWidth="1.2" fill="none" opacity=".85">
                      <path d="M0 -62 V62 M0 -60 L-34 -8 M0 -60 L34 -8 M0 -60 L-48 -34 M0 -60 L48 -34 M-4 26 Q-26 38 -42 30 M4 26 Q26 38 42 30" />
                      <path d="M-52 -26 Q0 -14 52 -26 M-52 -8 Q0 8 52 -8 M-50 14 Q0 32 50 14 M-44 34 Q0 54 44 34" />
                    </g>
                    <g transform="translate(-26 -2)">
                      <g ref={lensA}>
                        <path d={LENS} transform="scale(1.2)" fill="url(#lensShade)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
                      </g>
                    </g>
                    <g transform="translate(26 -2)">
                      <g ref={lensB}>
                        <path d={LENS} transform="scale(-1.2 1.2)" fill="url(#lensShade)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <ellipse cx="0" cy="0" rx="50" ry="60" fill="url(#spShadeV)" />
              <ellipse cx="0" cy="0" rx="50" ry="60" fill="none" stroke={INK} strokeWidth={OUT} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Figure;

