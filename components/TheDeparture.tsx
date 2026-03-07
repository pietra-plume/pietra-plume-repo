import React, { useState, useEffect } from 'react';
import { HolidayPackage, ProjectTypeTimeline, TimelinePhase } from '../types';

const holidays: HolidayPackage[] = [
  {
    id: 'himalayan',
    name: 'The Spiti Monolith',
    location: 'Spiti Valley, Himachal Pradesh',
    description: 'Brutalist serenity in the high desert. A sanctuary of local stone and glass looking over ancient monasteries.',
    imageUrl: 'https://ik.imagekit.io/pietraplume/pietra-asset-028.jpg',
    galleryUrls: [
      'https://ik.imagekit.io/pietraplume/pietra-asset-028.jpg',
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-029.jpg',
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-031.jpg'
    ]
  },
  {
    id: 'kerala',
    name: 'The Emerald Plume',
    location: 'Kumarakom, Kerala',
    description: 'Weightless architecture suspended over the backwaters, where traditional teak meets ethereal translucency.',
    imageUrl: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-032.jpg',
    galleryUrls: [
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-032.jpg',
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-033.jpg',
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-035.jpg'
    ]
  },
  {
    id: 'rajasthan',
    name: 'The Amber Stillness',
    location: 'Jaisalmer, Rajasthan',
    description: 'Ancient golden sandstone recontextualized into a modern nomadic fortress of silence.',
    imageUrl: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-036.jpg',
    galleryUrls: [
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-036.jpg',
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-037.jpg',
      'https://ik.imagekit.io/pietraplume/images/pietra-asset-039.jpg'
    ]
  }
];

const timelines: ProjectTypeTimeline[] = [
  {
    id: 'reno',
    title: 'Renovation',
    totalDuration: '10-14 Weeks',
    phases: [
      { 
        label: 'Discovery Sprint', 
        duration: '2 Weeks', 
        description: 'User stories and structural scanning.',
        detailedContent: 'We utilize high-precision LiDAR scanning to create a 1:1 digital twin of the existing space. Our "User Story" workshop translates your lifestyle into functional requirements, ensuring the architectural "backlog" is prioritized by experience.'
      },
      { 
        label: 'Iterative Design', 
        duration: '3 Weeks', 
        description: 'Rapid prototyping of spatial flow.',
        detailedContent: 'Unlike traditional firms, we deliver three rapid design builds. Each iteration is refined based on real-time feedback, focusing on light-path simulations and material alchemy before a single stone is moved.'
      },
      { 
        label: 'The Departure', 
        duration: '6 Weeks', 
        description: 'Client sabbatical begins. 24/7 execution.', 
        isSabbatical: true,
        detailedContent: 'As you depart for your chosen sanctuary, our sprint execution begins. You receive a weekly "Sprint Review" video—a cinematic update of the progress. Our on-site concierge manages all logistical noise while you recharge.'
      },
      { 
        label: 'The Return', 
        duration: '1 Week', 
        description: 'Zero-downtime handover and move-in.',
        detailedContent: 'The Return is a choreographed ritual. We manage the entire white-glove move-in, including sensory calibration (lighting scenes, climate, and scent) so your return is to a fully operational sanctuary.'
      }
    ]
  },
  {
    id: 'res',
    title: 'Residential',
    totalDuration: '14-18 Months',
    phases: [
      { 
        label: 'Vulnerability Study', 
        duration: '2 Months', 
        description: 'Site analysis and ancestral grounding.',
        detailedContent: 'We conduct a deep geological and historical audit of the land. We analyze soil vibration, wind patterns, and the site\'s "Pietra" heritage to ground the foundation in local truth.'
      },
      { 
        label: 'Core Architecture', 
        duration: '4 Months', 
        description: 'Pietra foundation and structural framing.',
        detailedContent: 'The "Skeleton Sprint." We execute the heavy structural elements—the stone cores and reinforced frames. This is where the physical weight of the project is established.'
      },
      { 
        label: 'The Sabbatical', 
        duration: '10 Months', 
        description: 'Interiors and Plume glazing.', 
        isSabbatical: true,
        detailedContent: 'The longest iterative phase. While you are abroad, we install high-performance glazing and custom interiors. We use "Version-Controlled Materiality" to allow for minor aesthetic shifts during the build.'
      },
      { 
        label: 'Deployment', 
        duration: '1 Month', 
        description: 'Final staging and system activation.',
        detailedContent: 'Deployment is the final "Live" launch. Every smart system is stress-tested, and the home is "staged" with your personal effects, curated art, and bespoke furniture for a perfect homecoming.'
      }
    ]
  },
  {
    id: 'com',
    title: 'Commercial',
    totalDuration: '7-9 Months',
    phases: [
      { 
        label: 'UX Design', 
        duration: '1 Month', 
        description: 'Mapping brand flow and employee journeys.',
        detailedContent: 'We apply IT-driven UX mapping to commercial space. How do employees "interface" with the environment? We optimize for productivity "sprints" and collaborative "pockets".'
      },
      { 
        label: 'Infrastructure', 
        duration: '2 Months', 
        description: 'Data-integrated structural skeletons.',
        detailedContent: 'Integration of redundant power systems, high-speed fiber, and IoT sensors into the structural fabric, ensuring the building is as intelligent as it is beautiful.'
      },
      { 
        label: 'Brand Manifest', 
        duration: '4 Months', 
        description: 'High-intensity execution of prestige finishes.', 
        isSabbatical: false,
        detailedContent: 'A dedicated deployment sprint where we execute the "Brand Skin"—bespoke stone cladding and custom lighting. For commercial assets, we utilize a non-disruptive night-shift model to ensure project velocity without operational downtime.'
      },
      { 
        label: 'System Live', 
        duration: '1 Month', 
        description: 'Operational handover and staff onboarding.',
        detailedContent: 'A managed "Onboarding" phase where we train staff on the building\'s systems and ensure a seamless "Go-Live" for the business operations.'
      }
    ]
  }
];

const TheDeparture: React.FC = () => {
  const [activeTimeline, setActiveTimeline] = useState(timelines[0]);
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayPackage | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (selectedHoliday || selectedPhase) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedHoliday, selectedPhase]);

  const handleTimelineChange = (timeline: ProjectTypeTimeline) => {
    if (timeline.id === activeTimeline.id) return;
    setIsChanging(true);
    setTimeout(() => {
      setActiveTimeline(timeline);
      setSelectedPhase(null);
      setIsChanging(false);
    }, 400);
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById('contact');
    if (element) {
      setSelectedPhase(null);
      setSelectedHoliday(null);

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
    <section id="departure" className="py-24 px-6 bg-[#1a1a1a] text-white scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        {/* Intro Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.5em] uppercase text-stone-500">The Sabbatical Program</h4>
            <h2 className="serif text-5xl md:text-7xl font-light leading-tight">
              The Grand <span className="italic">Departure</span>.
            </h2>
            <p className="text-stone-400 font-light leading-relaxed text-lg">
              We believe the stress of execution should never touch the client. When our Agile Sprints begin, we invite you to depart. Choose a sanctuary from our curated Indian heritage partners; while you find yourself, we manifest your home. 
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-px bg-stone-700 group-hover:w-20 transition-all duration-500"></div>
                <span className="text-[10px] tracking-[0.4em] uppercase text-stone-500 group-hover:text-white">Fully Funded by Pietra & Plume (Res/Reno)</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-px bg-stone-700 group-hover:w-20 transition-all duration-500"></div>
                <span className="text-[10px] tracking-[0.4em] uppercase text-stone-500 group-hover:text-white">Bespoke Concierge Service</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {holidays.map((h) => (
              <div 
                key={h.id} 
                onClick={() => setSelectedHoliday(h)}
                className="group relative h-48 overflow-hidden rounded-sm cursor-pointer border border-stone-800/50 hover:border-stone-500 transition-colors duration-500"
              >
                <img src={h.imageUrl} alt={h.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-8 flex flex-col justify-center">
                  <span className="text-[9px] tracking-widest uppercase text-stone-400 mb-1">{h.location}</span>
                  <h3 className="serif text-2xl mb-2">{h.name}</h3>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-xs text-stone-300 max-w-xs font-light">
                      Explore Sabbatical Provisions
                    </p>
                    <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Timeline Section */}
        <div className="pt-24 border-t border-stone-800">
          <div className="flex flex-col items-center text-center mb-16 space-y-8">
            <div className="space-y-2">
              <h4 className="text-xs tracking-[0.4em] uppercase text-stone-500">Agile Lifecycles</h4>
              <h2 className="serif text-4xl md:text-5xl font-light italic text-stone-100">Predictable Evolution.</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 p-1 bg-stone-900 border border-stone-800 rounded-full">
              {timelines.map((t) => (
                <button 
                  key={t.id}
                  onClick={() => handleTimelineChange(t)}
                  className={`px-8 py-3 text-[10px] tracking-[0.3em] uppercase rounded-full transition-all duration-500 ${
                    activeTimeline.id === t.id 
                    ? 'bg-white text-stone-900 shadow-[0_0_20px_rgba(255,255,255,0.15)]' 
                    : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-500 ${isChanging ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
              {activeTimeline.phases.map((phase, idx) => (
                <div 
                  key={`${activeTimeline.id}-${idx}`} 
                  onClick={() => setSelectedPhase(phase)}
                  className={`p-8 border cursor-pointer transition-all duration-700 group relative 
                    hover:-translate-y-4 hover:scale-[1.03] hover:shadow-[0_25px_60px_-15px_rgba(255,255,255,0.08)]
                    ${phase.isSabbatical ? 'bg-stone-800/30 border-white/10 hover:border-white/40 hover:bg-stone-800/50' : 'bg-transparent border-stone-800 hover:border-stone-500'} 
                    ${selectedPhase === phase ? 'ring-1 ring-white shadow-[0_0_40px_rgba(255,255,255,0.12)]' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[9px] tracking-widest uppercase text-stone-500 group-hover:text-stone-300 transition-colors">Phase {idx + 1}</span>
                      <span className="text-xs font-bold tracking-widest uppercase text-white px-2 py-1 bg-stone-700 rounded-sm group-hover:bg-stone-600 transition-colors">{phase.duration}</span>
                    </div>
                    <h3 className="serif text-xl mb-4 group-hover:italic group-hover:translate-x-1 transition-all duration-500">{phase.label}</h3>
                    <p className="text-xs text-stone-400 font-light leading-relaxed mb-6 group-hover:text-stone-300 transition-colors">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Sabbatical Dossier Modal */}
      {selectedHoliday && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <div 
            className="absolute inset-0 bg-stone-950/98 backdrop-blur-3xl animate-fade-in" 
            onClick={() => setSelectedHoliday(null)}
          ></div>
          
          <div className="relative w-full h-full max-w-7xl flex flex-col md:flex-row bg-[#111] shadow-2xl animate-scale-up border border-stone-800/50 overflow-hidden">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedHoliday(null)}
              className="absolute top-8 right-8 z-50 text-stone-500 hover:text-white transition-colors p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Column: Atmospheric Gallery */}
            <div className="w-full md:w-2/3 h-1/2 md:h-full overflow-y-auto bg-black custom-scrollbar">
              <div className="flex flex-col">
                {selectedHoliday.galleryUrls.map((url, i) => (
                  <div key={i} className="relative group overflow-hidden border-b border-stone-900">
                    <img 
                      src={url} 
                      alt={`${selectedHoliday.name} atmosphere ${i + 1}`} 
                      className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:opacity-0 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sabbatical Insights */}
            <div className="w-full md:w-1/3 h-1/2 md:h-full p-10 md:p-20 flex flex-col justify-between bg-[#111] overflow-y-auto">
              <div className="space-y-12">
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.5em] uppercase text-stone-600 block">Sabbatical Partner</span>
                  <div className="h-px w-16 bg-stone-800"></div>
                  <h2 className="serif text-5xl md:text-6xl font-light italic leading-tight text-white">
                    {selectedHoliday.name}
                  </h2>
                  <span className="text-stone-500 text-sm tracking-widest uppercase italic block">
                    {selectedHoliday.location}
                  </span>
                </div>

                <div className="space-y-8">
                  <p className="text-stone-400 font-light leading-relaxed text-lg first-letter:text-4xl first-letter:serif first-letter:text-stone-200 first-letter:float-left first-letter:mr-3">
                    {selectedHoliday.description}
                  </p>

                  <div className="pt-8 border-t border-stone-800 space-y-6">
                    <h4 className="text-[10px] tracking-[0.4em] uppercase text-white font-bold">Atmospheric Provisions</h4>
                    <ul className="space-y-4">
                      {['Guided Architectural Meditations', 'Thermal Spring Integration', 'Ancestral Culinary Arts', 'Silence Immersion'].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-xs text-stone-500 italic">
                          <div className="w-1 h-1 bg-stone-700 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col gap-4">
                <button 
                  onClick={scrollToContact}
                  className="w-full py-5 bg-white text-stone-900 text-[10px] tracking-[0.5em] uppercase hover:bg-stone-200 transition-all duration-500 shadow-xl"
                >
                  Initiate Sabbatical Build
                </button>
                <button 
                  onClick={() => setSelectedHoliday(null)}
                  className="w-full py-4 border border-stone-800 text-stone-500 text-[10px] tracking-[0.4em] uppercase hover:text-white hover:border-stone-600 transition-all duration-300"
                >
                  Return to Path
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase Details Modal */}
      {selectedPhase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <div 
            className="absolute inset-0 bg-stone-900/95 backdrop-blur-2xl animate-fade-in" 
            onClick={() => setSelectedPhase(null)}
          ></div>
          <div className="relative bg-[#1f1f1f] border border-stone-800 w-full max-w-2xl p-10 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-scale-up">
            <button 
              onClick={() => setSelectedPhase(null)}
              className="absolute top-8 right-8 text-stone-600 hover:text-white transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] tracking-[0.5em] uppercase text-stone-600">Architectural Detail</span>
                  <div className="h-px flex-1 bg-stone-800"></div>
                  <span className="text-[10px] tracking-[0.3em] uppercase bg-stone-800 px-3 py-1 rounded text-stone-400">{selectedPhase.duration}</span>
                </div>
                <h2 className="serif text-5xl md:text-6xl font-light italic text-stone-100">
                  {selectedPhase.label}
                </h2>
              </div>

              <div className="space-y-8">
                <p className="text-stone-400 text-lg font-light leading-relaxed first-letter:text-4xl first-letter:serif first-letter:float-left first-letter:mr-3 first-letter:text-white">
                  {selectedPhase.detailedContent || selectedPhase.description}
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-stone-800">
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-stone-600 block">Deliverable</span>
                    <span className="text-xs text-stone-300">High-Fidelity Project Asset</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-stone-600 block">Methodology</span>
                    <span className="text-xs text-stone-300">Agile Iterative Sprint</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={scrollToContact}
                  className="w-full py-4 bg-white text-stone-900 text-[10px] tracking-[0.4em] uppercase hover:bg-stone-200 transition-all duration-500"
                >
                  Begin the Path
                </button>
                <button 
                  onClick={() => setSelectedPhase(null)}
                  className="w-full py-4 border border-stone-800 text-[10px] tracking-[0.4em] uppercase hover:text-white hover:border-stone-500 transition-all duration-500"
                >
                  Close Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TheDeparture;