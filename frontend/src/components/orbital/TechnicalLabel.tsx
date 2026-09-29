import React from 'react';

interface TechnicalLabelProps {
  label: string;
  value?: string | number;
  variant?: 'cyan' | 'orange' | 'green' | 'amber' | 'slate';
  className?: string;
}

export const TechnicalLabel: React.FC<TechnicalLabelProps> = ({
  label,
  value,
  variant = 'slate',
  className = '',
}) => {
  const colorMap = {
    cyan: 'text-[#00F0FF] border-[#00F0FF]/25 bg-[#00F0FF]/5',
    orange: 'text-[#FF7722] border-[#FF5500]/30 bg-[#FF5500]/10',
    green: 'text-[#00E575] border-[#00E575]/25 bg-[#00E575]/5',
    amber: 'text-[#F59E0B] border-[#F59E0B]/25 bg-[#F59E0B]/5',
    slate: 'text-[#8E9BB5] border-[#1C2744] bg-[#0A0E1A]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${colorMap} ${className}`}
    >
      <span className="opacity-60">{label}</span>
      {value !== undefined && (
        <>
          <span className="opacity-40">::</span>
          <span className="font-bold text-white">{value}</span>
        </>
      )}
    </span>
  );
};
