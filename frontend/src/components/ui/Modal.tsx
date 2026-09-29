import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthStyles} bg-[#0D1220] border border-[#182238] rounded-xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] p-5 sm:p-6 text-[#F0F4FC] overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#00F0FF]/40 before:to-transparent`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-1.5 text-[#8E9BB5] hover:text-[#F0F4FC] rounded-lg hover:bg-white/[0.06] transition-colors z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/60"
        >
          <X className="w-4 h-4" />
        </button>

        {(title || subtitle) && (
          <div className="mb-4 flex-shrink-0 pr-8">
            {title && <h3 className="text-base sm:text-lg font-bold text-[#F0F4FC] font-mono uppercase tracking-wider">{title}</h3>}
            {subtitle && <p className="text-xs text-[#8E9BB5] mt-0.5">{subtitle}</p>}
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">{children}</div>
      </div>
    </div>
  );
};
