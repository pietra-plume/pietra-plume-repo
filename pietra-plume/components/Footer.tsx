import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <div className="mb-6">
                <BrandLogo colorMode="light" variant="horizontal" />
            </div>
            <p className="text-stone-400 max-w-sm leading-relaxed mb-6">
              Redefining interior design with Agile precision. 15 days from start to finish, guaranteed. The Art of Possible starts here.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6 text-amber-500">Quick Links</h4>
            <ul className="space-y-3 text-stone-400 text-sm">
              <li><a href="#process" className="hover:text-white transition-colors">Our Process</a></li>
              <li><a href="#studio" className="hover:text-white transition-colors">Design Studio</a></li>
              <li><a href="#holiday" className="hover:text-white transition-colors">Holiday Packages</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corporate Portfolio</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6 text-amber-500">Contact</h4>
            <ul className="space-y-3 text-stone-400 text-sm">
              <li>Mumbai • Bangalore • Delhi</li>
              <li>+91 98765 43210</li>
              <li>contactus@pietraplume.com</li>
              <li className="pt-4 text-xs text-stone-600">
                101, Corporate Park, Bandra Kurla Complex, Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Pietra Plume. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-stone-300">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};