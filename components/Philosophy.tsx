import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section id="about-us" className="relative py-32 px-6 bg-[#fdfcfb] min-h-[600px] overflow-hidden scroll-mt-32">
      {/* Target for Philosophy link as well */}
      <div id="philosophy" className="absolute top-0 left-0 w-full h-0"></div>
      
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-3 gap-12 xl:gap-24 items-center">
        
        {/* Pietra Anchor - Grounded Textures (Featuring Intricate Wood) */}
        <div className="relative group order-2 lg:order-1">
          <div className="absolute -inset-4 bg-stone-100 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"></div>
          <img 
            src="https://ik.imagekit.io/pietraplume/images/pietra-asset-002.jpg" 
            alt="Pietra - Intricate Wood and Natural Patterns" 
            className="relative w-full h-[500px] xl:h-[600px] object-cover grayscale-[0.3] shadow-2xl transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.02]"
          />
          <div className="absolute -bottom-6 -right-6 xl:-bottom-10 xl:-right-10 bg-white p-8 xl:p-12 shadow-2xl hidden md:block max-w-[280px] border border-stone-100 z-10">
            <h3 className="serif text-3xl mb-4 italic">Pietra</h3>
            <p className="text-xs xl:text-sm leading-relaxed text-stone-600 font-light">
              The foundation. Raw materials, historical weight, and the unyielding strength of stone, marble, and ancient wood—nature's core manifested in physical form.
            </p>
          </div>
        </div>

        {/* Central Philosophy Text */}
        <div className="space-y-10 relative order-1 lg:order-2 text-center lg:text-left flex flex-col items-center lg:items-start pt-12 lg:pt-0">
          <div className="space-y-4">
            <h4 className="text-xs tracking-[0.5em] uppercase text-stone-400 font-medium">Our Methodology</h4>
            <h2 className="serif text-5xl xl:text-7xl font-light leading-tight text-stone-900">
              The Alchemical <br/><span className="italic">Balance</span>
            </h2>
          </div>
          
          <div className="space-y-8 text-lg text-stone-700 font-light leading-relaxed">
            <p>
              At Pietra & Plume, we believe great design is an act of reconciliation. We marry the heavy with the light, the ancient with the ephemeral.
            </p>
            <p>
              Our process, "The Plume Path," is centered on <span className="text-stone-900 font-medium italic">the Art of the Possible</span>—expanding the horizons of structural engineering and aesthetic grace.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start">
              <p className="text-sm text-stone-400 italic border-l-2 lg:border-l-0 lg:border-t-0 border-stone-200 pl-6 lg:pl-0 py-2">
                "We don't just build structures; we manifest possibilities that defy the weight of tradition while honoring its soul."
              </p>
            </div>
          </div>
        </div>

        {/* Plume Anchor - Fabric, Feather, Light (Updated Image) */}
        <div className="relative group order-3">
          <div className="absolute -inset-4 bg-stone-100 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"></div>
          <img 
            src="https://ik.imagekit.io/pietraplume/images/pietra-asset-003.jpg" 
            alt="Plume - Ethereal Feathers and Airy Textures" 
            className="relative w-full h-[500px] xl:h-[600px] object-cover grayscale-[0.3] shadow-2xl transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.02]"
          />
          <div className="absolute -top-6 -left-6 xl:-top-10 xl:-left-10 bg-white p-8 xl:p-12 shadow-2xl hidden md:block max-w-[280px] border border-stone-100 z-10">
            <h3 className="serif text-3xl mb-4 italic">Plume</h3>
            <p className="text-xs xl:text-sm leading-relaxed text-stone-600 font-light">
              The spirit. Fluidity, transparency, and the ethereal dance of light through feathers and fabric. The breath of a structure that turns monoliths into living experiences.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Philosophy;