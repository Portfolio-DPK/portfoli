import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { tracks, START_AT } from '../data/music';

/**
 * Site-wide music player. One hidden YouTube IFrame player plays the playlist; the navbar speaker button and the
 * music section are both just controls on top of it. Browsers block sound until the visitor interacts with the
 * page, so nothing plays by itself — the first track is cued and starts on the first click.
 * If a video cannot be embedded (the owner disabled it) the player skips to the next one and marks it unavailable.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Ctx {
  index: number;
  playing: boolean;
  ready: boolean;
  failed: Set<string>;
  toggle: () => void;
  select: (i: number) => void;
  next: () => void;
  prev: () => void;
  seek: (fraction: number) => void;
}

const MusicCtx = createContext<Ctx | null>(null);
/** playback position lives in its own context: it changes every tick and only the seek bar needs it */
const TimeCtx = createContext<{ time: number; duration: number }>({ time: 0, duration: 0 });
export const useMusicTime = () => useContext(TimeCtx);
export const useMusic = () => {
  const c = useContext(MusicCtx);
  if (!c) throw new Error('useMusic must be used inside <MusicProvider>');
  return c;
};

let apiPromise: Promise<void> | null = null;
const loadApi = () => {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const w = window as any;
    if (w.YT?.Player) return resolve();
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<any>(null);
  const idx = useRef(0);
  const wantPlay = useRef(false);
  /** true until the current track has actually started playing: used to make sure it started at 0:00 */
  const fresh = useRef(true);
  const failedRef = useRef<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const timeRef = useRef(0);

  const go = useCallback((i: number, autoplay: boolean) => {
    const n = tracks.length;
    const k = ((i % n) + n) % n;
    idx.current = k;
    setIndex(k);
    setTime(0);
    setDuration(0);
    const p = player.current;
    if (!p) {
      wantPlay.current = autoplay;
      return;
    }
    fresh.current = true;
    // startSeconds: START_AT overrides YouTube's 'resume where you stopped' so every song starts from the very first beat
    if (autoplay) p.loadVideoById({ videoId: tracks[k].yt, startSeconds: START_AT });
    else p.cueVideoById({ videoId: tracks[k].yt, startSeconds: START_AT });
  }, []);

  const next = useCallback(() => {
    // skip tracks that failed to embed, but never loop forever if all of them did
    for (let step = 1; step <= tracks.length; step++) {
      const k = (idx.current + step) % tracks.length;
      if (!failedRef.current.has(tracks[k].id)) return go(k, true);
    }
  }, [go]);

  useEffect(() => {
    let dead = false;
    loadApi().then(() => {
      if (dead || !host.current) return;
      const w = window as any;
      const mount = document.createElement('div');
      host.current.appendChild(mount);
      player.current = new w.YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        width: 240,
        height: 135,
        videoId: tracks[0].yt,
        playerVars: { start: START_AT, playsinline: 1, controls: 0, rel: 0, modestbranding: 1, origin: window.location.origin },
        events: {
          onReady: () => {
            setReady(true);
            if (wantPlay.current) player.current.loadVideoById({ videoId: tracks[idx.current].yt, startSeconds: START_AT });
          },
          onStateChange: (e: any) => {
            const s = e.data;
            if (s === 1) {
              setPlaying(true);
              if (player.current?.isMuted?.()) player.current.unMute();
              player.current?.setVolume?.(100);
              // safety net: if YouTube resumed an old position, jump back to the beginning once
              if (fresh.current) {
                fresh.current = false;
                const at = player.current?.getCurrentTime?.() || 0;
                if (at > START_AT + 1.5) player.current.seekTo(START_AT, true);
              }
            }
            else if (s === 2) setPlaying(false);
            else if (s === 0) {
              setPlaying(false);
              next();
            }
            if (s === 1 || s === 5) setDuration(player.current?.getDuration?.() || 0);
          },
          onError: () => {
            const t = tracks[idx.current];
            failedRef.current = new Set(failedRef.current).add(t.id);
            setFailed(failedRef.current);
            setPlaying(false);
            if (failedRef.current.size < tracks.length) next();
          },
        },
      });
    });
    return () => {
      dead = true;
      try {
        player.current?.destroy?.();
      } catch {
        /* ignore */
      }
      player.current = null;
    };
  }, [next]);

  // progress ticker while playing
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      const p = player.current;
      if (!p?.getCurrentTime) return;
      timeRef.current = p.getCurrentTime() || 0;
      setTime(timeRef.current);
      const d = p.getDuration?.() || 0;
      if (d) setDuration(d);
    }, 500);
    return () => window.clearInterval(t);
  }, [playing]);

  const toggle = useCallback(() => {
    const p = player.current;
    if (!p || !ready) {
      wantPlay.current = true;
      return;
    }
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing, ready]);

  const select = useCallback((i: number) => {
    go(i, true);
  }, [go]);
  const prev = useCallback(() => {
    // restart the track if it has been playing for a few seconds, otherwise go back one
    if (timeRef.current > START_AT + 4) {
      player.current?.seekTo?.(START_AT, true);
      timeRef.current = 0;
      setTime(0);
    } else go(idx.current - 1, true);
  }, [go]);
  const seek = useCallback((f: number) => {
    const p = player.current;
    const d = p?.getDuration?.() || 0;
    if (!d) return;
    p.seekTo(Math.max(0, Math.min(1, f)) * d, true);
    setTime(f * d);
  }, []);

  const value = useMemo(
    () => ({ index, playing, ready, failed, toggle, select, next, prev, seek }),
    [index, playing, ready, failed, toggle, select, next, prev, seek],
  );

  const timeValue = useMemo(() => ({ time, duration }), [time, duration]);

  return (
    <MusicCtx.Provider value={value}>
      <TimeCtx.Provider value={timeValue}>{children}</TimeCtx.Provider>
      {/* the real player: always kept on screen but invisible (some browsers throttle fully hidden embeds) */}
      <div aria-hidden className="pointer-events-none fixed bottom-0 right-0 h-[135px] w-[240px] overflow-hidden opacity-[0.01]">
        <div ref={host} className="h-[135px] w-[240px]" />
      </div>    </MusicCtx.Provider>
  );
};





