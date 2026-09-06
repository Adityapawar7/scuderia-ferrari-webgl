import { PARALLAX_CONFIG } from '../../lib/parallax';
import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls, ContactShadows, Float } from '@react-three/drei';
import { Model as Ferrari } from '../Ferrari';
import { Suspense } from 'react';
import { useInView } from '../../hooks/useInView';

export default function Hero() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ rootMargin: '100px' });

  return (
    <section ref={sectionRef} id="hero-section" className="w-[100vw] h-[100vh] overflow-hidden relative">
      
      {/* Layer 3: UI & Navigation (z-index: 50) */}
      <header className="relative w-full px-16 py-8 flex justify-between z-[50] pointer-events-auto text-white uppercase opacity-100" style={{ color: '#FFFFFF', opacity: 1 }}>
        <div className="flex items-center gap-8 font-ui text-xs tracking-widest">
          <button className="hover:text-white/60 transition-colors hidden md:block">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <a href="#" className="hover:text-white/80 transition-colors hidden md:block">HOME</a>
          <a href="#" className="hover:text-white/80 transition-colors hidden md:block">RACING</a>
          <a href="#" className="hover:text-white/80 transition-colors hidden md:block">AUTOMOTIVE</a>
        </div>
        
        {/* Elegant Authentic Ferrari Shield Logo */}
        <div className="flex items-center justify-center shrink-0">
          <img 
            src="/ferrari-logo.svg" 
            alt="Ferrari Logo" 
            width="64"
            height="64"
            decoding="async"
            className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" 
          />
        </div>

        <div className="flex items-center gap-8 font-ui text-xs tracking-widest">
          <a href="#" className="hover:text-white/80 transition-colors hidden md:block">CORPORATE</a>
          <a href="#" className="hover:text-white/80 transition-colors hidden md:block">UNIVERSE</a>
          <a href="#" className="hover:text-white/80 transition-colors hidden md:block">STORE</a>
          <button className="hover:text-white/60 transition-colors hidden md:block">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </header>

      {/* Layer 1: Background HUD & Blueprint (z-index: 1 - in front of red background, behind 3D car) */}
      <div 
        className="absolute inset-0 w-full h-full z-[1] overflow-hidden pointer-events-none"
        data-speed={PARALLAX_CONFIG.LAYER_1_WORDMARK}
      >
        {/* Top Centered Descriptive Text */}
        <div className="hero-top-text absolute top-[16%] md:top-[18%] w-full flex flex-col items-center justify-center text-center px-4 z-[2]" style={{ color: '#FFFFFF', opacity: 1 }}>
          <p className="font-ui text-white/90 text-[10px] md:text-xs tracking-[0.25em] max-w-lg leading-relaxed mb-3 uppercase">
            A car like no other. A pure fusion of science and art in automotive form.<br/>
            The 488 GT3 is Ferrari's apex predator.
          </p>
          <h2 className="font-ui text-white text-3xl md:text-5xl tracking-widest font-black uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">FERRARI 488 GT3</h2>
        </div>

        {/* Blueprint Texture: Multi-Shade Crimson Concentric Rings & Crosshairs */}
        <div className="hero-blueprint absolute inset-0 pointer-events-none will-change-transform">
          {/* Ring 1 (Outer subtle light-crimson hairline) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] h-[92vw] max-w-[1450px] max-h-[1450px] border-[1px] border-[#ff3b4b]/15 rounded-full" />
          
          {/* Ring 2 (Mid-Outer deep dark-wine crimson) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76vw] h-[76vw] max-w-[1200px] max-h-[1200px] border-[1px] border-[#800008]/45 rounded-full" />
          
          {/* Ring 3 (Mid vibrant ruby crimson with soft tint) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[950px] max-h-[950px] border-[1px] border-[#ff4a5a]/20 bg-[#650005]/[0.08] rounded-full" />
          
          {/* Ring 4 (Inner rich velvet crimson) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44vw] h-[44vw] max-w-[700px] max-h-[700px] border-[1px] border-[#700005]/50 bg-[#450000]/[0.12] rounded-full" />
          
          {/* Ring 5 (Core focal circle with subtle soft glow) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28vw] h-[28vw] max-w-[450px] max-h-[450px] border-[1px] border-[#ff5565]/25 rounded-full shadow-[0_0_50px_rgba(200,16,46,0.12)]" />
          
          {/* Faint Horizontal Subtle Crimson Axis */}
          <div className="absolute top-[50%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3b4b]/15 to-transparent" />
        </div>

        {/* Massive Anchor Text */}
        <div 
          className="hero-giant-text absolute bottom-[-1%] left-0 w-full flex justify-center pb-0 z-[1] overflow-hidden will-change-transform"
        >
          <span 
            className="font-ui font-black whitespace-nowrap text-white/90 block text-center select-none tracking-tight"
            style={{ fontSize: '18.6vw', lineHeight: 0.8, width: '100%', opacity: 1, letterSpacing: '-0.02em' }}
          >
            FERRARI
          </span>
        </div>
      </div>

      {/* Layer 2: The Subject / WebGL Staging (z-index: 10) */}
      <div 
        className="absolute inset-0 w-full h-full z-[10] pointer-events-none block"
      >
        <div id="webgl-container" className="absolute inset-0 w-full h-full z-[10] pointer-events-auto block">
          <Canvas 
            frameloop={isInView ? 'always' : 'never'}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.2, 5.2], fov: 35 }} 
            gl={{ powerPreference: 'high-performance', antialias: true, stencil: false, depth: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <PresentationControls 
                global={false} 
                zoom={1} 
                rotation={[0, -Math.PI / 2, 0]} 
                polar={[-0.15, 0.15]} 
                azimuth={[-Math.PI, Math.PI]}
                snap={true}
              >
                <Float rotationIntensity={0.2} floatIntensity={0.4} speed={2}>
                  <Ferrari position={[0, -0.45, 0]} scale={58} />
                </Float>
              </PresentationControls>
              <Environment preset="studio" environmentIntensity={0.9} />
              <ContactShadows position={[0, -0.65, 0]} opacity={0.5} scale={35} blur={2} far={4} frames={1} resolution={512} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Sidebars for HUD Specs (Layer 3) */}
      <div 
        className="absolute inset-0 z-[50] pointer-events-none text-white opacity-100" 
        style={{ color: '#FFFFFF', opacity: 1 }}
      >
        {/* Left Sidebar */}
        <div className="hero-left-specs absolute top-[45%] left-[15%] md:left-[22%] flex flex-col gap-12 text-left">
          <p className="font-ui text-sm tracking-widest m-0">Engine 3.9L V8</p>
          <p className="font-ui text-sm tracking-widest m-0">Weight 1260kg</p>
        </div>

        {/* Right Sidebar */}
        <div className="hero-right-specs absolute top-[45%] right-[15%] md:right-[22%] flex flex-col gap-12 text-right">
          <p className="font-ui text-sm tracking-widest m-0">600HP @ 7000rpm</p>
          <p className="font-ui text-sm tracking-widest m-0">700Nm @ 4500rpm</p>
        </div>
      </div>
    </section>
  );
}

