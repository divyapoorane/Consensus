export type UserRole = 'participant' | 'organizer' | 'judge' | 'admin';

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  role: UserRole;
  email: string;
}

export interface HackathonCardData {
  id: string;
  title: string;
  category: string;
  tagline: string;
  date: string;
  participants: string;
  teamSize: string;
  prizePool: string;
  status: 'Upcoming' | 'Registration Open' | 'Draft' | 'TBA';
  tags: string[];
  isCustom?: boolean;
}

export interface EcosystemRoleInfo {
  id: UserRole;
  emoji: string;
  title: string;
  tagline: string;
  overview: string;
  capabilities: string[];
  primaryAction: string;
}
