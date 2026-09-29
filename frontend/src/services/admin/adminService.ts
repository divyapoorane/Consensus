import {
  AdminKPIs,
  AdminUserRecord,
  AdminHackathonRecord,
  AdminPaymentRecord,
  AdminPayoutRecord,
  AdminDisputeRecord,
  AdminAuditLogRecord,
  AdminSecurityAlert,
} from '../../types/admin';
import { UserRole } from '../../types/auth';
import { api } from '../api';

const EMPTY_ADMIN_KPIS: AdminKPIs = {
  totalUsers: 0,
  totalParticipants: 0,
  totalOrganizers: 0,
  totalJudges: 0,
  activeHackathons: 0,
  pendingApprovals: 0,
  totalSubmissions: 0,
  totalPaymentVolume: '$0',
  totalPayoutVolume: '$0',
  systemHealth: 'optimal',
};

class AdminService {
  private kpis: AdminKPIs = { ...EMPTY_ADMIN_KPIS };
  private users: AdminUserRecord[] = [];
  private hackathons: AdminHackathonRecord[] = [];
  private payments: AdminPaymentRecord[] = [];
  private payouts: AdminPayoutRecord[] = [];
  private disputes: AdminDisputeRecord[] = [];
  private auditLogs: AdminAuditLogRecord[] = [];
  private securityAlerts: AdminSecurityAlert[] = [];

  public async getKPIs(): Promise<AdminKPIs> {
    try {
      const data = await api.get<AdminKPIs>('/api/admin/kpis');
      if (data) {
        this.kpis = { ...this.kpis, ...data };
        return this.kpis;
      }
    } catch (err) {
      console.warn('Admin KPIs API error:', err);
    }
    return { ...this.kpis };
  }

  public async getUsers(): Promise<AdminUserRecord[]> {
    try {
      const data = await api.get<AdminUserRecord[]>('/api/admin/users');
      if (data && Array.isArray(data)) {
        this.users = data;
        return data;
      }
    } catch (err) {
      console.warn('Admin users API error:', err);
    }
    return [...this.users];
  }

  public async updateUserRole(userId: string, role: UserRole): Promise<AdminUserRecord | null> {
    try {
      const updated = await api.post<AdminUserRecord>(`/api/admin/users/${userId}/role`, { role });
      if (updated) {
        const idx = this.users.findIndex((u) => u.id === userId);
        if (idx !== -1) this.users[idx] = updated;
        this.recordAuditLog('USER_ROLE_UPDATED', `${updated.name} (${updated.email}) -> ${updated.role}`);
        return updated;
      }
    } catch (err) {
      console.warn('Update user role API error:', err);
    }

    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.role = role;
    this.recordAuditLog('USER_ROLE_UPDATED', `${user.name} (${user.email}) -> ${user.role}`);
    return { ...user };
  }

  public async provisionUser(data: { name: string; email: string; password?: string; role: UserRole }): Promise<AdminUserRecord | null> {
    try {
      const created = await api.post<AdminUserRecord>('/api/admin/users', data);
      if (created) {
        this.users.unshift(created);
        this.recordAuditLog('USER_PROVISIONED', `${created.name} (${created.email}) as ${created.role}`);
        return created;
      }
    } catch (err) {
      console.warn('Provision user API error:', err);
      throw err;
    }
    return null;
  }

  public async toggleUserStatus(userId: string): Promise<AdminUserRecord | null> {
    try {
      const updated = await api.post<AdminUserRecord>(`/api/admin/users/${userId}/toggle-status`);
      if (updated) {
        const idx = this.users.findIndex((u) => u.id === userId);
        if (idx !== -1) this.users[idx] = updated;
        this.recordAuditLog('USER_STATUS_TOGGLED', `${updated.name} (${updated.email}) -> ${updated.status}`);
        return updated;
      }
    } catch (err) {
      console.warn('Toggle user status API error:', err);
    }

    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.status = user.status === 'active' ? 'suspended' : 'active';
    this.recordAuditLog('USER_STATUS_TOGGLED', `${user.name} (${user.email}) -> ${user.status}`);
    return { ...user };
  }

  public async getHackathons(): Promise<AdminHackathonRecord[]> {
    try {
      const data = await api.get<AdminHackathonRecord[]>('/api/admin/hackathons');
      if (data && Array.isArray(data)) {
        this.hackathons = data;
        return data;
      }
    } catch (err) {
      console.warn('Admin hackathons API error:', err);
    }
    return [...this.hackathons];
  }

  public async updateHackathonStatus(
    hackathonId: string,
    status: AdminHackathonRecord['status']
  ): Promise<AdminHackathonRecord | null> {
    try {
      const updated = await api.post<AdminHackathonRecord>(`/api/admin/hackathons/${hackathonId}/status`, { status });
      if (updated) {
        const idx = this.hackathons.findIndex((h) => h.id === hackathonId);
        if (idx !== -1) this.hackathons[idx] = updated;
        this.recordAuditLog('HACKATHON_STATUS_MODIFIED', `${updated.title} -> ${status.toUpperCase()}`);
        return updated;
      }
    } catch (err) {
      console.warn('Update hackathon status API error:', err);
    }

    const hackathon = this.hackathons.find((h) => h.id === hackathonId);
    if (!hackathon) return null;
    hackathon.status = status;
    if (status === 'published' || status === 'active') {
      this.kpis.activeHackathons += 1;
      this.kpis.pendingApprovals = Math.max(0, this.kpis.pendingApprovals - 1);
    }
    this.recordAuditLog('HACKATHON_STATUS_MODIFIED', `${hackathon.title} -> ${status.toUpperCase()}`);
    return { ...hackathon };
  }

  public async getPayments(): Promise<AdminPaymentRecord[]> {
    return [...this.payments];
  }

  public async getPayouts(): Promise<AdminPayoutRecord[]> {
    try {
      const data = await api.get<any[]>('/api/payouts');
      if (data && Array.isArray(data)) {
        this.payouts = data.map((p) => ({
          id: p.id,
          payoutId: p.payoutId || p.id,
          winnerTeam: p.winnerTeam || p.teamName || 'Team',
          recipientEmail: p.recipientEmail || '',
          hackathonTitle: p.hackathonTitle || '',
          prizeTitle: p.prizeTitle || '',
          amount: p.amount || 0,
          status: p.status || 'pending',
          date: p.date || p.initiatedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        }));
        return [...this.payouts];
      }
    } catch (err) {
      console.warn('Admin payouts API error:', err);
    }
    return [...this.payouts];
  }

  public async updatePayoutStatus(payoutId: string, status: string): Promise<any> {
    try {
      const updated = await api.post(`/api/payouts/${payoutId}/status`, { status });
      return updated;
    } catch (err) {
      console.warn('Update payout status error:', err);
      return null;
    }
  }

  public async getDisputes(): Promise<AdminDisputeRecord[]> {
    try {
      const data = await api.get<AdminDisputeRecord[]>('/api/disputes');
      if (data && Array.isArray(data)) {
        this.disputes = data;
        return data;
      }
    } catch (err) {
      console.warn('Admin disputes API error:', err);
    }
    return [...this.disputes];
  }

  public async updateDisputeStatus(
    disputeId: string,
    status: AdminDisputeRecord['status'],
    resolutionNotes?: string
  ): Promise<AdminDisputeRecord | null> {
    try {
      const updated = await api.post<AdminDisputeRecord>(`/api/disputes/${disputeId}/resolve`, {
        status,
        resolutionNotes,
      });
      if (updated) {
        const idx = this.disputes.findIndex((d) => d.id === disputeId || d.disputeId === disputeId);
        if (idx !== -1) this.disputes[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.warn('Update dispute API error:', err);
    }

    const dispute = this.disputes.find((d) => d.id === disputeId || d.disputeId === disputeId);
    if (!dispute) return null;
    dispute.status = status;
    if (resolutionNotes) dispute.resolutionNotes = resolutionNotes;
    this.recordAuditLog('DISPUTE_STATUS_UPDATED', `Dispute ${dispute.disputeId} -> ${status}`);
    return { ...dispute };
  }

  public async getAuditLogs(params?: { action?: string; userRole?: string; search?: string }): Promise<AdminAuditLogRecord[]> {
    try {
      const query = new URLSearchParams();
      if (params?.action && params.action !== 'all') query.append('action', params.action);
      if (params?.userRole && params.userRole !== 'all') query.append('userRole', params.userRole);
      if (params?.search) query.append('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const data = await api.get<AdminAuditLogRecord[]>(`/api/admin/audit-logs${qs}`);
      if (data && Array.isArray(data)) {
        this.auditLogs = data;
        return data;
      }
    } catch (err) {
      console.warn('Admin audit logs API error:', err);
    }
    return [...this.auditLogs];
  }

  public getAuditLogsCsvUrl(): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${baseUrl}/api/admin/audit-logs/download-csv`;
  }

  public async getSecurityAlerts(): Promise<AdminSecurityAlert[]> {
    return [...this.securityAlerts];
  }

  public recordAuditLog(action: string, resource: string) {
    const log: AdminAuditLogRecord = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      userEmail: 'admin@consensus.dev',
      userRole: 'admin',
      action,
      resource,
      status: 'SUCCESS',
      ipAddress: '198.51.100.44',
      metadata: 'Console administrative intervention',
    };
    this.auditLogs = [log, ...this.auditLogs];
  }
}

export const adminService = new AdminService();
