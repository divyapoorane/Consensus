import React from 'react';
import { ConsoleLayout, ConsoleNavItem } from '../../components/layout/ConsoleLayout';
import {
  LayoutDashboard,
  User,
  Trophy,
  Users,
  FolderGit2,
  Send,
  Bell,
  Settings,
} from 'lucide-react';

export const ParticipantLayout: React.FC = () => {
  const navItems: ConsoleNavItem[] = [
    { label: 'Dashboard', path: '/participant/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Profile', path: '/participant/profile', icon: <User className="w-4 h-4" /> },
    { label: 'My Hackathons', path: '/participant/hackathons', icon: <Trophy className="w-4 h-4" /> },
    { label: 'My Teams', path: '/participant/teams', icon: <Users className="w-4 h-4" /> },
    { label: 'My Projects', path: '/participant/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'My Submissions', path: '/participant/submissions', icon: <Send className="w-4 h-4" /> },
    { label: 'Notifications', path: '/participant/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Settings', path: '/participant/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <ConsoleLayout
      portalTitle="Participant"
      portalRole="Builder"
      environmentLabel="Participant Sandbox"
      navItems={navItems}
      notificationsPath="/participant/notifications"
    />
  );
};
