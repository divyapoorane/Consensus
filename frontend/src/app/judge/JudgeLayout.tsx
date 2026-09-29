import React from 'react';
import { ConsoleLayout, ConsoleNavItem } from '../../components/layout/ConsoleLayout';
import {
  LayoutDashboard,
  ClipboardList,
  FolderGit2,
  Video,
  Scale,
  Bell,
  User,
  Settings,
} from 'lucide-react';

export const JudgeLayout: React.FC = () => {
  const navItems: ConsoleNavItem[] = [
    { label: 'Dashboard', path: '/judge/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Assignments', path: '/judge/assignments', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Projects Queue', path: '/judge/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Live Pitch Sessions', path: '/judge/sessions', icon: <Video className="w-4 h-4" /> },
    { label: 'My Evaluations', path: '/judge/evaluations', icon: <Scale className="w-4 h-4" /> },
    { label: 'Notifications', path: '/judge/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Juror Profile', path: '/judge/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', path: '/judge/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <ConsoleLayout
      portalTitle="Judge Console"
      portalRole="Juror"
      environmentLabel="Deliberation & Rubric Chamber"
      navItems={navItems}
      notificationsPath="/judge/notifications"
    />
  );
};
