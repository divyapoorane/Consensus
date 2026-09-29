export type OrganizerEventStatus = 'draft' | 'published' | 'active' | 'completed';

export interface OrganizerStats {
  totalHackathons: number;
  activeHackathons: number;
  totalRegistrations: number;
  totalSubmissions: number;
  pendingJudging: number;
  completedEvents: number;
  totalPrizeDistributed: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number; // percentage
  description: string;
}

export interface HackathonSchedule {
  registrationStart: string;
  registrationEnd: string;
  hackathonStart: string;
  hackathonEnd: string;
  submissionDeadline: string;
  judgingPeriod: string;
  resultsDate: string;
}

export interface HackathonPrizeTier {
  id: string;
  title: string;
  amount: string;
  description: string;
}

export interface HackathonConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  bannerUrl: string;
  logoUrl?: string;
  status: OrganizerEventStatus;
  schedule: HackathonSchedule;
  participation: {
    format: 'individual' | 'team' | 'both';
    minTeamSize: number;
    maxTeamSize: number;
    eligibility: string;
    geographicRestrictions: string;
    requirements: string[];
  };
  prizes: {
    totalPool: string;
    tiers: HackathonPrizeTier[];
  };
  judging: {
    rubric: RubricCriterion[];
    requiredJudgesPerProject: number;
    blindJudging: boolean;
  };
  communityVoting: {
    enabled: boolean;
    startDate?: string;
    endDate?: string;
    rules?: string;
  };
  presentation: {
    livePresentationEnabled: boolean;
    sessionSchedule?: string;
    presentationDurationMinutes?: number;
  };
  certificates: {
    participantEnabled: boolean;
    winnerEnabled: boolean;
    judgeEnabled: boolean;
  };
  registrationsCount: number;
  submissionsCount: number;
  createdAt: string;
}

export interface OrganizerParticipant {
  id: string;
  name: string;
  email: string;
  hackathonId: string;
  hackathonTitle: string;
  teamName: string;
  registrationStatus: 'confirmed' | 'pending' | 'waitlisted' | 'cancelled';
  submissionStatus: 'submitted' | 'in_progress' | 'none';
  dateJoined: string;
  country: string;
  skills: string[];
}

export interface OrganizerTeam {
  id: string;
  name: string;
  hackathonId: string;
  hackathonTitle: string;
  leaderName: string;
  leaderEmail: string;
  memberCount: number;
  maxMembers: number;
  submissionTitle?: string;
  submissionStatus: 'submitted' | 'not_submitted';
  createdAt: string;
}

export interface OrganizerJudge {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  assignedHackathons: string[];
  assignedProjectsCount: number;
  evaluatedProjectsCount: number;
  evaluationProgress: number; // percentage
  status: 'active' | 'invited' | 'pending';
}

export interface OrganizerSubmission {
  id: string;
  projectTitle: string;
  hackathonId: string;
  hackathonTitle: string;
  teamName: string;
  techStack: string[];
  submittedAt: string;
  assignedJudges: string[];
  status: 'pending' | 'in_review' | 'evaluated';
  averageScore?: number;
  consensusScore?: number;
  demoUrl?: string;
  repoUrl?: string;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface OrganizerPayout {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  winnerTeam: string;
  prizeTitle: string;
  amount: string;
  status: PayoutStatus;
  payoutMethod: string;
  initiatedAt: string;
  completedAt?: string;
}

export interface OrganizerCertificate {
  id: string;
  type: 'participant' | 'winner' | 'judge';
  hackathonId: string;
  hackathonTitle: string;
  recipientName: string;
  recipientEmail: string;
  issuedAt: string;
  status: 'issued' | 'draft';
}
