import React from 'react';

interface SectionEyebrowProps {
  number?: string;
  category?: string;
  label?: string;
  tagline?: string;
  status?: string;
  className?: string;
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({
  number,
  category,
  label,
  tagline,
  status,
  className = '',
}) => {
  const displayCategory = category || label || 'SECTION';
  const displayTagline = tagline || status;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1220] border border-[#182238] text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#F0F4FC] shadow-sm ${className}`}
    >
      {number && <span className="text-[#FF7722] font-bold">{number}</span>}
      {number && <span className="text-[#28375A]">/</span>}
      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-[#FF5500]/60 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF5500]" />
      </span>
      <span className="font-semibold">{displayCategory}</span>
      {displayTagline && (
        <>
          <span className="text-[#28375A] hidden sm:inline">•</span>
          <span className="text-[#8E9BB5] hidden sm:inline text-[10px] font-mono">
            {displayTagline}
          </span>
        </>
      )}
    </div>
  );
};
