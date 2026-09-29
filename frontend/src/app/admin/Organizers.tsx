import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminUserRecord } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

export const Organizers: React.FC = () => {
  const [organizers, setOrganizers] = useState<AdminUserRecord[]>([]);

  useEffect(() => {
    adminService.getUsers().then((users) => {
      setOrganizers(users.filter((u) => u.role === 'organizer'));
    });
  }, []);

  const columns: Column<AdminUserRecord>[] = [
    {
      header: 'Organizer Host',
      cell: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={u.name} src={u.avatarUrl} size="sm" />
          <div>
            <span className="font-semibold text-zinc-100 block">{u.name}</span>
            <span className="text-[10px] text-zinc-400 font-mono">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Hosted Hackathons',
      cell: (u) => <span className="font-mono text-zinc-200 font-semibold">{u.hackathonsCount} Tracks</span>,
    },
    {
      header: 'Account Status',
      cell: (u) => (
        <Badge variant={u.status === 'active' ? 'emerald' : 'amber'} size="sm">
          {u.status}
        </Badge>
      ),
    },
    {
      header: 'Member Since',
      cell: (u) => <span className="font-mono text-xs text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Verified Organizers Directory"
        subtitle="Review host identities, compliance screening status, and active track portfolios."
      />
      <Table columns={columns} data={organizers} keyExtractor={(u) => u.id} />
    </div>
  );
};
