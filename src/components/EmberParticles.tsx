import React, { useMemo } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  color: string;
}

export const EmberParticles: React.FC = () => {
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      'rgba(255, 179, 173, 0.75)', // crimson pale
      'rgba(138, 11, 20, 0.65)',   // deep primary red
      'rgba(233, 195, 73, 0.55)',  // amber secondary gold
      'rgba(229, 226, 225, 0.45)', // bone white dust
      'rgba(255, 146, 138, 0.6)'   // vivid ember
    ];

    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5,
      left: Math.random() * 100,
      duration: Math.random() * 7 + 7,
      delay: Math.random() * 6,
      drift: (Math.random() - 0.5) * 80,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            bottom: '-10px',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
            animation: `ember-float ${p.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${p.delay}s infinite`,
            // @ts-expect-error CSS variable custom properties
            '--drift-x': `${p.drift}px`,
            '--ember-opacity': p.opacity
          }}
        />
      ))}
    </div>
  );
};
