import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URL } from '../data/atelierData';
import { useSettings } from '../context/SettingsContext';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { settings } = useSettings();
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    // Elegant entrance and graceful fade-out
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 400); // allow exit transition to play
    }, 950);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#08080a] flex flex-col items-center justify-center select-none"
        >
          {/* Central Logo */}
          <div className="flex flex-col items-center text-center px-4">
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <img
                src={LOGO_URL}
                alt={settings.studioName || 'Marvin Tattoo Studio'}
                className="w-36 h-auto md:w-44 object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.18)]"
              />
            </motion.div>

            {/* Subtle Atelier Loading Accent */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 72 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-crimson to-transparent mt-6"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

