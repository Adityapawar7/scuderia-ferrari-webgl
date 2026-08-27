import { useState } from 'react';

interface GalleryItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stat: string;
  statLabel: string;
  category: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 'aero',
    tag: 'AERODYNAMICS',
    title: 'AERODYNAMIC PROFILE',
    subtitle: 'WIND TUNNEL SCULPTED',
    description: 'Developed through over 300 hours of Computational Fluid Dynamics (CFD) and full-scale wind tunnel testing. The sculpted front splitter, dive planes, and active underfloor diffusers generate over 600kg of downforce.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1600&auto=format&fit=crop',
    stat: '600 KG',
    statLabel: 'PEAK DOWNFORCE @ 250 KM/H',
    category: 'AERO'
  },
  {
    id: 'carbon',
    tag: 'CHASSIS',
    title: 'CARBON FIBER WEAVE',
    subtitle: 'AEROSPACE COMPOSITE',
    description: 'Autoclave-cured aerospace composite structure maximizing torsional rigidity while shaving crucial kilograms off the competition weight.',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop',
    stat: '1,260 KG',
    statLabel: 'COMPETITION DRY WEIGHT',
    category: 'CHASSIS'
  },
  {
    id: 'cockpit',
    tag: 'INTERIOR',
    title: 'GT3 RACING COCKPIT',
    subtitle: 'DRIVER-CENTRIC TELEMETRY',
    description: 'Formed in matte carbon with backlit rotary controllers, integrated MoTeC digital telemetry screen, and FIA-spec Sabelt competition bucket seating.',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop',
    stat: 'CAN-BUS',
    statLabel: 'REAL-TIME DATA ACQUISITION',
    category: 'COCKPIT'
  },
  {
    id: 'racing',
    tag: 'MOTORSPORT',
    title: 'RACING DNA & HERITAGE',
    subtitle: 'MARANELLO CHAMPIONSHIP PEDIGREE',
    description: 'With over 400 global victories including multiple titles at the 24 Hours of Le Mans, the 488 GT3 stands as the winningest platform in Ferrari GT history.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
    stat: '400+ WINS',
    statLabel: 'INTERNATIONAL VICTORIES',
    category: 'TRACK'
  }
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section className="relative w-full py-32 bg-transparent z-30 flex flex-col items-center border-t border-white/5">
      {/* Header Section */}
      <div className="w-full px-[8vw] mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFBA00] animate-pulse" />
            <span className="font-ui text-xs text-white/70 tracking-[0.25em] uppercase font-bold">
              FERRARI CORSE CLIENTE
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-ui font-black text-white uppercase tracking-wide">
            DESIGN EXCELLENCE
          </h2>
        </div>

        <p className="font-ui text-sm text-white/60 tracking-wider max-w-md">
          Explore the engineering precision and race-proven design elements of the Ferrari 488 GT3.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto] md:grid-rows-[repeat(2,340px)] gap-6 w-full max-w-[84vw] mx-auto">
        
        {/* Tile 1: Large Featured (Aerodynamics) */}
        <div 
          onClick={() => setSelectedItem(galleryItems[0])}
          className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden group relative cursor-pointer border border-white/10 bg-black/40 hover:border-white/40 transition-all duration-500 shadow-2xl min-h-[360px]"
        >
          <img 
            src={galleryItems[0].image} 
            alt={galleryItems[0].title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Top HUD Badge */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 font-ui text-[10px] text-white tracking-widest font-extrabold uppercase">
              {galleryItems[0].tag}
            </span>
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA00]" />
              <span className="font-ui text-[10px] text-white/90 tracking-widest font-bold">
                {galleryItems[0].stat}
              </span>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end">
            <span className="text-[#FFBA00] font-ui tracking-[0.2em] text-xs font-bold mb-1">
              {galleryItems[0].subtitle}
            </span>
            <h3 className="text-white font-ui font-black text-2xl md:text-4xl tracking-wide uppercase mb-3">
              {galleryItems[0].title}
            </h3>
            <p className="text-white/70 font-sans text-xs md:text-sm max-w-xl line-clamp-2 leading-relaxed">
              {galleryItems[0].description}
            </p>
          </div>
        </div>

        {/* Tile 2: Carbon Weave */}
        <div 
          onClick={() => setSelectedItem(galleryItems[1])}
          className="rounded-3xl overflow-hidden group relative cursor-pointer border border-white/10 bg-black/40 hover:border-white/40 transition-all duration-500 shadow-2xl min-h-[260px]"
        >
          <img 
            src={galleryItems[1].image} 
            alt={galleryItems[1].title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute top-5 left-5">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 font-ui text-[10px] text-white tracking-widest font-extrabold uppercase">
              {galleryItems[1].tag}
            </span>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-6">
            <span className="text-[#FFBA00] font-ui tracking-[0.2em] text-[10px] font-bold block mb-1">
              {galleryItems[1].subtitle}
            </span>
            <h3 className="text-white font-ui font-black text-xl md:text-2xl tracking-wide uppercase mb-1">
              {galleryItems[1].title}
            </h3>
            <span className="text-white/60 font-ui text-xs font-medium">
              {galleryItems[1].statLabel}: <strong className="text-white">{galleryItems[1].stat}</strong>
            </span>
          </div>
        </div>

        {/* Tile 3: Cockpit */}
        <div 
          onClick={() => setSelectedItem(galleryItems[2])}
          className="rounded-3xl overflow-hidden group relative cursor-pointer border border-white/10 bg-black/40 hover:border-white/40 transition-all duration-500 shadow-2xl min-h-[260px]"
        >
          <img 
            src={galleryItems[2].image} 
            alt={galleryItems[2].title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute top-5 left-5">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 font-ui text-[10px] text-white tracking-widest font-extrabold uppercase">
              {galleryItems[2].tag}
            </span>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-6">
            <span className="text-[#FFBA00] font-ui tracking-[0.2em] text-[10px] font-bold block mb-1">
              {galleryItems[2].subtitle}
            </span>
            <h3 className="text-white font-ui font-black text-xl md:text-2xl tracking-wide uppercase mb-1">
              {galleryItems[2].title}
            </h3>
            <span className="text-white/60 font-ui text-xs font-medium">
              {galleryItems[2].statLabel}
            </span>
          </div>
        </div>

        {/* Tile 4: Wide Racing DNA Banner */}
        <div 
          onClick={() => setSelectedItem(galleryItems[3])}
          className="md:col-span-3 rounded-3xl overflow-hidden group relative cursor-pointer border border-white/10 bg-black/40 hover:border-white/40 transition-all duration-500 shadow-2xl min-h-[280px]"
        >
          <img 
            src={galleryItems[3].image} 
            alt={galleryItems[3].title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 font-ui text-[10px] text-white tracking-widest font-extrabold uppercase">
                {galleryItems[3].tag}
              </span>
              <span className="text-[#FFBA00] font-ui text-xs tracking-widest font-bold">
                {galleryItems[3].stat}
              </span>
            </div>
            <h3 className="text-white font-ui font-black text-3xl md:text-4xl tracking-wide uppercase mb-3">
              {galleryItems[3].title}
            </h3>
            <p className="text-white/70 font-sans text-xs md:text-sm leading-relaxed mb-4">
              {galleryItems[3].description}
            </p>
            <div className="inline-flex items-center gap-2 text-white/90 font-ui text-xs tracking-widest font-bold group-hover:text-[#FFBA00] transition-colors">
              CLICK TO VIEW FULL SPECIFICATIONS &rarr;
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Detail Modal / Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[320px] w-full">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#FFBA00]/20 text-[#FFBA00] border border-[#FFBA00]/30 font-ui text-xs tracking-widest font-bold">
                  {selectedItem.tag}
                </span>
                <span className="text-white/50 font-ui text-xs tracking-widest uppercase">
                  {selectedItem.subtitle}
                </span>
              </div>

              <h2 className="text-white font-ui text-3xl font-black uppercase mb-4">
                {selectedItem.title}
              </h2>

              <p className="text-white/80 font-sans text-base leading-relaxed mb-8">
                {selectedItem.description}
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-white/50 font-ui text-[10px] uppercase tracking-wider block">
                    TELEMETRY HIGHLIGHT
                  </span>
                  <span className="text-white font-ui font-extrabold text-sm uppercase tracking-wide">
                    {selectedItem.statLabel}
                  </span>
                </div>
                <span className="text-[#FFBA00] font-ui font-black text-2xl">
                  {selectedItem.stat}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

