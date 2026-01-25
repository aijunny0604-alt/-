import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsExiting(true), 300);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const words = ['Creative', 'Developer', 'Portfolio'];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10000] bg-neutral-900 flex flex-col items-center justify-center"
        >
          {/* Animated words */}
          <div className="mb-16 overflow-hidden">
            {words.map((word, index) => (
              <motion.div
                key={word}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-4xl md:text-7xl font-serif text-white text-center leading-tight"
              >
                {word}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-48 md:w-64">
            <div className="flex justify-between text-xs text-neutral-500 mb-2 font-mono">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-[2px] bg-neutral-800 overflow-hidden">
              <motion.div
                className="h-full bg-white origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-10 left-10 text-xs font-mono text-neutral-600 hidden md:block"
          >
            SEOUL, KOREA<br />
            ©2025
          </motion.div>
        </motion.div>
      )}

      {isExiting && (
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] bg-neutral-900 origin-top"
        />
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
