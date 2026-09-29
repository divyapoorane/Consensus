import React from 'react';

export interface MetricItem {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
  accent?: 'orange' | 'cyan' | 'emerald' | 'amber' | 'violet';
  icon?: React.ReactNode;
}

interface MetricStripProps {
  items: MetricItem[];
  className?: string;
}

export const MetricStrip: React.FC<MetricStripProps> = ({ items, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#182238] bg-[#0D1220]/90 border border-[#182238] rounded-xl overflow-hidden shadow-lg ${className}`}
    >
      {items.map((item, idx) => {
        const accentColors = {
          orange: 'text-[#FF7722]',
          cyan: 'text-[#00F0FF]',
          emerald: 'text-[#00E575]',
          amber: 'text-amber-400',
          violet: 'text-violet-400',
        };
        const colorClass = item.accent ? accentColors[item.accent] : item.highlight ? 'text-[#FF7722]' : 'text-[#F0F4FC]';

        return (
          <div key={idx} className="p-4 sm:p-5 flex flex-col justify-between hover:bg-[#11182B] transition-colors relative group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#8E9BB5] font-semibold">
                {item.label}
              </span>
              {item.icon && <span className="text-[#8E9BB5] group-hover:text-[#00F0FF] transition-colors">{item.icon}</span>}
            </div>
            <div>
              <span className={`text-xl sm:text-3xl font-bold font-mono tracking-tight block ${colorClass}`}>
                {item.value}
              </span>
              {item.subtext && (
                <span className="text-[10px] text-[#8E9BB5] font-mono block mt-1 truncate">
                  {item.subtext}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
