import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const hudBadgeRef = useRef<HTMLDivElement>(null);
  const clickRippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate on devices with a mouse/trackpad pointer
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    const hudBadge = hudBadgeRef.current;
    const ripple = clickRippleRef.current;
    if (!cursor || !dot || !ring || !aura || !hudBadge) return;

    // Target coordinates (direct hardware mouse event)
    let mouseX = -200;
    let mouseY = -200;

    // Smooth lerp coordinates for the trailing ring & aura
    let ringX = -200;
    let ringY = -200;
    let auraX = -200;
    let auraY = -200;

    // Animation & physics state
    let currentScale = 1;
    let targetScale = 1;
    let currentAngle = 0;
    let currentStretch = 0;
    let isVisible = false;
    let isHoveringInteractive = false;
    let isHoveringCanvas = false;
    let isMouseDown = false;
    let lastTarget: EventTarget | null = null;

    // 1. ABSOLUTE 0ms latency: center dot tracks 1:1 with hardware pointer coordinates
    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Direct hardware-accelerated transform with ZERO CSS transition delay
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
        auraX = mouseX;
        auraY = mouseY;
      }
    };

    // 2. High-performance RAF loop for trailing reticle (60/120/240Hz monitor aligned)
    let rafId: number;

    const tick = () => {
      // Snappy damping factor (0.24 provides silky fluid follow without any perceived drag)
      const ringDx = mouseX - ringX;
      const ringDy = mouseY - ringY;
      ringX += ringDx * 0.24;
      ringY += ringDy * 0.24;

      const auraDx = mouseX - auraX;
      const auraDy = mouseY - auraY;
      auraX += auraDx * 0.14;
      auraY += auraDy * 0.14;

      // Dynamic velocity squash & stretch along movement vector
      const speed = Math.hypot(ringDx, ringDy);
      const targetStretch = isHoveringInteractive || isHoveringCanvas ? 0 : Math.min(speed * 0.003, 0.25);
      currentStretch += (targetStretch - currentStretch) * 0.25;

      if (speed > 1.5 && !isHoveringInteractive && !isHoveringCanvas) {
        const rawAngle = Math.atan2(ringDy, ringDx) * (180 / Math.PI);
        let diff = (rawAngle - currentAngle) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        currentAngle += diff * 0.3;
      }

      currentScale += (targetScale - currentScale) * 0.25;

      // Transform outer ring: GPU translation + rotation + aerodynamic stretch
      const scaleX = currentScale * (1 + currentStretch);
      const scaleY = currentScale * (1 - currentStretch * 0.6);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${currentAngle}deg) scale(${scaleX}, ${scaleY})`;

      // Transform aura halo
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) scale(${currentScale})`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // 3. Optimized hover detection (skips redundant checks on same target)
    const onPointerOver = (e: MouseEvent) => {
      if (e.target === lastTarget) return;
      lastTarget = e.target;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, .cursor-pointer');
      const canvasArea = target.closest('#webgl-container, canvas');

      if (interactive) {
        isHoveringInteractive = true;
        isHoveringCanvas = false;
        targetScale = isMouseDown ? 1.25 : 1.5;
        currentAngle = 0;
        ring.classList.add('cursor-hover-interactive');
        ring.classList.remove('cursor-hover-canvas');
        hudBadge.style.opacity = '0';
        hudBadge.style.transform = 'translate(-50%, 20px) scale(0.8)';
      } else if (canvasArea) {
        isHoveringCanvas = true;
        isHoveringInteractive = false;
        targetScale = isMouseDown ? 1.1 : 1.3;
        currentAngle = 0;
        ring.classList.add('cursor-hover-canvas');
        ring.classList.remove('cursor-hover-interactive');
        hudBadge.style.opacity = '1';
        hudBadge.style.transform = 'translate(-50%, 28px) scale(1)';
      } else {
        isHoveringInteractive = false;
        isHoveringCanvas = false;
        targetScale = isMouseDown ? 0.85 : 1;
        ring.classList.remove('cursor-hover-interactive', 'cursor-hover-canvas');
        hudBadge.style.opacity = '0';
        hudBadge.style.transform = 'translate(-50%, 20px) scale(0.8)';
      }
    };

    // 4. Click feedback without forced synchronous layout reflows
    const onPointerDown = () => {
      isMouseDown = true;
      targetScale = isHoveringInteractive ? 1.2 : isHoveringCanvas ? 1.05 : 0.82;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.4)`;

      if (ripple) {
        ripple.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        ripple.classList.remove('cursor-ripple-anim');
        requestAnimationFrame(() => {
          ripple.classList.add('cursor-ripple-anim');
        });
      }
    };

    const onPointerUp = () => {
      isMouseDown = false;
      targetScale = isHoveringInteractive ? 1.5 : isHoveringCanvas ? 1.3 : 1;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
    };

    const onPointerLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
    };

    const onPointerEnter = () => {
      cursor.style.opacity = '1';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseover', onPointerOver, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('mouseenter', onPointerEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseover', onPointerOver);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('mouseenter', onPointerEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-layer fixed inset-0 pointer-events-none z-[999999] opacity-0 transition-opacity duration-150"
      aria-hidden="true"
    >
      {/* 1. Ambient Golden Glow Halo (Pure CSS radial gradient, no expensive blur filters) */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(255,186,0,0.12)_0%,rgba(255,186,0,0.02)_45%,transparent_65%)] will-change-transform"
      />

      {/* 2. Aerodynamic Telemetry Reticle (Crisp F1 styling, zero backdrop-filter load) */}
      <div
        ref={ringRef}
        className="cursor-telemetry-ring fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#FFBA00]/70 bg-[#FFBA00]/[0.05] shadow-[0_0_12px_rgba(255,186,0,0.2)] flex items-center justify-center will-change-transform pointer-events-none transition-colors duration-150"
      >
        {/* Scuderia Crosshair HUD Ticks */}
        <span className="crosshair-tick absolute -top-[4px] left-1/2 -translate-x-1/2 w-[1.5px] h-[4px] bg-[#FFBA00]" />
        <span className="crosshair-tick absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[1.5px] h-[4px] bg-[#FFBA00]" />
        <span className="crosshair-tick absolute -left-[4px] top-1/2 -translate-y-1/2 h-[1.5px] w-[4px] bg-[#FFBA00]" />
        <span className="crosshair-tick absolute -right-[4px] top-1/2 -translate-y-1/2 h-[1.5px] w-[4px] bg-[#FFBA00]" />

        {/* Tactical 3D HUD Telemetry Label */}
        <div
          ref={hudBadgeRef}
          className="absolute top-1/2 left-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#FFBA00]/50 opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.8)] pointer-events-none transition-all duration-150 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA00] animate-pulse" />
          <span className="font-ui text-[8.5px] tracking-[0.25em] text-[#FFBA00] font-black uppercase">
            ROTATE 3D
          </span>
        </div>
      </div>

      {/* 3. Click Shockwave Wave */}
      <div
        ref={clickRippleRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFBA00] pointer-events-none opacity-0 will-change-transform"
      />

      {/* 4. Instantaneous 0ms Center Optic Pip (Strict zero-delay, NO transition duration) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFBA00] pointer-events-none shadow-[0_0_8px_#FFBA00,0_0_16px_rgba(255,186,0,0.8)] will-change-transform flex items-center justify-center"
      >
        <span className="w-[1.5px] h-[1.5px] rounded-full bg-white" />
      </div>
    </div>
  );
}
