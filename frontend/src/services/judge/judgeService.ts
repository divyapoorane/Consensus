import {
  JudgeStats,
  JudgeProfile,
  JudgeProject,
  JudgeLiveSession,
  JudgeEvaluationRecord,
  JudgeRubricScore,
} from '../../types/judge';
import { api } from '../api';

const EMPTY_JUDGE_STATS: JudgeStats = {
  assignedHackathons: 0,
  assignedProjects: 0,
  completedEvaluations: 0,
  pendingEvaluations: 0,
  upcomingLiveSessions: 0,
  averageScoreGiven: 0,
};

const EMPTY_JUDGE_PROFILE: JudgeProfile = {
  id: '',
  name: '',
  email: '',
  title: '',
  organization: '',
  bio: '',
  expertise: [],
  avatarUrl: '',
  linkedin: '',
  github: '',
  evaluationsCompletedCount: 0,
  reliabilityScore: 100,
};

const DEFAULT_LIVE_SESSIONS: JudgeLiveSession[] = [
  {
    id: 'session-01',
    hackathonTitle: 'Autonomous Systems & AI Arena',
    projectTitle: 'SynapseAgent: Multi-Modal Consensus Engine',
    teamName: 'NeuralForge',
    scheduledTime: 'LIVE NOW (Deliberation Active)',
    durationMinutes: 15,
    roomStatus: 'live_now',
    roomUrlPlaceholder: 'JURY-ROOM-SYNAPSE-01',
    jurorCount: 3,
  },
  {
    id: 'session-02',
    hackathonTitle: 'Autonomous Systems & AI Arena',
    projectTitle: 'SwarmProtocol: Decentralized Task Routing',
    teamName: 'AgentMesh',
    scheduledTime: 'LIVE NOW (Q&A In Progress)',
    durationMinutes: 15,
    roomStatus: 'live_now',
    roomUrlPlaceholder: 'JURY-ROOM-SWARM-02',
    jurorCount: 4,
  },
  {
    id: 'session-03',
    hackathonTitle: 'Autonomous Systems & AI Arena',
    projectTitle: 'OmniChain Agent Bridge',
    teamName: 'CrossLinkers',
    scheduledTime: 'Starting in 10 mins (22:15 UTC)',
    durationMinutes: 20,
    roomStatus: 'upcoming',
    roomUrlPlaceholder: 'JURY-ROOM-OMNICHAIN-03',
    jurorCount: 2,
  },
  {
    id: 'session-04',
    hackathonTitle: 'Autonomous Systems & AI Arena',
    projectTitle: 'Zero-Knowledge Oracle for Consensus Verification',
    teamName: 'CipherCore',
    scheduledTime: 'Starting in 35 mins (22:40 UTC)',
    durationMinutes: 15,
    roomStatus: 'upcoming',
    roomUrlPlaceholder: 'JURY-ROOM-ZKORACLE-04',
    jurorCount: 3,
  },
];

class JudgeService {
  private stats: JudgeStats = { ...EMPTY_JUDGE_STATS };
  private profile: JudgeProfile = { ...EMPTY_JUDGE_PROFILE };
  private projects: JudgeProject[] = [];
  private liveSessions: JudgeLiveSession[] = [...DEFAULT_LIVE_SESSIONS];
  private evaluations: JudgeEvaluationRecord[] = [];

  public async getStats(): Promise<JudgeStats> {
    try {
      const data = await api.get<JudgeStats>('/api/judge/stats');
      if (data) {
        this.stats = { ...this.stats, ...data };
        return this.stats;
      }
    } catch (err) {
      console.warn('Judge stats API error:', err);
    }
    return { ...this.stats };
  }

  public async getProfile(): Promise<JudgeProfile> {
    try {
      const data = await api.get<JudgeProfile>('/api/judge/profile');
      if (data) {
        this.profile = { ...this.profile, ...data };
        return this.profile;
      }
    } catch (err) {
      console.warn('Judge profile API error:', err);
    }
    return { ...this.profile };
  }

  public async updateProfile(updated: Partial<JudgeProfile>): Promise<JudgeProfile> {
    this.profile = { ...this.profile, ...updated };
    return { ...this.profile };
  }

  public async getAssignedProjects(): Promise<JudgeProject[]> {
    try {
      const data = await api.get<JudgeProject[]>('/api/judge/projects');
      if (data && Array.isArray(data)) {
        this.projects = data;
        return data;
      }
    } catch (err) {
      console.warn('Judge projects API error:', err);
    }
    return [...this.projects];
  }

  public async getProjectById(id: string): Promise<JudgeProject | undefined> {
    try {
      const data = await api.get<JudgeProject>(`/api/judge/projects/${id}`);
      if (data) return data;
    } catch (err) {
      console.warn('Judge project by id API error:', err);
    }
    return this.projects.find((p) => p.id === id);
  }

  public async submitEvaluation(projectId: string, score: JudgeRubricScore): Promise<JudgeProject | null> {
    try {
      await api.post(`/api/judge/projects/${projectId}/evaluate`, score);
    } catch (err) {
      console.warn('Submit evaluation API error:', err);
      throw err;
    }

    const project = this.projects.find((p) => p.id === projectId);
    const total = score.innovation + score.technicalQuality + score.uiUx + score.impact + score.presentation;

    if (project) {
      project.myScore = score;
      project.totalScore = total;
      project.evaluationStatus = 'completed';
    }

    const existingIndex = this.evaluations.findIndex((e) => e.projectId === projectId);
    const newEvalRecord: JudgeEvaluationRecord = {
      id: `eval-${Date.now()}`,
      projectId: project ? project.id : projectId,
      projectTitle: project ? project.title : 'Project',
      hackathonTitle: project ? project.hackathonTitle : 'Arena Track',
      teamName: project ? project.teamName : 'Squad',
      category: project ? project.category : 'General Track',
      submittedScore: total,
      maxScore: 100,
      evaluatedAt: new Date().toISOString(),
      status: 'finalized',
      feedbackExcerpt: score.feedback.slice(0, 120) + (score.feedback.length > 120 ? '...' : ''),
    };

    if (existingIndex >= 0) {
      this.evaluations[existingIndex] = newEvalRecord;
    } else {
      this.evaluations = [newEvalRecord, ...this.evaluations];
      this.stats.completedEvaluations += 1;
      this.stats.pendingEvaluations = Math.max(0, this.stats.pendingEvaluations - 1);
    }

    return project || null;
  }

  public async getLiveSessions(): Promise<JudgeLiveSession[]> {
    if (!this.liveSessions || this.liveSessions.length === 0) {
      this.liveSessions = [...DEFAULT_LIVE_SESSIONS];
    }
    return [...this.liveSessions];
  }

  public async createLiveSession(session: Partial<JudgeLiveSession>): Promise<JudgeLiveSession> {
    const newSession: JudgeLiveSession = {
      id: `session-${Date.now()}`,
      hackathonTitle: session.hackathonTitle || 'Autonomous Systems & AI Arena',
      projectTitle: session.projectTitle || 'Autonomous AI Agent Sandbox',
      teamName: session.teamName || 'Builder Squad',
      scheduledTime: 'LIVE NOW (Instant Launch)',
      durationMinutes: session.durationMinutes || 15,
      roomStatus: 'live_now',
      roomUrlPlaceholder: `JURY-ROOM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      jurorCount: 1,
    };
    this.liveSessions.unshift(newSession);
    return newSession;
  }

  public async getEvaluations(): Promise<JudgeEvaluationRecord[]> {
    try {
      const data = await api.get<JudgeEvaluationRecord[]>('/api/judge/evaluations');
      if (data && Array.isArray(data)) {
        this.evaluations = data;
        return data;
      }
    } catch (err) {
      console.warn('Judge evaluations API error:', err);
    }
    return [...this.evaluations];
  }
}

export const judgeService = new JudgeService();
