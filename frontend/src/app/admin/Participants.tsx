import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminUserRecord } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

export const ParticipantsAdmin: React.FC = () => {
  const [participants, setParticipants] = useState<AdminUserRecord[]>([]);

  useEffect(() => {
    adminService.getUsers().then((users) => {
      setParticipants(users.filter((u) => u.role === 'participant'));
    });
  }, []);

  const columns: Column<AdminUserRecord>[] = [
    {
      header: 'Builder Identity',
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
      header: 'Enrolled Hackathons',
      cell: (u) => <span className="font-mono text-zinc-200 font-semibold">{u.hackathonsCount} Tracks</span>,
    },
    {
      header: 'Account Status',
      cell: (u) => (
        <Badge variant={u.status === 'active' ? 'emerald' : 'rose'} size="sm">
          {u.status}
        </Badge>
      ),
    },
    {
      header: 'Registration Timestamp',
      cell: (u) => <span className="font-mono text-xs text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Participant Roster Directory"
        subtitle="Global directory of developers, designers, and systems architects competing in Consensus tracks."
      />
      <Table columns={columns} data={participants} keyExtractor={(u) => u.id} />
    </div>
  );
};
