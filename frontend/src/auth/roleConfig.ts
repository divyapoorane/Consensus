import { UserRole } from '../types/auth';

export interface RoleNavigationItem {
  label: string;
  path: string;
  iconName: string;
  badge?: string;
}

export const ROLE_DEFAULT_DASHBOARD: Record<UserRole, string> = {
  participant: '/participant/dashboard',
  organizer: '/organizer/dashboard',
  judge: '/judge/dashboard',
  admin: '/admin/dashboard',
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  participant: 'Participant Arena',
  organizer: 'Organizer Console',
  judge: 'Judge Console',
  admin: 'Platform Admin Console',
};
