import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantService } from '../../services/participant/participantService';
import {
  ParticipantHackathon,
  ParticipantTeam,
  ParticipantProject,
  ParticipantSubmission,
} from '../../types/participant';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  ArrowRight,
  Loader2,
  FolderGit2,
  Send,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PrimaryActionConfig {
  label: string;
  path: string;
  icon: React.ReactNode;
  subtitle: string;
}

export const ParticipantHackathons: React.FC = () => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState<ParticipantHackathon[]>([]);
  const [teams, setTeams] = useState<ParticipantTeam[]>([]);
  const [projects, setProjects] = useState<ParticipantProject[]>([]);
  const [submissions, setSubmissions] = useState<ParticipantSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParticipationData() {
      try {
        const [hList, tList, pList, sList] = await Promise.all([
          participantService.getHackathons(),
          participantService.getTeams(),
          participantService.getProjects(),
          participantService.getSubmissions(),
        ]);
        setHackathons(hList);
        setTeams(tList);
        setProjects(pList);
        setSubmissions(sList);
      } finally {
        setLoading(false);
      }
    }
    loadParticipationData();
  }, []);

  const tabs = [
    { id: 'all', label: 'All Enrolled', count: hackathons.length },
    { id: 'active', label: 'Active Sprints', count: hackathons.filter((h) => h.status === 'active').length },
    { id: 'registered', label: 'Upcoming', count: hackathons.filter((h) => h.status === 'registered').length },
    { id: 'completed', label: 'Completed', count: hackathons.filter((h) => h.status === 'completed').length },
  ];

  const filtered = hackathons.filter((h) => {
    if (activeTab === 'all') return true;
    return h.status === activeTab;
  });

  const getPrimaryAction = (
    h: ParticipantHackathon,
    team: ParticipantTeam | undefined,
    project: ParticipantProject | undefined,
    submission: ParticipantSubmission | undefined
  ): PrimaryActionConfig => {
    // 1. Evaluated -> View Results
    if (submission?.status === 'evaluated') {
      return {
        label: 'View Results',
        path: '/participant/submissions',
        icon: <Trophy className="w-4 h-4" />,
        subtitle: 'Consensus score and juror feedback finalized',
      };
    }

    // 2. Submitted or Under Review -> View Submission
    if (submission?.status === 'submitted' || submission?.status === 'under_review') {
      return {
        label: 'View Submission',
        path: '/participant/submissions',
        icon: <Send className="w-4 h-4" />,
        subtitle: 'Submission gate passed • Jury review in progress',
      };
    }

    // 3. Project ready for submission -> Submit Project
    if (project?.status === 'Ready for Submission') {
      return {
        label: 'Submit Project',
        path: '/participant/submissions',
        icon: <Send className="w-4 h-4" />,
        subtitle: 'Validation passed • Ready to ship to jury',
      };
    }

    // 4. Project in progress -> Continue Project
    if (project) {
      return {
        label: 'Continue Project',
        path: '/participant/projects',
        icon: <FolderGit2 className="w-4 h-4" />,
        subtitle: 'Update project repo, demo URL & architecture',
      };
    }

    // 5. Registered + Team -> Create Project
    if (team || h.teamName) {
      return {
        label: 'Create Project',
        path: '/participant/projects',
        icon: <FolderGit2 className="w-4 h-4" />,
        subtitle: 'Initialize project workspace for your squad',
      };
    }

    // 6. Registered solo -> Create Team
    return {
      label: 'Create Team',
      path: '/participant/teams',
      icon: <Users className="w-4 h-4" />,
      subtitle: 'Form or join a squad for this track sprint',
    };
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Hackathon Tracks"
        subtitle="Your central participation workspace: track registration status, squad formation, project code, and submission gates."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/hackathons')}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Browse New Tracks
          </Button>
        }
      />

      {/* Tabs Filter */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-16 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin mb-3" />
          <p className="text-xs text-[#A1A1A1]">Loading your participation records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-6 h-6" />}
          title="No hackathons in this filter"
          description="You don't have any enrolled hackathons under this category yet. Discover open tracks and apply to start building."
          actionLabel="Explore Arena Tracks"
          onAction={() => navigate('/hackathons')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((hackathon) => {
            const team = teams.find((t) => t.hackathonId === hackathon.id);
            const project = projects.find(
              (p) => p.hackathonId === hackathon.id || (team && p.teamId === team.id)
            );
            const submission = submissions.find(
              (s) => s.hackathonId === hackathon.id || (project && s.projectId === project.id)
            );

            const primaryAction = getPrimaryAction(hackathon, team, project, submission);

            return (
              <Card
                key={hackathon.id}
                className="flex flex-col justify-between hover:border-[#FF6B35]/40 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 p-5 sm:p-6 bg-[#181818]"
              >
                <div>
                  {/* Top Bar: Category, Status Badges & Track Link */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="orange" size="sm">
                        {hackathon.category}
                      </Badge>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                          hackathon.status === 'active'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : hackathon.status === 'completed'
                            ? 'bg-[#202020] text-[#A1A1A1] border-[#2A2A2A]'
                            : 'bg-[#202020] text-[#FF7F50] border-[#FF6B35]/30'
                        }`}
                      >
                        {hackathon.status === 'active'
                          ? 'Active Sprint'
                          : hackathon.status === 'completed'
                          ? 'Completed'
                          : 'Upcoming Sprint'}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#A1A1A1] hover:text-[#F5F5F0] transition-colors cursor-pointer"
                      title="View Public Track Details"
                    >
                      <span>Track Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-base sm:text-lg font-semibold text-[#F5F5F0] mb-3">
                    {hackathon.title}
                  </h3>

                  {/* 4-BLOCK STATUS MATRIX */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] mb-4 text-xs">
                    {/* 1. Status */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#A1A1A1] block">
                        Registration
                      </span>
                      <div className="flex items-center gap-1 text-[#F5F5F0] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="capitalize">{hackathon.registrationStatus}</span>
                      </div>
                    </div>

                    {/* 2. Team */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#A1A1A1] block">
                        Team
                      </span>
                      <div className="flex items-center gap-1 text-[#F5F5F0] font-medium truncate">
                        <Users className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0" />
                        <span className="truncate">
                          {team ? team.name : hackathon.teamName ? hackathon.teamName : 'Individual'}
                        </span>
                      </div>
                    </div>

                    {/* 3. Project */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#A1A1A1] block">
                        Project
                      </span>
                      <div className="flex items-center gap-1 text-[#F5F5F0] font-medium truncate">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#A1A1A1] flex-shrink-0" />
                        <span className="truncate">
                          {submission || project?.status === 'Submitted'
                            ? 'Submitted'
                            : project
                            ? project.status
                            : 'Not started'}
                        </span>
                      </div>
                    </div>

                    {/* 4. Submission */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#A1A1A1] block">
                        Submission
                      </span>
                      <div className="flex items-center gap-1 font-medium truncate">
                        <span
                          className={`text-[11px] truncate ${
                            submission?.status === 'evaluated'
                              ? 'text-purple-300 font-semibold'
                              : submission?.status === 'under_review'
                              ? 'text-amber-400'
                              : submission?.status === 'submitted'
                              ? 'text-emerald-400'
                              : 'text-[#A1A1A1]'
                          }`}
                        >
                          {submission
                            ? submission.status === 'evaluated'
                              ? `Evaluated (${submission.score ?? 'Final'}/100)`
                              : submission.status === 'under_review'
                              ? 'Under review'
                              : 'Submitted'
                            : 'Not submitted'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dates & Deadline Info */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-[#A1A1A1] px-1 mb-4 gap-2">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#A1A1A1]" />
                      <span>
                        {hackathon.startDate} – {hackathon.endDate}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[#FF7F50]">
                      <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>
                        Gate:{' '}
                        {hackathon.submissionDeadline
                          ? new Date(hackathon.submissionDeadline).toLocaleDateString()
                          : 'Open'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* BOTTOM: ONE PRIMARY NEXT ACTION */}
                <div className="pt-4 border-t border-[#2A2A2A] space-y-3">
                  <div className="bg-gradient-to-r from-[#1D1D1D] to-[#161616] p-3.5 rounded-lg border border-[#333333] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase text-[#FF6B35] font-semibold">
                          Recommended Next Action
                        </span>
                      </div>
                      <p className="text-xs text-[#A1A1A1] mt-0.5">{primaryAction.subtitle}</p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(primaryAction.path)}
                      icon={primaryAction.icon}
                      className="shadow-sm flex-shrink-0"
                    >
                      {primaryAction.label}
                    </Button>
                  </div>

                  {/* Secondary Quick Navigation Links */}
                  <div className="flex items-center justify-between text-[11px] text-[#A1A1A1] px-1">
                    <button
                      onClick={() => navigate('/participant/teams')}
                      className="hover:text-[#F5F5F0] transition-colors cursor-pointer"
                    >
                      Squad Hub
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => navigate('/participant/projects')}
                      className="hover:text-[#F5F5F0] transition-colors cursor-pointer"
                    >
                      Projects
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => navigate('/participant/submissions')}
                      className="hover:text-[#F5F5F0] transition-colors cursor-pointer"
                    >
                      Submission Gate
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
