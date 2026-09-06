import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only initialize on devices with a fine pointer (mouse/trackpad), not touch screens
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!cursor || !dot || !ring) return;

    // High performance GSAP quickTo for zero-lag hardware-accelerated tracking
    // The center dot tracks tightly (sub-frame delay), while the ring tracks with smooth aerodynamic lag
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' });

    let isVisible = false;

    const showCursor = () => {
      if (!isVisible) {
        isVisible = true;
        gsap.to(cursor, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      }
    };

    const hideCursor = () => {
      isVisible = false;
      gsap.to(cursor, { opacity: 0, duration: 0.25, ease: 'power2.out' });
    };

    const onMouseMove = (e: MouseEvent) => {
      showCursor();
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(ring, {
        scale: 0.82,
        borderColor: '#FFE600',
        backgroundColor: 'rgba(255, 186, 0, 0.25)',
        duration: 0.15,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        scale: 1.4,
        backgroundColor: '#FFFFFF',
        duration: 0.15,
      });
    };

    const onMouseUp = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(255, 186, 0, 0.75)',
        backgroundColor: 'rgba(255, 186, 0, 0.04)',
        duration: 0.25,
        ease: 'back.out(2)',
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: '#FFBA00',
        duration: 0.2,
      });
    };

    // Contextual hover states based on element type
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, .cursor-pointer');
      const canvasArea = target.closest('#webgl-container, canvas');

      if (interactive) {
        gsap.to(ring, {
          scale: 1.6,
          borderColor: '#FFE600',
          backgroundColor: 'rgba(255, 186, 0, 0.12)',
          boxShadow: '0 0 24px rgba(255, 186, 0, 0.35)',
          duration: 0.25,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          scale: 0.4,
          opacity: 0.7,
          duration: 0.2,
        });
        if (label) {
          label.textContent = '';
          gsap.to(label, { opacity: 0, duration: 0.15 });
        }
      } else if (canvasArea) {
        gsap.to(ring, {
          scale: 1.35,
          borderColor: 'rgba(255, 186, 0, 0.9)',
          backgroundColor: 'rgba(255, 186, 0, 0.08)',
          boxShadow: '0 0 20px rgba(255, 186, 0, 0.3)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          scale: 0.8,
          opacity: 0.9,
          duration: 0.2,
        });
        if (label) {
          label.textContent = 'ROTATE 3D';
          gsap.to(label, { opacity: 1, y: 32, duration: 0.2 });
        }
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(255, 186, 0, 0.75)',
          backgroundColor: 'rgba(255, 186, 0, 0.04)',
          boxShadow: '0 0 12px rgba(255, 186, 0, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.2,
        });
        if (label) {
          gsap.to(label, { opacity: 0, y: 26, duration: 0.15 });
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseenter', showCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('mouseenter', showCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-container fixed inset-0 pointer-events-none z-[99999] opacity-0 will-change-transform"
      aria-hidden="true"
    >
      {/* Precision Core Pip (Tracks cursor directly with near-zero latency) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFBA00] pointer-events-none shadow-[0_0_12px_rgba(255,186,0,0.9)] will-change-transform"
      />

      {/* Aerodynamic Telemetry Ring (Lag-free fluid lerp damping with telemetry crosshair accents) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#FFBA00]/75 bg-[#FFBA00]/[0.04] pointer-events-none shadow-[0_0_16px_rgba(255,186,0,0.2)] backdrop-blur-[0.5px] will-change-transform flex items-center justify-center transition-colors duration-150"
      >
        {/* Scuderia Telemetry Corner Crosshair Marks */}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-[2px] h-[4px] bg-[#FFBA00]/80" />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[2px] h-[4px] bg-[#FFBA00]/80" />
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-[2px] w-[4px] bg-[#FFBA00]/80" />
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-[2px] w-[4px] bg-[#FFBA00]/80" />

        {/* Ambient Soft Telemetry Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFBA00]/15 via-transparent to-[#FFBA00]/10" />

        {/* Contextual HUD Text (e.g., ROTATE 3D) */}
        <span
          ref={labelRef}
          className="absolute opacity-0 font-ui text-[9px] tracking-[0.25em] text-[#FFBA00] font-black uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pointer-events-none"
        />
      </div>
    </div>
  );
}
