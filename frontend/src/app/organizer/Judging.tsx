import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Scale, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const Judging: React.FC = () => {
  const navigate = useNavigate();

  const rubricCriteria = [
    { name: 'Innovation & Originality', weight: 20, desc: 'Novelty of approach and problem-solving uniqueness' },
    { name: 'Technical Quality & Execution', weight: 30, desc: 'Code cleanliness, architecture rigor, and robustness' },
    { name: 'UI / UX Design', weight: 15, desc: 'Intuitive user interface and developer ergonomics' },
    { name: 'Practical Impact & Utility', weight: 20, desc: 'Real-world applicability and adoption potential' },
    { name: 'Presentation & Documentation', weight: 15, desc: 'Clarity of pitch, demo, and architectural docs' },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Judging & Deliberation Console"
        subtitle="Monitor real-time panel evaluations, normalized consensus scoring, and variance outlier flags."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/organizer/results')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Deliberate Final Results
          </Button>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Submissions" value={88} />
        <StatsCard label="Assigned Reviews" value={264} />
        <StatsCard label="Evaluations Finished" value={192} change="72% Complete" accent="emerald" />
        <StatsCard label="Average Panel Score" value="86.4 / 100" accent="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rubric Weights & Rules */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-400" />
              <span>Active Scoring Rubric Matrix (Autonomous Systems Track)</span>
            </h3>
            <Badge variant="orange" size="sm">Double-Blind</Badge>
          </div>

          <div className="space-y-3">
            {rubricCriteria.map((c) => (
              <div
                key={c.name}
                className="p-3.5 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-zinc-100 text-xs block">{c.name}</span>
                  <span className="text-[11px] text-zinc-400">{c.desc}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-semibold text-orange-400">{c.weight}%</span>
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">Weight</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Outlier & Consensus Variance Detection */}
        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Consensus Variance Health</span>
          </h3>

          <div className="p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Variance Status:</span>
              <span className="text-emerald-400 font-semibold font-mono">Optimal (0.34 σ)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Outlier Detections:</span>
              <span className="text-zinc-100 font-mono">0 Pending Flags</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Deliberation Room:</span>
              <span className="text-orange-400 font-semibold">Open</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-zinc-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>All juror evaluations are normalized by Consensus algorithm to prevent panel skew.</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate('/organizer/judges')}
          >
            Inspect Judge Workloads
          </Button>
        </Card>
      </div>
    </div>
  );
};
