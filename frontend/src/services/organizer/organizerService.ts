import {
  OrganizerStats,
  HackathonConfig,
  OrganizerParticipant,
  OrganizerTeam,
  OrganizerJudge,
  OrganizerSubmission,
  OrganizerPayout,
  OrganizerCertificate,
} from '../../types/organizer';
import { api } from '../api';

const EMPTY_ORGANIZER_STATS: OrganizerStats = {
  totalHackathons: 0,
  activeHackathons: 0,
  totalRegistrations: 0,
  totalSubmissions: 0,
  pendingJudging: 0,
  completedEvents: 0,
  totalPrizeDistributed: '$0',
};

class OrganizerService {
  private stats: OrganizerStats = { ...EMPTY_ORGANIZER_STATS };
  private hackathons: HackathonConfig[] = [];
  private participants: OrganizerParticipant[] = [];
  private teams: OrganizerTeam[] = [];
  private judges: OrganizerJudge[] = [];
  private submissions: OrganizerSubmission[] = [];
  private payouts: OrganizerPayout[] = [];
  private certificates: OrganizerCertificate[] = [];

  public async getStats(): Promise<OrganizerStats> {
    try {
      const data = await api.get<OrganizerStats>('/api/organizer/stats');
      if (data) {
        this.stats = { ...this.stats, ...data };
        return this.stats;
      }
    } catch (err) {
      console.warn('Organizer stats API error:', err);
    }
    return { ...this.stats };
  }

  public async getHackathons(): Promise<HackathonConfig[]> {
    try {
      const data = await api.get<HackathonConfig[]>('/api/hackathons');
      if (data && Array.isArray(data)) {
        this.hackathons = data;
        return data;
      }
    } catch (err) {
      console.warn('Hackathons API error:', err);
    }
    return [...this.hackathons];
  }

  public async getHackathonById(id: string): Promise<HackathonConfig | undefined> {
    try {
      const data = await api.get<HackathonConfig>(`/api/hackathons/${id}`);
      if (data) return data;
    } catch (err) {
      console.warn('Hackathon by id API error:', err);
    }
    return this.hackathons.find((h) => h.id === id);
  }

  public async createHackathon(
    config: Omit<HackathonConfig, 'id' | 'registrationsCount' | 'submissionsCount' | 'createdAt'>
  ): Promise<HackathonConfig> {
    try {
      const created = await api.post<HackathonConfig>('/api/hackathons', config);
      if (created) {
        this.hackathons = [created, ...this.hackathons];
        this.stats.totalHackathons += 1;
        if (created.status === 'active') this.stats.activeHackathons += 1;
        return created;
      }
      throw new Error('Failed to create hackathon');
    } catch (err) {
      console.warn('Create hackathon API error:', err);
      throw err;
    }
  }

  public async updateHackathon(id: string, updates: Partial<HackathonConfig>): Promise<HackathonConfig | null> {
    try {
      const updated = await api.put<HackathonConfig>(`/api/hackathons/${id}`, updates);
      if (updated) {
        const idx = this.hackathons.findIndex((h) => h.id === id);
        if (idx !== -1) this.hackathons[idx] = { ...this.hackathons[idx], ...updated };
        return updated;
      }
    } catch (err) {
      console.warn('Update hackathon API error:', err);
    }

    const index = this.hackathons.findIndex((h) => h.id === id);
    if (index === -1) return null;
    this.hackathons[index] = { ...this.hackathons[index], ...updates };
    return this.hackathons[index];
  }

  public async getParticipants(): Promise<OrganizerParticipant[]> {
    try {
      const data = await api.get<OrganizerParticipant[]>('/api/organizer/participants');
      if (data && Array.isArray(data)) {
        this.participants = data;
        return data;
      }
    } catch (err) {
      console.warn('Organizer participants API error:', err);
    }
    return [...this.participants];
  }

  public async getTeams(): Promise<OrganizerTeam[]> {
    try {
      const data = await api.get<OrganizerTeam[]>('/api/organizer/teams');
      if (data && Array.isArray(data)) {
        this.teams = data;
        return data;
      }
    } catch (err) {
      console.warn('Organizer teams API error:', err);
    }
    return [...this.teams];
  }

  public async getJudges(): Promise<OrganizerJudge[]> {
    try {
      const data = await api.get<OrganizerJudge[]>('/api/organizer/judges');
      if (data && Array.isArray(data)) {
        this.judges = data;
        return data;
      }
    } catch (err) {
      console.warn('Organizer judges API error:', err);
    }
    return [...this.judges];
  }

  public async addJudge(
    judge: Omit<OrganizerJudge, 'id' | 'assignedProjectsCount' | 'evaluatedProjectsCount' | 'evaluationProgress'>
  ): Promise<OrganizerJudge> {
    const newJudge: OrganizerJudge = {
      ...judge,
      id: `jdg-${Date.now()}`,
      assignedProjectsCount: 0,
      evaluatedProjectsCount: 0,
      evaluationProgress: 0,
    };
    this.judges = [newJudge, ...this.judges];
    return newJudge;
  }

  public async getSubmissions(): Promise<OrganizerSubmission[]> {
    try {
      const data = await api.get<OrganizerSubmission[]>('/api/organizer/submissions');
      if (data && Array.isArray(data)) {
        this.submissions = data;
        return data;
      }
    } catch (err) {
      console.warn('Organizer submissions API error:', err);
    }
    return [...this.submissions];
  }

  public async getPayouts(): Promise<OrganizerPayout[]> {
    try {
      const data = await api.get<OrganizerPayout[]>('/api/payouts');
      if (data && Array.isArray(data)) {
        this.payouts = data;
        return data;
      }
    } catch (err) {
      console.warn('Organizer payouts API error:', err);
    }
    return [...this.payouts];
  }

  public async updatePayoutStatus(id: string, status: string): Promise<OrganizerPayout | null> {
    try {
      const updated = await api.post<OrganizerPayout>(`/api/payouts/${id}/status`, { status });
      if (updated) {
        const idx = this.payouts.findIndex((p) => p.id === id || (p as any).payoutId === id);
        if (idx !== -1) this.payouts[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.warn('Update payout status API error:', err);
    }
    return null;
  }

  public async getCertificates(): Promise<OrganizerCertificate[]> {
    try {
      const data = await api.get<OrganizerCertificate[]>('/api/certificates');
      if (data && Array.isArray(data)) {
        this.certificates = data;
        return data;
      }
    } catch (err) {
      console.warn('Organizer certificates API error:', err);
    }
    return [...this.certificates];
  }

  public async issueCertificate(
    cert: Partial<OrganizerCertificate> & { id?: string }
  ): Promise<OrganizerCertificate> {
    try {
      const data = await api.post<OrganizerCertificate>('/api/certificates/issue', cert);
      if (data) {
        const idx = this.certificates.findIndex((c) => c.id === data.id);
        if (idx !== -1) {
          this.certificates[idx] = data;
        } else {
          this.certificates = [data, ...this.certificates];
        }
        return data;
      }
      throw new Error('Failed to issue certificate');
    } catch (err) {
      console.warn('Issue certificate API error:', err);
      throw err;
    }
  }

  public getCertificateDownloadUrl(id: string): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${baseUrl}/api/certificates/${id}/download`;
  }
}

export const organizerService = new OrganizerService();
