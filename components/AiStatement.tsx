import React, { useState, useEffect, useRef, RefObject } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

interface AiStatementProps {
  lenisRef: RefObject<Lenis | null>;
}

const AiStatement: React.FC<AiStatementProps> = ({ lenisRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    lenisRef.current?.stop();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const t = setTimeout(() => setPhase(1), 300);
    return () => clearTimeout(t);
  }, [isInView, lenisRef]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    if (phase === 1) timers.push(setTimeout(() => setPhase(2), 600));
    if (phase === 2) timers.push(setTimeout(() => setPhase(3), 1000));
    if (phase === 3) timers.push(setTimeout(() => setPhase(4), 1200));
    if (phase === 4) timers.push(setTimeout(() => setPhase(5), 1200));
    if (phase === 5) timers.push(setTimeout(() => setPhase(6), 800));
    if (phase === 6) {
      timers.push(setTimeout(() => {
        setPhase(7);
        lenisRef.current?.start();
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }, 2500));
    }
    return () => timers.forEach(clearTimeout);
  }, [phase, lenisRef]);

  useEffect(() => {
    return () => {
      lenisRef.current?.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [lenisRef]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-black text-white overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 md:px-20">

        {/* Prompt */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 md:mb-16"
            >
              <span className="text-sm md:text-base font-mono tracking-[0.15em] text-neutral-500">
                // 그리고 한 가지 더
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Line 1 */}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: '120%' }}
            animate={phase >= 3 ? { y: '0%' } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif tracking-tight text-center text-white whitespace-nowrap"
            style={{ fontSize: 'clamp(1.4rem, 4.5vw, 4.5rem)' }}
          >
            지금 보고 계신 이 포트폴리오도,
          </motion.h2>
        </div>

        {/* Line 2 */}
        <div className="overflow-hidden mt-1 md:mt-2">
          <motion.h2
            initial={{ y: '120%' }}
            animate={phase >= 4 ? { y: '0%' } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif tracking-tight text-center whitespace-nowrap"
            style={{ fontSize: 'clamp(1.4rem, 4.5vw, 4.5rem)' }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-white font-bold">AI</span>
            <span className="text-white">와 함께 만들었습니다.</span>
          </motion.h2>
        </div>

        {/* Divider */}
        <motion.div
          className="w-12 h-[1px] bg-neutral-700 mt-10 md:mt-14"
          initial={{ scaleX: 0 }}
          animate={phase >= 5 ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={phase >= 6 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mt-8 md:mt-10 text-neutral-500 text-[11px] md:text-sm font-mono max-w-md mx-auto leading-relaxed text-center"
        >
          사진 촬영부터 영상 편집, AI 아트, 웹 개발까지 —<br />
          AI는 제 도구이고, 결과물은 제 역량입니다.
        </motion.p>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 6 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3"
        >
          {['Claude', 'React', 'Vite', 'TypeScript', 'Tailwind CSS'].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 8 }}
              animate={phase >= 6 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
              className="px-2.5 py-1 text-[9px] md:text-[11px] font-mono border border-neutral-800 rounded-full text-neutral-600"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 7 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 md:mt-20"
        >
          <motion.div className="w-[1px] h-10 bg-neutral-800 mx-auto overflow-hidden relative">
            <motion.div
              className="absolute w-full bg-neutral-500"
              animate={{ top: ['-100%', '100%'], height: ['40%', '40%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AiStatement;
