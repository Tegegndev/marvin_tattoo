import React from 'react';
import { Icons8 } from './Icons8';

interface PreloaderProps {
  message?: string;
  count?: number;
}

/**
 * Luxury dark preloader spinner for Marvin Tattoo Atelier sections
 */
export const AtelierSpinner: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading studio data...',
  className = 'py-16',
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center text-center space-y-4 ${className}`}>
      <div className="relative flex items-center justify-center w-14 h-14">
        {/* Pulsing glow ring */}
        <div className="absolute inset-0 rounded-full bg-crimson/20 animate-ping opacity-60" />
        <div className="w-12 h-12 rounded-full border border-noir-700 bg-noir-900 flex items-center justify-center relative z-10 shadow-lg shadow-black/60">
          <div className="w-6 h-6 border-2 border-noir-700 border-t-crimson rounded-full animate-spin" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-label-caps text-xs text-bone tracking-widest uppercase font-bold">
          {message}
        </p>
        <div className="flex items-center justify-center gap-1 text-[10px] text-bone-dim font-label-data">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
          <span>Synchronizing live atelier ledger</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader matching Equipment & Shop product cards
 */
export const ProductGridSkeleton: React.FC<PreloaderProps> = ({
  count = 4,
  message = 'Curating studio equipment & inventory...',
}) => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
          <span className="font-label-caps text-xs text-bone-muted uppercase tracking-wider">
            {message}
          </span>
        </div>
        <div className="h-4 w-16 bg-noir-800/80 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-noir-850 p-5 shadow-xl flex flex-col justify-between border border-noir-800/80 rounded-sm animate-pulse"
          >
            <div>
              {/* Image Skeleton */}
              <div className="w-full h-48 mb-4 bg-noir-950 relative border border-noir-800 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-noir-800/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <Icons8 name="shopping-bag" size={24} className="text-noir-800" />
                <div className="absolute top-2 left-2 w-16 h-4 bg-noir-850 rounded" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 w-3/4 bg-noir-750 rounded" />
                <div className="h-3 w-full bg-noir-800 rounded" />
                <div className="h-3 w-2/3 bg-noir-800 rounded" />
              </div>

              {/* Specs Tags */}
              <div className="space-y-2 pt-2 border-t border-noir-800">
                <div className="h-2.5 w-1/2 bg-noir-850 rounded" />
                <div className="h-2.5 w-2/5 bg-noir-850 rounded" />
              </div>
            </div>

            {/* Price & Action Skeleton */}
            <div className="pt-4 border-t border-noir-800 flex items-center justify-between mt-4">
              <div className="h-4 w-20 bg-noir-750 rounded font-mono" />
              <div className="h-8 w-24 bg-noir-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton loader matching ServicesPage & Atelier Disciplines
 */
export const ServicesGridSkeleton: React.FC<PreloaderProps> = ({
  count = 3,
  message = 'Loading atelier tattoo disciplines...',
}) => {
  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
          <span className="font-label-caps text-xs text-bone-muted uppercase tracking-wider">
            {message}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-noir-900 border border-noir-800 shadow-xl overflow-hidden justify-between animate-pulse"
          >
            <div>
              {/* Hero Image Skeleton */}
              <div className="w-full h-64 bg-noir-950 relative border-b border-noir-800 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-noir-800/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <Icons8 name="paint-brush" size={32} className="text-noir-800" />
                <div className="absolute top-3 left-3 w-24 h-5 bg-noir-850 rounded border border-noir-800" />
                <div className="absolute bottom-2.5 left-3 right-3 h-7 bg-noir-950/80 border border-noir-800 rounded" />
              </div>

              {/* Body Skeleton */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-noir-800 rounded" />
                  <div className="h-3.5 w-full bg-noir-850 rounded" />
                  <div className="h-3.5 w-5/6 bg-noir-850 rounded" />
                </div>

                {/* Specs Pills */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="h-10 bg-noir-950 border border-noir-800 rounded" />
                  <div className="h-10 bg-noir-950 border border-noir-800 rounded" />
                </div>

                {/* Pricing Skeleton */}
                <div className="p-3 bg-noir-950 border border-noir-800 rounded flex justify-between items-center">
                  <div className="h-3 w-16 bg-noir-850 rounded" />
                  <div className="h-3.5 w-24 bg-noir-800 rounded" />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 pt-0 flex gap-3">
              <div className="h-10 flex-1 bg-noir-850 border border-noir-800 rounded" />
              <div className="h-10 flex-1 bg-noir-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
