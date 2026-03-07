import React, { useState, useEffect, useRef } from 'react';
import { PortfolioItem } from '../types';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          // Fallback if DB is empty
          setProjects([]);
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  const scrollBy = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById('contact');
    if (element) {
      setSelectedProject(null);
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', '#contact');
    }
  };

  return (
    <section id="portfolio" className="py-24 px-6 bg-[#fcfcfc] scroll-mt-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4 md:px-0 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs tracking-[0.5em] uppercase text-stone-400">Selected Works</h4>
            <h2 className="serif text-5xl md:text-6xl font-light">Crafting the <span className="italic underline underline-offset-8 decoration-stone-200">Indelible</span>.</h2>
          </div>
          <div className="flex flex-col items-end gap-6">
            <p className="max-w-md text-stone-500 font-light leading-relaxed text-sm text-right">
              A curated odyssey through spaces where gravity is challenged and heritage is re-imagined. 
            </p>
            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex items-center gap-4">
               <button 
                onClick={() => scrollBy('left')}
                className="w-12 h-12 flex items-center justify-center border border-stone-200 rounded-full hover:border-stone-800 hover:bg-stone-50 transition-all text-stone-400 hover:text-stone-900"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                 </svg>
               </button>
               <button 
                onClick={() => scrollBy('right')}
                className="w-12 h-12 flex items-center justify-center border border-stone-200 rounded-full hover:border-stone-800 hover:bg-stone-50 transition-all text-stone-400 hover:text-stone-900"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                 </svg>
               </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-stone-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Horizontally Scrollable Gallery */
          <div className="relative group">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-12 pb-12 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing px-4 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw] snap-center group/card cursor-pointer"
              >
                {/* Project Image */}
                <div className="aspect-[16/10] overflow-hidden relative mb-8 shadow-sm group-hover/card:shadow-2xl transition-all duration-700">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 grayscale group-hover/card:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover/card:opacity-0 transition-opacity duration-500"></div>
                  
                  {/* Floating Action Button */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-full shadow-lg border border-stone-100">
                      <svg className="w-5 h-5 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Project Description & Meta */}
                <div className="space-y-4 px-1">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-medium">
                      {project.category} // {project.year}
                    </span>
                    <span className="text-[9px] text-stone-300 font-light italic">
                      {project.location}
                    </span>
                  </div>
                  
                  <h3 className="serif text-3xl font-light italic text-stone-900 group-hover/card:text-stone-600 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-stone-500 text-sm font-light leading-relaxed line-clamp-2 italic h-10">
                    {project.description}
                  </p>

                  <div className="flex gap-4 pt-2">
                    <div className="flex-1 h-px bg-stone-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-stone-800 w-0 group-hover/card:w-full transition-all duration-1000 delay-100"></div>
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-hover/card:text-stone-800 transition-colors">Details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 flex items-center gap-6 px-4 md:px-0">
             <div className="flex-1 h-px bg-stone-100 relative">
               <div 
                className="absolute top-0 left-0 h-full bg-stone-800 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
               ></div>
             </div>
             <div className="flex items-center gap-4">
               <span className="text-[9px] tracking-widest text-stone-900 uppercase font-medium">
                 {projects.length} Works Manifested
               </span>
               <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
               <span className="text-[9px] tracking-widest text-stone-400 uppercase font-light">
                 Horizontal Exploration
               </span>
             </div>
          </div>
        </div>
        )}
      </div>

      {/* Portfolio Detailed Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl animate-fade-in" 
            onClick={() => setSelectedProject(null)}
          ></div>
          
          <div className="relative w-full h-full md:h-[90vh] md:w-[95vw] max-w-7xl bg-[#fdfcfb] shadow-2xl flex flex-col md:flex-row animate-scale-up overflow-hidden">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-[120] w-12 h-12 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left: Scrollable Gallery */}
            <div className="w-full md:w-2/3 h-1/2 md:h-full overflow-y-auto custom-scrollbar bg-stone-100">
              <div className="flex flex-col gap-4 p-4 md:p-8">
                {selectedProject.galleryUrls.map((url, i) => (
                  <div key={i} className="relative group overflow-hidden shadow-lg border border-white/10">
                    <img 
                      src={url} 
                      alt={`${selectedProject.title} view ${i + 1}`} 
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Project Dossier */}
            <div className="w-full md:w-1/3 h-1/2 md:h-full p-8 md:p-16 flex flex-col justify-between overflow-y-auto bg-white border-l border-stone-100">
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.5em] uppercase text-stone-400">{selectedProject.category}</span>
                    <div className="h-px flex-1 bg-stone-100"></div>
                  </div>
                  <h2 className="serif text-5xl md:text-6xl font-light italic leading-tight text-stone-900">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="space-y-8">
                  <p className="text-stone-500 font-light leading-relaxed text-lg italic">
                    {selectedProject.description}
                  </p>

                  <div className="space-y-6 pt-6 border-t border-stone-100">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold">Pietra Weight</span>
                      <span className="text-xl font-light">{selectedProject.pietraRatio}%</span>
                    </div>
                    <div className="w-full h-1 bg-stone-100 overflow-hidden">
                      <div className="h-full bg-stone-800 transition-all duration-1000" style={{ width: `${selectedProject.pietraRatio}%` }}></div>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold">Plume Essence</span>
                      <span className="text-xl font-light">{selectedProject.plumeRatio}%</span>
                    </div>
                    <div className="w-full h-1 bg-stone-100 overflow-hidden">
                      <div className="h-full bg-stone-300 transition-all duration-1000" style={{ width: `${selectedProject.plumeRatio}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-[0.4em] uppercase text-stone-400 block">Location</span>
                    <span className="text-xs text-stone-800 font-medium">{selectedProject.location}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-[0.4em] uppercase text-stone-400 block">Completion</span>
                    <span className="text-xs text-stone-800 font-medium">{selectedProject.year}</span>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <span className="text-[9px] tracking-[0.4em] uppercase text-stone-400 block">Primary Materials</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.materials.map((m, i) => (
                        <span key={i} className="text-[10px] border border-stone-200 px-2 py-1 italic text-stone-600">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col gap-4">
                <button 
                  onClick={scrollToContact}
                  className="w-full py-5 bg-stone-900 text-white text-[10px] tracking-[0.5em] uppercase hover:bg-stone-700 transition-all duration-500 shadow-xl"
                >
                  Initiate Design Dialogue
                </button>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-4 border border-stone-200 text-stone-400 text-[10px] tracking-[0.4em] uppercase hover:text-stone-900 hover:border-stone-800 transition-all duration-300"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;