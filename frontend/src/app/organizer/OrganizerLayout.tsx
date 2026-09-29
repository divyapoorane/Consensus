import React from 'react';
import { ConsoleLayout, ConsoleNavItem } from '../../components/layout/ConsoleLayout';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FolderGit2,
  FileCheck2,
  Award,
  Scale,
  Trophy,
  DollarSign,
  Scroll,
  User,
  Settings,
} from 'lucide-react';

export const OrganizerLayout: React.FC = () => {
  const navItems: ConsoleNavItem[] = [
    { label: 'Dashboard', path: '/organizer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Hackathons', path: '/organizer/hackathons', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Participants', path: '/organizer/participants', icon: <Users className="w-4 h-4" /> },
    { label: 'Teams', path: '/organizer/teams', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Submissions', path: '/organizer/submissions', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Judges', path: '/organizer/judges', icon: <Award className="w-4 h-4" /> },
    { label: 'Judging Overview', path: '/organizer/judging', icon: <Scale className="w-4 h-4" /> },
    { label: 'Results & Winners', path: '/organizer/results', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Prize Payouts', path: '/organizer/payouts', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Certificates', path: '/organizer/certificates', icon: <Scroll className="w-4 h-4" /> },
    { label: 'Organizer Profile', path: '/organizer/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', path: '/organizer/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <ConsoleLayout
      portalTitle="Organizer"
      portalRole="Organizer"
      environmentLabel="Organizer Management Console"
      navItems={navItems}
    />
  );
};
