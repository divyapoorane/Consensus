import React from 'react';
import { Check, CircleDot, ChevronRight } from 'lucide-react';

export type JourneyStage = 'registered' | 'squad' | 'project' | 'submission' | 'judging' | 'results';

interface JourneyStep {
  id: JourneyStage;
  label: string;
  sublabel: string;
}

const STAGES: JourneyStep[] = [
  { id: 'registered', label: 'Registered', sublabel: 'Track Confirmed' },
  { id: 'squad', label: 'Squad Room', sublabel: 'Team Formed' },
  { id: 'project', label: 'Workspace', sublabel: 'Prototype Built' },
  { id: 'submission', label: 'Submission', sublabel: 'Deliverable Shipped' },
  { id: 'judging', label: 'Evaluation', sublabel: 'Consensus Jury' },
  { id: 'results', label: 'Results', sublabel: 'Verified Escrow' },
];

interface JourneyTrackerProps {
  currentStage: JourneyStage;
  onStepClick?: (stage: JourneyStage) => void;
  className?: string;
}

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  currentStage,
  onStepClick,
  className = '',
}) => {
  const currentIdx = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={`bg-[#12141C] border border-[#222634] rounded-xl p-3 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Arena Journey Progression
        </span>
        <span className="text-[10px] font-mono text-[#FF6B35] font-semibold">
          Stage {currentIdx + 1} of {STAGES.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;

          return (
            <button
              key={stage.id}
              type="button"
              disabled={!onStepClick}
              onClick={() => onStepClick && onStepClick(stage.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                onStepClick ? 'cursor-pointer hover:border-zinc-500' : 'cursor-default'
              } ${
                isCurrent
                  ? 'bg-[#1C1F2B] border-[#FF6B35] shadow-xs'
                  : isCompleted
                  ? 'bg-[#14161F] border-emerald-500/30 text-emerald-400'
                  : 'bg-[#0F1117] border-[#1E222D] text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  0{idx + 1}
                </span>
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <CircleDot className="w-3.5 h-3.5 text-[#FF6B35] animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                )}
              </div>
              <span
                className={`text-xs font-semibold block leading-tight ${
                  isCurrent ? 'text-zinc-100' : isCompleted ? 'text-zinc-200' : 'text-zinc-500'
                }`}
              >
                {stage.label}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block mt-0.5 truncate">
                {stage.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
