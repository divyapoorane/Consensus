import React, { useState, useEffect } from 'react';
import { organizerService } from '../../services/organizer/organizerService';
import { OrganizerParticipant } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Search } from '../../components/ui/Search';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';

export const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<OrganizerParticipant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<OrganizerParticipant | null>(null);

  useEffect(() => {
    organizerService.getParticipants().then(setParticipants);
  }, []);

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.registrationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<OrganizerParticipant>[] = [
    {
      header: 'Participant',
      cell: (p) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{p.name}</span>
          <span className="text-[10px] text-zinc-400 font-mono">{p.email}</span>
        </div>
      ),
    },
    {
      header: 'Hackathon Track',
      accessorKey: 'hackathonTitle',
    },
    {
      header: 'Squad / Team',
      cell: (p) => <span className="font-medium text-zinc-200">{p.teamName}</span>,
    },
    {
      header: 'Status',
      cell: (p) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
            p.registrationStatus === 'confirmed'
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
          }`}
        >
          {p.registrationStatus}
        </span>
      ),
    },
    {
      header: 'Submission',
      cell: (p) => (
        <Badge variant={p.submissionStatus === 'submitted' ? 'emerald' : 'neutral'} size="sm">
          {p.submissionStatus}
        </Badge>
      ),
    },
    {
      header: 'Joined Date',
      cell: (p) => <span className="font-mono text-[11px] text-zinc-400">{p.dateJoined}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Participant Directory"
        subtitle="Search, filter, and inspect enrolled builders across all active and upcoming hackathons."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Exporting participant CSV dataset...')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Roster
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181818] border border-[#2A2A2A] p-3 rounded-xl">
        <div className="w-full sm:w-80">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, squad..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] text-zinc-400 font-mono uppercase">Filter:</span>
          {['all', 'confirmed', 'pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1 rounded-lg uppercase font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#FF6B35] text-white font-semibold'
                  : 'text-zinc-400 hover:text-white bg-[#202020]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Participants Table */}
      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => setSelectedParticipant(p)}
      />

      {/* Detail Drawer Modal */}
      <Modal
        isOpen={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
        title="Participant Profile Overview"
        subtitle="Individual builder metadata and submission affiliation."
      >
        {selectedParticipant && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Full Name:</span>
                <span className="font-semibold text-zinc-100 text-sm">{selectedParticipant.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Email Address:</span>
                <span className="font-mono text-zinc-200">{selectedParticipant.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Country:</span>
                <span className="text-zinc-200">{selectedParticipant.country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Squad:</span>
                <span className="font-semibold text-orange-400">{selectedParticipant.teamName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Hackathon Track:</span>
                <span className="text-zinc-200">{selectedParticipant.hackathonTitle}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-zinc-300 uppercase block mb-2">
                Declared Technical Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedParticipant.skills.map((s) => (
                  <Badge key={s} variant="neutral" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedParticipant(null)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
