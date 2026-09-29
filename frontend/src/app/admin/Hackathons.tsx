import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminHackathonRecord, AdminHackathonLifecycle } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Check, X, Archive } from 'lucide-react';

export const HackathonsAdmin: React.FC = () => {
  const [hackathons, setHackathons] = useState<AdminHackathonRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    adminService.getHackathons().then(setHackathons);
  }, []);

  const handleUpdateStatus = async (id: string, status: AdminHackathonLifecycle) => {
    const updated = await adminService.updateHackathonStatus(id, status);
    if (updated) {
      setHackathons((prev) => prev.map((h) => (h.id === id ? updated : h)));
      alert(`Hackathon "${updated.title}" marked as ${status.toUpperCase()}.`);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Tracks', count: hackathons.length },
    { id: 'pending_approval', label: 'Pending Approval', count: hackathons.filter((h) => h.status === 'pending_approval').length },
    { id: 'active', label: 'Active', count: hackathons.filter((h) => h.status === 'active').length },
    { id: 'completed', label: 'Completed', count: hackathons.filter((h) => h.status === 'completed').length },
  ];

  const filtered = hackathons.filter((h) => {
    if (activeTab === 'all') return true;
    return h.status === activeTab;
  });

  const columns: Column<AdminHackathonRecord>[] = [
    {
      header: 'Hackathon Track Proposal',
      cell: (h) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{h.title}</span>
          <span className="text-[10px] text-zinc-400 font-mono">
            Host: {h.organizerName} ({h.organizerEmail})
          </span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Prize Pool',
      cell: (h) => <span className="font-mono font-semibold text-orange-400">{h.prizePool}</span>,
    },
    {
      header: 'Status',
      cell: (h) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
            h.status === 'active' || h.status === 'published'
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
              : h.status === 'pending_approval'
              ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
              : 'bg-[#202020] text-zinc-400 border border-[#2A2A2A]'
          }`}
        >
          {h.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Compliance Checked',
      cell: (h) => (
        <Badge variant={h.complianceChecked ? 'emerald' : 'amber'} size="sm">
          {h.complianceChecked ? 'Passed' : 'Pending'}
        </Badge>
      ),
    },
    {
      header: 'Moderation Actions',
      cell: (h) => (
        <div className="flex items-center gap-1.5">
          {h.status === 'pending_approval' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus(h.id, 'active')}
                icon={<Check className="w-3 h-3" />}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleUpdateStatus(h.id, 'rejected')}
                icon={<X className="w-3 h-3" />}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateStatus(h.id, 'archived')}
              icon={<Archive className="w-3 h-3" />}
            >
              Archive
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Hackathon Track Moderation & Approvals"
        subtitle="Review prospective hackathons submitted by organizers, verify escrow funds, and publish to the public arena."
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <Table columns={columns} data={filtered} keyExtractor={(h) => h.id} />
    </div>
  );
};
