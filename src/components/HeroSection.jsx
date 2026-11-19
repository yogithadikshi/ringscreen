import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

export default function HeroSection({
  isDark = false,
  onExploreClick,
}) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Graceful scroll fade-out: disappears smoothly before it ever reaches the top header
  const contentOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.38], [0, -35]);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const headingColor = isDark ? 'text-[#FAF6F0]' : 'text-[#3E1821]';
  const paragraphColor = isDark ? 'text-[#FAF6F0]/90' : 'text-[#3E1821]/85';

  return (
    <section 
      ref={heroRef}
      id="hero"
      className="relative min-h-screen min-h-[100dvh] w-full flex items-center justify-center px-3 xs:px-5 sm:px-8 lg:px-16 2xl:px-24 4xl:px-32 pt-[max(3.5rem,env(safe-area-inset-top,0px))] pb-[max(2rem,env(safe-area-inset-bottom,0px))] overflow-hidden pointer-events-none"
    >
      <div className="relative z-10 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4xl:max-w-[2400px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-12 items-center justify-start lg:justify-center min-h-[calc(100dvh-80px)] lg:min-h-[calc(100dvh-120px)]">
        
        {/* On Mobile & Tablet Portrait: Reserved space in the upper viewport matching the 3D Ring camera framing */}
        <div className="w-full h-[48vh] xs:h-[50vh] sm:h-[50vh] max-h-[460px] lg:hidden landscape:hidden flex-shrink-0 pointer-events-none" />

        {/* On Desktop & Ultrawide: Left Column spacer where the 3D Ring is positioned on the left */}
        <div className="hidden lg:block landscape:block lg:col-span-6 xl:col-span-6 2xl:col-span-6 pointer-events-none" />

        {/* Typography Column: Editorial Haute Joaillerie text */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="w-full lg:col-span-6 xl:col-span-6 2xl:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2.5 xs:space-y-3 sm:space-y-4 lg:space-y-7 3xl:space-y-9 pl-0 lg:pl-6 xl:pl-10 2xl:pl-14 3xl:pl-20 pointer-events-auto pb-4 lg:pb-0"
        >
          
          {/* Main Title: UNIQUE JEWELLERY */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col select-none"
          >
            <h1 className={`font-serif-luxury text-hero-fluid tracking-tight leading-[0.9] uppercase font-normal ${headingColor}`}>
              <span className="block hover:tracking-normal transition-all duration-500">UNIQUE</span>
              <span className="block mt-1 sm:mt-2 italic font-light hover:tracking-normal transition-all duration-500">JEWELLERY</span>
            </h1>
          </motion.div>

          {/* Subtitle / Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`font-sans-luxury text-xs xs:text-sm sm:text-base md:text-lg 2xl:text-xl 3xl:text-2xl max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg 2xl:max-w-xl 3xl:max-w-2xl font-normal leading-relaxed tracking-wide ${paragraphColor}`}
          >
            Customize your unique ring with graphic angles and pure lines that combine to create the pure beauty of the collection.
          </motion.p>
        </motion.div>

      </div>

      {/* Bottom Center: Scroll Prompt Indicator */}
      <motion.div
        style={{ opacity: promptOpacity }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-2 xs:bottom-2.5 sm:bottom-6 lg:bottom-8 3xl:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer group select-none pointer-events-auto"
        onClick={() => {
          luxuryAudio.playClick();
          onExploreClick();
        }}
      >
        <span className={`text-[8.5px] xs:text-[9.5px] sm:text-[11px] 3xl:text-xs uppercase tracking-[0.25em] transition-opacity duration-300 group-hover:opacity-100 opacity-60 ${paragraphColor}`}>
          Start scrolling to explore
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className={`w-3.5 h-3.5 stroke-[1.5] opacity-60 group-hover:opacity-100 ${paragraphColor}`} />
        </motion.div>
      </motion.div>

    </section>
  );
}
