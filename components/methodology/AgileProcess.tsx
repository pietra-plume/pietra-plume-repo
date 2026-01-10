import React from 'react';
import { Target, PenTool, Hammer, CheckCircle } from 'lucide-react';

export const AgileProcess: React.FC = () => {
  const steps = [
    {
      icon: <Target size={32} />,
      title: "Sprint 1: Pre-Planning",
      desc: "Day 1-3: We capture requirements using our Agile backlog system. Every corner is defined, budget locked, and materials sourced before we touch a hammer."
    },
    {
      icon: <PenTool size={32} />,
      title: "Sprint 2: Iterative Design",
      desc: "Day 4-5: You see 3D visualizations. We iterate rapidly based on your feedback. Changes are welcomed here, not later. We sign off on the 'Definition of Done'."
    },
    {
      icon: <Hammer size={32} />,
      title: "Sprint 3: Execution",
      desc: "Day 6-15: The 'Development' phase. Our corporate squads work in parallel shifts. This is when you fly out for your holiday."
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Handover",
      desc: "Day 15: You return to a clean, transformed home. A final walkthrough ensures everything meets the acceptance criteria."
    }
  ];

  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">The Agile Renovation Methodology</h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-stone-600 max-w-2xl mx-auto">
            We've adapted the software world's most efficient delivery model to interior design. 
            No delays, no surprises, just pure execution velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group relative p-8 bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 rounded-sm">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-6xl text-amber-900 group-hover:opacity-20 transition-opacity">
                0{index + 1}
              </div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};