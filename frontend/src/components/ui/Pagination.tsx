import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between text-xs text-[#A1A1A1] py-3 ${className}`}>
      <span>
        Page <span className="font-semibold text-[#F5F5F0]">{currentPage}</span> of{' '}
        <span className="font-semibold text-[#F5F5F0]">{totalPages}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md border border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#181818] text-[#A1A1A1] hover:text-[#F5F5F0] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md border border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#181818] text-[#A1A1A1] hover:text-[#F5F5F0] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
