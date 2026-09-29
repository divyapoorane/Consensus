import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const Assignments: React.FC = () => {
  const navigate = useNavigate();

  const assignedHackathons = [
    {
      id: 'hack-01',
      title: 'Autonomous Systems & AI Arena',
      category: 'Artificial Intelligence',
      assignedProjectsCount: 24,
      evaluatedCount: 15,
      deadline: 'Oct 02, 2026',
      rubricType: 'Consensus Weighted Rubric (5 Criteria)',
      status: 'Active Deliberation',
    },
    {
      id: 'hack-02',
      title: 'Consensus Zero-Knowledge Sprint',
      category: 'Decentralized Tech',
      assignedProjectsCount: 12,
      evaluatedCount: 0,
      deadline: 'Oct 10, 2026',
      rubricType: 'ZK Circuit Optimization Rubric',
      status: 'Pending Submission Lock',
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Track Assignments"
        subtitle="Hackathons and challenge tracks where you are currently empaneled as a verified juror."
      />

      <div className="space-y-4">
        {assignedHackathons.map((h) => (
          <Card key={h.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">{h.category}</Badge>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    {h.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-100">{h.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span>Quota: <strong className="text-zinc-100 font-mono">{h.assignedProjectsCount} Projects</strong></span>
                  <span>•</span>
                  <span>Completed: <strong className="text-emerald-400 font-mono">{h.evaluatedCount} Reviewed</strong></span>
                  <span>•</span>
                  <span>Deadline: <strong className="text-orange-400 font-mono">{h.deadline}</strong></span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/judge/projects')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Review Queue
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
