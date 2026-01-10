import React from 'react';

interface BrandLogoProps {
  variant?: 'vertical' | 'horizontal';
  colorMode?: 'dark' | 'light'; // dark = dark elements for light bg; light = white elements for dark bg
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'horizontal', colorMode = 'dark', className = '' }) => {
  const mainColor = colorMode === 'dark' ? '#1c1917' : '#ffffff'; // stone-900 or white
  const featherColor = '#d97706'; // amber-600

  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Arch (Inverted U) */}
            <path 
                d="M25 100 V45 C25 31.19 36.19 20 50 20 C63.81 20 75 31.19 75 45 V100" 
                stroke={mainColor} 
                strokeWidth="16" 
                strokeLinecap="butt" 
            />
            
            {/* Feather - Artistic approximation */}
            <path 
                d="M50 95 C50 95 65 75 68 50 C70 35 60 25 50 25 C40 25 30 35 32 50 C35 75 50 95 50 95 Z" 
                fill={featherColor}
                opacity="0.9"
            />
            {/* Feather Spine */}
            <path d="M50 25 Q 48 60 50 95" stroke="white" strokeWidth="1" strokeOpacity="0.8" />
            {/* Feather details */}
            <path d="M50 40 L62 48" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
            <path d="M50 55 L64 62" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
            <path d="M50 70 L60 76" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
            
            <path d="M50 45 L36 52" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
            <path d="M50 60 L34 68" stroke="white" strokeWidth="0.5" strokeOpacity="0.6" />
        </svg>
      </div>

      {/* Text */}
      <div className={`flex flex-col ${variant === 'vertical' ? 'items-center text-center' : 'items-start'}`}>
          <span className={`font-serif font-bold leading-none tracking-wide text-xl whitespace-nowrap`} style={{ color: mainColor }}>
              Pietra &amp; Plume
          </span>
          <span className="font-sans font-bold uppercase tracking-[0.2em] text-[0.5rem] text-amber-600 mt-0.5">
              The Art of Possible
          </span>
      </div>
    </div>
  );
};
