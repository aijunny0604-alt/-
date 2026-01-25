import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO_TEXT } from '../constants';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax effects
  // Move text horizontally as user scrolls down
  const x1 = useTransform(scrollY, [0, 500], [0, -100]);
  const x2 = useTransform(scrollY, [0, 500], [0, 100]);
  
  // Fade out and scale down slightly
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <motion.section 
      style={{ opacity, scale }}
      className="h-screen flex flex-col justify-center px-6 md:px-20 pt-20 sticky top-0 z-0"
    >
      <div className="overflow-hidden">
        <motion.h1 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          style={{ x: x1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15vw] leading-[0.85] font-serif tracking-tighter text-neutral-850 whitespace-nowrap"
        >
          {HERO_TEXT.line1}
        </motion.h1>
      </div>
      <div className="overflow-hidden">
        <motion.h1 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          style={{ x: x2 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15vw] leading-[0.85] font-serif tracking-tighter text-neutral-850 md:ml-[15vw] whitespace-nowrap"
        >
          {HERO_TEXT.line2}
        </motion.h1>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-12 md:ml-auto md:w-1/3 text-lg md:text-xl font-sans text-neutral-600 leading-relaxed keep-all"
      >
        <p>{HERO_TEXT.sub}</p>
        <div className="h-px w-full bg-neutral-300 mt-8"></div>
        <div className="mt-4 flex justify-between text-sm uppercase tracking-widest text-neutral-400">
          <span>Scroll to Explore</span>
          <motion.span 
            animate={{ y: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ↓
          </motion.span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;