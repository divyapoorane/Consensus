export interface ParticipantProfile {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  college: string;
  course: string;
  graduationYear: string;
  currentRole: string;
  skills: string[];
  interests: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  country: string;
  state: string;
  city: string;
}

export type HackathonStatus = 'registered' | 'active' | 'completed';
export type SubmissionProgressStatus = 'draft' | 'submitted' | 'under_review' | 'evaluated' | 'shortlisted' | 'won';

export interface ParticipantHackathon {
  id: string;
  title: string;
  category: string;
  bannerUrl: string;
  status: HackathonStatus;
  registrationStatus: 'confirmed' | 'pending' | 'waitlisted';
  submissionStatus: 'not_started' | 'draft' | 'submitted';
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  teamName?: string;
  prizePool: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  isLeader?: boolean;
}

export interface ParticipantTeam {
  id: string;
  name: string;
  hackathonId: string;
  hackathonTitle: string;
  inviteCode: string;
  members: TeamMember[];
  myRole: 'Team Leader' | 'Member';
  maxMembers: number;
  projectTitle?: string;
}

export interface ParticipantProject {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  teamId?: string;
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  repositoryUrl: string;
  demoUrl: string;
  documentationUrl: string;
  status: 'In Progress' | 'Ready for Submission' | 'Submitted';
  thumbnailUrl?: string;
  updatedAt: string;
}

export interface ParticipantSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  hackathonId: string;
  hackathonTitle: string;
  teamName: string;
  status: SubmissionProgressStatus;
  validationStatus: 'Passed' | 'Checks In Progress' | 'Needs Attention';
  judgingStatus: 'Pending Review' | 'In Deliberation' | 'Scoring Completed';
  score?: number;
  maxScore?: number;
  feedback?: string;
  submittedAt: string;
  timeline: {
    label: string;
    date: string;
    completed: boolean;
  }[];
}

export interface ParticipantNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ParticipantStats {
  hackathonsJoined: number;
  activeTeams: number;
  projectsBuilt: number;
  submissionsCount: number;
  profileCompletion: number;
}
