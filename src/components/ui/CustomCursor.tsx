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

    // Target coordinates (raw mouse event)
    let mouseX = -200;
    let mouseY = -200;

    // Smooth lerp coordinates for the trailing aerodynamic ring & aura
    let ringX = -200;
    let ringY = -200;
    let auraX = -200;
    let auraY = -200;

    // Dynamic state parameters
    let currentScale = 1;
    let targetScale = 1;
    let currentAngle = 0;
    let currentStretch = 0;
    let isVisible = false;
    let isHoveringInteractive = false;
    let isHoveringCanvas = false;
    let isMouseDown = false;

    // 1. Direct instantaneous 0ms pointer tracking for the center optic pip
    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Absolute 0ms latency: center dot moves synchronously with the physical mouse
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
        // Initialize ring position to avoid flying across the screen on first enter
        ringX = mouseX;
        ringY = mouseY;
        auraX = mouseX;
        auraY = mouseY;
      }
    };

    // 2. High-precision RAF loop for the trailing fluid ring & aura
    let rafId: number;

    const tick = () => {
      // Fluid damping factor (0.18 gives snappy, zero-sluggishness tracking)
      const ringDx = mouseX - ringX;
      const ringDy = mouseY - ringY;
      ringX += ringDx * 0.18;
      ringY += ringDy * 0.18;

      // Softer damping for ambient golden aura
      const auraDx = mouseX - auraX;
      const auraDy = mouseY - auraY;
      auraX += auraDx * 0.10;
      auraY += auraDy * 0.10;

      // Calculate movement velocity & direction for aerodynamic squash & stretch
      const speed = Math.hypot(ringDx, ringDy);
      const targetStretch = isHoveringInteractive || isHoveringCanvas ? 0 : Math.min(speed * 0.0028, 0.32);
      currentStretch += (targetStretch - currentStretch) * 0.2;

      if (speed > 1.2 && !isHoveringInteractive && !isHoveringCanvas) {
        const rawAngle = Math.atan2(ringDy, ringDx) * (180 / Math.PI);
        // Smooth angle interpolation
        let diff = (rawAngle - currentAngle) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        currentAngle += diff * 0.25;
      }

      // Smooth scale interpolation
      currentScale += (targetScale - currentScale) * 0.2;

      // Apply transform to the outer precision ring (squash & stretch along velocity angle)
      const scaleX = currentScale * (1 + currentStretch);
      const scaleY = currentScale * (1 - currentStretch * 0.7);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${currentAngle}deg) scale(${scaleX}, ${scaleY})`;

      // Position the ambient aura
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) scale(${currentScale * 1.3})`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // 3. Interactive hover detection
    const onPointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, .cursor-pointer');
      const canvasArea = target.closest('#webgl-container, canvas');

      if (interactive) {
        isHoveringInteractive = true;
        isHoveringCanvas = false;
        targetScale = isMouseDown ? 1.3 : 1.6;
        currentAngle = 0; // Straighten ring on hover
        ring.classList.add('cursor-hover-interactive');
        ring.classList.remove('cursor-hover-canvas');
        hudBadge.style.opacity = '0';
        hudBadge.style.transform = 'translate(-50%, 20px) scale(0.8)';
      } else if (canvasArea) {
        isHoveringCanvas = true;
        isHoveringInteractive = false;
        targetScale = isMouseDown ? 1.15 : 1.35;
        currentAngle = 0;
        ring.classList.add('cursor-hover-canvas');
        ring.classList.remove('cursor-hover-interactive');
        hudBadge.style.opacity = '1';
        hudBadge.style.transform = 'translate(-50%, 28px) scale(1)';
      } else {
        isHoveringInteractive = false;
        isHoveringCanvas = false;
        targetScale = isMouseDown ? 0.8 : 1;
        ring.classList.remove('cursor-hover-interactive', 'cursor-hover-canvas');
        hudBadge.style.opacity = '0';
        hudBadge.style.transform = 'translate(-50%, 20px) scale(0.8)';
      }
    };

    // 4. Click feedback & shockwave animation
    const onPointerDown = () => {
      isMouseDown = true;
      targetScale = isHoveringInteractive ? 1.3 : isHoveringCanvas ? 1.1 : 0.82;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.6)`;

      if (ripple) {
        ripple.style.left = `${mouseX}px`;
        ripple.style.top = `${mouseY}px`;
        ripple.classList.remove('cursor-ripple-anim');
        // Force reflow to re-trigger animation
        void ripple.offsetWidth;
        ripple.classList.add('cursor-ripple-anim');
      }
    };

    const onPointerUp = () => {
      isMouseDown = false;
      targetScale = isHoveringInteractive ? 1.6 : isHoveringCanvas ? 1.35 : 1;
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
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
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
      className="custom-cursor-layer fixed inset-0 pointer-events-none z-[999999] opacity-0 transition-opacity duration-200"
      aria-hidden="true"
    >
      {/* 1. Ambient Golden Glow Halo (Subtle, luxurious optical glow behind reticle) */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(255,186,0,0.12)_0%,rgba(255,186,0,0.03)_50%,transparent_70%)] blur-[6px] will-change-transform"
      />

      {/* 2. Aerodynamic Telemetry Reticle (Fluid damping, crosshairs, velocity stretch) */}
      <div
        ref={ringRef}
        className="cursor-telemetry-ring fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-[#FFBA00]/70 bg-[#FFBA00]/[0.03] backdrop-blur-[1px] shadow-[0_0_15px_rgba(255,186,0,0.25)] flex items-center justify-center will-change-transform pointer-events-none transition-colors duration-200"
      >
        {/* Scuderia Crosshair HUD Ticks */}
        <span className="crosshair-tick absolute -top-[5px] left-1/2 -translate-x-1/2 w-[1.5px] h-[5px] bg-[#FFBA00] shadow-[0_0_6px_#FFBA00]" />
        <span className="crosshair-tick absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[1.5px] h-[5px] bg-[#FFBA00] shadow-[0_0_6px_#FFBA00]" />
        <span className="crosshair-tick absolute -left-[5px] top-1/2 -translate-y-1/2 h-[1.5px] w-[5px] bg-[#FFBA00] shadow-[0_0_6px_#FFBA00]" />
        <span className="crosshair-tick absolute -right-[5px] top-1/2 -translate-y-1/2 h-[1.5px] w-[5px] bg-[#FFBA00] shadow-[0_0_6px_#FFBA00]" />

        {/* Micro F1 Corner Aperture Arc Hints */}
        <div className="absolute inset-1 rounded-full border border-dashed border-[#FFBA00]/25 pointer-events-none" />

        {/* Tactical 3D HUD Telemetry Label */}
        <div
          ref={hudBadgeRef}
          className="absolute top-1/2 left-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/80 border border-[#FFBA00]/40 backdrop-blur-md opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.6)] pointer-events-none transition-all duration-200 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA00] animate-pulse" />
          <span className="font-ui text-[8.5px] tracking-[0.25em] text-[#FFBA00] font-black uppercase">
            ROTATE 3D
          </span>
        </div>
      </div>

      {/* 3. Click Shockwave Wave (Spawns and ripples outwards on click) */}
      <div
        ref={clickRippleRef}
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFBA00] pointer-events-none opacity-0 will-change-transform"
      />

      {/* 4. Instantaneous 0ms Center Optic Pip (Zero-latency hardware alignment) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFBA00] pointer-events-none shadow-[0_0_10px_rgba(255,186,0,1),0_0_20px_rgba(255,186,0,0.6)] will-change-transform flex items-center justify-center transition-transform duration-75 ease-out"
      >
        {/* Precision Ultra-White Laser Core */}
        <span className="w-[1.5px] h-[1.5px] rounded-full bg-white shadow-[0_0_3px_#FFFFFF]" />
      </div>
    </div>
  );
}
