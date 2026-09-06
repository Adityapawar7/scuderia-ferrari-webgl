import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Fast, responsive 0.9s duration with natural damping (eliminates "heavy/underwater" scroll lag)
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // Smoothly absorb micro frame drops without stuttering
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
