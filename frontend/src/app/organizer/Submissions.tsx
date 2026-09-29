import React, { useState, useEffect } from 'react';
import { organizerService } from '../../services/organizer/organizerService';
import { OrganizerSubmission } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Search } from '../../components/ui/Search';
import { StatusPill } from '../../components/shared/StatusPill';
import { ExternalLink, Github } from 'lucide-react';

export const Submissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<OrganizerSubmission[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    organizerService.getSubmissions().then(setSubmissions);
  }, []);

  const filtered = submissions.filter(
    (s) =>
      s.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.teamName.toLowerCase().includes(search.toLowerCase()) ||
      s.hackathonTitle.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<OrganizerSubmission>[] = [
    {
      header: 'Delivered Project',
      cell: (s) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{s.projectTitle}</span>
          <span className="text-[10px] text-zinc-400 font-mono">By squad: {s.teamName}</span>
        </div>
      ),
    },
    {
      header: 'Hackathon Track',
      accessorKey: 'hackathonTitle',
    },
    {
      header: 'Assigned Panel',
      cell: (s) => (
        <span className="text-[11px] text-zinc-300">
          {s.assignedJudges.length} Jurors ({s.assignedJudges.join(', ')})
        </span>
      ),
    },
    {
      header: 'Jury Status',
      cell: (s) => <StatusPill status={s.status} />,
    },
    {
      header: 'Consensus Score',
      cell: (s) => (
        <span className="font-mono font-semibold text-orange-400">
          {s.averageScore ? `${s.averageScore} / 100` : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Artifacts',
      cell: (s) => (
        <div className="flex items-center gap-2">
          {s.repoUrl && (
            <a
              href={s.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded bg-[#202020] hover:bg-[#282828] text-zinc-300 hover:text-white"
              title="Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {s.demoUrl && (
            <a
              href={s.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded bg-orange-950/30 hover:bg-orange-900/40 text-orange-400 border border-orange-500/20"
              title="Demo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Submissions Moderation Feed"
        subtitle="Review delivered codebases, track reviewer assignments, and inspect incoming jury consensus scores."
      />

      <div className="w-full sm:w-80">
        <Search
          value={search}
          onChange={setSearch}
          placeholder="Search by project, squad, or track..."
        />
      </div>

      <Table columns={columns} data={filtered} keyExtractor={(s) => s.id} />
    </div>
  );
};
