import React from 'react';
import { ArrowRight, Clock, Plane } from 'lucide-react';

interface HeroProps {
  onBook: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBook }) => {
  const scrollToStudio = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('studio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://ik.imagekit.io/pietraplume/images/pietra-asset-001.jpg"
          alt="Luxury Living Room" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/90 text-xs tracking-[0.2em] mb-6 uppercase backdrop-blur-sm">
          The Art of Possible
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
          Your Dream Home.<br/>
          <span className="text-amber-400 italic">Delivered in 15 Days.</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-200 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          Experience the revolution of Agile interior design. We plan, iterate, and execute your renovation in a flat 15-day sprint while you enjoy a <span className="text-white font-bold border-b border-amber-400">fully paid family holiday</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onBook}
            className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white text-sm font-bold tracking-widest hover:bg-amber-500 transition-all duration-300 rounded-sm flex items-center justify-center gap-3 shadow-lg shadow-amber-900/20"
          >
            START YOUR JOURNEY <ArrowRight size={16} />
          </button>
          <a 
             href="#studio"
             onClick={scrollToStudio}
             className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white text-sm font-bold tracking-widest hover:bg-white/20 transition-all duration-300 rounded-sm border border-white/30 flex items-center justify-center gap-3 cursor-pointer"
          >
            TRY DESIGN STUDIO
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80 border-t border-white/10 pt-8">
            <div className="flex flex-col items-center">
                <Clock className="mb-2 text-amber-400" size={24} />
                <span className="text-sm font-bold uppercase tracking-wider">15-Day Delivery</span>
            </div>
             <div className="flex flex-col items-center">
                <Plane className="mb-2 text-amber-400" size={24} />
                <span className="text-sm font-bold uppercase tracking-wider">Paid Holiday</span>
            </div>
             <div className="flex flex-col items-center">
                <svg className="mb-2 text-amber-400 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-bold uppercase tracking-wider">Agile Iterations</span>
            </div>
        </div>
      </div>
    </div>
  );
};