import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-xs">
      {label && (
        <label htmlFor={inputId} className="font-mono text-[11px] font-semibold text-[#8E9BB5] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3 text-[#8E9BB5] pointer-events-none">{icon}</span>}
        <input
          id={inputId}
          className={`w-full bg-[#090D18] border rounded-lg py-2.5 text-xs sm:text-sm text-[#F0F4FC] placeholder-[#4B556D] font-sans focus:outline-none transition-all duration-150 ${
            icon ? 'pl-9 pr-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#182238] hover:border-[#28375A] focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-[11px] text-red-400 font-mono font-medium">{error}</span>}
      {helperText && !error && <span className="text-[11px] text-[#8E9BB5] font-mono">{helperText}</span>}
    </div>
  );
};
