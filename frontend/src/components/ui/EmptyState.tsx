import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center border border-dashed border-[#2A2A2A] rounded-xl bg-[#181818] ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-[#202020] border border-[#2A2A2A] flex items-center justify-center text-[#FF6B35] mb-3">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-[#F5F5F0] mb-1">{title}</h4>
      <p className="text-xs text-[#A1A1A1] max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
