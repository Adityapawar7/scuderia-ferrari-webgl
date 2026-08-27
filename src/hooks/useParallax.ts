import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useParallax() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const hero = document.getElementById('hero-section');
      if (!hero) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        }
      });

      // 1. Top text moves up and fades out cleanly
      const topText = hero.querySelector('.hero-top-text');
      if (topText) {
        tl.to(topText, { y: -80, opacity: 0, ease: 'power1.out' }, 0);
      }

      // 2. Left specs slide left & fade out
      const leftSpecs = hero.querySelector('.hero-left-specs');
      if (leftSpecs) {
        tl.to(leftSpecs, { x: -120, opacity: 0, ease: 'power1.out' }, 0);
      }

      // 3. Right specs slide right & fade out
      const rightSpecs = hero.querySelector('.hero-right-specs');
      if (rightSpecs) {
        tl.to(rightSpecs, { x: 120, opacity: 0, ease: 'power1.out' }, 0);
      }

      // 4. Giant FERRARI text glides down smoothly & fades out
      const giantText = hero.querySelector('.hero-giant-text');
      if (giantText) {
        tl.to(giantText, { y: 120, opacity: 0, ease: 'power1.out' }, 0);
      }

      // 5. Blueprint texture fades out
      const blueprint = hero.querySelector('.hero-blueprint');
      if (blueprint) {
        tl.to(blueprint, { scale: 1.15, opacity: 0, ease: 'power1.out' }, 0);
      }

      // 6. Header navbar fades subtly
      const header = hero.querySelector('header');
      if (header) {
        tl.to(header, { y: -30, opacity: 0, ease: 'power1.out' }, 0);
      }
    }, containerRef.current || document.body);

    return () => ctx.revert();
  }, []);

  return containerRef;
}

