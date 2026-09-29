import React from 'react';

interface OrbitalRingProps {
  size?: number;
  className?: string;
  children?: React.ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  accent?: 'orange' | 'cyan' | 'slate';
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({
  size = 320,
  className = '',
  children,
  speed = 'normal',
  accent = 'cyan',
}) => {
  const accentColor = {
    orange: 'rgba(255, 85, 0, 0.25)',
    cyan: 'rgba(0, 240, 255, 0.25)',
    slate: 'rgba(142, 155, 181, 0.15)',
  }[accent];

  const dotColor = {
    orange: '#FF5500',
    cyan: '#00F0FF',
    slate: '#8E9BB5',
  }[accent];

  const duration = {
    slow: '40s',
    normal: '24s',
    fast: '14s',
  }[speed];

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Static Track */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 overflow-visible"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
          strokeDasharray="2 8"
        />
      </svg>

      {/* Rotating Node Satellite */}
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{ animationDuration: duration }}
      >
        <span
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-lg"
          style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
        />
      </div>

      {/* Optional Inner Content / Children */}
      {children && <div className="relative z-10 pointer-events-auto">{children}</div>}
    </div>
  );
};
