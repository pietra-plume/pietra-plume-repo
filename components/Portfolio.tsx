import React, { useState } from 'react';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "The Urban Zen Flat",
    category: "Modern Apartment",
    image: "/assets/project-urban-zen.jpg",
    description: "A 3BHK transformation for a tech executive. We utilized the 15-day sprint to completely overhaul the lighting and flooring. The agile backlog allowed us to prioritize the home office setup without delaying the living room execution.",
    tags: ["Minimalist", "15-Day Delivery", "Smart Home"]
  },
  {
    id: 2,
    title: "Heritage Havelis",
    category: "Traditional Home",
    image: "/assets/project-heritage.jpg",
    description: "Blending Rajasthani heritage with modern comfort. Pre-planning was crucial to source authentic sandstone artifacts. The family enjoyed their paid holiday in Dubai while we installed intricate woodwork.",
    tags: ["Traditional", "Craftsmanship", "Holiday Perk"]
  },
  {
    id: 3,
    title: "Vertex Co-Working",
    category: "Commercial Space",
    image: "/assets/project-vertex.jpg",
    description: "A high-velocity revamp for a startup hub. Agile iterations allowed us to adjust the breakout zones based on employee feedback during the design sprint (Day 3-5).",
    tags: ["Commercial", "Agile Workspace", "High Energy"]
  },
   {
    id: 4,
    title: "Scandinavian Blue",
    category: "Master Bedroom",
    image: "/assets/project-scandi.jpg",
    description: "Focusing on serenity and light. The 'Definition of Done' included custom fitted wardrobes and blackout automation. Delivered exactly at 5 PM on Day 15.",
    tags: ["Nordic", "Serene", "Bedroom"]
  },
   {
    id: 5,
    title: "The Chef's Canvas",
    category: "Modular Kitchen",
    image: "/assets/project-kitchen.jpg",
    description: "A gourmet kitchen executed with military precision. Stone countertops were pre-cut offsite to ensure zero dust during the final installation phase.",
    tags: ["Kitchen", "Gourmet", "Precision"]
  }
];

export const Portfolio: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">Our Work</span>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Portfolio of Possibilities</h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Real homes. Real deadlines. 15 days of focused execution. 
            Browse our recent sprints delivered with corporate precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="group bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold tracking-widest uppercase text-stone-900">
                  {project.category}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-1 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                  <div className="flex items-center text-amber-600 text-xs font-bold uppercase tracking-wider gap-1">
                    <Clock size={14} />
                    <span>15 Days</span>
                  </div>
                   <div className="flex items-center text-stone-400 group-hover:text-stone-900 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider mr-2">View Case</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Call to Action Card */}
           <div className="bg-stone-900 text-white rounded-sm shadow-xl p-8 flex flex-col justify-center items-center text-center group border border-stone-800">
              <h3 className="text-2xl font-serif mb-4">Your Home Could Be Next</h3>
              <p className="text-stone-400 mb-8 text-sm leading-relaxed">
                Imagine walking into your transformed home in just 15 days from now. 
                The Art of Possible is just a consultation away.
              </p>
              <button className="px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300 text-sm font-bold tracking-widest uppercase rounded-sm">
                Start Your Project
              </button>
           </div>
        </div>
      </div>
    </section>
  );
};