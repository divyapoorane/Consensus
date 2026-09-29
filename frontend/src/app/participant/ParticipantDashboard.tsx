import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/MockAuthProvider';
import { participantService } from '../../services/participant/participantService';
import {
  ParticipantHackathon,
  ParticipantTeam,
  ParticipantProject,
  ParticipantSubmission,
} from '../../types/participant';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { MetricStrip } from '../../components/shared/MetricStrip';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Trophy,
  Users,
  FolderGit2,
  Send,
  Sparkles,
  Loader2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Target,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const ParticipantDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hackathons, setHackathons] = useState<ParticipantHackathon[]>([]);
  const [teams, setTeams] = useState<ParticipantTeam[]>([]);
  const [projects, setProjects] = useState<ParticipantProject[]>([]);
  const [submissions, setSubmissions] = useState<ParticipantSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
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
    loadDashboardData();
  }, []);

  const activeHackathons = hackathons.filter((h) => h.status === 'active' || h.status === 'registered');
  const primaryHackathon = activeHackathons[0] || hackathons[0];

  const primaryTeam = teams.find((t) => t.hackathonId === primaryHackathon?.id);
  const primaryProject = projects.find(
    (p) => p.hackathonId === primaryHackathon?.id || (primaryTeam && p.teamId === primaryTeam.id)
  );
  const primarySubmission = submissions.find(
    (s) => s.hackathonId === primaryHackathon?.id || (primaryProject && s.projectId === primaryProject.id)
  );

  // Real 7-Gate Mission Timeline based on actual data
  const timelineGates = [
    { key: 'account', label: 'ACCOUNT', complete: true, active: false },
    { key: 'registered', label: 'REGISTERED', complete: !!primaryHackathon, active: !primaryTeam },
    { key: 'team', label: 'TEAM', complete: !!primaryTeam || !!primaryHackathon?.teamName, active: (!!primaryTeam || !!primaryHackathon?.teamName) && !primaryProject },
    { key: 'build', label: 'BUILD', complete: !!primaryProject, active: !!primaryProject && !primarySubmission },
    { key: 'submit', label: 'SUBMIT', complete: !!primarySubmission, active: !!primarySubmission && primarySubmission.status === 'submitted' },
    { key: 'judging', label: 'JUDGING', complete: primarySubmission?.status === 'under_review' || primarySubmission?.status === 'evaluated', active: primarySubmission?.status === 'under_review' },
    { key: 'result', label: 'RESULT', complete: primarySubmission?.status === 'evaluated', active: primarySubmission?.status === 'evaluated' },
  ];

  const getNextObjective = () => {
    if (primarySubmission?.status === 'evaluated') {
      return {
        title: 'Review Final Consensus Outcome',
        description: 'Jury consensus scoring is locked and official results are published.',
        actionLabel: 'View Results & Credentials',
        path: '/participant/submissions',
        icon: <Trophy className="w-3.5 h-3.5" />,
      };
    }
    if (primarySubmission) {
      return {
        title: 'Submission In Double-Blind Jury Deliberation',
        description: 'Payload is locked. Jurors are scoring across innovation, code quality, and UX.',
        actionLabel: 'Monitor Deliberation',
        path: '/participant/submissions',
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
      };
    }
    if (primaryProject?.status === 'Ready for Submission') {
      return {
        title: 'Complete Project Submission',
        description: 'Prototype ready for launch. Complete pre-flight checks and launch before deadline.',
        actionLabel: 'Launch Submission Sequence',
        path: '/participant/submissions',
        icon: <Send className="w-3.5 h-3.5" />,
      };
    }
    if (primaryProject) {
      return {
        title: 'Advance Prototype Engineering',
        description: 'Connect repository, deploy live endpoint, and verify technical requirements.',
        actionLabel: 'Open Build Bay',
        path: '/participant/projects',
        icon: <FolderGit2 className="w-3.5 h-3.5" />,
      };
    }
    if (primaryTeam) {
      return {
        title: 'Initialize Mission Project Workspace',
        description: 'Squad assembled. Initialize the code workspace and declare repository.',
        actionLabel: 'Create Project Workspace',
        path: '/participant/projects',
        icon: <FolderGit2 className="w-3.5 h-3.5" />,
      };
    }
    if (primaryHackathon) {
      return {
        title: 'Mobilize Squad or Declare Solo',
        description: 'Issue encrypted join codes to squad members or proceed as solo developer.',
        actionLabel: 'Configure Squad Command',
        path: '/participant/teams',
        icon: <Users className="w-3.5 h-3.5" />,
      };
    }
    return {
      title: 'Enter Active Arena Mission',
      description: 'Explore live hackathon tracks and register your builder entry.',
      actionLabel: 'Browse Active Missions',
      path: '/hackathons',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    };
  };

  const nextObjective = getNextObjective();

  return (
    <div className="space-y-6">
      {/* Dashboard Mission Header */}
      <DashboardHeader
        title="Your Mission Control"
        subtitle={`Operator: ${user?.name || 'Builder'} • Realtime Telemetry: Active Squad Coordinates, Codebase Bays, and Consensus Gates.`}
        badge={<StatusBeacon status="active" label="OPERATIONAL" />}
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/hackathons')}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Explore Active Missions
          </Button>
        }
      />

      {loading ? (
        <div className="bg-[#0D1220] border border-[#182238] rounded-xl p-16 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin mb-3" />
          <p className="text-xs font-mono text-[#8E9BB5]">Synchronizing mission telemetry...</p>
        </div>
      ) : hackathons.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-8 h-8 text-[#FF5500]" />}
          title="No active mission assignments"
          description="You are not enrolled in any hackathons. Enter an active mission track to form a squad, build projects, and compete under double-blind jury consensus."
          actionLabel="Explore Active Missions"
          onAction={() => navigate('/hackathons')}
        />
      ) : (
        <>
          {/* REAL TELEMETRY STRIP */}
          <MetricStrip
            items={[
              {
                label: 'Enrolled Missions',
                value: hackathons.length,
                subtext: 'Active Competitions',
                icon: <Trophy className="w-4 h-4" />,
                accent: 'orange',
                highlight: true,
              },
              {
                label: 'Squad Roster',
                value: teams.length,
                subtext: 'Mobilized Units',
                icon: <Users className="w-4 h-4" />,
                accent: 'emerald',
              },
              {
                label: 'Build Bay Projects',
                value: projects.length,
                subtext: 'Prototypes Active',
                icon: <FolderGit2 className="w-4 h-4" />,
                accent: 'cyan',
              },
              {
                label: 'Jury Gate Payload',
                value: submissions.length,
                subtext: 'Deliberation Gates',
                icon: <Send className="w-4 h-4" />,
                accent: 'amber',
              },
            ]}
          />

          {/* PROMINENT AREA: CURRENT MISSION & NEXT OBJECTIVE */}
          {primaryHackathon && (
            <div className="bg-[#0D1220]/95 border border-[#182238] rounded-xl p-5 sm:p-7 relative overflow-hidden shadow-xl space-y-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#FF5500]/50 before:to-transparent">
              {/* CURRENT MISSION BRIEFING */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#182238]">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-[#FF5500] uppercase bg-[#FF5500]/10 border border-[#FF5500]/30 px-2 py-0.5 rounded">
                      CURRENT MISSION
                    </span>
                    <Badge variant="orange" size="sm">
                      {primaryHackathon.category}
                    </Badge>
                    <StatusBeacon status="connected" label={primaryHackathon.status} />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F0F4FC] font-mono uppercase tracking-tight">
                    {primaryHackathon.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#8E9BB5]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>{primaryHackathon.date || 'Active Sprint'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#FF7722]" />
                      <span className="font-bold text-[#F0F4FC]">{primaryHackathon.prizePool}</span>
                    </span>
                    {primaryTeam && (
                      <span className="flex items-center gap-1.5 text-[#00E575]">
                        <Users className="w-3.5 h-3.5" />
                        <span>SQUAD: {primaryTeam.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/hackathons/${primaryHackathon.id}`)}
                    className="px-3.5 py-2 rounded-lg bg-[#11182B] hover:bg-[#162038] border border-[#182238] hover:border-[#00F0FF]/40 text-xs font-mono uppercase text-[#00F0FF] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Mission Spec</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* NEXT OBJECTIVE COMMAND CARD */}
              <div className="bg-[#090D18] border border-[#FF5500]/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FF5500]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5500] font-bold">
                      NEXT OBJECTIVE
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#F0F4FC] font-mono uppercase">
                    {nextObjective.title}
                  </h3>
                  <p className="text-xs text-[#8E9BB5] font-sans leading-relaxed">
                    {nextObjective.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(nextObjective.path)}
                  className="px-5 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF7722] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#FF5500]/25 hover:shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all cursor-pointer flex-shrink-0"
                >
                  {nextObjective.icon}
                  <span>{nextObjective.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 7-GATE MISSION TIMELINE */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9BB5] font-semibold">
                    MISSION TIMELINE PROTOCOL
                  </span>
                  <span className="text-[10px] font-mono text-[#00F0FF]">
                    {timelineGates.filter((g) => g.complete).length} / 7 VERIFIED GATES
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {timelineGates.map((gate, idx) => (
                    <div
                      key={gate.key}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        gate.complete
                          ? 'bg-[#090D18] border-[#00E575]/40 text-[#00E575]'
                          : gate.active
                          ? 'bg-[#11182B] border-[#FF5500] text-[#F0F4FC] shadow-[0_0_12px_rgba(255,85,0,0.2)]'
                          : 'bg-[#06080F]/60 border-[#182238] text-[#8E9BB5] opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-[9px] font-mono text-[#8E9BB5]">0{idx + 1}</span>
                        {gate.complete && <Check className="w-3 h-3 text-[#00E575]" />}
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase block tracking-wider truncate">
                        {gate.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SQUAD, BUILD BAY & JURY GATES OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Squad Command Panel */}
            <SystemPanel
              title="Squad Command Roster"
              badge={<TechnicalLabel label="UNITS" value={teams.length} variant="cyan" />}
              action={
                <button
                  onClick={() => navigate('/participant/teams')}
                  className="text-xs font-mono uppercase text-[#00F0FF] hover:underline flex items-center gap-1"
                >
                  <span>Manage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              }
              accent="cyan"
            >
              {teams.length === 0 ? (
                <p className="text-xs text-[#8E9BB5] font-mono">No active squads formed. Deploy or join via join code.</p>
              ) : (
                <div className="space-y-3">
                  {teams.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#F0F4FC] font-mono uppercase">{t.name}</p>
                        <p className="text-[10px] text-[#8E9BB5] font-mono">{t.hackathonTitle}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11182B] text-[#00F0FF] border border-[#00F0FF]/30">
                        {t.members?.length || 1} BUILDERS
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SystemPanel>

            {/* Build Bay Projects */}
            <SystemPanel
              title="Mission Build Bay"
              badge={<TechnicalLabel label="PROJECTS" value={projects.length} variant="orange" />}
              action={
                <button
                  onClick={() => navigate('/participant/projects')}
                  className="text-xs font-mono uppercase text-[#FF7722] hover:underline flex items-center gap-1"
                >
                  <span>Build Bay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              }
              accent="orange"
            >
              {projects.length === 0 ? (
                <p className="text-xs text-[#8E9BB5] font-mono">No codebase projects created yet. Form squad and initiate bay.</p>
              ) : (
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#F0F4FC] font-mono uppercase truncate">{p.title}</p>
                        <p className="text-[10px] text-[#8E9BB5] font-mono truncate">{p.hackathonTitle}</p>
                      </div>
                      <Badge variant={p.status === 'Submitted' ? 'emerald' : 'orange'} size="sm">
                        {p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </SystemPanel>
          </div>
        </>
      )}
    </div>
  );
};
