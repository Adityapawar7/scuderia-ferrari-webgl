import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../store';

gsap.registerPlugin(ScrollTrigger);

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const isLoaded = useStore(state => state.isLoaded);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 99 && !isLoaded) return 99;
        if (p < 100) return p + 1;
        return 100;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setProgress(100);
      
      const timer = setTimeout(() => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              if (containerRef.current) containerRef.current.style.display = 'none';
              ScrollTrigger.refresh();
            }
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-carbon"
    >
      <div className="text-accent font-display text-4xl mb-8 opacity-50 tracking-widest">
        FERRARI
      </div>
      
      <div className="font-mono text-offwhite text-2xl">
        {progress}%
      </div>
    </div>
  );
}
