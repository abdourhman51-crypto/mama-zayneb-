'use client';

import { useEffect } from 'react';
import { loadPixel } from '@/lib/pixel';

const EVENTS = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;

export default function PixelLoader() {
  useEffect(() => {
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      loadPixel();
      EVENTS.forEach((e) => window.removeEventListener(e, fire));
    };
    EVENTS.forEach((e) => window.addEventListener(e, fire, { once: true, passive: true }));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, fire));
  }, []);

  return null;
}
