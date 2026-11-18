import React from 'react';
import { luxuryAudio } from '../utils/audio';

const SECTIONS = [
  { id: 'hero', label: 'Unique Jewelry' },
  { id: 'details-section', label: 'Maison Artistry' },
  { id: 'auth-section', label: 'VIP Vault Sign In' },
];

export default function SidePagination({ activeSection = 'hero', isDark = false }) {
  const scrollTo = (id) => {
    luxuryAudio.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-4 sm:right-6 lg:right-8 2xl:right-12 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4">
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            aria-label={`Navigate to ${sec.label}`}
            className="group relative flex items-center justify-end p-2 min-w-[36px] min-h-[36px] focus:outline-none"
          >
            {/* Tooltip on hover */}
            <span className="absolute right-8 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 backdrop-blur-md bg-black/80 text-[#FAF6F0] border border-white/20">
              {sec.label}
            </span>

            {/* Dot Indicator */}
            <span
              className={`block rounded-full transition-all duration-500 ${
                isActive
                  ? isDark
                    ? 'w-2.5 h-6 bg-[#FAF6F0] shadow-md'
                    : 'w-2.5 h-6 bg-[#3E1821] shadow-md'
                  : isDark
                    ? 'w-2 h-2 bg-[#FAF6F0]/35 group-hover:bg-[#FAF6F0]/80'
                    : 'w-2 h-2 bg-[#3E1821]/35 group-hover:bg-[#3E1821]/80'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
