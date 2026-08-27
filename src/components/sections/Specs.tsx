import { useState } from 'react';

interface SpecItem {
  id: string;
  category: string;
  title: string;
  value: string;
  unit?: string;
  subtitle: string;
  detail: string;
  percentage: number;
  highlight: string;
}

const trackSpecs: SpecItem[] = [
  {
    id: 'engine',
    category: 'POWERTRAIN',
    title: 'ENGINE ARCHITECTURE',
    value: '3.9L',
    unit: 'V8',
    subtitle: 'TWIN-TURBO 90°',
    detail: 'Dry sump lubrication with twin IHI turbochargers and flat-plane crankshaft.',
    percentage: 95,
    highlight: 'MARANELLO F154CB'
  },
  {
    id: 'power',
    category: 'OUTPUT',
    title: 'MAX HORSEPOWER',
    value: '600',
    unit: 'HP',
    subtitle: '@ 7,000 RPM',
    detail: 'Instantaneous throttle mapping with FIA GT3 Balance of Performance.',
    percentage: 88,
    highlight: '154 HP / LITRE'
  },
  {
    id: 'torque',
    category: 'DYNAMICS',
    title: 'PEAK TORQUE',
    value: '700',
    unit: 'NM',
    subtitle: '@ 4,500 RPM',
    detail: 'Variable boost management providing flat, relentless torque across the band.',
    percentage: 92,
    highlight: 'VARIABLE BOOST'
  },
  {
    id: 'weight',
    category: 'CHASSIS',
    title: 'COMPETITION WEIGHT',
    value: '1,260',
    unit: 'KG',
    subtitle: 'DRY WEIGHT',
    detail: 'Aerospace-grade autoclave carbon monocoque with integral roll cage.',
    percentage: 82,
    highlight: '52% REAR BIAS'
  }
];

const performanceSpecs: SpecItem[] = [
  {
    id: 'accel',
    category: 'ACCELERATION',
    title: '0 - 100 KM/H',
    value: '2.8',
    unit: 'SEC',
    subtitle: 'LAUNCH CONTROL',
    detail: 'Hewland 6-speed transversal sequential gearbox with carbon clutch.',
    percentage: 96,
    highlight: 'LIGHTNING SHIFTS'
  },
  {
    id: 'speed',
    category: 'VELOCITY',
    title: 'TOP TRACK SPEED',
    value: '315+',
    unit: 'KM/H',
    subtitle: 'HIGH-DOWNFORCE SETUP',
    detail: 'Aero-optimized gear ratios tailored for international circuits.',
    percentage: 90,
    highlight: 'MONZA SPEC'
  },
  {
    id: 'downforce',
    category: 'AERODYNAMICS',
    title: 'MAX DOWNFORCE',
    value: '600',
    unit: 'KG',
    subtitle: '@ 250 KM/H',
    detail: 'Sculpted front splitter and underbody ground-effect vortex tunnels.',
    percentage: 85,
    highlight: 'CFD OPTIMIZED'
  },
  {
    id: 'braking',
    category: 'DECELERATION',
    title: '100 - 0 KM/H',
    value: '30.5',
    unit: 'M',
    subtitle: 'BREMBO RACING CALIPERS',
    detail: '6-piston monobloc front calipers with Bosch Motorsport adjustable ABS.',
    percentage: 94,
    highlight: 'BOSCH RACE ABS'
  }
];

export default function Specs() {
  const [activeTab, setActiveTab] = useState<'powertrain' | 'performance'>('powertrain');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const currentSpecs = activeTab === 'powertrain' ? trackSpecs : performanceSpecs;

  return (
    <section className="relative w-full min-h-screen bg-transparent z-30 py-28 px-6 lg:px-[8vw] border-t border-white/10 flex flex-col justify-center overflow-hidden">
      
      {/* Background blueprint telemetry grid & coordinates */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 flex items-center justify-center">
        <div className="w-[85vw] h-[85vw] border border-white/30 rounded-full" />
        <div className="absolute w-[60vw] h-[60vw] border border-white/20 rounded-full" />
      </div>

      {/* Top Header Section with Coordinates & Switcher */}
      <div className="relative z-10 mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBA00] animate-pulse shadow-[0_0_10px_rgba(255,186,0,0.8)]" />
            <span className="font-ui text-xs text-white/80 tracking-[0.3em] uppercase font-black">
              SCUDERIA TELEMETRY & SPECIFICATIONS
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-ui font-black text-white uppercase tracking-tight leading-none mb-4">
            ENGINEERED FOR THE TRACK
          </h2>

          <p className="text-white/70 font-sans text-sm md:text-base max-w-2xl font-normal leading-relaxed">
            The 488 GT3 is the ultimate distillation of Ferrari racing DNA. Every system is honed for championship endurance, from the mid-rear twin-turbo V8 to the aerodynamic carbon monocoque.
          </p>
        </div>

        {/* Interactive Mode Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl shrink-0 self-start lg:self-end shadow-2xl">
          <button
            onClick={() => setActiveTab('powertrain')}
            className={`px-6 py-2.5 rounded-full font-ui text-xs tracking-widest uppercase font-black transition-all duration-300 cursor-pointer ${
              activeTab === 'powertrain'
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-100'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            ⚡ POWERTRAIN DYNAMICS
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-6 py-2.5 rounded-full font-ui text-xs tracking-widest uppercase font-black transition-all duration-300 cursor-pointer ${
              activeTab === 'performance'
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-100'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            🏁 TRACK PERFORMANCE
          </button>
        </div>
      </div>

      {/* 4 Telemetry Glassmorphism Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-10">
        {currentSpecs.map((spec) => (
          <div
            key={spec.id}
            onMouseEnter={() => setHoveredCard(spec.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`relative p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between backdrop-blur-xl group cursor-pointer ${
              hoveredCard === spec.id
                ? 'border-[#FFBA00]/60 bg-black/70 shadow-[0_0_40px_rgba(255,186,0,0.2)] -translate-y-2'
                : 'border-white/10 bg-black/40 hover:border-white/30 shadow-xl'
            }`}
          >
            {/* Top Pill & Tag */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="font-ui text-[10px] text-white/50 tracking-[0.25em] uppercase font-bold">
                  {spec.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 font-ui text-[9px] text-[#FFBA00] tracking-widest font-black uppercase">
                  {spec.highlight}
                </span>
              </div>

              <h3 className="text-white/80 font-ui text-xs tracking-widest uppercase mb-2 font-bold">
                {spec.title}
              </h3>

              {/* Main Number & Unit */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-white font-ui text-5xl md:text-6xl font-black tracking-tight group-hover:text-white transition-colors">
                  {spec.value}
                </span>
                {spec.unit && (
                  <span className="text-xl md:text-2xl text-[#FFBA00] font-ui font-black tracking-wider">
                    {spec.unit}
                  </span>
                )}
              </div>

              <p className="text-white/60 font-ui text-xs uppercase tracking-wider font-bold mb-6">
                {spec.subtitle}
              </p>
            </div>

            {/* Bottom Progress Bar & Description */}
            <div>
              {/* Dynamic Animated Telemetry Gauge Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-[#FFBA00] rounded-full transition-all duration-700 ease-out"
                  style={{ width: hoveredCard === spec.id ? `${spec.percentage}%` : `${spec.percentage * 0.75}%` }}
                />
              </div>

              <p className="text-white/60 font-sans text-xs leading-relaxed">
                {spec.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Telemetry Coordinate Bar */}
      <div className="relative z-10 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 font-ui text-[10px] uppercase tracking-widest font-bold">
        <span>FACILITY: MARANELLO HOMOLOGATION TEST BENCH</span>
        <span className="text-[#FFBA00]/70 font-mono">LAT 44.5323° N / LON 10.8640° E</span>
        <span>FIA GT3 HOMOLOGATION NO. GT3-044</span>
      </div>

    </section>
  );
}

