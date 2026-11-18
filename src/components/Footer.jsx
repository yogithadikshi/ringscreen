import React from 'react';
import { ArrowUp, Sparkles, Shield, HeartHandshake } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

export default function Footer({ isDark = false }) {
  const scrollToTop = () => {
    luxuryAudio.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headingColor = isDark ? 'text-[#FAF6F0]' : 'text-[#3E1821]';
  const subtextColor = isDark ? 'text-[#FAF6F0]/85' : 'text-[#3E1821]/80';

  return (
    <footer 
      id="footer-section" 
      className="relative w-full px-4 sm:px-8 lg:px-16 2xl:px-24 pt-16 sm:pt-20 pb-[max(3rem,env(safe-area-inset-bottom,0px))] transition-colors duration-700 overflow-hidden"
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto flex flex-col items-center text-center space-y-10 sm:space-y-12">

        {/* Brand Signoff - DIKSHI JEWELLERY with Tagline */}
        <div className="select-none py-4 sm:py-8 flex flex-col items-center justify-center text-center">
          <h2 className={`font-serif-luxury text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.16em] sm:tracking-[0.22em] uppercase leading-tight transition-colors duration-500 ${headingColor}`}>
            DIKSHI JEWELLERY
          </h2>
          <span className="font-sans-luxury text-[8.5px] xs:text-[9.5px] sm:text-xs md:text-sm font-light tracking-[0.26em] sm:tracking-[0.36em] uppercase text-[#D6C298] mt-2 sm:mt-3 whitespace-nowrap">
            ELEGANCE • TIMELESS BEAUTY
          </span>
        </div>

        {/* Guarantees Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-14 text-[11px] sm:text-xs tracking-wider">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className={`font-medium ${subtextColor}`}>Lifetime Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className={`font-medium ${subtextColor}`}>Complimentary Global Insured Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className={`font-medium ${subtextColor}`}>100% Conflict-Free Kimberley Certified</span>
          </div>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm ${
            isDark 
              ? 'border-white/20 text-[#FAF6F0] hover:border-white/50 bg-white/5' 
              : 'border-[#3E1821]/30 text-[#3E1821] hover:border-[#3E1821] hover:bg-[#3E1821] hover:text-[#FAF6F0] bg-white/70'
          }`}
        >
          <ArrowUp className="w-4 h-4 stroke-[1.5]" />
        </button>

      </div>
    </footer>
  );
}
