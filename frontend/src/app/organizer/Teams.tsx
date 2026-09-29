import React, { useState, useEffect } from 'react';
import { organizerService } from '../../services/organizer/organizerService';
import { OrganizerTeam } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Search } from '../../components/ui/Search';

export const Teams: React.FC = () => {
  const [teams, setTeams] = useState<OrganizerTeam[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    organizerService.getTeams().then(setTeams);
  }, []);

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(query.toLowerCase()) ||
      t.hackathonTitle.toLowerCase().includes(query.toLowerCase())
  );

  const columns: Column<OrganizerTeam>[] = [
    {
      header: 'Squad Name',
      cell: (t) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{t.name}</span>
          <span className="text-[10px] text-zinc-400 font-mono">ID: {t.id}</span>
        </div>
      ),
    },
    {
      header: 'Hackathon Track',
      accessorKey: 'hackathonTitle',
    },
    {
      header: 'Team Leader',
      cell: (t) => (
        <div>
          <span className="font-medium text-zinc-200 block">{t.leaderName}</span>
          <span className="text-[10px] text-zinc-400 font-mono">{t.leaderEmail}</span>
        </div>
      ),
    },
    {
      header: 'Roster Size',
      cell: (t) => (
        <span className="font-mono text-zinc-300 font-semibold">
          {t.memberCount} / {t.maxMembers} Members
        </span>
      ),
    },
    {
      header: 'Attached Submission',
      cell: (t) => (
        <div>
          <span className="font-medium text-zinc-200 block truncate max-w-xs">
            {t.submissionTitle || 'Pending Submission'}
          </span>
          <Badge
            variant={t.submissionStatus === 'submitted' ? 'emerald' : 'neutral'}
            size="sm"
            className="mt-0.5"
          >
            {t.submissionStatus === 'submitted' ? 'Submitted' : 'Not Shipped'}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Squad Formations"
        subtitle="Monitor registered team rosters, leadership assignments, and project deliverables across tracks."
      />

      <div className="w-full sm:w-80">
        <Search
          value={query}
          onChange={setQuery}
          placeholder="Filter squads by title or leader..."
        />
      </div>

      <Table columns={columns} data={filtered} keyExtractor={(t) => t.id} />
    </div>
  );
};
