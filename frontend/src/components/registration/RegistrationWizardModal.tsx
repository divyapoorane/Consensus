import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantService } from '../../services/participant/participantService';
import { ParticipantProfile } from '../../types/participant';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  X,
  Check,
  CheckCircle2,
  Users,
  User,
  Shield,
  ArrowRight,
  ArrowLeft,
  Copy,
  AlertCircle,
  Loader2,
  Calendar,
  Trophy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface RegistrationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: any;
  onRegistrationSuccess: () => void;
}

type WizardStep = 'eligibility' | 'format' | 'profile' | 'team' | 'review' | 'confirmed';

export const RegistrationWizardModal: React.FC<RegistrationWizardModalProps> = ({
  isOpen,
  onClose,
  hackathon,
  onRegistrationSuccess,
}) => {
  const navigate = useNavigate();

  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>('eligibility');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Eligibility
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);

  // Step 2: Participation Format ('individual' | 'team')
  const allowedFormat = hackathon?.participation?.format || 'both';
  const defaultFormat = allowedFormat === 'team' ? 'team' : 'individual';
  const [participationFormat, setParticipationFormat] = useState<'individual' | 'team'>(defaultFormat);

  // Step 3: Profile Reuse & Required Information
  const [profile, setProfile] = useState<ParticipantProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [collegeInput, setCollegeInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [githubInput, setGithubInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  // Step 4: Team Setup (If format === 'team')
  const [teamOption, setTeamOption] = useState<'create' | 'join' | 'later'>('create');
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');

  // Step 6: Confirmation result
  const [createdTeamCode, setCreatedTeamCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch profile on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('eligibility');
      setEligibilityConfirmed(false);
      setErrorMessage(null);
      setCreatedTeamCode(null);
      setCopiedCode(false);

      setLoadingProfile(true);
      participantService
        .getProfile()
        .then((p) => {
          setProfile(p);
          setCollegeInput(p.college || '');
          setSkillsInput(Array.isArray(p.skills) ? p.skills.join(', ') : '');
          setGithubInput(p.github || '');
          setCityInput(p.city || '');
          setCountryInput(p.country || '');
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !hackathon) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Step Progression Logic
  const handleNextFromEligibility = () => {
    if (!eligibilityConfirmed) return;
    setCurrentStep('format');
  };

  const handleNextFromFormat = () => {
    setCurrentStep('profile');
  };

  const handleNextFromProfile = async () => {
    setErrorMessage(null);

    const effectiveCollege = (collegeInput.trim() || profile?.college || '').trim();
    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const effectiveSkills = skillsArray.length > 0 ? skillsArray : (profile?.skills || []);
    const effectiveGithub = (githubInput.trim() || profile?.github || '').trim();

    // Enforce required information
    const missingFields: string[] = [];
    if (!effectiveCollege) missingFields.push('University / Institution / Organization');
    if (!effectiveSkills || effectiveSkills.length === 0) missingFields.push('Primary Technical Skills');
    if (!effectiveGithub) missingFields.push('GitHub Profile URL');

    if (missingFields.length > 0) {
      setErrorMessage(
        `Required information missing: ${missingFields.join(', ')}. Please provide these details to register for this competition.`
      );
      return;
    }

    try {
      const updates: Partial<ParticipantProfile> = {};
      if (collegeInput.trim() && collegeInput.trim() !== profile?.college) updates.college = collegeInput.trim();
      if (githubInput.trim() && githubInput.trim() !== profile?.github) updates.github = githubInput.trim();
      if (cityInput.trim() && cityInput.trim() !== profile?.city) updates.city = cityInput.trim();
      if (countryInput.trim() && countryInput.trim() !== profile?.country) updates.country = countryInput.trim();
      if (skillsArray.length > 0) updates.skills = skillsArray;

      if (Object.keys(updates).length > 0) {
        await participantService.updateProfile(updates);
        if (profile) setProfile({ ...profile, ...updates });
      }

      if (participationFormat === 'team') {
        setCurrentStep('team');
      } else {
        setCurrentStep('review');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save updated profile details');
    }
  };

  const handleNextFromTeam = () => {
    setErrorMessage(null);
    if (teamOption === 'create' && !newTeamName.trim()) {
      setErrorMessage('Please provide a squad name to continue.');
      return;
    }
    if (teamOption === 'join' && !inviteCodeInput.trim()) {
      setErrorMessage('Please provide a valid squad invite code to continue.');
      return;
    }
    setCurrentStep('review');
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (participationFormat === 'team' && teamOption === 'create') {
        // Create team: this automatically confirms registration in the backend
        const createdTeam = await participantService.createTeam({
          name: newTeamName.trim(),
          hackathonId: hackathon.id,
          hackathonTitle: hackathon.title || hackathon.name,
        });
        if (createdTeam?.inviteCode) {
          setCreatedTeamCode(createdTeam.inviteCode);
        }
      } else if (participationFormat === 'team' && teamOption === 'join') {
        // Join team: this automatically confirms registration in the backend
        const joined = await participantService.joinTeam(inviteCodeInput.trim());
        if (!joined) {
          throw new Error('Squad invite code was invalid or not found. Please verify the code.');
        }
      } else {
        // Solo builder or team formation later
        await participantService.registerForHackathon(hackathon.id);
      }

      // Notify parent to refetch registration and state
      onRegistrationSuccess();
      setCurrentStep('confirmed');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please check network connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderProgressIndicator = () => {
    const steps: { id: WizardStep; label: string }[] = [
      { id: 'eligibility', label: 'Eligibility' },
      { id: 'format', label: 'Participation' },
      { id: 'profile', label: 'Profile' },
      ...(participationFormat === 'team' ? [{ id: 'team' as WizardStep, label: 'Squad' }] : []),
      { id: 'review', label: 'Review' },
    ];

    const currentIdx = steps.findIndex((s) => s.id === currentStep);

    return (
      <div className="flex items-center justify-between mb-6 px-1">
        {steps.map((s, idx) => {
          const isDone = currentIdx > idx || currentStep === 'confirmed';
          const isCurrent = currentStep === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-[#FF6B35] text-white shadow-sm'
                      : 'bg-[#202020] text-[#A1A1A1] border border-[#2A2A2A]'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-1 hidden sm:block ${
                    isCurrent ? 'text-[#F5F5F0] font-medium' : 'text-[#A1A1A1]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-[1px] mx-2 transition-colors ${
                    currentIdx > idx ? 'bg-emerald-500/40' : 'bg-[#2A2A2A]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#181818] border border-[#2A2A2A] rounded-2xl p-5 sm:p-7 text-[#F5F5F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2A2A2A] mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="orange" size="sm">
                Registration Gate
              </Badge>
              <span className="text-xs text-[#A1A1A1] font-mono">{hackathon.category}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F0] leading-snug font-display">
              {hackathon.title || hackathon.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close registration modal"
            className="p-1.5 text-[#A1A1A1] hover:text-[#F5F5F0] rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker (unless confirmed) */}
        {currentStep !== 'confirmed' && renderProgressIndicator()}

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* STEP 1: ELIGIBILITY & GUIDELINES */}
          {currentStep === 'eligibility' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF7F50]">
                  <Shield className="w-4 h-4" />
                  <span>Competition Eligibility Criteria</span>
                </div>
                <p className="text-xs text-[#F5F5F0] leading-relaxed">
                  {hackathon.participation?.eligibility ||
                    'Open to all developers, researchers, and engineers globally. Participants must be at least 18 years old or possess legal guardian consent.'}
                </p>

                {hackathon.participation?.geographicRestrictions && (
                  <div className="pt-2 border-t border-[#2A2A2A] text-xs text-[#A1A1A1]">
                    <span className="font-medium text-[#F5F5F0]">Geographic Scope: </span>
                    {hackathon.participation.geographicRestrictions}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-2.5">
                <span className="text-xs font-semibold text-[#F5F5F0] block">
                  Mandatory Submission Deliverables:
                </span>
                <ul className="space-y-2 text-xs text-[#A1A1A1]">
                  {(hackathon.participation?.requirements || [
                    'Public GitHub/GitLab codebase repository with open-source licensing.',
                    'Working live deployment URL accessible during double-blind evaluation.',
                    'Architecture documentation specifying consensus and system components.',
                  ]).map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/20">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={eligibilityConfirmed}
                    onChange={(e) => setEligibilityConfirmed(e.target.checked)}
                    className="mt-0.5 rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#F5F5F0] leading-relaxed">
                    I confirm that I meet the eligibility requirements and agree to comply with the Consensus competition rules and code of conduct.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: PARTICIPATION FORMAT */}
          {currentStep === 'format' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F5F0]">Select Participation Structure</h3>
                <p className="text-xs text-[#A1A1A1] mt-0.5">
                  Choose whether you are competing as an individual or organizing a team.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Individual option */}
                {(allowedFormat === 'individual' || allowedFormat === 'both') && (
                  <div
                    onClick={() => setParticipationFormat('individual')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      participationFormat === 'individual'
                        ? 'bg-[#202020] border-[#FF6B35] shadow-sm'
                        : 'bg-[#141414] border-[#2A2A2A] hover:border-[#383838]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#242424] flex items-center justify-center text-[#FF7F50]">
                          <User className="w-4 h-4" />
                        </div>
                        {participationFormat === 'individual' && (
                          <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-[#F5F5F0]">Solo Builder</h4>
                      <p className="text-xs text-[#A1A1A1] mt-1 leading-relaxed">
                        Compete independently. You maintain full codebase ownership and represent yourself on the leaderboard.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 mt-3 block">1 Builder</span>
                  </div>
                )}

                {/* Team option */}
                {(allowedFormat === 'team' || allowedFormat === 'both') && (
                  <div
                    onClick={() => setParticipationFormat('team')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      participationFormat === 'team'
                        ? 'bg-[#202020] border-[#FF6B35] shadow-sm'
                        : 'bg-[#141414] border-[#2A2A2A] hover:border-[#383838]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#242424] flex items-center justify-center text-[#FF7F50]">
                          <Users className="w-4 h-4" />
                        </div>
                        {participationFormat === 'team' && (
                          <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-[#F5F5F0]">Team / Squad</h4>
                      <p className="text-xs text-[#A1A1A1] mt-1 leading-relaxed">
                        Form a squad with collaborators. Share invite codes, divide architecture roles, and pool rewards.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 mt-3 block">
                      {hackathon.participation?.minTeamSize || 1} – {hackathon.participation?.maxTeamSize || 4} Builders
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PROFILE REUSE & DATA ENRICHMENT */}
          {currentStep === 'profile' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F5F0]">Builder Profile & Technical Credentials</h3>
                <p className="text-xs text-[#A1A1A1] mt-0.5">
                  Information previously saved to your Consensus account is automatically reused.
                </p>
              </div>

              {loadingProfile ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-6 h-6 text-[#FF6B35] animate-spin mb-2" />
                  <span className="text-xs text-[#A1A1A1]">Loading verified profile...</span>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Reused Read-Only summary items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#A1A1A1]">Full Name</span>
                        <Badge variant="neutral" size="sm">ACCOUNT REQUIRED</Badge>
                      </div>
                      <span className="font-medium text-[#F5F5F0]">
                        {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (profile?.email ? profile.email.split('@')[0] : 'Builder')}
                      </span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">✓ Synced from Account</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#A1A1A1]">Registered Email</span>
                        <Badge variant="neutral" size="sm">ACCOUNT REQUIRED</Badge>
                      </div>
                      <span className="font-medium text-[#F5F5F0] truncate block">{profile?.email}</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">✓ Account Identity</span>
                    </div>
                  </div>

                  {/* Editable / Missing info fields */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-[#A1A1A1]">
                          University / Institution / Organization <span className="text-[#FF6B35]">*</span>
                        </label>
                        <Badge variant="orange" size="sm">PROFILE REQUIRED</Badge>
                      </div>
                      <Input
                        placeholder="e.g. Stanford University or Independent Lab"
                        value={collegeInput}
                        onChange={(e) => setCollegeInput(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-[#A1A1A1]">
                          Primary Technical Skills (comma separated) <span className="text-[#FF6B35]">*</span>
                        </label>
                        <Badge variant="orange" size="sm">PROFILE REQUIRED</Badge>
                      </div>
                      <Input
                        placeholder="e.g. Rust, TypeScript, PyTorch, React, Solidity"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-[#A1A1A1]">
                            GitHub Profile URL <span className="text-cyan-400">*</span>
                          </label>
                          <Badge variant="cyan" size="sm">HACKATHON REQUIRED</Badge>
                        </div>
                        <Input
                          placeholder="https://github.com/..."
                          value={githubInput}
                          onChange={(e) => setGithubInput(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-[#A1A1A1]">City / Region</label>
                          <span className="text-[10px] text-zinc-500 font-mono">OPTIONAL</span>
                        </div>
                        <Input
                          placeholder="e.g. San Francisco, CA"
                          value={cityInput}
                          onChange={(e) => setCityInput(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: TEAM SETUP (ONLY IF TEAM SELECTED) */}
          {currentStep === 'team' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F5F0]">Squad Formation</h3>
                <p className="text-xs text-[#A1A1A1] mt-0.5">
                  Launch a new team or enter an existing invite code to sync with your squad.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTeamOption('create')}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    teamOption === 'create'
                      ? 'bg-[#202020] border-[#FF6B35]'
                      : 'bg-[#141414] border-[#2A2A2A] hover:border-[#383838]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[#F5F5F0] block">Create Squad</span>
                  <span className="text-[10px] text-[#A1A1A1] mt-0.5 block">Be squad leader & invite peers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTeamOption('join')}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    teamOption === 'join'
                      ? 'bg-[#202020] border-[#FF6B35]'
                      : 'bg-[#141414] border-[#2A2A2A] hover:border-[#383838]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[#F5F5F0] block">Join Squad</span>
                  <span className="text-[10px] text-[#A1A1A1] mt-0.5 block">Use 8-character invite code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTeamOption('later')}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    teamOption === 'later'
                      ? 'bg-[#202020] border-[#FF6B35]'
                      : 'bg-[#141414] border-[#2A2A2A] hover:border-[#383838]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[#F5F5F0] block">Decide Later</span>
                  <span className="text-[10px] text-[#A1A1A1] mt-0.5 block">Form squad before deadline</span>
                </button>
              </div>

              {teamOption === 'create' && (
                <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-3">
                  <Input
                    label="Squad / Team Name"
                    required
                    placeholder="e.g. NeuralForge Autonomous"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                  <p className="text-[11px] text-[#A1A1A1]">
                    You will be assigned as <strong className="text-[#F5F5F0]">Team Leader</strong>. Upon confirmation, a shareable invite code will be generated for your collaborators.
                  </p>
                </div>
              )}

              {teamOption === 'join' && (
                <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-3">
                  <Input
                    label="Squad Invite Code"
                    required
                    placeholder="e.g. INV-8921"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                  />
                  <p className="text-[11px] text-[#A1A1A1]">
                    Enter the invite code generated by your squad leader. Joining a team automatically validates your hackathon registration.
                  </p>
                </div>
              )}

              {teamOption === 'later' && (
                <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs text-[#A1A1A1] space-y-1">
                  <p className="font-semibold text-[#F5F5F0]">Deferred Squad Formation</p>
                  <p>
                    You will be registered in this sprint as a solo builder. You can form or join a squad anytime from the My Teams dashboard before project submission.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: REVIEW & CONSENT */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F5F5F0]">Review Registration Details</h3>
                <p className="text-xs text-[#A1A1A1] mt-0.5">
                  Confirm your registration parameters before locking your participant entry.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A1A1A1]">Target Track:</span>
                  <span className="font-semibold text-[#F5F5F0]">{hackathon.title || hackathon.name}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A1A1A1]">Participation Mode:</span>
                  <span className="font-semibold text-[#FF7F50]">
                    {participationFormat === 'individual'
                      ? 'Solo Builder'
                      : teamOption === 'create'
                      ? `Squad Lead: "${newTeamName}"`
                      : teamOption === 'join'
                      ? `Joining Squad: "${inviteCodeInput}"`
                      : 'Team (Deferred Formation)'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A1A1A1]">Builder:</span>
                  <span className="text-[#F5F5F0]">
                    {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : profile?.email}
                  </span>
                </div>

                {collegeInput && (
                  <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
                    <span className="text-[#A1A1A1]">Institution:</span>
                    <span className="text-[#F5F5F0]">{collegeInput}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#A1A1A1]">Eligibility:</span>
                  <span className="text-emerald-400 font-medium">✓ Acknowledged & Verified</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1A1]">Prize Pool:</span>
                  <span className="font-mono text-[#FF7F50] font-semibold">{hackathon.prizePool}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#202020] border border-[#2A2A2A] text-[11px] text-[#A1A1A1]">
                Upon confirmation, your registration will be recorded in PostgreSQL and you will receive full workspace access for codebase submission.
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMED SUCCESS */}
          {currentStep === 'confirmed' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F5F5F0]">Registration Confirmed!</h3>
                <p className="text-xs text-[#A1A1A1] mt-1 max-w-md mx-auto">
                  You are officially enrolled in <strong className="text-[#F5F5F0]">{hackathon.title || hackathon.name}</strong>.
                </p>
              </div>

              {createdTeamCode && (
                <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] max-w-sm mx-auto text-center space-y-2">
                  <span className="text-[10px] font-mono text-[#A1A1A1] uppercase block font-semibold">
                    Your Squad Invite Code
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-mono font-bold text-[#FF7F50] bg-[#202020] px-3 py-1 rounded border border-[#2A2A2A]">
                      {createdTeamCode}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(createdTeamCode)}
                      icon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedCode ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <p className="text-[10px] text-[#A1A1A1]">
                    Share this code with up to {hackathon.participation?.maxTeamSize || 4} collaborators to join your squad.
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    onClose();
                    navigate('/participant/hackathons');
                  }}
                >
                  View in My Hackathons
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    onClose();
                    navigate('/participant/projects');
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Project Workspace
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {currentStep !== 'confirmed' && (
          <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A] mt-4">
            <div>
              {currentStep !== 'eligibility' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentStep === 'format') setCurrentStep('eligibility');
                    if (currentStep === 'profile') setCurrentStep('format');
                    if (currentStep === 'team') setCurrentStep('profile');
                    if (currentStep === 'review') {
                      setCurrentStep(participationFormat === 'team' ? 'team' : 'profile');
                    }
                  }}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>

              {currentStep === 'eligibility' && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!eligibilityConfirmed}
                  onClick={handleNextFromEligibility}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Confirm & Continue
                </Button>
              )}

              {currentStep === 'format' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextFromFormat}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Next: Profile Details
                </Button>
              )}

              {currentStep === 'profile' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextFromProfile}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {participationFormat === 'team' ? 'Next: Team Setup' : 'Next: Review'}
                </Button>
              )}

              {currentStep === 'team' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextFromTeam}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Next: Final Review
                </Button>
              )}

              {currentStep === 'review' && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={submitting}
                  onClick={handleFinalSubmit}
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Confirm Registration
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
