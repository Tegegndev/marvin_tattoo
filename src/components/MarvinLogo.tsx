import React from 'react';

interface MarvinLogoProps {
  variant?: 'full' | 'monogram';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const MarvinLogo: React.FC<MarvinLogoProps> = ({
  variant = 'full',
  size = 'md',
  animated = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { width: 140, height: 32, monoSize: 32 },
    md: { width: 200, height: 44, monoSize: 48 },
    lg: { width: 260, height: 56, monoSize: 72 },
    xl: { width: 340, height: 72, monoSize: 96 }
  };

  const { width, height, monoSize } = sizeMap[size];

  if (variant === 'monogram') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width={monoSize}
        height={monoSize}
        className={`shrink-0 select-none ${className}`}
        aria-label="Marvin Tattoos Monogram"
      >
        <defs>
          <linearGradient id="monogramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="redDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* Sharp Gothic 'M' Geometry */}
        <path
          d="M 14 10 L 25 28 L 36 10 L 45 44 L 37 44 L 31 26 L 25 36 L 19 26 L 13 44 L 5 44 Z"
          fill="url(#monogramGrad)"
        />

        {/* Signature Red Dot Above Central Apex */}
        <circle
          cx="25"
          cy="5"
          r="3"
          fill="#ef4444"
          filter="url(#redDotGlow)"
          className={animated ? 'animate-pulse' : ''}
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 50"
      width={width}
      height={height}
      className={`shrink-0 select-none ${className}`}
      aria-label="Marvin Tattoos & Piercing Logo"
    >
      <defs>
        <linearGradient id="fullLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <filter id="fullRedGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ef4444" floodOpacity="0.85" />
        </filter>
      </defs>

      {/* Gothic 'M' Monogram */}
      <path
        d="M 12 8 L 22 25 L 32 8 L 40 42 L 32 42 L 27 24 L 22 34 L 17 24 L 12 42 L 4 42 Z"
        fill="url(#fullLogoGrad)"
      />

      {/* Signature Red Dot Above M */}
      <circle
        cx="22"
        cy="4.5"
        r="2.5"
        fill="#ef4444"
        filter="url(#fullRedGlow)"
        className={animated ? 'animate-pulse' : ''}
      />

      {/* MARVIN in Bodoni Moda serif */}
      <text
        x="50"
        y="32"
        fontFamily="'Bodoni Moda', 'Playfair Display', serif"
        fontWeight="900"
        fontSize="22"
        letterSpacing="4"
        fill="#f8fafc"
      >
        MARVIN
      </text>

      {/* TATTOOS & PIERCING Subtitle */}
      <text
        x="52"
        y="44"
        fontFamily="'Geist', sans-serif"
        fontWeight="600"
        fontSize="7.5"
        letterSpacing="6"
        fill="#94a3b8"
      >
        TATTOOS &amp; PIERCING
      </text>
    </svg>
  );
};
