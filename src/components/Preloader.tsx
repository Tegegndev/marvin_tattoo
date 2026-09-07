import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    // Smooth progress counter from 0 to 100% over ~1.4s
    const startTime = Date.now();
    const duration = 1400; // ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculated = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(calculated);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(onComplete, 450); // allow exit transition to play
        }, 200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-noir-950 flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[500px] h-[500px] bg-crimson/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Central Logo & Monogram Display */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm px-6">
            {/* Animated Gothic 'M' Monogram with Crimson Dot */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Monogram SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="76"
                height="76"
                className="drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <defs>
                  <linearGradient id="preloaderMGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                  <filter id="preloaderRedGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.95" />
                  </filter>
                </defs>

                {/* Sharp Gothic 'M' */}
                <path
                  d="M 14 10 L 25 28 L 36 10 L 45 44 L 37 44 L 31 26 L 25 36 L 19 26 L 13 44 L 5 44 Z"
                  fill="url(#preloaderMGrad)"
                />

                {/* Signature Pulsing Crimson Red Dot Above M */}
                <circle
                  cx="25"
                  cy="5"
                  r="3.2"
                  fill="#ef4444"
                  filter="url(#preloaderRedGlow)"
                  className="animate-pulse"
                />
              </svg>
            </motion.div>

            {/* Studio Title */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-1.5"
            >
              <h1 className="font-bodoni text-2xl tracking-[0.2em] uppercase text-bone font-bold">
                MARVIN
              </h1>
              <span className="font-label-caps text-[10px] text-bone-dim tracking-[0.3em] uppercase block">
                Tattoos &amp; Piercing Atelier
              </span>
            </motion.div>

            {/* Sleek Minimal Loading Progress Bar */}
            <div className="w-48 sm:w-56 space-y-2 pt-2">
              <div className="w-full h-[2px] bg-noir-800 overflow-hidden relative rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-crimson via-crimson-light to-white"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* Progress Percentage & Studio Est. */}
              <div className="flex items-center justify-between text-[10px] font-label-data text-bone-dim">
                <span className="uppercase tracking-widest text-[9px]">Kampala · EST. 2014</span>
                <span className="text-bone font-mono font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
