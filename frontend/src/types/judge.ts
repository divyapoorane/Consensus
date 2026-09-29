export interface JudgeStats {
  assignedHackathons: number;
  assignedProjects: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  upcomingLiveSessions: number;
  averageScoreGiven: number;
}

export interface JudgeProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  bio: string;
  expertise: string[];
  avatarUrl: string;
  linkedin: string;
  github: string;
  evaluationsCompletedCount: number;
  reliabilityScore: number; // percentage
}

export interface JudgeRubricScore {
  innovation: number;       // 0 - 20
  technicalQuality: number; // 0 - 30
  uiUx: number;             // 0 - 15
  impact: number;           // 0 - 20
  presentation: number;     // 0 - 15
  feedback: string;
  privateNotes?: string;
  recommendForAward?: boolean;
}

export interface JudgeProject {
  id: string;
  title: string;
  hackathonId: string;
  hackathonTitle: string;
  teamName: string;
  category: string;
  tagline: string;
  description: string;
  repositoryUrl: string;
  demoUrl: string;
  videoUrl?: string;
  documentationUrl?: string;
  techStack: string[];
  submittedAt: string;
  evaluationStatus: 'pending' | 'in_progress' | 'completed';
  assignedAt: string;
  myScore?: JudgeRubricScore;
  totalScore?: number;
}

export interface JudgeLiveSession {
  id: string;
  hackathonTitle: string;
  projectTitle: string;
  teamName: string;
  scheduledTime: string;
  durationMinutes: number;
  roomStatus: 'upcoming' | 'live_now' | 'completed';
  roomUrlPlaceholder: string;
  jurorCount: number;
}

export interface JudgeEvaluationRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  hackathonTitle: string;
  teamName: string;
  category: string;
  submittedScore: number;
  maxScore: number;
  evaluatedAt: string;
  status: 'finalized' | 'draft';
  feedbackExcerpt: string;
}
