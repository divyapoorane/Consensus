import { UserRole } from './auth';

export interface AdminKPIs {
  totalUsers: number;
  totalParticipants: number;
  totalOrganizers: number;
  totalJudges: number;
  activeHackathons: number;
  pendingApprovals: number;
  totalSubmissions: number;
  totalPaymentVolume: string;
  totalPayoutVolume: string;
  systemHealth: 'optimal' | 'degraded' | 'maintenance';
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending_verification';
  createdAt: string;
  lastLogin: string;
  hackathonsCount: number;
  avatarUrl?: string;
}

export type AdminHackathonLifecycle = 'pending_approval' | 'draft' | 'published' | 'active' | 'completed' | 'rejected' | 'archived';

export interface AdminHackathonRecord {
  id: string;
  title: string;
  organizerName: string;
  organizerEmail: string;
  category: string;
  prizePool: string;
  status: AdminHackathonLifecycle;
  submittedForReviewAt: string;
  startDate: string;
  endDate: string;
  registrationsCount: number;
  submissionsCount: number;
  complianceChecked: boolean;
}

export interface AdminPaymentRecord {
  id: string;
  transactionId: string;
  userName: string;
  userEmail: string;
  hackathonTitle: string;
  amount: string;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  date: string;
  paymentMethod: string;
}

export interface AdminPayoutRecord {
  id: string;
  payoutId: string;
  winnerTeam: string;
  recipientEmail: string;
  hackathonTitle: string;
  prizeTitle: string;
  amount: string;
  status: 'completed' | 'processing' | 'held_for_review' | 'failed';
  date: string;
}

export type DisputePriority = 'low' | 'medium' | 'high' | 'critical';
export type DisputeStatus = 'open' | 'under_investigation' | 'resolved' | 'dismissed';

export interface AdminDisputeRecord {
  id: string;
  disputeId: string;
  complainantName: string;
  complainantEmail: string;
  complainantRole: UserRole;
  hackathonTitle: string;
  category: 'Plagiarism / Code Theft' | 'Judging Bias' | 'Prize Dispute' | 'Conduct Violation' | 'Other';
  priority: DisputePriority;
  status: DisputeStatus;
  createdAt: string;
  description: string;
  resolutionNotes?: string;
}

export interface AdminAuditLogRecord {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED' | 'FAILED';
  ipAddress: string;
  metadata?: string;
}

export interface AdminSecurityAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  description: string;
}
