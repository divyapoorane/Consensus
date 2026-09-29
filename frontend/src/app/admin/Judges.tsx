import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminUserRecord } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

export const JudgesAdmin: React.FC = () => {
  const [judges, setJudges] = useState<AdminUserRecord[]>([]);

  useEffect(() => {
    adminService.getUsers().then((users) => {
      setJudges(users.filter((u) => u.role === 'judge'));
    });
  }, []);

  const columns: Column<AdminUserRecord>[] = [
    {
      header: 'Juror Identity',
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
      header: 'Empaneled Tracks',
      cell: (u) => <span className="font-mono text-orange-400 font-semibold">{u.hackathonsCount} Tracks</span>,
    },
    {
      header: 'Juror Status',
      cell: (u) => (
        <Badge variant={u.status === 'active' ? 'emerald' : 'amber'} size="sm">
          {u.status}
        </Badge>
      ),
    },
    {
      header: 'Last Active Session',
      cell: (u) => <span className="text-zinc-400 text-xs">{u.lastLogin}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Global Juror Panel Roster"
        subtitle="Oversight of empaneled judges, double-blind compliance, and panel assignments across all tracks."
      />
      <Table columns={columns} data={judges} keyExtractor={(u) => u.id} />
    </div>
  );
};
