import React from 'react';
import { Moon, Sun, Info } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

export default function Navbar({
  isDark,
  setIsDark,
  onOpenKnowMore,
}) {
  const handleThemeToggle = () => {
    luxuryAudio.playClick();
    setIsDark(!isDark);
  };

  const textColor = isDark ? 'text-[#FAF6F0]' : 'text-[#3E1821]';
  const subtextColor = isDark ? 'text-[#FAF6F0]/85' : 'text-[#3E1821]/85';
  const iconBorderColor = isDark
    ? 'border-white/25 hover:border-white/60 bg-white/10 text-[#FAF6F0]'
    : 'border-[#3E1821]/20 hover:border-[#3E1821]/50 bg-[#3E1821]/5 text-[#3E1821]';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-16 2xl:px-24 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-3 sm:py-5 lg:py-7 transition-colors duration-500 pointer-events-none">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Brand Logo - DIKSHI JEWELLERY with Tagline */}
        <a 
          href="#hero" 
          onClick={() => luxuryAudio.playClick()}
          className="group flex flex-col items-center justify-center text-center select-none transition-transform duration-300 hover:scale-[1.01]"
        >
          <span className={`font-serif-luxury text-sm xs:text-base sm:text-2xl md:text-3xl tracking-[0.16em] sm:tracking-[0.2em] uppercase font-semibold whitespace-nowrap ${textColor}`}>
            DIKSHI JEWELLERY
          </span>
          <span className="font-sans-luxury text-[7.5px] xs:text-[8px] sm:text-[10px] md:text-[11px] font-light tracking-[0.24em] sm:tracking-[0.32em] uppercase text-[#D6C298] mt-0.5 sm:mt-1 whitespace-nowrap">
            ELEGANCE • TIMELESS BEAUTY
          </span>
        </a>

        {/* Right Navigation & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 lg:gap-8">
          
          {/* Know More link */}
          <button
            onClick={() => {
              luxuryAudio.playClick();
              onOpenKnowMore();
            }}
            className={`hidden md:inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 relative group py-1.5 ${textColor}`}
          >
            <span>Know more</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-80 group-hover:scale-150 transition-transform duration-300" />
            <span className={`absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isDark ? 'bg-[#FAF6F0]' : 'bg-[#3E1821]'}`} />
          </button>

          {/* Theme Mode Toggle (Imperial Ruby Red vs Rose Luxury Blush Pink) */}
          <button
            onClick={handleThemeToggle}
            aria-label={isDark ? 'Switch to Rose Luxury Blush Pink' : 'Switch to Imperial Ruby Red'}
            title={isDark ? 'Switch to Rose Luxury Blush Pink' : 'Switch to Imperial Ruby Red'}
            className={`w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md ${iconBorderColor} ${textColor} hover:scale-105 active:scale-95`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform duration-500" />
            ) : (
              <Moon className="w-4 h-4 text-[#3E1821] opacity-75 hover:-rotate-12 transition-transform duration-500" />
            )}
          </button>

          {/* Mobile Know More Trigger */}
          <button
            onClick={() => {
              luxuryAudio.playClick();
              onOpenKnowMore();
            }}
            aria-label="View jewellery details"
            className={`md:hidden w-9 h-9 min-w-[36px] min-h-[36px] rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md ${iconBorderColor} ${textColor} active:scale-95`}
          >
            <Info className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
