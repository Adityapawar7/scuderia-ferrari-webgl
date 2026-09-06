import { useEffect, useRef, useState, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { Model as Ferrari } from '../Ferrari';
import { useInView } from '../../hooks/useInView';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const hotspots = [
  {
    tag: 'AERODYNAMICS',
    title: 'GROUND EFFECT & DOWNFORCE',
    description: 'Front carbon splitter, active underbody vortex generators, and sculpted rear wing engineered to maximize cornering downforce while slicing through air on high-speed straights.',
    spec: 'DOWNFORCE: 600KG @ 250 KM/H',
  },
  {
    tag: 'CHASSIS',
    title: 'CARBON FIBER MONOCOQUE',
    description: 'Ultra-lightweight aerospace-grade carbon composite chassis engineered for supreme torsional rigidity, laser-sharp turn-in response, and track-proven agility.',
    spec: 'RIGIDITY: +40% TORSIONAL STIFFNESS',
  },
  {
    tag: 'POWERTRAIN',
    title: '3.9L V8 TWIN-TURBO',
    description: 'Mid-rear mounted Maranello twin-turbo powerhouse delivering 600 HP of instantaneous throttle response, screaming up to 7,500 RPM with signature Ferrari acoustics.',
    spec: 'POWER: 600 HP | 700 NM TORQUE',
  }
];

function HotspotCarModel({ stage }: { stage: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Subtle natural pointer parallax
    const mouseX = state.pointer.x * 0.12;
    const mouseY = state.pointer.y * 0.08;

    // Rotational targets for each stage:
    let targetRotY = -0.65;
    let targetRotX = 0.08;
    let targetPosZ = 0;

    if (stage === 1) {
      targetRotY = -Math.PI / 2;
      targetRotX = 0.22;
      targetPosZ = 0.2;
    } else if (stage === 2) {
      targetRotY = -2.35;
      targetRotX = 0.12;
      targetPosZ = -0.1;
    }

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY + mouseX, 4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX - mouseY, 4, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosZ, 4, delta);
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      <Float rotationIntensity={0.15} floatIntensity={0.25} speed={2}>
        <Ferrari scale={52} />
      </Float>
    </group>
  );
}

export default function Hotspots() {
  const containerRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [, isInView] = useInView({ rootMargin: '300px' }, containerRef);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            if (self.progress < 0.33) {
              setCurrentStage(0);
            } else if (self.progress < 0.66) {
              setCurrentStage(1);
            } else {
              setCurrentStage(2);
            }
          }
        }
      });

      // Clean non-overlapping transitions for each hotspot text card
      textRefs.current.forEach((el, index) => {
        if (!el) return;

        if (index === 0) {
          tl.to(el, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0)
            .to(el, { opacity: 0, y: -30, duration: 0.1, ease: 'power2.in' }, 0.22);
        } else if (index === 1) {
          tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.35)
            .to(el, { opacity: 0, y: -30, duration: 0.1, ease: 'power2.in' }, 0.58);
        } else if (index === 2) {
          tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.70)
            .to(el, { opacity: 1, y: 0, duration: 0.2 }, 0.85);
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-transparent z-30 flex items-center justify-between border-t border-white/5 overflow-hidden"
    >
      {/* Background blueprint subtle circular grid */}
      <div className="hero-blueprint absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
        <div className="w-[60vw] h-[60vw] border border-white/20 rounded-full" />
        <div className="absolute w-[40vw] h-[40vw] border border-white/10 rounded-full" />
      </div>

      {/* Left side: Interactive 3D Car with dynamic scroll rotation */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative">
        <div className="w-full h-[85vh] relative">
          <Canvas 
            frameloop={isInView ? 'always' : 'never'}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.35, 5.0], fov: 35 }} 
            gl={{ powerPreference: 'high-performance', antialias: true, stencil: false, depth: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <HotspotCarModel stage={currentStage} />
              <Environment preset="studio" environmentIntensity={1.0} />
            </Suspense>
          </Canvas>

          {/* Dynamic Stage HUD overlay */}
          <div className="absolute bottom-6 left-12 flex items-center gap-4 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#FFBA00] animate-ping" />
            <span className="font-ui text-xs text-white/80 tracking-[0.25em] uppercase font-bold">
              3D TELEMETRY / ANGLE 0{currentStage + 1}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right side: Hotspot Specs Cards */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center lg:justify-start px-6 lg:px-[6vw] relative z-10 pointer-events-none">
        {hotspots.map((spot, i) => (
          <div 
            key={i}
            ref={el => { textRefs.current[i] = el; }}
            className="absolute w-[90%] max-w-lg p-0 opacity-0 translate-y-6 pointer-events-auto"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBA00] shadow-[0_0_12px_rgba(255,186,0,0.8)]" />
                <span className="font-ui text-xs text-white tracking-[0.25em] uppercase font-black">
                  {spot.tag}
                </span>
              </div>
              <div className="h-[1px] flex-grow bg-white/20" />
              <span className="font-ui text-xs text-white/60 tracking-widest font-extrabold">
                0{i + 1} / 03
              </span>
            </div>
            
            <h2 className="text-white font-ui tracking-wide text-3xl md:text-5xl mb-6 leading-tight font-black uppercase">
              {spot.title}
            </h2>
            
            <p className="text-white/80 font-sans text-sm md:text-base leading-relaxed tracking-wide font-medium max-w-md mb-8">
              {spot.description}
            </p>

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-ui text-[11px] text-white/90 tracking-widest uppercase font-bold">
                {spot.spec}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


