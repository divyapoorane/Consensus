import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-medium uppercase tracking-wider transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080F]';

  const sizeStyles = {
    sm: 'text-[11px] px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-xs sm:text-sm px-5 py-2.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#FF5500] hover:bg-[#FF7722] text-white font-bold shadow-md shadow-[#FF5500]/20 hover:shadow-[0_0_20px_rgba(255,85,0,0.35)]',
    cyan:
      'bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/40 font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    secondary:
      'bg-[#0D1220] hover:bg-[#11182B] text-[#F0F4FC] border border-[#182238] hover:border-[#28375A]',
    outline:
      'bg-transparent hover:bg-white/[0.04] text-[#F0F4FC] border border-[#182238] hover:border-[#00F0FF]/40 hover:text-[#00F0FF]',
    danger:
      'bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30',
    ghost:
      'bg-transparent hover:bg-white/[0.05] text-[#8E9BB5] hover:text-[#F0F4FC]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
    </button>
  );
};
