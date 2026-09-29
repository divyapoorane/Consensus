import React from 'react';

interface SystemPanelProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  accent?: 'orange' | 'cyan' | 'green' | 'default';
  flush?: boolean;
  className?: string;
}

export const SystemPanel: React.FC<SystemPanelProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  accent = 'default',
  flush = false,
  className = '',
}) => {
  const topAccentStyles = {
    orange: 'border-t-2 border-t-[#FF5500]',
    cyan: 'border-t-2 border-t-[#00F0FF]',
    green: 'border-t-2 border-t-[#00E575]',
    default: 'border-t border-t-[#28375A]',
  }[accent];

  return (
    <div
      className={`relative bg-[#0D1220]/90 border border-[#182238] rounded-xl ${topAccentStyles} overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Top Header Rail if title/badge/action provided */}
      {(title || subtitle || badge || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#182238] bg-[#0A0E1A]/60">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              {title && (
                <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F0F4FC] truncate">
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-[11px] text-[#8E9BB5] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Panel Body */}
      <div className={flush ? '' : 'p-5 sm:p-6'}>{children}</div>
    </div>
  );
};
