import React from 'react';
import { PortfolioPiece } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Clock, Palette, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

interface ArtworkModalProps {
  piece: PortfolioPiece | null;
  onClose: () => void;
  onBookSimilar: (piece: PortfolioPiece) => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  piece,
  onClose,
  onBookSimilar
}) => {
  return (
    <AnimatePresence>
      {piece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-noir-900 border border-noir-700/80 shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-noir-950/80 hover:bg-crimson text-bone hover:text-white transition-colors border border-noir-700/60"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
              {/* Image Side */}
              <div className="lg:col-span-7 relative bg-noir-950 flex items-center justify-center overflow-hidden min-h-[380px] lg:min-h-full">
                <img
                  src={piece.image}
                  alt={piece.title}
                  className="w-full h-full object-cover max-h-[650px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-transparent to-transparent lg:hidden" />
                
                {/* Badges on image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-crimson/90 text-bone font-label-caps text-[10px] uppercase tracking-widest backdrop-blur-sm border border-crimson/30 shadow-lg">
                    {piece.categoryLabel}
                  </span>
                  <span className="px-3 py-1 bg-noir-950/90 text-gold font-label-caps text-[10px] uppercase tracking-wider backdrop-blur-sm border border-gold/30 shadow-lg">
                    {piece.healingState}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 hidden lg:flex items-center gap-2 px-3 py-1.5 bg-noir-950/90 text-bone font-label-data text-xs uppercase border border-noir-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-crimson-light" />
                  <span>Authenticated Studio Work</span>
                </div>
              </div>

              {/* Specs & Description Side */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-noir-900">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-bone-dim text-xs font-label-data">
                    <span className="uppercase tracking-wider">ID: {piece.flashId}</span>
                    <span className="text-gold uppercase">{piece.zone}</span>
                  </div>

                  <h3 className="font-headline-lg text-2xl sm:text-3xl text-bone uppercase tracking-tight">
                    {piece.title}
                  </h3>

                  <p className="font-body-md text-sm text-bone-muted leading-relaxed">
                    {piece.description}
                  </p>

                  {/* Parametric Specs */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                      <span className="font-label-caps text-[9px] text-bone-dim uppercase flex items-center gap-1">
                        <User className="w-3 h-3 text-crimson-light" /> Artist
                      </span>
                      <span className="font-label-data text-xs text-bone uppercase block font-semibold">
                        {piece.artist}
                      </span>
                    </div>

                    <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                      <span className="font-label-caps text-[9px] text-bone-dim uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold" /> Duration
                      </span>
                      <span className="font-label-data text-xs text-gold uppercase block font-semibold">
                        {piece.duration || 'Custom Sessions'}
                      </span>
                    </div>

                    <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                      <span className="font-label-caps text-[9px] text-bone-dim uppercase flex items-center gap-1">
                        <Palette className="w-3 h-3 text-crimson-light" /> Pigment
                      </span>
                      <span className="font-label-data text-xs text-bone uppercase block font-semibold">
                        {piece.pigment || 'Dynamic Carbon Deep'}
                      </span>
                    </div>

                    <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1">
                      <span className="font-label-caps text-[9px] text-bone-dim uppercase flex items-center gap-1">
                        <Layers className="w-3 h-3 text-gold" /> Placement
                      </span>
                      <span className="font-label-data text-xs text-bone uppercase block font-semibold truncate">
                        {piece.morphology || piece.zone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-4 border-t border-noir-700/60 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      onBookSimilar(piece);
                      onClose();
                    }}
                    className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-crimson/30"
                  >
                    <span>Book Similar Piece</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <span className="font-label-data text-[10px] text-bone-dim uppercase">
                      Consultation required to book
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
