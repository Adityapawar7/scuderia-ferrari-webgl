# UNIVERSAL 3D WEBGL MASTERY SPECIFICATION (3DSKILL.MD)
## The Architectural Blueprint for Zero-Lag, Awwwards-Tier 3D Interactive Web Experiences

> **Target Standard**: 60–120 FPS rock-solid framerate, 0ms cursor latency, instantaneous initial paint, sub-2MB 3D asset payload, and butter-smooth kinetic scrolling on desktop, laptop, and mobile devices.

---

## 1. THE GOLDEN RULES OF ZERO-LAG 3D SITES

1. **NEVER use CSS transitions on cursor mouse coordinates.** Direct pointer coordinates must be applied via `translate3d` with **0ms latency** on raw events.
2. **NEVER use full-screen SVG filters (e.g. `feTurbulence`, `feDisplacementMap`).** Full-screen SVG filter rasterization on fixed overlays destroys GPU fill-rate and drops FPS by 50–70%.
3. **NEVER use `backdrop-filter: blur(...)` on high-frequency moving elements.** A moving element with backdrop blur forces GPU framebuffer copies on every single frame.
4. **ALWAYS cull off-screen WebGL canvases.** Every `<Canvas>` out of the viewport MUST set `frameloop="never"`. A single page must never run multiple un-culled render loops.
5. **ALWAYS clamp DPR.** Set `dpr={[1, 1.5]}` (or `[1, 2]` maximum). Default DPR on 3x–4x Retina or 4K screens will crash or throttle mobile GPUs.
6. **NEVER use real-time physical transmission (`KHR_materials_transmission`) without necessity.** Transmission forces full-screen framebuffer copy passes on every frame. Use tuned alpha blending (`transparent: true, opacity: 0.35, roughness: 0.05`).
7. **ALWAYS compress 3D models with Draco/Meshopt.** Compress raw geometry by 50–80% using `@gltf-transform/cli`.
8. **NEVER set `duration > 1.0s` on smooth scroll (Lenis).** High duration creates an "underwater/sluggish" lag feel. Use `0.9s` with natural damping.

---

## 2. PRODUCTION TECH STACK

| Layer | Recommended Library | Purpose |
| :--- | :--- | :--- |
| **Core UI** | `react` + `react-dom` (v18 or v19) | Application state & component tree |
| **3D Engine** | `three` + `@react-three/fiber` (v8/v9) | Declarative WebGL scene graph |
| **3D Helpers** | `@react-three/drei` | Loaders, controls, environments, shadows |
| **Animation Engine** | `gsap` + `gsap/ScrollTrigger` | Timeline sequencing & pinned choreography |
| **Smooth Scroll** | `lenis` | High-frequency momentum scrolling |
| **Styling** | `tailwindcss` | Utility styling & design tokens |
| **Build Tool** | `vite` | Rollup manual chunk code-splitting |

---

## 3. 3D ASSET OPTIMIZATION PIPELINE

### 3.1 Model Compression with Draco
Raw GLB files from Blender, Maya, or Sketchfab contain uncompressed vertex buffers. Always compress them:

```bash
# 1. Install or run gltf-transform
npx @gltf-transform/cli draco input_model.glb public/model.glb

# 2. Inspect the result
npx @gltf-transform/cli inspect public/model.glb
```

### 3.2 Draco Decoder Loading in R3F
In your model component, pass `true` to enable Draco decoding via worker threads:

```tsx
import { useGLTF } from '@react-three/drei';

export function Model(props: any) {
  // Pass true as second argument to enable web-worker Draco decompression
  const { nodes, materials } = useGLTF('/model.glb', true) as any;
  return <primitive object={nodes.Scene} {...props} />;
}

// Preload immediately
useGLTF.preload('/model.glb', true);
```

### 3.3 The Material Transmission Trap
If your model has glass, headlights, or transparent plastic, GLTF loaders default to `MeshPhysicalMaterial` with transmission, triggering a full-screen scene framebuffer copy pass **every frame**.

**Fix**: Override the glass material on load:
```tsx
import { useMemo } from 'react';

const glassMaterial = useMemo(() => {
  if (!materials?.GLASS) return null;
  const mat = materials.GLASS.clone();
  mat.transmission = 0;          // ELIMINATES OFF-SCREEN FRAMEBUFFER COPY
  mat.transparent = true;
  mat.opacity = 0.35;           // Realistic tinted glass
  mat.roughness = 0.05;
  mat.metalness = 0.1;
  return mat;
}, [materials]);
```

---

## 4. MULTI-CANVAS ARCHITECTURE & VIEWPORT CULLING

Running multiple `<Canvas>` instances on one page (Hero, Specs, Footer) will crash mobile WebGL contexts if not culled.

### 4.1 ScrollTrigger-Driven Frameloop Culling
```tsx
import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Section3D() {
  const containerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setIsInView(self.isActive),
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen">
      <Canvas
        frameloop={isInView ? 'always' : 'never'} // Halts GPU rendering when off-screen!
        dpr={[1, 1.5]}                            // Clamped DPR prevents Retina/4K lag
        camera={{ position: [0, 0.2, 5.0], fov: 35 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          stencil: false,
          depth: true,
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          {/* Scene content */}
        </Suspense>
      </Canvas>
    </section>
  );
}
```

### 4.2 Contact Shadows Optimization
Never let `<ContactShadows />` recalculate on every tick:
```tsx
// frames={1} bakes the shadow into a texture ONCE instead of 60/120 times a second
<ContactShadows 
  position={[0, -0.65, 0]} 
  opacity={0.5} 
  scale={35} 
  blur={2} 
  far={4} 
  frames={1} 
  resolution={512} 
/>
```

### 4.3 Scoped Presentation Controls
Avoid `global={true}` on `<PresentationControls>`—it intercepts pointer events across the entire window:
```tsx
// Confine drag physics to the canvas container
<PresentationControls
  global={false}
  zoom={1}
  polar={[-0.15, 0.15]}
  azimuth={[-Math.PI, Math.PI]}
  snap={true}
>
  <Model />
</PresentationControls>
```

---

## 5. THE ZERO-LATENCY CUSTOM CURSOR ARCHITECTURE

To make a custom cursor feel **instantaneous** and **luxurious**:

1. **Center Optic Dot (0ms)**: Pinned directly to hardware pointer coordinates inside `pointermove` with `translate3d()`. **Zero CSS transitions.**
2. **Trailing Reticle (High-Refresh RAF)**: Glides behind using a mathematical damping factor (`ringX += dx * 0.24`).
3. **Aerodynamic Velocity Squash & Stretch**: Dynamically elongates along the angle of movement at high speed and snaps back to a circular crosshair when stopped.
4. **Zero Layout Thrashing**: Never query `offsetWidth` or invoke forced browser reflows.
5. **No Blur Shaders**: Use CSS `radial-gradient` instead of `filter: blur()` or `backdrop-filter: blur()`.

### Full Production Code: `CustomCursor.tsx`
```tsx
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const hudBadgeRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only mount on desktop mouse devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    const hudBadge = hudBadgeRef.current;
    const ripple = rippleRef.current;
    if (!cursor || !dot || !ring || !aura || !hudBadge) return;

    let mouseX = -200, mouseY = -200;
    let ringX = -200, ringY = -200;
    let auraX = -200, auraY = -200;
    let currentScale = 1, targetScale = 1;
    let currentAngle = 0, currentStretch = 0;
    let isVisible = false, isHoveringInteractive = false, isHoveringCanvas = false, isMouseDown = false;
    let lastTarget: EventTarget | null = null;

    // 1. ABSOLUTE 0ms: Center dot tracks raw pointer immediately
    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
        ringX = mouseX; ringY = mouseY;
        auraX = mouseX; auraY = mouseY;
      }
    };

    // 2. High-Refresh RAF loop for trailing reticle
    let rafId: number;
    const tick = () => {
      const ringDx = mouseX - ringX;
      const ringDy = mouseY - ringY;
      ringX += ringDx * 0.24;
      ringY += ringDy * 0.24;

      const auraDx = mouseX - auraX;
      const auraDy = mouseY - auraY;
      auraX += auraDx * 0.14;
      auraY += auraDy * 0.14;

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
      const scaleX = currentScale * (1 + currentStretch);
      const scaleY = currentScale * (1 - currentStretch * 0.6);

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${currentAngle}deg) scale(${scaleX}, ${scaleY})`;
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) scale(${currentScale})`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // 3. Throttled Hover Detection
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
      } else if (canvasArea) {
        isHoveringCanvas = true;
        isHoveringInteractive = false;
        targetScale = isMouseDown ? 1.1 : 1.3;
        currentAngle = 0;
        ring.classList.add('cursor-hover-canvas');
        ring.classList.remove('cursor-hover-interactive');
        hudBadge.style.opacity = '1';
      } else {
        isHoveringInteractive = false;
        isHoveringCanvas = false;
        targetScale = isMouseDown ? 0.85 : 1;
        ring.classList.remove('cursor-hover-interactive', 'cursor-hover-canvas');
        hudBadge.style.opacity = '0';
      }
    };

    const onPointerDown = () => {
      isMouseDown = true;
      targetScale = isHoveringInteractive ? 1.2 : isHoveringCanvas ? 1.05 : 0.82;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.4)`;

      if (rippleRef.current) {
        rippleRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        rippleRef.current.classList.remove('cursor-ripple-anim');
        requestAnimationFrame(() => rippleRef.current?.classList.add('cursor-ripple-anim'));
      }
    };

    const onPointerUp = () => {
      isMouseDown = false;
      targetScale = isHoveringInteractive ? 1.5 : isHoveringCanvas ? 1.3 : 1;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.addEventListener('mouseover', onPointerOver, { passive: true });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; isVisible = false; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; isVisible = true; });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseover', onPointerOver);
    };
  }, []);

  return (
    <div ref={cursorRef} className="fixed inset-0 pointer-events-none z-[999999] opacity-0 transition-opacity duration-150" aria-hidden="true">
      {/* Soft Ambient Halo */}
      <div ref={auraRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,186,0,0.12)_0%,transparent_65%)] will-change-transform" />
      
      {/* Outer Telemetry Reticle */}
      <div ref={ringRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#FFBA00]/70 bg-[#FFBA00]/[0.05] shadow-[0_0_12px_rgba(255,186,0,0.2)] flex items-center justify-center will-change-transform transition-colors duration-150">
        <span className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-[1.5px] h-[4px] bg-[#FFBA00]" />
        <span className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[1.5px] h-[4px] bg-[#FFBA00]" />
        <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 h-[1.5px] w-[4px] bg-[#FFBA00]" />
        <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 h-[1.5px] w-[4px] bg-[#FFBA00]" />

        <div ref={hudBadgeRef} className="absolute top-1/2 left-1/2 translate-y-6 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#FFBA00]/50 opacity-0 transition-all duration-150 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA00] animate-pulse" />
          <span className="text-[8.5px] tracking-[0.25em] text-[#FFBA00] font-black uppercase font-mono">ROTATE 3D</span>
        </div>
      </div>

      {/* Click Ripple */}
      <div ref={rippleRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFBA00] opacity-0 will-change-transform" />

      {/* 0ms Precision Dot */}
      <div ref={dotRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFBA00] shadow-[0_0_8px_#FFBA00] will-change-transform flex items-center justify-center">
        <span className="w-[1.5px] h-[1.5px] rounded-full bg-white" />
      </div>
    </div>
  );
}
```

---

## 6. BUTTER-SMOOTH KINETIC SCROLLING (LENIS + GSAP)

To prevent the common "heavy/floaty/laggy" feeling from smooth scrolling:

1. **Set `duration: 0.9` (NOT 1.5–2.0)**: Gives instant tactile scroll response.
2. **Never set `lagSmoothing(0)`**: Use `gsap.ticker.lagSmoothing(500, 33)` to absorb frame drops gracefully.
3. **Never dispatch store state inside scroll events**: Dispatches trigger component re-render cascades.

### `useLenis.ts` Setup:
```ts
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,       // Responsive & fast
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
    gsap.ticker.lagSmoothing(500, 33); // Absorbs micro-stutters

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
```

---

## 7. GLOBAL CSS RULES & TAILWIND ESSENTIALS

In `index.css`:
```css
@import "tailwindcss";

/* 1. Universal default cursor removal on fine pointer devices */
@media (hover: hover) and (pointer: fine) {
  *, *::before, *::after {
    cursor: none !important;
  }
}

/* 2. Interactive Cursor States */
.cursor-hover-interactive {
  border-color: #FFE600 !important;
  background-color: rgba(255, 186, 0, 0.12) !important;
  box-shadow: 0 0 24px rgba(255, 186, 0, 0.4) !important;
}

.cursor-hover-canvas {
  border-color: rgba(255, 186, 0, 0.9) !important;
  background-color: rgba(255, 186, 0, 0.08) !important;
  box-shadow: 0 0 20px rgba(255, 186, 0, 0.3) !important;
}

/* 3. Click Shockwave Wave */
@keyframes cursorRipple {
  0% {
    width: 12px;
    height: 12px;
    opacity: 0.95;
    border-width: 2px;
  }
  100% {
    width: 68px;
    height: 68px;
    opacity: 0;
    border-width: 0.5px;
  }
}

.cursor-ripple-anim {
  animation: cursorRipple 0.45s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
}

/* 4. Font Display Swap to prevent FOIT */
@font-face {
  font-family: 'BrandFont';
  src: url('/fonts/brand-font.woff2') format('woff2');
  font-display: swap;
}
```

---

## 8. VITE CODE-SPLITTING & ASSET PRELOADING

### 8.1 `index.html` Preloading
Start downloading the heavy 3D asset while HTML is parsing, before JS initializes:
```html
<link rel="preload" href="/model.glb" as="fetch" crossorigin="anonymous" />
<link rel="preconnect" href="https://www.gstatic.com" crossorigin />
```

### 8.2 `vite.config.ts` Manual Chunks
Prevent the 1.5MB monolithic bundle by isolating Three.js, R3F, GSAP, and UI vendors:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    target: 'esnext',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/]three[\\/]/.test(id)) return 'vendor-three';
            if (id.includes('@react-three')) return 'vendor-r3f';
            if (id.includes('three-stdlib')) return 'vendor-three-stdlib';
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('lenis')) return 'vendor-lenis';
            if (id.includes('react')) return 'vendor-react';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
});
```

---

## 9. REAL ASSET PRELOADER (NO RE-RENDER CHURN)

Never use `setInterval(..., 15)` to increment a fake counter. Use Drei's `useProgress()`:
```tsx
import { useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, active } = useProgress();

  useEffect(() => {
    if (!active && progress >= 100) {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            if (containerRef.current) containerRef.current.style.display = 'none';
            onComplete?.();
          }
        });
      }
    }
  }, [active, progress, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black">
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-[#FFBA00] transition-all duration-200 ease-out" 
          style={{ width: `${Math.round(progress)}%` }} 
        />
      </div>
      <span className="font-mono text-white/70 text-xs">{Math.round(progress)}%</span>
    </div>
  );
}
```

---

## 10. PRE-FLIGHT ZERO-LAG CHECKLIST

Before deploying any 3D web experience, verify:
- [ ] 3D `.glb` is Draco compressed (target: < 2.5 MB).
- [ ] Center cursor dot has `transition: none` and is updated in `pointermove` via direct transform.
- [ ] Full-screen SVG noise/turbulent filters are completely removed.
- [ ] No `backdrop-filter: blur()` exists on rapidly moving cursor elements.
- [ ] All off-screen `<Canvas>` components have `frameloop="never"` when scrolled out of view.
- [ ] All canvases have `dpr={[1, 1.5]}` clamped.
- [ ] Glass and transparent materials have `transmission = 0` to prevent full-screen texture copies.
- [ ] Smooth scrolling (Lenis) duration is set to `0.9s` (not `1.5s`).
- [ ] Critical 3D assets are preloaded with `<link rel="preload" as="fetch">` in `index.html`.
- [ ] Vite `manualChunks` is active; initial JS entry chunk is `< 35 kB`.
