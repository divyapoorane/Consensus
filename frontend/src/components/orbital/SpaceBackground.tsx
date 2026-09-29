import React from 'react';
import { DynamicTechnoSpaceCanvas } from './DynamicTechnoSpaceCanvas';

interface SpaceBackgroundProps {
  className?: string;
  showConstellation?: boolean;
  density?: 'low' | 'medium' | 'high';
  showGrid?: boolean;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({
  className = '',
  showGrid = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06080F] ${className}`}
    >
      {/* 1. Dynamic Live Interactive Space Engine Canvas */}
      <DynamicTechnoSpaceCanvas interactive={true} showGrid={showGrid} />

      {/* 2. Technical Aerospace Grid Layer with soft glow */}
      <div className="absolute inset-0 orbital-grid opacity-40 pointer-events-none" />

      {/* 3. Subtle Cyber Scanlines overlay for techno vibe */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 240, 255, 0.03) 0px, rgba(0, 240, 255, 0.03) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* 4. Deep Space Top Ambient Orbital Ring Accent */}
      <div className="absolute -top-40 right-10 w-[700px] h-[700px] rounded-full border border-cyan-500/10 pointer-events-none animate-[spin_120s_linear_infinite]" />
      <div className="absolute -top-24 right-24 w-[520px] h-[520px] rounded-full border border-orange-500/10 border-dashed pointer-events-none animate-[spin_90s_linear_infinite_reverse]" />
    </div>
  );
};
