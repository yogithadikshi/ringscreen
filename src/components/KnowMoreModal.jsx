import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Gem, ShieldCheck, Layers, Heart } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

export default function KnowMoreModal({ isOpen, onClose, isDark = false }) {
  if (!isOpen) return null;

  const bgStyle = 'bg-[#701322]/98 text-[#FAF6F0] border-white/20 shadow-2xl';
  const cardBg = 'bg-white/10 border-white/15 text-[#FAF6F0]';

  const collections = [
    { title: 'Gold Jewellery', desc: 'Traditional and contemporary designs' },
    { title: 'Diamond Jewellery', desc: 'Elegant diamond collections' },
    { title: 'Platinum Jewellery', desc: 'Modern and timeless styles' },
    { title: 'Silver Jewellery', desc: 'Beautiful everyday essentials' },
    { title: 'Bridal Jewellery', desc: 'Exquisite wedding collections' },
    { title: 'Gemstone Jewellery', desc: 'Colourful and distinctive designs' },
    { title: 'Daily Wear Jewellery', desc: 'Minimal and elegant designs' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-4 sm:p-6 md:p-10">
        
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            luxuryAudio.playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl max-h-[90vh] max-h-[90dvh] overflow-y-auto rounded-3xl border shadow-2xl p-4 xs:p-6 sm:p-8 md:p-10 backdrop-blur-2xl z-10 ${bgStyle}`}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              luxuryAudio.playClick();
              onClose();
            }}
            aria-label="Close dialog"
            className="absolute top-3 xs:top-4 sm:top-6 right-3 xs:right-4 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border border-current/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-2 mb-6 sm:mb-8 pr-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] xs:text-[11px] uppercase tracking-[0.25em] font-semibold opacity-75">
                Dikshi Jewellery Maison
              </span>
            </div>
            <h2 className="font-serif-luxury text-xl xs:text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl font-normal uppercase tracking-tight">
              The Artistry of Dikshi Jewellery
            </h2>
          </div>

          {/* Content Body */}
          <div className="space-y-4 sm:space-y-6 text-xs xs:text-sm sm:text-base leading-relaxed font-sans-luxury opacity-90">
            
            {/* Introductory Text */}
            <p>
              Discover the timeless beauty of fine jewellery, where exceptional craftsmanship meets elegant design. From traditional gold ornaments to contemporary diamond creations, every piece in the <strong>DIKSHI Jewellery</strong> collection reflects sophistication, quality and attention to detail.
            </p>

            <p>
              Explore an exquisite range of gold, diamond, platinum, silver and gemstone jewellery, thoughtfully crafted for celebrations, special occasions and everyday elegance.
            </p>

            {/* Premium Craftsmanship & Authentic Materials Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
                <div className="flex items-center gap-2 text-amber-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    ✧ Premium Craftsmanship
                  </span>
                </div>
                <p className="text-xs opacity-80 leading-normal">
                  Every jewellery piece is designed with attention to detail, quality finishing and timeless appeal.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
                <div className="flex items-center gap-2 text-amber-500">
                  <Gem className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    ✧ Authentic Materials
                  </span>
                </div>
                <p className="text-xs opacity-80 leading-normal">
                  Explore jewellery crafted using quality gold, diamonds, platinum, silver and carefully selected gemstones.
                </p>
              </div>
            </div>

            {/* Our Jewellery Collection Section */}
            <div className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
              <div className="flex items-center gap-2 text-amber-500">
                <Layers className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">
                  ✧ Our Jewellery Collection
                </span>
              </div>
              <ul className="text-xs opacity-85 space-y-2 list-none pt-1">
                {collections.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>
                      <strong>{item.title}</strong> – {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Designed For Every Moment Card */}
            <div className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
              <div className="flex items-center gap-2 text-amber-500">
                <Heart className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">
                  ✧ Designed for Every Moment
                </span>
              </div>
              <p className="text-xs opacity-80 leading-normal">
                From everyday elegance to grand celebrations, DIKSHI Jewellery brings together beauty, craftsmanship and timeless luxury.
              </p>
            </div>

          </div>

          {/* Modal Footer CTA */}
          <div className="mt-8 pt-6 border-t border-current/10 flex justify-end">
            <button
              onClick={() => {
                luxuryAudio.playClick();
                onClose();
              }}
              className="px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold border border-current/30 hover:border-current transition-all backdrop-blur-sm active:scale-95"
            >
              Close & Explore
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
