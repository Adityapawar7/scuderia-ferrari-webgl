import { useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../store';

gsap.registerPlugin(ScrollTrigger);

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, active } = useProgress();
  const setIsLoaded = useStore((state) => state.setIsLoaded);

  useEffect(() => {
    if (!active && progress >= 100) {
      setIsLoaded(true);
      const timer = setTimeout(() => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete: () => {
              if (containerRef.current) containerRef.current.style.display = 'none';
              ScrollTrigger.refresh();
            },
          });
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [active, progress, setIsLoaded]);

  // Safety fallback in case network stalls or assets fail
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            if (containerRef.current) containerRef.current.style.display = 'none';
            ScrollTrigger.refresh();
          },
        });
      }
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, [setIsLoaded]);

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0B]"
    >
      <div className="text-[#FFBA00] font-display text-4xl md:text-5xl mb-6 opacity-80 tracking-widest uppercase">
        FERRARI
      </div>

      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-[#FFBA00] transition-all duration-300 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>

      <div className="font-mono text-white/70 text-sm tracking-widest">
        {displayProgress}%
      </div>
    </div>
  );
}
