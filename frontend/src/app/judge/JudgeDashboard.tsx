import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/MockAuthProvider';
import { judgeService } from '../../services/judge/judgeService';
import { JudgeStats, JudgeProject } from '../../types/judge';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { MetricStrip } from '../../components/shared/MetricStrip';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Scale, Award, Video, Clock, ArrowRight, ShieldCheck, Target, Radio } from 'lucide-react';

export const JudgeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<JudgeStats | null>(null);
  const [projects, setProjects] = useState<JudgeProject[]>([]);

  useEffect(() => {
    Promise.all([judgeService.getStats(), judgeService.getAssignedProjects()]).then(
      ([statsData, projectsData]) => {
        setStats(statsData);
        setProjects(projectsData);
      }
    );
  }, []);

  const pendingProjects = projects.filter((p) => p.evaluationStatus === 'pending');

  return (
    <div className="space-y-6">
      {/* Editorial Dashboard Header */}
      <DashboardHeader
        title="Judge // Command Deck"
        subtitle={`Juror: ${user?.name || 'Evaluator'} • Double-blind evaluation chamber. Assess candidate targets using standardized quantitative rubric weights.`}
        badge={<StatusBeacon status="connected" label="DOUBLE-BLIND ACTIVE" />}
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/judge/projects')}
            icon={<Scale className="w-3.5 h-3.5" />}
          >
            Deliberation Queue
          </Button>
        }
      />

      {/* TELEMETRY METRIC STRIP */}
      <MetricStrip
        items={[
          {
            label: 'Assigned Targets',
            value: stats?.assignedProjects ?? 0,
            subtext: 'In Deliberation Queue',
            icon: <Scale className="w-4 h-4" />,
            accent: 'orange',
            highlight: true,
          },
          {
            label: 'Scored Targets',
            value: stats?.completedEvaluations ?? 0,
            subtext: 'Rubric Scores Locked',
            icon: <Award className="w-4 h-4" />,
            accent: 'emerald',
          },
          {
            label: 'Pending Scoring',
            value: stats?.pendingEvaluations ?? 0,
            subtext: 'Awaiting Evaluation',
            icon: <Clock className="w-4 h-4" />,
            accent: 'amber',
          },
          {
            label: 'Live Pitches',
            value: stats?.upcomingLiveSessions ?? 0,
            subtext: 'Scheduled Sessions',
            icon: <Video className="w-4 h-4" />,
            accent: 'cyan',
          },
        ]}
      />

      {/* Evaluation Queue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Projects Awaiting Evaluation (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F0F4FC] flex items-center gap-2 font-mono uppercase tracking-wider">
              <Target className="w-4 h-4 text-[#FF5500]" />
              <span>Project Targets Awaiting Evaluation ({pendingProjects.length})</span>
            </h2>
            <button
              onClick={() => navigate('/judge/projects')}
              className="text-xs text-[#00F0FF] hover:underline cursor-pointer font-mono uppercase"
            >
              Full Queue ({projects.length}) →
            </button>
          </div>

          <div className="divide-y divide-[#182238] rounded-xl border border-[#182238] bg-[#0D1220]/95 overflow-hidden">
            {pendingProjects.length === 0 ? (
              <div className="p-8 text-center bg-[#090D18]">
                <p className="text-xs text-[#8E9BB5] font-mono">No target projects currently awaiting your evaluation.</p>
              </div>
            ) : (
              pendingProjects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-5 hover:bg-[#11182B] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TechnicalLabel label="TARGET" value={`#0${idx + 1}`} variant="cyan" />
                      <Badge variant="slate" size="sm">
                        {proj.category}
                      </Badge>
                      <span className="text-[10px] font-mono text-[#8E9BB5] px-2 py-0.5 rounded bg-[#090D18] border border-[#182238]">
                        {proj.hackathonTitle}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#F0F4FC] font-mono uppercase">{proj.title}</h3>
                    <p className="text-xs text-[#8E9BB5] line-clamp-1 font-sans">{proj.tagline}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-mono text-[#00F0FF] px-1.5 py-0.5 rounded bg-[#090D18] border border-[#00F0FF]/25 font-semibold"
                        >
                          [{tech}]
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="self-end sm:self-center shadow-md shadow-[#FF5500]/20"
                    onClick={() => navigate(`/judge/projects/${proj.id}`)}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Evaluate Target
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Pitch Sessions & Deliberation Protocol (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <SystemPanel title="Live Pitch Deliberation" accent="cyan">
            <p className="text-xs text-[#8E9BB5] py-2 text-center font-mono">
              No live pitch streams currently broadcasting.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/judge/sessions')}
            >
              Enter Deliberation Room
            </Button>
          </SystemPanel>

          <SystemPanel title="Consensus Signal Protocol" accent="orange">
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#090D18] border border-[#182238]">
                <p className="text-[10px] text-[#FF5500] uppercase font-bold mb-0.5">
                  DOUBLE-BLIND MASKING
                </p>
                <p className="text-[#8E9BB5] font-sans">
                  Builder identity is masked. Evaluations are isolated until jury consensus convergence.
                </p>
              </div>
              <div className="p-2.5 rounded bg-[#090D18] border border-[#182238]">
                <p className="text-[10px] text-[#00F0FF] uppercase font-bold mb-0.5">
                  WEIGHTED RUBRIC GATES
                </p>
                <p className="text-[#8E9BB5] font-sans">
                  Scores are weighted: Innovation (20%), Tech Quality (30%), UI/UX (15%), Impact (20%), Pitch (15%).
                </p>
              </div>
            </div>
          </SystemPanel>
        </div>
      </div>
    </div>
  );
};
