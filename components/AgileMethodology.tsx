import React, { useState, useEffect } from 'react';
import { API_VERSION } from '../constants';

const AgileMethodology: React.FC = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/content?v=${API_VERSION}`)
      .then(res => res.json())
      .then(data => setContent(data.agile))
      .catch(err => console.error('Failed to fetch agile content', err));
  }, []);

  if (!content) return null;

  return (
    <section id="path" className="py-24 px-6 bg-white border-t border-stone-100 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.5em] uppercase text-stone-400">{content.subHeading}</h4>
            <h2 className="serif text-5xl font-light leading-tight">
              {content.mainHeading}
            </h2>
            <p className="text-stone-500 font-light leading-relaxed">
              {content.description}
            </p>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-x-12 gap-y-16">
            {content.principles.map((p: any) => (
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