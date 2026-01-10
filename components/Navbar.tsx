import React, { useState, useEffect, useCallback } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Abstraction of the smooth scroll logic to ensure consistent behavior 
   * across all navigation links with a fixed header offset.
   */
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close mobile menu if open
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerOffset = 80; // Adjusted for the scrolled navbar height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without causing a page jump
      window.history.pushState(null, '', `#${targetId}`);
    } else {
      console.warn(`Navigation target #${targetId} not found.`);
    }
  }, []);

  const navLinks = [
    { label: 'About Us', id: 'about-us' },
    { label: 'Methodology', id: 'philosophy' },
    { label: 'The Path', id: 'path' },
    { label: 'The Departure', id: 'departure' },
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
    // Oracle link removed as requested
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-stone-100' : 'bg-transparent py-8 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Brand Logo */}
          <div 
            className="flex flex-col items-center cursor-pointer group relative z-50" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className={`serif text-2xl tracking-[0.2em] font-light group-hover:opacity-70 transition-all ${isMenuOpen || isScrolled ? 'text-stone-900' : 'text-white'}`}>
              PIETRA & PLUME
            </span>
            <span className={`text-[9px] tracking-[0.35em] uppercase opacity-60 text-center ${isMenuOpen || isScrolled ? 'text-stone-600' : 'text-stone-200'}`}>
              The art of possible
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className={`flex space-x-6 text-[10px] tracking-widest uppercase font-light ${isScrolled ? 'text-stone-700' : 'text-white'}`}>
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="relative py-1 group overflow-hidden"
                >
                  <span className="relative z-10 hover:text-stone-400 transition-colors duration-300">
                    {link.label}
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-px ${isScrolled ? 'bg-stone-800' : 'bg-white'} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></span>
                </a>
              ))}
            </div>

            <button 
              onClick={(e) => {
                const contact = document.getElementById('contact');
                if (contact) {
                  const offset = 80;
                  const pos = contact.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top: pos, behavior: 'smooth' });
                }
              }}
              className={`ml-4 border px-6 py-2 text-xs tracking-widest uppercase transition-all duration-500 font-medium ${
                isScrolled 
                ? 'border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white' 
                : 'border-white text-white hover:bg-white hover:text-stone-900'
              }`}
            >
              Enquire
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden relative z-50">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${isScrolled || isMenuOpen ? 'text-stone-800' : 'text-white'} p-2 transition-colors duration-300`}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#fdfcfb] z-40 transition-transform duration-500 ease-in-out lg:hidden flex flex-col justify-center items-center ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col space-y-8 text-center">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={(e) => handleNavClick(e, link.id)}
              className="serif text-3xl text-stone-800 hover:text-stone-500 hover:italic transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
          <button 
            onClick={(e) => {
              setIsMenuOpen(false);
              const contact = document.getElementById('contact');
              if (contact) {
                const offset = 80;
                const pos = contact.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
              }
            }}
            className="mt-8 border border-stone-800 text-stone-800 px-8 py-3 text-xs tracking-[0.3em] uppercase hover:bg-stone-800 hover:text-white transition-all duration-300"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;