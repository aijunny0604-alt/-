import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { HERO_TEXT } from '../constants';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 30);
      mouseY.set((clientY - innerHeight / 2) / 30);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Enhanced parallax effects
  const x1 = useTransform(scrollY, [0, 500], [0, -200]);
  const x2 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.8]);
  const filter = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(20px)"]);
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const rotate = useTransform(scrollY, [0, 600], [0, -3]);

  // Luxurious character animation variants - 글자가 하나씩 나타나는 효과
  const charContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,  // 글자 사이 딜레이
        delayChildren: 0.5,     // 시작 전 딜레이
      },
    },
  };

  const charVariants = {
    hidden: {
      y: 80,
      opacity: 0,
      rotateZ: -5,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateZ: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 150,
      },
    },
  };

  // Floating particles data
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 3,
  }));

  const renderAnimatedText = (text: string, lineIndex: number) => {
    // 두 번째 줄은 첫 번째 줄 애니메이션 후에 시작
    const containerVariants = {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: lineIndex === 0 ? 0.2 : 0.8,
        },
      },
    };

    return (
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={charVariants}
            className="inline-block cursor-default"
            style={{ transformOrigin: 'bottom center' }}
            whileHover={{
              scale: 1.12,
              y: -8,
              color: '#333',
              transition: { type: 'spring', stiffness: 400, damping: 10 }
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
      ref={containerRef}
      style={{ opacity, scale, filter, y, rotateZ: rotate }}
      className="h-screen flex flex-col justify-center px-6 md:px-20 pt-20 fixed top-0 left-0 right-0 z-0 will-change-transform overflow-hidden"
    >
      {/* Noise texture overlay for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient mesh background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(245,243,240,0.8) 0%, transparent 70%)',
        }}
        animate={{
          background: [
            'radial-gradient(ellipse 80% 50% at 40% 40%, rgba(245,243,240,0.8) 0%, transparent 70%)',
            'radial-gradient(ellipse 80% 50% at 60% 60%, rgba(245,243,240,0.8) 0%, transparent 70%)',
            'radial-gradient(ellipse 80% 50% at 40% 40%, rgba(245,243,240,0.8) 0%, transparent 70%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-neutral-400/30 pointer-events-none hidden md:block"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [-20, -100],
            x: [0, (Math.random() - 0.5) * 50],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay + 2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Primary gradient orb with enhanced movement */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-25 blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,180,150,0.5) 0%, rgba(180,160,130,0.2) 50%, transparent 70%)',
          x: smoothMouseX,
          y: smoothMouseY,
          left: '5%',
          top: '10%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          scale: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(140,140,180,0.4) 0%, transparent 70%)',
          x: useTransform(smoothMouseX, (v) => -v * 0.8),
          y: useTransform(smoothMouseY, (v) => -v * 0.8),
          right: '10%',
          bottom: '20%',
        }}
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Tertiary accent orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-15 blur-[80px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(220,200,170,0.6) 0%, transparent 70%)',
          x: useTransform(smoothMouseX, (v) => v * 0.3),
          y: useTransform(smoothMouseY, (v) => v * 0.3),
        }}
        initial={{ left: '50%', top: '50%' }}
        animate={{
          left: ['50%', '30%', '70%', '50%'],
          top: ['50%', '30%', '60%', '50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Elegant horizontal reveal lines */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.87, 0, 0.13, 1], delay: 1 }}
        className="absolute top-[35%] left-0 right-0 h-[1px] origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(160,150,140,0.3) 20%, rgba(160,150,140,0.3) 80%, transparent 100%)',
        }}
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.87, 0, 0.13, 1], delay: 1.3 }}
        className="absolute top-[65%] left-0 right-0 h-[1px] origin-right"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(160,150,140,0.2) 20%, rgba(160,150,140,0.2) 80%, transparent 100%)',
        }}
      />

      {/* Main text - Line 1 with staggered reveal */}
      <div className="relative pb-2">
        <motion.h1
          style={{ x: x1 }}
          className="text-[13vw] md:text-[15vw] leading-[1.1] font-serif tracking-[-0.04em] text-neutral-900 whitespace-nowrap relative"
        >
          {/* Animated underline - 글자 등장 후 나타남 */}
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neutral-400 via-neutral-300 to-transparent origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.8, ease: [0.87, 0, 0.13, 1] }}
            style={{ width: '100%' }}
          />
          {renderAnimatedText(HERO_TEXT.line1, 0)}
        </motion.h1>
      </div>

      {/* Main text - Line 2 with offset animation */}
      <div className="relative pb-2">
        <motion.h1
          style={{ x: x2 }}
          className="text-[13vw] md:text-[15vw] leading-[1.1] font-serif tracking-[-0.04em] text-neutral-900 md:ml-[15vw] whitespace-nowrap relative italic"
        >
          {/* Gradient shine effect - 반짝이는 효과 */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%] pointer-events-none"
            initial={{ backgroundPosition: '200% center' }}
            animate={{ backgroundPosition: '-200% center' }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
              delay: 2.5,
              repeat: Infinity,
              repeatDelay: 4,
            }}
            style={{ mixBlendMode: 'overlay' }}
          />
          {renderAnimatedText(HERO_TEXT.line2, 1)}
        </motion.h1>
      </div>

      {/* Subtitle with split-line animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="mt-16 md:ml-auto md:w-1/3 relative"
      >
        {/* Subtitle text with word-by-word reveal */}
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: 60, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl font-sans text-neutral-600 leading-relaxed keep-all"
          >
            {HERO_TEXT.sub}
          </motion.p>
        </div>

        {/* Animated decorative line */}
        <motion.div
          className="relative h-[1px] w-full mt-10 overflow-hidden"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ delay: 2.5, duration: 1.2, ease: [0.87, 0, 0.13, 1] }}
            className="absolute inset-0 bg-gradient-to-r from-neutral-400 via-neutral-300 to-transparent"
          />
          {/* Traveling light effect */}
          <motion.div
            className="absolute top-0 w-20 h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            }}
            animate={{ x: ['-80px', '100%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 4,
              delay: 3.5,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <div className="mt-6 flex justify-between items-center text-sm uppercase tracking-[0.2em] text-neutral-400">
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-light"
          >
            Scroll to Explore
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="w-[1px] h-8 bg-neutral-300 origin-top overflow-hidden relative"
            >
              <motion.div
                className="absolute w-full bg-neutral-600"
                animate={{
                  top: ['-100%', '100%'],
                  height: ['50%', '50%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sophisticated floating elements */}
      <motion.div
        className="absolute bottom-24 left-12 hidden md:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-3 h-3 border border-neutral-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-16 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
      >
        <motion.div
          className="w-2 h-2 bg-neutral-400 rounded-full"
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Diagonal decorative line */}
      <motion.div
        className="absolute top-0 right-0 w-[1px] h-[40vh] origin-top hidden md:block"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(160,150,140,0.3) 30%, rgba(160,150,140,0.3) 70%, transparent)',
          transform: 'rotate(15deg)',
          right: '8%',
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.2, ease: [0.87, 0, 0.13, 1] }}
      />

      {/* Corner accent */}
      <motion.div
        className="absolute bottom-16 right-16 hidden md:flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.2, duration: 0.8 }}
      >
        <span className="text-xs font-mono text-neutral-400 tracking-widest">2024</span>
        <motion.div
          className="w-12 h-[1px] bg-neutral-300"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 3.4, duration: 0.6 }}
        />
      </motion.div>
    </motion.section>
  );
};

export default Hero;
