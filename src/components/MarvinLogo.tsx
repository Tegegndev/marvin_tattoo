import React from 'react';
import { LOGO_URL } from '../data/atelierData';

interface MarvinLogoProps {
  variant?: 'full' | 'monogram';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const MarvinLogo: React.FC<MarvinLogoProps> = ({
  size = 'md',
  animated = false,
  className = ''
}) => {
  const sizeMap = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto'
  };

  return (
    <img
      src={LOGO_URL}
      alt="Marvin Tattoo Studio Logo"
      className={`object-contain select-none ${sizeMap[size]} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
    />
  );
};
