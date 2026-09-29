import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = 'Search records...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <SearchIcon className="w-4 h-4 text-[#A1A1A1] absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#141414] border border-[#2A2A2A] hover:border-[#383838] focus:border-[#FF6B35] text-xs text-[#F5F5F0] rounded-lg pl-9 pr-8 py-2 placeholder-[#666666] focus:outline-none transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 text-[#A1A1A1] hover:text-[#F5F5F0] p-0.5 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
