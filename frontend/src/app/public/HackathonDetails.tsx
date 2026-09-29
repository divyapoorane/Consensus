import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { SpaceBackground } from '../../components/orbital/SpaceBackground';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { useAuth } from '../../auth/MockAuthProvider';
import { organizerService } from '../../services/organizer/organizerService';
import { participantService } from '../../services/participant/participantService';
import { HackathonConfig } from '../../types/organizer';
import {
  ParticipantHackathon,
  ParticipantTeam,
  ParticipantProject,
  ParticipantSubmission,
} from '../../types/participant';
import { RegistrationWizardModal } from '../../components/registration/RegistrationWizardModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MetricStrip } from '../../components/shared/MetricStrip';
import {
  Calendar,
  Users,
  Trophy,
  ArrowLeft,
  Check,
  CheckCircle2,
  FileCode,
  Shield,
  Loader2,
  AlertCircle,
  FolderGit2,
  Send,
  UserCheck,
  Copy,
  Clock,
  Sparkles,
  ChevronRight,
  Scale,
  Cpu,
} from 'lucide-react';

export const HackathonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [rawHackathon, setRawHackathon] = useState<HackathonConfig | null>(null);
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // User Enrollment States
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userRegistration, setUserRegistration] = useState<ParticipantHackathon | null>(null);
  const [userTeam, setUserTeam] = useState<ParticipantTeam | null>(null);
  const [userProject, setUserProject] = useState<ParticipantProject | null>(null);
  const [userSubmission, setUserSubmission] = useState<ParticipantSubmission | null>(null);
  const [, setCheckingEnrollment] = useState(false);

  // Registration Wizard Modal State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchEnrollmentStatus = useCallback(async (hackathonId: string) => {
    if (!isAuthenticated) {
      setIsEnrolled(false);
      setUserRegistration(null);
      setUserTeam(null);
      setUserProject(null);
      setUserSubmission(null);
      return;
    }
    setCheckingEnrollment(true);
    try {
      const [enrolledHackathons, teams, projects, submissions] = await Promise.all([
        participantService.getHackathons(),
        participantService.getTeams(),
        participantService.getProjects(),
        participantService.getSubmissions(),
      ]);

      const foundReg = (enrolledHackathons || []).find((h) => h.id === hackathonId);
      if (foundReg) {
        setIsEnrolled(true);
        setUserRegistration(foundReg);
      } else {
        setIsEnrolled(false);
        setUserRegistration(null);
      }

      const foundTeam = (teams || []).find((t) => t.hackathonId === hackathonId);
      setUserTeam(foundTeam || null);

      const foundProject = (projects || []).find(
        (p) => p.hackathonId === hackathonId || (foundTeam && p.teamId === foundTeam.id)
      );
      setUserProject(foundProject || null);

      const foundSubmission = (submissions || []).find(
        (s) => s.hackathonId === hackathonId || (foundProject && s.projectId === foundProject.id)
      );
      setUserSubmission(foundSubmission || null);
    } catch (err) {
      console.warn('Failed to verify participant enrollment state:', err);
    } finally {
      setCheckingEnrollment(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      organizerService
        .getHackathonById(id)
        .then((data: any) => {
          if (data) {
            setRawHackathon(data);
            setHackathon({
              id: data.id,
              title: data.name || data.title,
              category: data.category,
              tagline: data.tagline,
              description: data.description,
              date: `${data.schedule?.registrationStart || ''} – ${data.schedule?.hackathonEnd || ''}`,
              participants: `${data.registrationsCount || 0} Registered Builders`,
              teamSize: `${data.participation?.minTeamSize || 1} – ${data.participation?.maxTeamSize || 4} Builders`,
              prizePool: data.prizes?.totalPool || data.totalPrizePool || '$0',
              status: data.status === 'active' || data.rawStatus === 'active' ? 'Registration Open' : 'Upcoming',
              tags: data.tags || [data.category?.split(' ')[0] || 'Tech', 'Open Track', 'Global'],
              participation: data.participation,
              schedule: data.schedule,
              prizes: data.prizes,
            });
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => {
          setNotFound(true);
        })
        .finally(() => {
          setLoading(false);
        });

      fetchEnrollmentStatus(id);
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id, fetchEnrollmentStatus]);

  const handleOpenRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/hackathons/${id}` } });
      return;
    }
    setWizardOpen(true);
  };

  const handleRegistrationSuccess = () => {
    if (id) {
      fetchEnrollmentStatus(id);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Determine orbital timeline stages
  const timelineStages = [
    { key: 'reg', label: '01 REGISTRATION', active: true },
    { key: 'build', label: '02 BUILD BAY', active: isEnrolled },
    { key: 'submit', label: '03 SUBMISSION', active: !!userProject },
    { key: 'judge', label: '04 JUDGING', active: !!userSubmission },
    { key: 'results', label: '05 RESULTS', active: userSubmission?.status === 'evaluated' },
  ];

  return (
    <div className="relative min-h-screen bg-[#06080F] text-[#F0F4FC] flex flex-col justify-between selection:bg-[#FF5500]/30 selection:text-[#FFFFFF] overflow-x-hidden font-sans">
      <SpaceBackground />

      <Navbar
        session={{
          isLoggedIn: isAuthenticated,
          name: user?.name || '',
          role: user?.role || 'participant',
          email: user?.email || '',
        }}
        onLogout={logout}
      />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1">
        <button
          onClick={() => navigate('/hackathons')}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#00F0FF] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Active Missions</span>
        </button>

        {loading ? (
          <div className="bg-[#0D1220] border border-[#182238] rounded-xl p-16 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin mb-3" />
            <p className="text-xs font-mono text-[#8E9BB5]">Loading mission telemetry...</p>
          </div>
        ) : notFound || !hackathon ? (
          <div className="bg-[#0D1220] border border-[#182238] rounded-xl p-12 text-center">
            <AlertCircle className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-[#F0F4FC] font-mono uppercase">Mission Not Found</h2>
            <p className="text-xs text-[#8E9BB5] mt-1 max-w-md mx-auto">
              The requested hackathon challenge does not exist or may have been archived.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/hackathons')}
              className="mt-5"
            >
              Explore Active Missions
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* MISSION CONTROL TOP BRIEFING */}
            <div className="bg-[#0D1220]/95 border border-[#182238] rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.7)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#FF5500]/40 before:to-transparent">
              {/* Mission ID + Status Beacons */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <TechnicalLabel label="MISSION ID" value={hackathon.id.slice(0, 8).toUpperCase()} variant="orange" />
                  <Badge variant="orange" size="sm">
                    {hackathon.category}
                  </Badge>
                  <StatusBeacon
                    status={hackathon.status === 'Registration Open' ? 'connected' : 'warning'}
                    label={hackathon.status}
                  />
                </div>

                {isEnrolled && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[10px] font-bold uppercase bg-emerald-950/60 border border-emerald-500/40 text-[#00E575]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E575]" />
                    <span>ENROLLED BUILDER ({userRegistration?.registrationStatus || 'ACTIVE'})</span>
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h1 className="text-2xl sm:text-4xl font-bold text-[#F0F4FC] tracking-tight mb-2 font-mono uppercase">
                {hackathon.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#8E9BB5] max-w-3xl leading-relaxed mb-6 font-sans">
                {hackathon.tagline}
              </p>

              {/* Telemetry Metric Strip */}
              <div className="mb-6">
                <MetricStrip
                  items={[
                    {
                      label: 'Sprint Timeline',
                      value: hackathon.date || 'TBA',
                      subtext: 'Registration to Final Gate',
                      icon: <Calendar className="w-4 h-4" />,
                      accent: 'cyan',
                    },
                    {
                      label: 'Squad Constraints',
                      value: hackathon.teamSize,
                      subtext: 'Cross-Disciplinary Roster',
                      icon: <Users className="w-4 h-4" />,
                      accent: 'emerald',
                    },
                    {
                      label: 'Escrow Prize Pool',
                      value: hackathon.prizePool,
                      subtext: 'Consensus Disbursed',
                      icon: <Trophy className="w-4 h-4" />,
                      highlight: true,
                      accent: 'orange',
                    },
                    {
                      label: 'Entry Mode',
                      value: isEnrolled ? 'Enrolled' : 'Open Entry',
                      subtext: hackathon.participation?.format || 'Solo or Squad',
                      icon: <Shield className="w-4 h-4" />,
                      accent: 'violet',
                    },
                  ]}
                />
              </div>

              {/* ORBITAL TIMELINE TRACK */}
              <div className="mb-6 bg-[#090D18] border border-[#182238] rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#182238]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E9BB5] font-semibold">
                    ORBITAL MISSION TIMELINE
                  </span>
                  <span className="text-[10px] font-mono text-[#00F0FF]">
                    {isEnrolled ? 'ACTIVE FLIGHT' : 'REGISTRATION PHASE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                  {timelineStages.map((stage, idx) => (
                    <div
                      key={stage.key}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        stage.active
                          ? 'bg-[#0D1220] border-[#FF5500]/50 text-[#F0F4FC] shadow-sm'
                          : 'bg-[#06080F]/50 border-[#182238] text-[#8E9BB5] opacity-50'
                      }`}
                    >
                      <span className="text-[9px] font-mono block text-[#8E9BB5] mb-0.5">
                        GATE 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase block truncate">
                        {stage.label.split(' ')[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ENROLLED BUILDER MILESTONE STRIP */}
              {isEnrolled && (
                <div className="mb-6 p-4 sm:p-5 rounded-xl bg-[#090D18] border border-[#182238] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00E575] animate-ping" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E575] font-bold">
                        Current Mission Objective
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#F0F4FC] font-mono">
                      {userSubmission?.status === 'evaluated'
                        ? 'Review Official Consensus Score & Jury Feedback'
                        : userSubmission
                        ? 'Project Shipped — Awaiting Double-Blind Jury Deliberation'
                        : userProject?.status === 'Ready for Submission'
                        ? 'Deliverable Ready — Run Pre-Flight Validation & Submit'
                        : userProject
                        ? 'Prototype In Development — Continue in Workspace'
                        : userTeam
                        ? 'Squad Formed — Initialize Project Workspace'
                        : 'Assemble Your Squad or Launch Workspace'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {userSubmission?.status === 'evaluated' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/participant/submissions')}
                        icon={<Trophy className="w-3.5 h-3.5" />}
                      >
                        View Results
                      </Button>
                    ) : userSubmission ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/participant/submissions')}
                        icon={<Send className="w-3.5 h-3.5" />}
                      >
                        View Submission
                      </Button>
                    ) : userProject?.status === 'Ready for Submission' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/participant/submissions')}
                        icon={<Send className="w-3.5 h-3.5" />}
                      >
                        Submit to Jury Gate
                      </Button>
                    ) : userProject ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/participant/projects')}
                        icon={<FolderGit2 className="w-3.5 h-3.5" />}
                      >
                        Open Build Bay
                      </Button>
                    ) : userTeam ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/participant/projects')}
                        icon={<FolderGit2 className="w-3.5 h-3.5" />}
                      >
                        Create Project
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/participant/teams')}
                        icon={<Users className="w-3.5 h-3.5" />}
                      >
                        Squad Command
                      </Button>
                    )}

                    {userTeam?.inviteCode && (
                      <button
                        onClick={() => handleCopyCode(userTeam.inviteCode)}
                        className="px-3 py-1.5 rounded-lg bg-[#0D1220] hover:bg-[#11182B] border border-[#182238] text-xs font-mono text-[#00F0FF] transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Copy Squad Join Code"
                      >
                        <span className="text-[10px] text-[#8E9BB5]">JOIN:</span>
                        <span className="font-bold">{userTeam.inviteCode}</span>
                        {copiedCode ? (
                          <Check className="w-3 h-3 text-[#00E575]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#8E9BB5]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tag Row & ENTER MISSION Action Button */}
              <div className="flex flex-wrap gap-3 items-center justify-between pt-4 border-t border-[#182238]">
                <div className="flex flex-wrap gap-1.5">
                  {(hackathon.tags || []).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-[#8E9BB5] px-2.5 py-0.5 rounded bg-[#090D18] border border-[#182238]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {!isEnrolled ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleOpenRegister}
                    icon={<Sparkles className="w-4 h-4" />}
                    className="shadow-lg shadow-[#FF5500]/25"
                  >
                    {isAuthenticated ? 'Enter Mission' : 'Sign In to Enter Mission'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/participant/hackathons')}
                  >
                    My Missions Hub
                  </Button>
                )}
              </div>
            </div>

            {/* MISSION CONTROL SPECIFICATIONS & JURY PROTOCOL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols): Challenge Scope & Deliverables */}
              <div className="lg:col-span-8 space-y-6">
                <SystemPanel
                  title="Mission Brief & Engineering Scope"
                  badge={<StatusBeacon status="live" label="SPECIFICATION" />}
                  accent="orange"
                >
                  <p className="text-xs sm:text-sm text-[#8E9BB5] leading-relaxed mb-6 font-sans">
                    {hackathon.description ||
                      'Participants are expected to build open-source prototypes addressing real-world coordination problems. Submissions will be evaluated by an impartial jury panel via double-blind consensus scoring.'}
                  </p>

                  <h4 className="font-bold text-[#F0F4FC] text-xs uppercase tracking-wider font-mono mb-3">
                    Verified Deliverable Checklist:
                  </h4>
                  <div className="space-y-2.5">
                    {Array.isArray(hackathon.participation?.requirements) &&
                    hackathon.participation.requirements.length > 0 ? (
                      hackathon.participation.requirements.map((req: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-start gap-2.5 text-xs text-[#D1D1D1] font-mono"
                        >
                          <Check className="w-4 h-4 text-[#00E575] flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-start gap-2.5 text-xs text-[#D1D1D1] font-mono">
                          <Check className="w-4 h-4 text-[#00E575] flex-shrink-0 mt-0.5" />
                          <span>Public repository containing complete source code, test coverage, and documentation.</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-start gap-2.5 text-xs text-[#D1D1D1] font-mono">
                          <Check className="w-4 h-4 text-[#00E575] flex-shrink-0 mt-0.5" />
                          <span>Working deployment or live demo URL accessible via public HTTPS.</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-start gap-2.5 text-xs text-[#D1D1D1] font-mono">
                          <Check className="w-4 h-4 text-[#00E575] flex-shrink-0 mt-0.5" />
                          <span>Architecture breakdown diagram or video pitch showcasing the implementation.</span>
                        </div>
                      </>
                    )}
                  </div>
                </SystemPanel>

                {/* Prize Pool Breakdown */}
                {hackathon.prizes?.tiers && hackathon.prizes.tiers.length > 0 && (
                  <SystemPanel
                    title="Escrow Prize Distribution"
                    badge={<TechnicalLabel label="STATUS" value="LOCKED" variant="orange" />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {hackathon.prizes.tiers.map((tier: any) => (
                        <div
                          key={tier.id}
                          className="p-3.5 rounded-lg bg-[#090D18] border border-[#182238] space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#F0F4FC] font-mono uppercase">{tier.title}</span>
                            <span className="text-xs font-mono font-bold text-[#FF7722]">{tier.amount}</span>
                          </div>
                          {tier.description && (
                            <p className="text-[11px] text-[#8E9BB5]">{tier.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </SystemPanel>
                )}
              </div>

              {/* Right Column (4 cols): Eligibility, Rules, Protocol */}
              <div className="lg:col-span-4 space-y-4">
                <SystemPanel title="Eligibility & Constraints" accent="cyan">
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-[#090D18] border border-[#182238]">
                      <p className="text-[10px] text-[#8E9BB5] uppercase mb-0.5">ELIGIBILITY</p>
                      <p className="text-[#F0F4FC]">
                        {hackathon.participation?.eligibility ||
                          'Open to all verified builders, students, and professionals globally.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#090D18] border border-[#182238]">
                      <p className="text-[10px] text-[#8E9BB5] uppercase mb-0.5">JURISDICTION</p>
                      <p className="text-[#F0F4FC]">
                        {hackathon.participation?.geographicRestrictions || 'Global / Unrestricted'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#090D18] border border-[#182238]">
                      <p className="text-[10px] text-[#8E9BB5] uppercase mb-0.5">SQUAD STRUCTURE</p>
                      <p className="text-[#F0F4FC]">
                        {hackathon.participation?.format === 'individual'
                          ? 'Solo Builders only'
                          : hackathon.participation?.format === 'team'
                          ? `Squads only (${hackathon.participation?.minTeamSize || 2} - ${hackathon.participation?.maxTeamSize || 4} members)`
                          : `Solo or Squads (Up to ${hackathon.participation?.maxTeamSize || 4} members)`}
                      </p>
                    </div>
                  </div>
                </SystemPanel>

                <SystemPanel title="Consensus Protocol" accent="green">
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-[#090D18] border border-[#182238]">
                      <p className="text-[10px] text-[#00E575] uppercase mb-0.5">
                        Double-Blind Jury Matrix
                      </p>
                      <p className="text-[#8E9BB5] font-sans">
                        Jurors score submissions without author identity or institutional affiliation to guarantee pure meritocracy.
                      </p>
                    </div>
                    <div className="p-2.5 rounded bg-[#090D18] border border-[#182238]">
                      <p className="text-[10px] text-[#00F0FF] uppercase mb-0.5">
                        Variance Normalization
                      </p>
                      <p className="text-[#8E9BB5] font-sans">
                        Automated mathematical outlier detection flags scoring discrepancies to protect builders from skewed evaluations.
                      </p>
                    </div>
                  </div>
                </SystemPanel>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* REGISTRATION WIZARD MODAL */}
      {wizardOpen && (rawHackathon || hackathon) && (
        <RegistrationWizardModal
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          hackathon={rawHackathon || hackathon}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};
