import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Instagram, Facebook, Linkedin, LogIn, Activity, Sparkles, ChevronRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onBook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBook }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScrollListener = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScrollListener);
    return () => window.removeEventListener('scroll', handleScrollListener);
  }, []);

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'process', label: 'Process' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'studio', label: 'Studio' },
    { id: 'veo-studio', label: 'Video' },
    { id: 'planner', label: 'Planner' },
    { id: 'holiday', label: 'Holiday' },
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 relative z-50">
               <BrandLogo 
                  colorMode={scrolled || isMenuOpen ? 'dark' : 'light'} 
                  variant="horizontal" 
               />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={(e) => handleScroll(e, link.id)}
                  className={`transition-colors text-xs font-bold tracking-widest uppercase ${
                    scrolled ? 'text-stone-600 hover:text-amber-600' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <button 
                onClick={onBook}
                className="bg-stone-900 text-white px-5 py-2.5 rounded-sm hover:bg-amber-600 transition-colors duration-300 flex items-center gap-2 text-xs font-bold tracking-widest uppercase shadow-lg shadow-stone-900/10"
              >
                <Phone size={14} />
                <span>Consult</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center z-50">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`transition-colors ${isMenuOpen || scrolled ? 'text-stone-900' : 'text-white'}`}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-stone-50 transform transition-transform duration-500 ease-in-out md:hidden flex flex-col ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 flex flex-col pt-24 px-6 overflow-y-auto">
            {/* Quick Actions - Client Zone */}
            <div className="mb-8 p-4 bg-stone-100 rounded border border-stone-200">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity size={14} /> Client Zone
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center bg-white p-3 rounded shadow-sm border border-stone-100 active:bg-amber-50">
                        <Activity size={20} className="text-amber-600 mb-1" />
                        <span className="text-[10px] font-bold uppercase text-stone-700">Track Order</span>
                    </button>
                    <button className="flex flex-col items-center justify-center bg-white p-3 rounded shadow-sm border border-stone-100 active:bg-amber-50">
                        <LogIn size={20} className="text-stone-600 mb-1" />
                        <span className="text-[10px] font-bold uppercase text-stone-700">Client Login</span>
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="space-y-6 mb-10">
                {navLinks.map((link) => (
                    <a 
                        key={link.id}
                        href={`#${link.id}`}
                        onClick={(e) => handleScroll(e, link.id)}
                        className="flex items-center justify-between text-2xl font-serif text-stone-900 border-b border-stone-200 pb-2 active:text-amber-600 group"
                    >
                        <span>{link.label}</span>
                        <ChevronRight className="text-stone-300 group-active:text-amber-600" size={20} />
                    </a>
                ))}
            </div>

            {/* Daily Inspiration */}
            <div className="mb-8 relative overflow-hidden rounded-lg bg-stone-900 text-white p-6">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={60} />
                </div>
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Daily Muse</h4>
                <p className="font-serif italic text-lg leading-relaxed mb-4">
                    "Simplicity is the ultimate sophistication."
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">— Leonardo da Vinci</p>
            </div>

            {/* Footer Actions */}
            <div className="mt-auto pb-8">
                <button 
                    onClick={() => {
                        setIsMenuOpen(false);
                        onBook();
                    }}
                    className="w-full py-4 bg-amber-600 text-white text-sm font-bold tracking-widest uppercase rounded-sm shadow-xl mb-6 flex items-center justify-center gap-2 active:bg-amber-700"
                >
                    <Phone size={16} /> Book Consultation
                </button>

                <div className="flex justify-center space-x-8 text-stone-400">
                    <a href="#" className="hover:text-amber-600 transition-colors"><Instagram size={24} /></a>
                    <a href="#" className="hover:text-amber-600 transition-colors"><Facebook size={24} /></a>
                    <a href="#" className="hover:text-amber-600 transition-colors"><Linkedin size={24} /></a>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};