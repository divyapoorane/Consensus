import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizerService } from '../../services/organizer/organizerService';
import { HackathonConfig } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Calendar, PlusCircle, ArrowRight } from 'lucide-react';

export const OrganizerHackathons: React.FC = () => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState<HackathonConfig[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    organizerService.getHackathons().then(setHackathons);
  }, []);

  const tabs = [
    { id: 'all', label: 'All Events', count: hackathons.length },
    { id: 'active', label: 'Active', count: hackathons.filter((h) => h.status === 'active').length },
    { id: 'draft', label: 'Drafts', count: hackathons.filter((h) => h.status === 'draft').length },
    { id: 'completed', label: 'Completed', count: hackathons.filter((h) => h.status === 'completed').length },
  ];

  const filtered = hackathons.filter((h) => {
    if (activeTab === 'all') return true;
    return h.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Hackathon Event Portfolio"
        subtitle="Manage live tracks, draft challenge briefs, registration thresholds, and jury schedules."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/organizer/hackathons/create')}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Create Hackathon
          </Button>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="You haven't created a hackathon yet."
          description="Launch your first hackathon with custom timelines, double-blind judging rubrics, and automated prize escrow."
          actionLabel="Create Hackathon"
          onAction={() => navigate('/organizer/hackathons/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="neutral" size="sm">
                    {hackathon.category}
                  </Badge>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      hackathon.status === 'active'
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                        : hackathon.status === 'draft'
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                        : 'bg-[#202020] text-zinc-300 border border-[#2A2A2A]'
                    }`}
                  >
                    {hackathon.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-zinc-100">{hackathon.name}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{hackathon.tagline}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs text-zinc-300">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      Registrations
                    </span>
                    <span className="font-semibold text-zinc-100 font-mono">{hackathon.registrationsCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      Submissions
                    </span>
                    <span className="font-semibold text-zinc-100 font-mono">{hackathon.submissionsCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      Prize Pool
                    </span>
                    <span className="font-semibold text-orange-400 font-mono">{hackathon.prizes.totalPool}</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Submission Deadline:</span>
                    <span className="font-mono text-zinc-200">
                      {new Date(hackathon.schedule.submissionDeadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Judging Protocol:</span>
                    <span className="font-mono text-zinc-300">
                      {hackathon.judging.blindJudging ? 'Double-Blind' : 'Standard'} (
                      {hackathon.judging.requiredJudgesPerProject} Jurors/Project)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[#2A2A2A] mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/organizer/hackathons/${hackathon.id}`)}
                >
                  Configure Track
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate('/organizer/judging')}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Jury Room
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
