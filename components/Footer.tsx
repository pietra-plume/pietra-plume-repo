import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f8f7f4] py-24 px-6 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          <div className="col-span-2 space-y-8">
            <div className="flex flex-col">
              <span className="serif text-3xl tracking-[0.2em] font-light">PIETRA & PLUME</span>
              <span className="text-[10px] tracking-[0.4em] uppercase opacity-60">Architectural Alchemy</span>
            </div>
            <p className="max-w-sm text-stone-500 font-light leading-relaxed">
              Designing environments that endure through the philosophy of the solid and the spirit.
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