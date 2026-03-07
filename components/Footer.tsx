import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    contact_tag: 'Restricted Access',
    contact_heading: 'Begin Your Odyssey',
    contact_body: 'Whether you seek to anchor a legacy or breathe life into a new vision, our sanctum is open for consultation.',
    contact_email: 'sanctum@pietraplume.com',
    contact_phone: '+39 02 123 4567',
    contact_address: 'Via del Marmo 12, Milan, Italy'
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

  return (
    <footer id="contact" className="bg-[#f8f7f4] py-24 px-6 border-t border-stone-200 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          <div className="col-span-2 space-y-8">
            <div className="flex flex-col">
              <span className="serif text-3xl tracking-[0.2em] font-light">{settings.footer_logo_text || 'PIETRA & PLUME'}</span>
              <span className="text-[10px] tracking-[0.4em] uppercase opacity-60">{settings.footer_logo_subtext || 'Architectural Alchemy'}</span>
            </div>
            <p className="max-w-sm text-stone-500 font-light leading-relaxed">
              {settings.footer_body || 'Designing environments that endure through the philosophy of the solid and the spirit.'}
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs tracking-widest uppercase font-semibold">Social</h4>
            <div className="flex flex-col space-y-2 text-stone-500 font-light text-sm">
              <a 
                href="https://www.instagram.com/pietraplume" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-stone-900 transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://www.pinterest.com/pietraplume" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-stone-900 transition-colors"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-widest uppercase text-stone-400">
            © 2026 Pietra & Plume. All rights reserved.
          </p>
          <div className="flex gap-12 text-[10px] tracking-widest uppercase text-stone-400">
            <a href="#" className="hover:text-stone-900">Privacy Policy</a>
            <a href="#" className="hover:text-stone-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;