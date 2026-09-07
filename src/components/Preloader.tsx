import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    // Elegant, fast entrance and graceful fade-out
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 400); // allow exit transition to play
    }, 850);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-noir-950 flex flex-col items-center justify-center select-none"
        >
          {/* Central Minimalist Atelier Monogram */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Gothic 'M' Monogram with Signature Crimson Dot */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="68"
                height="68"
                className="drop-shadow-[0_0_25px_rgba(255,255,255,0.12)]"
              >
                <defs>
                  <linearGradient id="minimalMGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                  <filter id="crimsonDotGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ef4444" floodOpacity="0.95" />
                  </filter>
                </defs>

                {/* Sharp Gothic 'M' */}
                <path
                  d="M 14 10 L 25 28 L 36 10 L 45 44 L 37 44 L 31 26 L 25 36 L 19 26 L 13 44 L 5 44 Z"
                  fill="url(#minimalMGrad)"
                />

                {/* Pulsing Crimson Dot Above M */}
                <circle
                  cx="25"
                  cy="5"
                  r="3.2"
                  fill="#ef4444"
                  filter="url(#crimsonDotGlow)"
                  className="animate-pulse"
                />
              </svg>
            </motion.div>

            {/* Studio Identity */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-1"
            >
              <h1 className="font-bodoni text-xl tracking-[0.25em] uppercase text-bone font-bold">
                MARVIN
              </h1>
              <span className="font-label-caps text-[9px] text-bone-dim tracking-[0.3em] uppercase block">
                Tattoos &amp; Piercing · Kampala
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
