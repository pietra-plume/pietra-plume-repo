import React, { useState } from 'react';
import { Palmtree, MapPin, Sun, Clock, Compass, X } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  coords: { top: string; left: string };
  description: string;
  image: string;
}

const destinations: Destination[] = [
  { 
    id: 'dubai', 
    name: 'Dubai', 
    coords: { top: '30%', left: '20%' }, 
    description: 'Experience futuristic luxury, desert safaris, and world-class shopping.',
    image: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-043.jpg'
  },
  { 
    id: 'maldives', 
    name: 'Maldives', 
    coords: { top: '65%', left: '30%' }, 
    description: 'Unwind in private overwater villas surrounded by crystal clear lagoons.',
    image: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-044.jpg'
  },
  { 
    id: 'bali', 
    name: 'Bali', 
    coords: { top: '75%', left: '80%' }, 
    description: 'Immerse yourself in tropical jungles, serene temples, and vibrant culture.',
    image: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-045.jpg'
  }
];

export const HolidayPerk: React.FC = () => {
  const [activeDest, setActiveDest] = useState<Destination>(destinations[1]); // Default to Maldives

  return (
    <section id="holiday" className="py-24 bg-stone-900 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="https://ik.imagekit.io/pietraplume/images/pietra-asset-042.jpg"
          alt="World Map Texture" 
          className="w-full h-full object-cover grayscale"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="z-10">
            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <Palmtree size={20} />
              <span className="uppercase tracking-widest text-xs font-bold">The Pietra Plume Promise</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Don't Live in the Dust.<br />
              <span className="text-amber-400">Live in Paradise.</span>
            </h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Renovations are noisy, dusty, and stressful. We believe you shouldn't have to endure that. 
              Once the design is locked, we send you and your family on a fully paid, 5-star vacation for 15 days.
            </p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-400"><Compass size={16} /></div>
                <span className="text-stone-200">Explore our curated destinations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-400"><Sun size={16} /></div>
                <span className="text-stone-200">All-inclusive stays at 5-star properties</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-400"><ClockIcon /></div>
                <span className="text-stone-200">Return exactly on Day 15 for the reveal</span>
              </li>
            </ul>

            <div className="hidden md:block">
                 <p className="font-serif italic text-stone-500">"We left our old home and came back to a masterpiece. The holiday was just the cherry on top."</p>
                 <p className="text-xs font-bold uppercase tracking-wider text-stone-600 mt-2">- The Sharma Family</p>
            </div>
          </div>
          
          {/* Right Interactive Map */}
          <div className="relative h-[500px] w-full bg-stone-800/50 rounded-2xl border border-stone-700/50 shadow-2xl backdrop-blur-sm overflow-hidden group">
             {/* Abstract Map Lines (SVG) */}
             <svg className="absolute inset-0 w-full h-full text-stone-700/30 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                <path d="M50 50 Q 150 10 250 50 T 450 100" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M20 200 Q 120 150 220 200 T 420 250" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M100 0 V 300" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                <path d="M300 0 V 300" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                <path d="M0 100 H 400" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                <path d="M0 200 H 400" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
             </svg>

             {/* Map Title */}
             <div className="absolute top-4 right-4 text-right pointer-events-none">
                <span className="block text-xs font-bold text-amber-500 uppercase tracking-widest">Select Destination</span>
                <span className="block text-stone-500 text-[10px]">Interactive Map</span>
             </div>

             {/* Hotspots */}
             {destinations.map((dest) => (
                <button
                    key={dest.id}
                    onClick={() => setActiveDest(dest)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group/pin transition-all duration-300 focus:outline-none ${
                        activeDest.id === dest.id ? 'z-20 scale-110' : 'z-10 opacity-70 hover:opacity-100'
                    }`}
                    style={{ top: dest.coords.top, left: dest.coords.left }}
                >
                    <div className="relative">
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                             activeDest.id === dest.id ? 'bg-amber-400' : 'bg-stone-400'
                        }`}></span>
                        <div className={`relative inline-flex rounded-full h-4 w-4 border-2 ${
                             activeDest.id === dest.id ? 'bg-amber-500 border-white' : 'bg-stone-800 border-stone-400'
                        }`}></div>
                        
                        {/* Label Tooltip (Always visible for active, hover for others) */}
                        <div className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${
                            activeDest.id === dest.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover/pin:opacity-100 group-hover/pin:translate-x-0'
                        }`}>
                            <span className="text-xs font-bold uppercase tracking-wider bg-stone-900/80 px-2 py-1 rounded text-white backdrop-blur">
                                {dest.name}
                            </span>
                        </div>
                    </div>
                </button>
             ))}

             {/* Info Card Overlay */}
             <div className="absolute bottom-6 left-6 right-6 bg-stone-900/90 backdrop-blur-md border-t-2 border-amber-600 rounded p-5 transition-all duration-500 animate-in slide-in-from-bottom-4">
                 <div className="flex gap-4">
                     <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                        <img 
                            src={activeDest.image} 
                            alt={activeDest.name} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-xl font-serif text-white mb-1 flex items-center justify-between">
                            {activeDest.name}
                            <MapPin size={16} className="text-amber-500" />
                        </h3>
                        <p className="text-sm text-stone-300 leading-relaxed">
                            {activeDest.description}
                        </p>
                        <div className="mt-3 flex gap-2">
                             <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-1 rounded uppercase tracking-wider">5 Nights</span>
                             <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-1 rounded uppercase tracking-wider">Flight Included</span>
                        </div>
                     </div>
                 </div>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);