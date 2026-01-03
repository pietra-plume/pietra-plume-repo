import React from 'react';
import { Zap, GitBranch, Users } from 'lucide-react';

export const WhyAgile: React.FC = () => {
  return (
    <section className="py-20 bg-stone-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">The Methodology</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Why Agile?</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Traditional interior design is often chaotic and delayed. We treat your home renovation like a high-stakes engineering project, delivering predictability and peace of mind.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-stone-200 rounded-sm hover:border-amber-400 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
                    <Zap size={28} />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-3">Unmatched Speed</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                    By working in sprints, we eliminate downtime. 15 days isn't an estimate; it's a calculated commitment backed by strict project velocity metrics. No waiting for vendors, just execution.
                </p>
            </div>

            <div className="bg-white p-8 border border-stone-200 rounded-sm hover:border-amber-400 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
                    <GitBranch size={28} />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-3">Radical Flexibility</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                    We iterate relentlessly. You see the design evolve in the 'Pre-Planning' sprint. Changes are welcomed early when they are cheap, not later when the walls are already up.
                </p>
            </div>

            <div className="bg-white p-8 border border-stone-200 rounded-sm hover:border-amber-400 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
                    <Users size={28} />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-3">Client Involvement</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                    You are the Product Owner. You approve the backlog. You define 'Done'. Full transparency means you're never guessing about budget or timeline. We build <i>with</i> you.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};