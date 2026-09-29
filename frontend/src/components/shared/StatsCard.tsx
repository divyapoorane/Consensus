import React from 'react';
import { Card } from '../ui/Card';

export interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  accent?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'orange' | 'default';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  icon,
  accent = 'default',
}) => {
  return (
    <Card borderAccent={accent} className="flex flex-col justify-between hover:-translate-y-0.5 hover:border-[#3A3A3A] transition-all duration-200">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-[#A1A1A1]">
          {label}
        </span>
        {icon && (
          <div className="w-7 h-7 rounded-lg bg-[#202020] border border-[#2A2A2A] flex items-center justify-center text-[#A1A1A1]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold text-[#F5F5F0] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
              isPositive
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </Card>
  );
};
