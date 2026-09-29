import React from 'react';
import { DynamicTechnoSpaceCanvas } from './orbital/DynamicTechnoSpaceCanvas';

interface StarfieldProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export const StarfieldCanvas: React.FC<StarfieldProps> = ({
  className = '',
  interactive = true,
}) => {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${className}`}>
      <DynamicTechnoSpaceCanvas interactive={interactive} showGrid={true} />
    </div>
  );
};
