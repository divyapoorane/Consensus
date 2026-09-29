import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  borderAccent?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'orange' | 'default';
}

export const Card: React.FC<CardProps> = ({
  glow = false,
  borderAccent = 'default',
  children,
  className = '',
  ...props
}) => {
  const accentStyles = {
    default: 'border-[#182238] hover:border-[#28375A]',
    orange: 'border-[#FF5500]/40 hover:border-[#FF5500]/70 hover:shadow-[0_0_20px_-4px_rgba(255,85,0,0.25)]',
    cyan: 'border-[#00F0FF]/30 hover:border-[#00F0FF]/60 hover:shadow-[0_0_20px_-4px_rgba(0,240,255,0.2)]',
    indigo: 'border-[#6366F1]/30 hover:border-[#6366F1]/60',
    emerald: 'border-[#00E575]/30 hover:border-[#00E575]/60 hover:shadow-[0_0_20px_-4px_rgba(0,229,117,0.2)]',
    amber: 'border-amber-500/30 hover:border-amber-500/60',
    rose: 'border-rose-500/30 hover:border-rose-500/60',
  }[borderAccent];

  const glowStyle = glow ? 'shadow-[0_0_24px_-4px_rgba(255,85,0,0.2)]' : '';

  return (
    <div
      className={`relative bg-[#0D1220]/90 border rounded-xl p-5 text-[#F0F4FC] transition-all duration-200 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${accentStyles} ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
