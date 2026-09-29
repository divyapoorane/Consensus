import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { judgeService } from '../../services/judge/judgeService';
import { JudgeProject } from '../../types/judge';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Scale } from 'lucide-react';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<JudgeProject[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    judgeService.getAssignedProjects().then(setProjects);
  }, []);

  const tabs = [
    { id: 'all', label: 'All Assigned', count: projects.length },
    { id: 'pending', label: 'Pending Review', count: projects.filter((p) => p.evaluationStatus === 'pending').length },
    { id: 'completed', label: 'Evaluated', count: projects.filter((p) => p.evaluationStatus === 'completed').length },
  ];

  const filtered = projects.filter((p) => {
    if (activeTab === 'all') return true;
    return p.evaluationStatus === activeTab;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Assigned Projects Queue"
        subtitle="Double-blind evaluation queue. Review repositories, test live links, and submit scores against standardized rubrics."
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Scale className="w-8 h-8" />}
          title="No projects have been assigned to you yet."
          description="Your queue is currently clear. When the organizer assigns submissions for this sprint track, they will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((proj) => (
            <Card
              key={proj.id}
              className="flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="neutral" size="sm">
                    {proj.category}
                  </Badge>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      proj.evaluationStatus === 'completed'
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {proj.evaluationStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-zinc-100">{proj.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{proj.tagline}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs text-zinc-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Track:</span>
                    <span className="text-zinc-100 font-medium">{proj.hackathonTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Assigned:</span>
                    <span className="font-mono text-zinc-300">
                      {new Date(proj.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {proj.totalScore !== undefined && (
                    <div className="flex justify-between pt-1 border-t border-[#2A2A2A]">
                      <span className="text-zinc-400 font-medium">Your Score:</span>
                      <span className="font-mono font-semibold text-emerald-400 text-sm">
                        {proj.totalScore} / 100
                      </span>
                    </div>
                  )}
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-[#202020]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[#2A2A2A] mt-4">
                <Button
                  variant={proj.evaluationStatus === 'completed' ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/judge/projects/${proj.id}`)}
                  icon={<Scale className="w-3.5 h-3.5" />}
                >
                  {proj.evaluationStatus === 'completed' ? 'Edit Evaluation' : 'Score Project'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
