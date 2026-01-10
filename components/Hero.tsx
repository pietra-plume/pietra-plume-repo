import React from 'react';

const Hero: React.FC = () => {
  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://ik.imagekit.io/pietraplume/images/pietra-asset-001.jpg" 
          alt="Luxury Architecture" 
          className="w-full h-full object-cover brightness-75 scale-105"
        />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h2 className="text-xs tracking-[0.6em] uppercase mb-6 animate-pulse font-light">
          Mastering the Art of the Possible
        </h2>
        <h1 className="serif text-5xl md:text-8xl font-light mb-8 leading-tight">
          Where <span className="italic">Stone</span> Meets <span className="italic">Spirit</span>.
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto opacity-90 leading-relaxed mb-10">
          We weave the permanence of earth with the fluidity of light, manifesting bespoke realities that redefine the boundaries of architectural potential.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={(e) => scrollTo(e, 'portfolio')}
            className="border border-white/50 text-white px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-white/10 transition-all"
          >
            View Works
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-px h-16 bg-white/40"></div>
      </div>
    </section>
  );
};

export default Hero;