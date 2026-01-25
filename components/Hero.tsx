import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useAnimation } from 'framer-motion';
import { HERO_TEXT } from '../constants';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const controls = useAnimation();
  const [isLoaded, setIsLoaded] = useState(false);

  // Smooth mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Start animation after mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
      controls.start('visible');
    }, 300);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY, controls]);

  // Parallax effects
  const x1 = useTransform(scrollY, [0, 500], [0, -150]);
  const x2 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.85]);
  const filter = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(12px)"]);
  const y = useTransform(scrollY, [0, 600], [0, 100]);

  // Luxurious reveal animation variants
  const lineVariants = {
    hidden: {
      clipPath: 'inset(0 100% 0 0)',
    },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 1.2,
        ease: [0.77, 0, 0.175, 1], // Custom cubic bezier for luxury feel
      }
    }
  };

  const charContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const charVariants = {
    hidden: {
      y: 120,
      opacity: 0,
      rotateX: -90,
      scale: 0.8,
      filter: 'blur(10px)',
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 90,
        mass: 1,
      },
    },
  };

  // Shimmer effect for text
  const shimmerVariants = {
    hidden: { backgroundPosition: '-200% center' },
    visible: {
      backgroundPosition: '200% center',
      transition: {
        duration: 3,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: 2,
      }
    }
  };

  const renderAnimatedText = (text: string, lineIndex: number) => {
    return (
      <motion.span
        variants={charContainerVariants}
        initial="hidden"
        animate={controls}
        style={{
          perspective: 1000,
          display: 'inline-block',
        }}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={charVariants}
            className="inline-block relative"
            style={{
              transformOrigin: 'center bottom',
              transformStyle: 'preserve-3d',
            }}
            whileHover={{
              scale: 1.1,
              color: '#666',
              transition: { duration: 0.2 }
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  return (
    <motion.section
      style={{ opacity, scale, filter, y }}
      className="h-screen flex flex-col justify-center px-6 md:px-20 pt-20 fixed top-0 left-0 right-0 z-0 will-change-transform overflow-hidden"
    >
      {/* Animated background gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,180,150,0.4) 0%, transparent 70%)',
          x: smoothMouseX,
          y: smoothMouseY,
          left: '10%',
          top: '20%',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(150,150,200,0.3) 0%, transparent 70%)',
          x: useTransform(smoothMouseX, (v) => -v * 0.5),
          y: useTransform(smoothMouseY, (v) => -v * 0.5),
          right: '15%',
          bottom: '30%',
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Decorative line that reveals */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.3 }}
        transition={{ delay: 0.5, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent origin-left"
      />

      {/* Main text - Line 1 */}
      <div className="overflow-visible py-2 relative">
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="overflow-visible"
          style={{ transitionDelay: '0.3s' }}
        >
          <motion.h1
            style={{ x: x1 }}
            className="text-[13vw] md:text-[15vw] leading-[1.15] font-serif tracking-tighter text-neutral-850 whitespace-nowrap relative"
          >
            {/* Shimmer overlay */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] pointer-events-none mix-blend-overlay"
              variants={shimmerVariants}
              initial="hidden"
              animate="visible"
              style={{ WebkitBackgroundClip: 'text' }}
            />
            {renderAnimatedText(HERO_TEXT.line1, 0)}
          </motion.h1>
        </motion.div>
      </div>

      {/* Main text - Line 2 */}
      <div className="overflow-visible py-2 relative">
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="overflow-visible"
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            style={{ x: x2 }}
            className="text-[13vw] md:text-[15vw] leading-[1.15] font-serif tracking-tighter text-neutral-850 md:ml-[15vw] whitespace-nowrap relative"
          >
            {/* Shimmer overlay */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] pointer-events-none mix-blend-overlay"
              variants={shimmerVariants}
              initial="hidden"
              animate="visible"
              style={{ WebkitBackgroundClip: 'text', transitionDelay: '0.5s' }}
            />
            {renderAnimatedText(HERO_TEXT.line2, 1)}
          </motion.h1>
        </motion.div>
      </div>

      {/* Subtitle with elegant fade */}
      <motion.div
        initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 md:ml-auto md:w-1/3 text-lg md:text-xl font-sans text-neutral-600 leading-relaxed keep-all"
      >
        <p>{HERO_TEXT.sub}</p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="h-px w-full bg-gradient-to-r from-neutral-400 via-neutral-300 to-transparent mt-8 origin-left"
        />
        <div className="mt-4 flex justify-between text-sm uppercase tracking-widest text-neutral-400">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.3, duration: 0.8 }}
          >
            Scroll to Explore
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 2.3, duration: 0.5 },
              y: { delay: 2.5, repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
            }}
          >
            ↓
          </motion.span>
        </div>
      </motion.div>

      {/* Enhanced floating decorative elements */}
      <motion.div
        className="absolute bottom-20 left-10 w-2 h-2 bg-neutral-400 rounded-full hidden md:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.5, 1],
          y: [0, -30, 0],
        }}
        transition={{
          delay: 2,
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute top-1/3 right-20 w-3 h-3 border border-neutral-400 rounded-full hidden md:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          y: [0, 20, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          delay: 2.2,
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-neutral-300 rounded-full hidden md:block"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 2, 1],
        }}
        transition={{
          delay: 2.5,
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut'
        }}
      />
    </motion.section>
  );
};

export default Hero;
