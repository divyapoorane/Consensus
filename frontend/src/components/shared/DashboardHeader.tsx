import React from 'react';

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  systemId?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  action,
  badge,
  systemId,
}) => {
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#182238] mb-6 before:absolute before:-bottom-px before:left-0 before:w-20 before:h-0.5 before:bg-[#FF5500]">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {systemId && (
            <span className="font-mono text-[10px] uppercase text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-semibold">
              {systemId}
            </span>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F4FC] tracking-tight font-mono uppercase">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#8E9BB5] mt-1 font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5 flex-shrink-0">{action}</div>}
    </div>
  );
};
