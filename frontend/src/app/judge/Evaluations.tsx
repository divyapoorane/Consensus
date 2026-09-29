import React, { useState, useEffect } from 'react';
import { judgeService } from '../../services/judge/judgeService';
import { JudgeEvaluationRecord } from '../../types/judge';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';

export const Evaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<JudgeEvaluationRecord[]>([]);

  useEffect(() => {
    judgeService.getEvaluations().then(setEvaluations);
  }, []);

  const columns: Column<JudgeEvaluationRecord>[] = [
    {
      header: 'Evaluated Project',
      cell: (e) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{e.projectTitle}</span>
          <span className="text-[10px] text-zinc-400 font-mono">By squad: {e.teamName}</span>
        </div>
      ),
    },
    {
      header: 'Track',
      accessorKey: 'hackathonTitle',
    },
    {
      header: 'Submitted Score',
      cell: (e) => (
        <span className="font-mono font-semibold text-orange-400 text-sm">
          {e.submittedScore} / {e.maxScore}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (e) => (
        <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
          {e.status}
        </span>
      ),
    },
    {
      header: 'Recorded Feedback Excerpt',
      cell: (e) => (
        <span className="text-xs text-zinc-300 italic line-clamp-1 max-w-xs">
          "{e.feedbackExcerpt}"
        </span>
      ),
    },
    {
      header: 'Timestamp',
      cell: (e) => (
        <span className="font-mono text-[11px] text-zinc-400">
          {new Date(e.evaluatedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Submitted Evaluations"
        subtitle="Historical audit log of your submitted scores, feedback notes, and deliberation timestamps."
      />

      <Table columns={columns} data={evaluations} keyExtractor={(e) => e.id} />
    </div>
  );
};
