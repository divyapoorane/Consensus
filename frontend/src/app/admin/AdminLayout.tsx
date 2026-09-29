import React from 'react';
import { ConsoleLayout, ConsoleNavItem } from '../../components/layout/ConsoleLayout';
import {
  LayoutDashboard,
  Users,
  Shield,
  Award,
  Terminal,
  Calendar,
  FileCheck2,
  DollarSign,
  Receipt,
  AlertTriangle,
  History,
  Settings,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navItems: ConsoleNavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'User Directory', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Organizers', path: '/admin/organizers', icon: <Shield className="w-4 h-4" /> },
    { label: 'Judges', path: '/admin/judges', icon: <Award className="w-4 h-4" /> },
    { label: 'Participants', path: '/admin/participants', icon: <Terminal className="w-4 h-4" /> },
    { label: 'Hackathons Moderation', path: '/admin/hackathons', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Submissions Feed', path: '/admin/submissions', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Payments Volume', path: '/admin/payments', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Prize Payouts', path: '/admin/payouts', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Disputes & Reports', path: '/admin/disputes', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History className="w-4 h-4" /> },
    { label: 'System Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <ConsoleLayout
      portalTitle="Platform Admin"
      portalRole="Superuser"
      environmentLabel="Global RBAC Governance"
      navItems={navItems}
      systemStatusText="OPERATIONAL"
    />
  );
};
