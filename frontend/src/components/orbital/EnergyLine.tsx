import React from 'react';

interface EnergyLineProps {
  orientation?: 'horizontal' | 'vertical';
  length?: string | number;
  active?: boolean;
  accent?: 'orange' | 'cyan' | 'green';
  className?: string;
}

export const EnergyLine: React.FC<EnergyLineProps> = ({
  orientation = 'horizontal',
  length = '100%',
  active = false,
  accent = 'orange',
  className = '',
}) => {
  const activeColor = {
    orange: 'bg-[#FF5500] shadow-[0_0_10px_#FF5500]',
    cyan: 'bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]',
    green: 'bg-[#00E575] shadow-[0_0_10px_#00E575]',
  }[accent];

  if (orientation === 'vertical') {
    return (
      <div
        className={`relative w-px bg-[#182238] overflow-hidden ${className}`}
        style={{ height: length }}
      >
        {active && (
          <div
            className={`absolute top-0 left-0 w-full h-1/2 ${activeColor} animate-pulse`}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative h-px bg-[#182238] overflow-hidden ${className}`}
      style={{ width: length }}
    >
      {active && (
        <div
          className={`absolute top-0 left-0 h-full w-1/2 ${activeColor} animate-pulse`}
        />
      )}
    </div>
  );
};
