import React, { useState, useEffect } from 'react';

const AgileMethodology: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    methodology_tag: 'The Plume Path',
    methodology_heading: 'Architectural Agility.',
    methodology_body: 'We have abandoned the rigid silos of traditional architecture. By adhering to modern IT delivery principles, we provide a delivery model where the blueprint is a living document, and the client is a co-developer.'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings((prev: any) => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  const principles = [
    {
      step: "01",
      title: settings.meth_p1_title || "Discovery Sprints",
      description: settings.meth_p1_desc || "We treat your vision as a set of dynamic 'User Stories'. Instead of rigid static briefs, we define the core experience and iterate on the volume through rapid conceptual prototyping."
    },
    {
      step: "02",
      title: settings.meth_p2_title || "Iterative Manifestation",
      description: settings.meth_p2_desc || "Borrowing from the CI/CD pipeline of high-performance software, we deliver architectural 'builds' in phases. This allows for evolving material choices and light-path adjustments as the space takes shape."
    },
    {
      step: "03",
      title: settings.meth_p3_title || "Refactorable Design",
      description: settings.meth_p3_desc || "We welcome changes late in the process. By utilizing modular IT-driven principles in our structural engineering, our blueprints remain flexible—responding to new insights rather than resisting them."
    },
    {
      step: "04",
      title: settings.meth_p4_title || "Responsive Environment",
      description: settings.meth_p4_desc || "The final deployment isn't the end. We view architecture as a living system that optimizes itself through usage data and human feedback loops, ensuring a permanent state of refinement."
    }
  ];

  return (
    <section id="path" className="py-24 px-6 bg-white border-t border-stone-100 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.5em] uppercase text-stone-400">{settings.methodology_tag}</h4>
            <h2 className="serif text-5xl font-light leading-tight">
              {settings.methodology_heading}
            </h2>
            <p className="text-stone-500 font-light leading-relaxed">
              {settings.methodology_body}
            </p>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-x-12 gap-y-16">
            {principles.map((p) => (
              <div key={p.step} className="group space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="serif text-4xl text-stone-200 group-hover:text-stone-800 transition-colors duration-500">
                    {p.step}
                  </span>
                  <h3 className="text-sm tracking-[0.2em] uppercase font-semibold text-stone-800">
                    {p.title}
                  </h3>
                </div>
                <p className="text-sm text-stone-500 font-light leading-relaxed pl-10 border-l border-stone-100 group-hover:border-stone-800 transition-all duration-700">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgileMethodology;