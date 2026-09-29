import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizerService } from '../../services/organizer/organizerService';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Calendar,
  Users,
  Trophy,
  Scale,
  Vote,
  Video,
  Scroll,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CreateHackathon: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Section 1: Basic Information
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Autonomous Systems & AI');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800');
  const [logoUrl, setLogoUrl] = useState('');

  // Section 2: Schedule
  const [registrationStart, setRegistrationStart] = useState('2026-10-01');
  const [registrationEnd, setRegistrationEnd] = useState('2026-10-15');
  const [hackathonStart, setHackathonStart] = useState('2026-10-16');
  const [hackathonEnd, setHackathonEnd] = useState('2026-10-25');
  const [submissionDeadline, setSubmissionDeadline] = useState('2026-10-24T23:59');
  const [judgingPeriod, setJudgingPeriod] = useState('Oct 25 – Oct 28, 2026');
  const [resultsDate, setResultsDate] = useState('2026-10-29');

  // Section 3: Participation
  const [participationFormat, setParticipationFormat] = useState<'individual' | 'team' | 'both'>('team');
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [eligibility, setEligibility] = useState('Open to all builders aged 18+ globally.');
  const [geographicRestrictions, setGeographicRestrictions] = useState('No restrictions (Global)');
  const [requirements] = useState<string[]>([
    'Public GitHub repository',
    'Live working URL endpoint',
    '3-minute pitch video walkthrough',
    'Architecture diagram',
  ]);

  // Section 4: Prizes
  const [totalPool, setTotalPool] = useState('$50,000');
  const [prizeTiers, setPrizeTiers] = useState([
    { id: '1', title: 'Grand Consensus Winner', amount: '$25,000', description: 'Highest overall jury composite score' },
    { id: '2', title: 'Runner-Up Track Excellence', amount: '$15,000', description: 'Second place composite score' },
    { id: '3', title: 'Breakthrough Innovation Prize', amount: '$10,000', description: 'Highest score in technical novelty' },
  ]);

  // Section 5: Judging
  const [requiredJudges, setRequiredJudges] = useState(3);
  const [blindJudging, setBlindJudging] = useState(true);
  const [rubric, setRubric] = useState([
    { id: '1', name: 'Innovation & Novelty', weight: 25, description: 'Uniqueness of approach and challenge fit' },
    { id: '2', name: 'Technical Execution & Rigor', weight: 35, description: 'Code quality, test coverage, and stability' },
    { id: '3', name: 'UI / UX Design', weight: 15, description: 'Intuitive user interface ergonomics' },
    { id: '4', name: 'Scalability & Practical Impact', weight: 25, description: 'Feasibility in production environments' },
  ]);

  // Section 6: Community Voting
  const [communityVotingEnabled, setCommunityVotingEnabled] = useState(true);
  const [votingPeriod, setVotingPeriod] = useState('Oct 25 – Oct 27, 2026');
  const [votingRules, setVotingRules] = useState('1 verified vote per registered platform account.');

  // Section 7: Presentation
  const [livePresentationEnabled, setLivePresentationEnabled] = useState(true);
  const [presentationDuration, setPresentationDuration] = useState(8);
  const [sessionSchedule, setSessionSchedule] = useState('Oct 27, 2026: 15:00 - 19:00 UTC');

  // Section 8: Certificates
  const [participantCertificate, setParticipantCertificate] = useState(true);
  const [winnerCertificate, setWinnerCertificate] = useState(true);
  const [judgeCertificate, setJudgeCertificate] = useState(true);

  const steps = [
    { num: 1, title: 'Basic Info', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { num: 2, title: 'Schedule', icon: <Calendar className="w-3.5 h-3.5" /> },
    { num: 3, title: 'Participation', icon: <Users className="w-3.5 h-3.5" /> },
    { num: 4, title: 'Prizes', icon: <Trophy className="w-3.5 h-3.5" /> },
    { num: 5, title: 'Judging', icon: <Scale className="w-3.5 h-3.5" /> },
    { num: 6, title: 'Voting', icon: <Vote className="w-3.5 h-3.5" /> },
    { num: 7, title: 'Presentation', icon: <Video className="w-3.5 h-3.5" /> },
    { num: 8, title: 'Certificates', icon: <Scroll className="w-3.5 h-3.5" /> },
  ];

  const handleDeploy = async () => {
    setIsSubmitting(true);
    await organizerService.createHackathon({
      name: name || 'Decentralized Consensus Sprint',
      tagline: tagline || 'Next-generation verifiable protocol sprint',
      description: description || 'Building resilient distributed consensus systems.',
      category,
      bannerUrl,
      logoUrl,
      status: 'active',
      schedule: {
        registrationStart,
        registrationEnd,
        hackathonStart,
        hackathonEnd,
        submissionDeadline,
        judgingPeriod,
        resultsDate,
      },
      participation: {
        format: participationFormat,
        minTeamSize,
        maxTeamSize,
        eligibility,
        geographicRestrictions,
        requirements,
      },
      prizes: {
        totalPool,
        tiers: prizeTiers,
      },
      judging: {
        rubric,
        requiredJudgesPerProject: requiredJudges,
        blindJudging,
      },
      communityVoting: {
        enabled: communityVotingEnabled,
        rules: votingRules,
      },
      presentation: {
        livePresentationEnabled,
        sessionSchedule,
        presentationDurationMinutes: presentationDuration,
      },
      certificates: {
        participantEnabled: participantCertificate,
        winnerEnabled: winnerCertificate,
        judgeEnabled: judgeCertificate,
      },
    });

    setIsSubmitting(false);
    navigate('/organizer/hackathons');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <button
        onClick={() => navigate('/organizer/hackathons')}
        className="inline-flex items-center gap-1.5 text-xs text-[#A1A1A1] hover:text-[#F5F5F0] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      <DashboardHeader
        title="Deploy New Hackathon Track"
        subtitle="Complete the specification to publish an arena challenge with automated jury rubrics."
      />

      {/* Step Navigation Pill Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-x-auto">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              currentStep === s.num
                ? 'bg-[#FF6B35] text-white shadow-sm'
                : currentStep > s.num
                ? 'text-[#FF7F50] hover:bg-white/[0.03]'
                : 'text-[#A1A1A1] hover:text-[#F5F5F0]'
            }`}
          >
            {s.icon}
            <span>{s.num}. {s.title}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Basic Information */}
      {currentStep === 1 && (
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            1. Basic Information
          </h3>
          <Input
            label="Hackathon Name"
            required
            placeholder="e.g. Autonomous Systems & AI Arena"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Tagline / Brief Hook"
            required
            placeholder="e.g. Scale decentralized autonomous agent clusters with deterministic reasoning"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-medium text-[#A1A1A1]">
              Detailed Challenge Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline mission, background, target architectural scope..."
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg p-2.5 text-[#F5F5F0] placeholder-[#666666] focus:outline-none focus:border-[#FF6B35] text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Track Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              label="Banner Image URL"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
          </div>
        </Card>
      )}

      {/* STEP 2: Schedule */}
      {currentStep === 2 && (
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            2. Lifecycle Schedule & Deadlines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Registration Opens"
              type="date"
              value={registrationStart}
              onChange={(e) => setRegistrationStart(e.target.value)}
            />
            <Input
              label="Registration Closes"
              type="date"
              value={registrationEnd}
              onChange={(e) => setRegistrationEnd(e.target.value)}
            />
            <Input
              label="Hackathon Kick-Off"
              type="date"
              value={hackathonStart}
              onChange={(e) => setHackathonStart(e.target.value)}
            />
            <Input
              label="Hackathon Ends"
              type="date"
              value={hackathonEnd}
              onChange={(e) => setHackathonEnd(e.target.value)}
            />
            <Input
              label="Submission Deadline"
              type="datetime-local"
              value={submissionDeadline}
              onChange={(e) => setSubmissionDeadline(e.target.value)}
            />
            <Input
              label="Results Declaration Date"
              type="date"
              value={resultsDate}
              onChange={(e) => setResultsDate(e.target.value)}
            />
          </div>
          <Input
            label="Judging Deliberation Window"
            value={judgingPeriod}
            onChange={(e) => setJudgingPeriod(e.target.value)}
            placeholder="e.g. Oct 25 – Oct 28, 2026"
          />
        </Card>
      )}

      {/* STEP 3: Participation */}
      {currentStep === 3 && (
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            3. Participation Rules & Squad Bounds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-medium text-[#A1A1A1]">
                Format
              </label>
              <select
                value={participationFormat}
                onChange={(e) => setParticipationFormat(e.target.value as any)}
                className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-[#F5F5F0] text-xs focus:outline-none focus:border-[#FF6B35]"
              >
                <option value="team">Team Only</option>
                <option value="individual">Individual Only</option>
                <option value="both">Both Individual & Team</option>
              </select>
            </div>
            <Input
              label="Minimum Squad Size"
              type="number"
              value={minTeamSize}
              onChange={(e) => setMinTeamSize(Number(e.target.value))}
            />
            <Input
              label="Maximum Squad Size"
              type="number"
              value={maxTeamSize}
              onChange={(e) => setMaxTeamSize(Number(e.target.value))}
            />
          </div>
          <Input
            label="Eligibility Criteria"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
          />
          <Input
            label="Geographic Restrictions"
            value={geographicRestrictions}
            onChange={(e) => setGeographicRestrictions(e.target.value)}
          />
        </Card>
      )}

      {/* STEP 4: Prizes */}
      {currentStep === 4 && (
        <Card className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
              4. Prize Pool & Escrow Tiers
            </h3>
            <span className="text-xs font-mono text-[#FF7F50] font-semibold">Total: {totalPool}</span>
          </div>
          <Input
            label="Total Prize Pool (USD/USDC)"
            value={totalPool}
            onChange={(e) => setTotalPool(e.target.value)}
          />

          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-medium text-[#A1A1A1] block">
              Tier Breakdown
            </span>
            {prizeTiers.map((tier, idx) => (
              <div key={tier.id} className="p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label={`Tier ${idx + 1} Title`}
                  value={tier.title}
                  onChange={(e) => {
                    const updated = [...prizeTiers];
                    updated[idx].title = e.target.value;
                    setPrizeTiers(updated);
                  }}
                />
                <Input
                  label="Amount"
                  value={tier.amount}
                  onChange={(e) => {
                    const updated = [...prizeTiers];
                    updated[idx].amount = e.target.value;
                    setPrizeTiers(updated);
                  }}
                />
                <Input
                  label="Description"
                  value={tier.description}
                  onChange={(e) => {
                    const updated = [...prizeTiers];
                    updated[idx].description = e.target.value;
                    setPrizeTiers(updated);
                  }}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* STEP 5: Judging */}
      {currentStep === 5 && (
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            5. Judging Rubric & Juror Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Required Juror Reviews per Project"
              type="number"
              value={requiredJudges}
              onChange={(e) => setRequiredJudges(Number(e.target.value))}
            />
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={blindJudging}
                  onChange={(e) => setBlindJudging(e.target.checked)}
                  className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#F5F5F0] block">Double-Blind Scoring</span>
                  <span className="text-[10px] text-[#A1A1A1]">Anonymize submission teams to prevent bias</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-medium text-[#A1A1A1] block">
              Scoring Criteria Matrix (Must total 100%)
            </span>
            {rubric.map((crit, idx) => (
              <div key={crit.id} className="p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    label="Criterion Name"
                    value={crit.name}
                    onChange={(e) => {
                      const updated = [...rubric];
                      updated[idx].name = e.target.value;
                      setRubric(updated);
                    }}
                  />
                </div>
                <Input
                  label="Weight (%)"
                  type="number"
                  value={crit.weight}
                  onChange={(e) => {
                    const updated = [...rubric];
                    updated[idx].weight = Number(e.target.value);
                    setRubric(updated);
                  }}
                />
                <Input
                  label="Description"
                  value={crit.description}
                  onChange={(e) => {
                    const updated = [...rubric];
                    updated[idx].description = e.target.value;
                    setRubric(updated);
                  }}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* STEP 6: Community Voting */}
      {currentStep === 6 && (
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            6. Community Voting Gate
          </h3>
          <label className="flex items-center gap-2.5 p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer">
            <input
              type="checkbox"
              checked={communityVotingEnabled}
              onChange={(e) => setCommunityVotingEnabled(e.target.checked)}
              className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#F5F5F0] block">Enable Public Community Choice Voting</span>
              <span className="text-[10px] text-[#A1A1A1]">Allows verified community members to vote on shortlisted submissions</span>
            </div>
          </label>

          {communityVotingEnabled && (
            <div className="space-y-3.5 pt-1">
              <Input
                label="Voting Period"
                value={votingPeriod}
                onChange={(e) => setVotingPeriod(e.target.value)}
              />
              <Input
                label="Voting Rules & Anti-Sybil Constraints"
                value={votingRules}
                onChange={(e) => setVotingRules(e.target.value)}
              />
            </div>
          )}
        </Card>
      )}

      {/* STEP 7: Presentation */}
      {currentStep === 7 && (
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            7. Live Presentation & Demo Day Sessions
          </h3>
          <label className="flex items-center gap-2.5 p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer">
            <input
              type="checkbox"
              checked={livePresentationEnabled}
              onChange={(e) => setLivePresentationEnabled(e.target.checked)}
              className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#F5F5F0] block">Require Live Finalist Pitches</span>
              <span className="text-[10px] text-[#A1A1A1]">Finalist teams present live in interactive juror presentation rooms</span>
            </div>
          </label>

          {livePresentationEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <Input
                label="Pitch Duration (Minutes per team)"
                type="number"
                value={presentationDuration}
                onChange={(e) => setPresentationDuration(Number(e.target.value))}
              />
              <Input
                label="Demo Day Session Schedule"
                value={sessionSchedule}
                onChange={(e) => setSessionSchedule(e.target.value)}
              />
            </div>
          )}
        </Card>
      )}

      {/* STEP 8: Certificates */}
      {currentStep === 8 && (
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            8. Verifiable Digital Certificates
          </h3>
          <p className="text-xs text-[#A1A1A1]">
            Automatically generate verifiable proof-of-participation and achievement credentials upon consensus finality.
          </p>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer text-xs">
              <div>
                <p className="font-semibold text-[#F5F5F0]">Participant Proof-of-Build Certificate</p>
                <p className="text-[11px] text-[#A1A1A1]">Issued to all squad members with verified submitted code.</p>
              </div>
              <input
                type="checkbox"
                checked={participantCertificate}
                onChange={(e) => setParticipantCertificate(e.target.checked)}
                className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer text-xs">
              <div>
                <p className="font-semibold text-[#F5F5F0]">Winner Track Honors Certificate</p>
                <p className="text-[11px] text-[#A1A1A1]">Issued to prize tier champions with signature cryptographic hash.</p>
              </div>
              <input
                type="checkbox"
                checked={winnerCertificate}
                onChange={(e) => setWinnerCertificate(e.target.checked)}
                className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer text-xs">
              <div>
                <p className="font-semibold text-[#F5F5F0]">Empaneled Juror Credential</p>
                <p className="text-[11px] text-[#A1A1A1]">Issued to judges who completed consensus evaluation quotas.</p>
              </div>
              <input
                type="checkbox"
                checked={judgeCertificate}
                onChange={(e) => setJudgeCertificate(e.target.checked)}
                className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
              />
            </label>
          </div>
        </Card>
      )}

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
        <Button
          variant="outline"
          size="md"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous Step
        </Button>

        {currentStep < 8 ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentStep(Math.min(8, currentStep + 1))}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Next: {steps[currentStep].title}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={handleDeploy}
            isLoading={isSubmitting}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Deploy Hackathon Track
          </Button>
        )}
      </div>
    </div>
  );
};
