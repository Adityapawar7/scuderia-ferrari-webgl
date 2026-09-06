import { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import { Model as Ferrari } from '../Ferrari';
import { useInView } from '../../hooks/useInView';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

function DrivingCar({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Progress from 0 (off-screen left) to 1 (parked dead center)
    const p = progressRef.current;
    
    // Target position: starts at x: -9, settles at x: 0
    const targetX = THREE.MathUtils.lerp(-9, 0, p);
    
    // Subtle driving steering rotation that straightens out smoothly as it parks
    const targetRotY = -Math.PI / 2 + (1 - p) * 0.25;

    // Smooth physics damping
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5, delta);
  });

  return (
    <group ref={groupRef} position={[-9, -0.42, 0]}>
      <Float rotationIntensity={0.06} floatIntensity={0.12} speed={1.5}>
        <Ferrari scale={46} />
      </Float>
      <ContactShadows position={[0, -0.01, 0]} opacity={0.55} scale={30} blur={2.2} far={4} frames={1} resolution={512} color="#000000" />
    </group>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [, isInView] = useInView({ rootMargin: '300px' }, footerRef);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Trigger car driving in from left to right as footer scrolls into view
      gsap.to(progressRef, {
        current: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1.0,
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full h-screen bg-transparent z-30 flex flex-col items-center justify-between py-12 border-t border-white/5 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

      {/* Layer 1: Giant Background FERRARI Text (behind parked car) */}
      <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none select-none">
        <h2 
          className="text-[16vw] font-ui font-black text-white/90 whitespace-nowrap tracking-tighter uppercase text-center"
          style={{ lineHeight: 0.75 }}
        >
          FERRARI
        </h2>
      </div>

      {/* Layer 2: 3D Driving Car Canvas (Drives in from left and parks in center) */}
      <div className="absolute inset-0 z-[10] pointer-events-none flex items-center justify-center">
        <div className="w-full h-full relative pointer-events-auto">
          <Canvas 
            frameloop={isInView ? 'always' : 'never'}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.3, 5.2], fov: 35 }} 
            gl={{ powerPreference: 'high-performance', antialias: true, stencil: false, depth: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <DrivingCar progressRef={progressRef} />
              <Environment preset="studio" environmentIntensity={1.0} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Layer 3: Top Label */}
      <div className="z-[20] text-center px-6 mt-4 pointer-events-none">
        <span className="font-ui text-xs text-white/60 tracking-[0.3em] uppercase font-bold">
          MARANELLO SPEEDWAY FINALE
        </span>
      </div>

      {/* Layer 3: Bottom Action & Legal Links */}
      <div className="z-[20] flex flex-col items-center gap-8 w-full px-[8vw] mb-4">
        <button className="px-12 py-5 bg-white text-black font-ui font-black text-xs md:text-sm tracking-widest uppercase rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:scale-105 cursor-pointer">
          EXPERIENCE THE 488 GT3 &rarr;
        </button>

        <div className="w-full pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 font-ui text-[11px] uppercase tracking-widest font-extrabold">
          <span>© {new Date().getFullYear()} FERRARI S.P.A. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">LEGAL</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">COOKIES</a>
          </div>
        </div>
      </div>
    </footer>
  );
}



