import {
  ParticipantProfile,
  ParticipantHackathon,
  ParticipantTeam,
  ParticipantProject,
  ParticipantSubmission,
  ParticipantNotification,
  ParticipantStats,
} from '../../types/participant';
import { api } from '../api';

const EMPTY_PROFILE: ParticipantProfile = {
  id: '',
  avatarUrl: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  bio: '',
  college: '',
  course: '',
  graduationYear: '',
  currentRole: '',
  skills: [],
  interests: [],
  github: '',
  linkedin: '',
  portfolio: '',
  country: '',
  state: '',
  city: '',
};

const EMPTY_STATS: ParticipantStats = {
  hackathonsJoined: 0,
  activeTeams: 0,
  projectsBuilt: 0,
  submissionsCount: 0,
  profileCompletion: 0,
};

class ParticipantService {
  private profile: ParticipantProfile = { ...EMPTY_PROFILE };
  private stats: ParticipantStats = { ...EMPTY_STATS };
  private hackathons: ParticipantHackathon[] = [];
  private teams: ParticipantTeam[] = [];
  private projects: ParticipantProject[] = [];
  private submissions: ParticipantSubmission[] = [];
  private notifications: ParticipantNotification[] = [];

  public async getProfile(): Promise<ParticipantProfile> {
    try {
      const data = await api.get<ParticipantProfile>('/api/participant/profile');
      if (data) {
        this.profile = { ...this.profile, ...data };
        return this.profile;
      }
    } catch (err) {
      console.warn('Get profile API error:', err);
    }
    return { ...this.profile };
  }

  public async updateProfile(updated: Partial<ParticipantProfile>): Promise<ParticipantProfile> {
    try {
      const data = await api.put<ParticipantProfile>('/api/participant/profile', updated);
      if (data) {
        this.profile = { ...this.profile, ...data };
        return this.profile;
      }
    } catch (err) {
      console.warn('Update profile API error:', err);
      throw err;
    }
    this.profile = { ...this.profile, ...updated };
    return { ...this.profile };
  }

  public async getStats(): Promise<ParticipantStats> {
    try {
      const data = await api.get<ParticipantStats>('/api/participant/stats');
      if (data) {
        this.stats = { ...this.stats, ...data };
        return this.stats;
      }
    } catch (err) {
      console.warn('Participant stats API error:', err);
    }
    return { ...this.stats };
  }

  public async getHackathons(): Promise<ParticipantHackathon[]> {
    try {
      const data = await api.get<ParticipantHackathon[]>('/api/participant/hackathons');
      if (data && Array.isArray(data)) {
        this.hackathons = data;
        return data;
      }
    } catch (err) {
      console.warn('Participant hackathons API error:', err);
    }
    return [...this.hackathons];
  }

  public async registerForHackathon(hackathonId: string): Promise<any> {
    try {
      const res = await api.post(`/api/participant/hackathons/${hackathonId}/register`);
      await this.getHackathons();
      return res;
    } catch (err) {
      console.warn('Register hackathon API error:', err);
      throw err;
    }
  }

  public async getTeams(): Promise<ParticipantTeam[]> {
    try {
      const data = await api.get<ParticipantTeam[]>('/api/participant/teams');
      if (data && Array.isArray(data)) {
        this.teams = data;
        return data;
      }
    } catch (err) {
      console.warn('Participant teams API error:', err);
    }
    return [...this.teams];
  }

  public async createTeam(teamData: { name: string; hackathonId: string; hackathonTitle: string }): Promise<ParticipantTeam> {
    try {
      const data = await api.post<ParticipantTeam>('/api/participant/teams', teamData);
      if (data) {
        this.teams = [data, ...this.teams];
        this.stats.activeTeams += 1;
        return data;
      }
      throw new Error('Failed to create team');
    } catch (err) {
      console.warn('Create team API error:', err);
      throw err;
    }
  }

  public async joinTeam(inviteCode: string): Promise<ParticipantTeam | null> {
    try {
      const data = await api.post<ParticipantTeam>('/api/participant/teams/join', { inviteCode });
      if (data) {
        const idx = this.teams.findIndex((t) => t.id === data.id);
        if (idx !== -1) {
          this.teams[idx] = data;
        } else {
          this.teams = [data, ...this.teams];
        }
        return data;
      }
      return null;
    } catch (err) {
      console.warn('Join team API error:', err);
      return null;
    }
  }

  public async getProjects(): Promise<ParticipantProject[]> {
    try {
      const data = await api.get<ParticipantProject[]>('/api/participant/projects');
      if (data && Array.isArray(data)) {
        this.projects = data;
        return data;
      }
    } catch (err) {
      console.warn('Participant projects API error:', err);
    }
    return [...this.projects];
  }

  public async createProject(project: Omit<ParticipantProject, 'id' | 'updatedAt'>): Promise<ParticipantProject> {
    try {
      const data = await api.post<ParticipantProject>('/api/participant/projects', project);
      if (data) {
        this.projects = [data, ...this.projects];
        this.stats.projectsBuilt += 1;
        return data;
      }
      throw new Error('Failed to create project');
    } catch (err) {
      console.warn('Create project API error:', err);
      throw err;
    }
  }

  public async submitProject(projectId: string): Promise<ParticipantSubmission | null> {
    try {
      const data = await api.post<ParticipantSubmission>('/api/participant/submissions', { projectId });
      if (data) {
        this.submissions = [data, ...this.submissions];
        this.stats.submissionsCount += 1;
        const pIdx = this.projects.findIndex((p) => p.id === projectId);
        if (pIdx !== -1) {
          this.projects[pIdx].status = 'Submitted';
        }
        return data;
      }
    } catch (err) {
      console.warn('Submit project API error:', err);
    }
    return null;
  }

  public async getSubmissions(): Promise<ParticipantSubmission[]> {
    try {
      const data = await api.get<ParticipantSubmission[]>('/api/participant/submissions');
      if (data && Array.isArray(data)) {
        this.submissions = data;
        return data;
      }
    } catch (err) {
      console.warn('Participant submissions API error:', err);
    }
    return [...this.submissions];
  }

  public async getNotifications(): Promise<ParticipantNotification[]> {
    return [...this.notifications];
  }

  public async markNotificationRead(id: string): Promise<void> {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  }
}

export const participantService = new ParticipantService();
