import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'orange' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
  }[size];

  const variantStyles = {
    orange: 'bg-[#FF5500]/10 text-[#FF7722] border border-[#FF5500]/30 shadow-[0_0_10px_rgba(255,85,0,0.15)]',
    cyan: 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]',
    indigo: 'bg-[#6366F1]/15 text-[#A5B4FC] border border-[#6366F1]/30',
    emerald: 'bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/30 shadow-[0_0_10px_rgba(0,229,117,0.15)]',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    slate: 'bg-[#0D1220] text-[#8E9BB5] border border-[#182238]',
    neutral: 'bg-[#0D1220] text-[#8E9BB5] border border-[#182238]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
