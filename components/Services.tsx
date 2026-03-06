import React, { useState, useEffect, useRef } from 'react';
import { Service } from '../types';
import { API_VERSION } from '../constants';

// Extended type for internal use to support specific gallery details
interface MaterialGalleryItem {
  url: string;
  title: string;
  detail: string;
}

const bespokeGallery: MaterialGalleryItem[] = [
  {
    url: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-016.jpg',
    title: 'The Petrified Oak Handle',
    detail: 'A synthesis of millennia-old wood and hand-forged bronze, creating a tactile gateway to the residence.'
  },
  {
    url: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-017.jpg',
    title: 'Monolithic Dining Void',
    detail: 'A 4-meter slab of suspended limestone, precision-milled to appear weightless amidst glass architecture.'
  },
  {
    url: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-018.jpg',
    title: 'Woven Light Screens',
    detail: 'Bespoke metal filaments interwoven with fiber optics to provide privacy that glows from within.'
  },
  {
    url: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-019.jpg',
    title: 'Basalt Basins',
    detail: 'Raw volcanic rock hollowed by artisanal water-jets, preserving the natural crust while refining the flow.'
  }
];

const Services: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeGalleryItem, setActiveGalleryItem] = useState<MaterialGalleryItem | null>(null);

  useEffect(() => {
    fetch(`/api/content?v=${API_VERSION}`)
      .then(res => res.json())
      .then(data => setContent(data.services))
      .catch(err => console.error('Failed to fetch services content', err));
  }, []);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setActiveGalleryItem(null);
    }
  }, [selectedService]);

  const scrollToContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById('contact');
    if (element) {
      setSelectedService(null);
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

  if (!content) return null;

  return (
    <section id="services" className="py-24 px-6 bg-[#fdfcfb] scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 space-y-4">
          <h4 className="text-xs tracking-[0.5em] uppercase text-stone-400">{content.subHeading}</h4>
          <h2 className="serif text-5xl font-light">{content.mainHeading}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {content.services.map((service: any) => (
            <div 
              key={service.id} 
              onClick={() => setSelectedService(service)}
              className={`group flex flex-col space-y-6 cursor-pointer transition-all duration-500 hover:-translate-y-2 p-4 -m-4 rounded-xl ${
                service.featured ? 'bg-white shadow-sm ring-1 ring-stone-200/50' : 'hover:bg-white/50'
              }`}
            >
              <div className="relative h-64 overflow-hidden mb-2 rounded-sm shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                {service.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-stone-900 text-white text-[8px] tracking-[0.3em] uppercase px-3 py-1.5 backdrop-blur-md">
                      Featured Discipline
                    </span>
                  </div>
                )}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-stone-900/10 opacity-40 group-hover:opacity-0 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-stone-900/40 backdrop-blur-[2px]">
                   <span className="text-[9px] tracking-[0.4em] uppercase text-white border border-white/30 px-4 py-2">Explore Discipline</span>
                </div>
              </div>
              
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-500 group-hover:border-stone-800 group-hover:scale-110 group-hover:bg-white ${
                    service.featured ? 'border-stone-800 bg-stone-50' : 'border-stone-200'
                  }`}>
                    <svg className={`w-4 h-4 transition-all duration-700 group-hover:scale-125 group-hover:rotate-6 icon-pulse ${
                      service.featured ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-900'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                    </svg>
                  </div>
                  <h3 className="serif text-2xl font-light tracking-wide transition-colors duration-500 group-hover:text-stone-900">{service.title}</h3>
                </div>
                
                <p className="text-stone-500 text-sm leading-relaxed font-light transition-colors duration-500 group-hover:text-stone-700">
                  {service.description}
                </p>
                
                <div className="pt-2">
                  <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-stone-400 group-hover:text-stone-900 border-b border-transparent group-hover:border-stone-800 transition-all duration-500 pb-1">
                    Discover Provision
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Provision Dossier Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-stone-950/98 backdrop-blur-2xl animate-fade-in" 
            onClick={() => setSelectedService(null)}
          ></div>
          
          <div className="relative w-full h-full max-w-6xl bg-white shadow-2xl flex flex-col md:flex-row animate-scale-up overflow-hidden rounded-sm">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 z-[120] w-12 h-12 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all duration-300 group"
            >
              <svg className="w-8 h-8 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Section: Gallery */}
            <div className={`w-full ${selectedService.id === 'bes' ? 'md:w-2/3' : 'md:w-3/5'} h-1/2 md:h-full overflow-y-auto bg-stone-50 custom-scrollbar`}>
              {selectedService.id === 'bes' ? (
                <div className="flex flex-col bg-stone-900 min-h-full">
                  <div className="p-8 md:p-12 pb-4 border-b border-stone-800">
                    <span className="text-[10px] tracking-[0.5em] uppercase text-stone-500 block mb-2">Material Archive</span>
                    <h3 className="serif text-3xl italic text-white/90">The Tactile Odyssey</h3>
                  </div>
                  
                  {/* Vertical Scroll Archive */}
                  <div className="flex flex-col p-8 md:p-12 gap-16">
                    {bespokeGallery.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveGalleryItem(activeGalleryItem === item ? null : item)}
                        className={`w-full relative group cursor-pointer transition-all duration-1000 ${activeGalleryItem === item ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                      >
                        <div className="aspect-[16/9] overflow-hidden border border-white/5 shadow-2xl">
                          <img 
                            src={item.url} 
                            alt={item.title} 
                            className={`w-full h-full object-cover grayscale transition-all duration-1000 ${activeGalleryItem === item ? 'grayscale-0' : 'group-hover:grayscale-0 opacity-60 group-hover:opacity-100'}`}
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div className="mt-6 flex justify-between items-end border-b border-stone-800 pb-4">
                          <div className="space-y-1">
                            <span className="text-[8px] tracking-[0.4em] uppercase text-stone-600">Specimen {String(i + 1).padStart(2, '0')}</span>
                            <h4 className="serif text-2xl text-white italic">{item.title}</h4>
                          </div>
                          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-500 group-hover:text-white transition-colors">Expand Detail +</span>
                        </div>

                        {activeGalleryItem === item && (
                          <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl p-8 md:p-12 flex flex-col justify-center items-start animate-fade-in z-20 border border-stone-800">
                             <div className="space-y-6 max-w-lg">
                               <div className="space-y-2">
                                 <span className="text-[10px] tracking-[0.5em] uppercase text-stone-600 block">Analysis</span>
                                 <h4 className="serif text-4xl text-white italic leading-tight">{item.title}</h4>
                               </div>
                               <p className="text-stone-300 font-light text-lg leading-relaxed">
                                 {item.detail}
                               </p>
                               <div className="flex gap-4 pt-4">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveGalleryItem(null); }}
                                    className="px-8 py-3 bg-white text-stone-900 text-[10px] tracking-[0.4em] uppercase hover:bg-stone-200 transition-all"
                                  >
                                    Retract
                                  </button>
                               </div>
                             </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Vertical Scroll Hint */}
                  <div className="p-12 border-t border-stone-800 flex justify-between items-center text-stone-700">
                    <span className="text-[8px] tracking-[0.5em] uppercase italic">End of Archive</span>
                    <div className="flex gap-2">
                      {bespokeGallery.map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-stone-800 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 p-6 md:p-12">
                  <div className="space-y-4 mb-8">
                    <span className="text-[9px] tracking-[0.5em] uppercase text-stone-400 block">Visual Provision</span>
                    <div className="h-px w-24 bg-stone-200"></div>
                  </div>
                  {selectedService.galleryUrls.map((url, i) => (
                    <div key={i} className="group overflow-hidden shadow-2xl border border-stone-100">
                      <img 
                        src={url} 
                        alt={`${selectedService.title} application ${i + 1}`} 
                        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Section: Details */}
            <div className={`${selectedService.id === 'bes' ? 'md:w-1/3' : 'md:w-2/5'} w-full h-1/2 md:h-full p-8 md:p-16 flex flex-col justify-between overflow-y-auto bg-white border-l border-stone-100`}>
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-stone-900 text-white rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={selectedService.icon} />
                      </svg>
                    </div>
                    <span className="text-[10px] tracking-[0.5em] uppercase text-stone-400">Expertise Profile</span>
                  </div>
                  <h2 className="serif text-4xl md:text-5xl font-light italic leading-tight text-stone-900">
                    {selectedService.title}
                  </h2>
                </div>

                <div className="space-y-8">
                  <p className="text-stone-600 font-light leading-relaxed text-lg first-letter:text-3xl first-letter:serif first-letter:text-stone-900 first-letter:float-left first-letter:mr-2">
                    {selectedService.longDescription}
                  </p>

                  <div className="space-y-6 pt-8 border-t border-stone-100">
                    <h4 className="text-[10px] tracking-[0.4em] uppercase text-stone-900 font-bold">Focus Dimensions</h4>
                    <div className="grid gap-4">
                      {selectedService.focusAreas.map((focus, i) => (
                        <div key={i} className="flex items-start gap-4 group">
                          <div className="mt-1 w-1.5 h-1.5 bg-stone-300 rounded-full group-hover:bg-stone-800 transition-colors"></div>
                          <span className="text-sm text-stone-500 font-light group-hover:text-stone-900 transition-colors">{focus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col gap-4">
                <button 
                  onClick={scrollToContact}
                  className="w-full py-5 bg-stone-900 text-white text-[10px] tracking-[0.5em] uppercase hover:bg-stone-800 transition-all duration-500 shadow-xl"
                >
                  Initiate Design Dialogue
                </button>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="w-full py-4 border border-stone-200 text-stone-400 text-[9px] tracking-[0.4em] uppercase hover:text-stone-900 hover:border-stone-800 transition-all duration-300"
                >
                  Return to Provisions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;