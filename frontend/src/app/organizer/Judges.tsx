import React, { useState, useEffect } from 'react';
import { organizerService } from '../../services/organizer/organizerService';
import { OrganizerJudge } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { UserPlus } from 'lucide-react';

export const Judges: React.FC = () => {
  const [judges, setJudges] = useState<OrganizerJudge[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Add judge form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');

  useEffect(() => {
    organizerService.getJudges().then(setJudges);
  }, []);

  const handleAddJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newJudge = await organizerService.addJudge({
      name,
      email,
      title,
      organization,
      assignedHackathons: ['Autonomous Systems & AI Arena'],
      status: 'active',
    });

    setJudges([newJudge, ...judges]);
    setName('');
    setEmail('');
    setTitle('');
    setOrganization('');
    setAddModalOpen(false);
  };

  const columns: Column<OrganizerJudge>[] = [
    {
      header: 'Juror Name & Affiliation',
      cell: (j) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{j.name}</span>
          <span className="text-[11px] text-zinc-300">
            {j.title} • <strong className="text-orange-400 font-medium">{j.organization}</strong>
          </span>
          <span className="text-[10px] text-zinc-400 font-mono block">{j.email}</span>
        </div>
      ),
    },
    {
      header: 'Assigned Hackathons',
      cell: (j) => (
        <div className="flex flex-wrap gap-1">
          {j.assignedHackathons.map((h) => (
            <Badge key={h} variant="neutral" size="sm">
              {h}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Workload & Assigned Projects',
      cell: (j) => (
        <span className="font-mono text-xs text-zinc-200">
          {j.assignedProjectsCount} Assigned Projects
        </span>
      ),
    },
    {
      header: 'Scoring Completion',
      cell: (j) => (
        <div className="w-36 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-zinc-400">{j.evaluatedProjectsCount}/{j.assignedProjectsCount}</span>
            <span className="text-emerald-400 font-semibold">{j.evaluationProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${j.evaluationProgress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (j) => (
        <Badge variant={j.status === 'active' ? 'emerald' : 'amber'} size="sm">
          {j.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Empaneled Judges Roster"
        subtitle="Recruit jurors, assign project review quotas, and track double-blind evaluation progress."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Invite Judge
          </Button>
        }
      />

      <Table columns={columns} data={judges} keyExtractor={(j) => j.id} />

      {/* Modal: Invite Judge */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Empanel New Juror"
        subtitle="Invite an expert to evaluate hackathon submissions using Consensus rubrics."
      >
        <form onSubmit={handleAddJudge} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Dr. Alex Mercer"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="e.g. alex.mercer@lab.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Professional Title"
            placeholder="e.g. Principal AI Researcher"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Organization / University"
            placeholder="e.g. MIT CSAIL"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Juror Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
