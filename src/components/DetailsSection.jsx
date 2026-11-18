import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ShieldCheck, Gem, Award, ArrowDown } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

const HIGHLIGHTS = [
  {
    title: 'Heritage Craftsmanship',
    desc: 'Every piece is meticulously finished by master artisans with micrometer precision, ensuring timeless durability and fluid drape.',
  },
  {
    title: 'Authentic Precious Metals',
    desc: '22K yellow gold, 18K rose gold, and pure 950 cold-forged platinum hallmarked to international purity standards.',
  },
  {
    title: 'Conflict-Free Diamonds',
    desc: 'Hand-selected natural diamonds accompanied by GIA dossiers, strictly adhering to the Kimberley Process certification.',
  },
  {
    title: 'Bespoke Atelier Service',
    desc: 'Custom ring sizing, tailored gemstone curation, personalized engravings, and one-of-a-kind bespoke commissions.',
  },
];

export default function DetailsSection({
  isDark = false,
  onScrollToAuth,
}) {
  const detailsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: detailsRef,
    offset: ['start end', 'end start'],
  });

  // Smooth entrance as section comes into view, and clean exit as it scrolls towards Maison Vault
  const contentOpacity = useTransform(scrollYProgress, [0.12, 0.35, 0.75, 0.95], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0.12, 0.35, 0.75, 0.95], [35, 0, 0, -30]);

  const headingColor = isDark ? 'text-[#FAF6F0]' : 'text-[#3E1821]';
  const subtextColor = isDark ? 'text-[#FAF6F0]/85' : 'text-[#3E1821]/80';
  const cardBg = isDark
    ? 'bg-black/25 border-white/20 backdrop-blur-xl shadow-lg'
    : 'bg-white/70 border-[#3E1821]/15 backdrop-blur-xl shadow-sm';

  return (
    <section 
      ref={detailsRef}
      id="details-section"
      className="relative min-h-screen min-h-[100dvh] w-full flex items-center justify-center py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 transition-colors duration-700 pointer-events-auto overflow-hidden"
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 2xl:gap-16 items-center">
        
        {/* Left Column: Heading, Description & 4 Feature Cards (Positioned on the Left Side) */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="w-full lg:col-span-7 xl:col-span-7 2xl:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-8 lg:space-y-10"
        >
          
          {/* Section Header */}
          <div className="space-y-3 sm:space-y-4 max-w-xl 2xl:max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-current/15 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-semibold opacity-80">
                Maison Heritage
              </span>
            </div>

            <h2 className={`font-serif-luxury text-heading-fluid tracking-tight uppercase leading-[1.05] ${headingColor}`}>
              THE ARTISTRY OF <br className="hidden sm:inline" />DIKSHI
            </h2>

            <p className={`font-sans-luxury text-xs sm:text-sm md:text-base 2xl:text-lg leading-relaxed max-w-lg 2xl:max-w-xl ${subtextColor}`}>
              Discover the timeless beauty of signature rings, where exceptional craftsmanship meets pure geometric design. Every diamond solitaire, crown entourage, and dual-metal band in the DIKSHI collection reflects devotion to perfection and enduring luxury.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 2xl:gap-5 w-full max-w-xl 2xl:max-w-2xl">
            {HIGHLIGHTS.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 lg:p-6 2xl:p-7 rounded-2xl border backdrop-blur-xl space-y-1.5 transition-transform duration-300 hover:scale-[1.01] ${cardBg}`}
              >
                <div className="flex items-center gap-2 text-amber-500">
                  <span className="text-xs">✦</span>
                  <h3 className={`font-serif-luxury text-sm sm:text-base lg:text-lg font-medium ${headingColor}`}>
                    {item.title}
                  </h3>
                </div>
                <p className={`text-[11px] sm:text-xs 2xl:text-sm leading-relaxed opacity-85 ${subtextColor}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="pt-2">
            <button
              onClick={() => {
                luxuryAudio.playClick();
                onScrollToAuth();
              }}
              className="group inline-flex items-center gap-2.5 select-none opacity-75 hover:opacity-100 transition-opacity py-2"
            >
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium">
                Continue to Maison Vault
              </span>
              <ArrowDown className="w-4 h-4 animate-bounce text-amber-500" />
            </button>
          </div>

        </motion.div>

        {/* Right Column: Reserved space on Desktop where the 3D Ring is positioned on the Right */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5 2xl:col-span-5 pointer-events-none min-h-[420px] 2xl:min-h-[520px]" />

      </div>
    </section>
  );
}
