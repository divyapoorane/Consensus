import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminDisputeRecord, DisputeStatus } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const Disputes: React.FC = () => {
  const [disputes, setDisputes] = useState<AdminDisputeRecord[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<AdminDisputeRecord | null>(null);

  useEffect(() => {
    adminService.getDisputes().then(setDisputes);
  }, []);

  const handleResolve = async (status: DisputeStatus) => {
    if (!selectedDispute) return;
    const updated = await adminService.updateDisputeStatus(
      selectedDispute.id,
      status,
      'Resolved via root platform administrative deliberation.'
    );
    if (updated) {
      setDisputes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setSelectedDispute(null);
      alert(`Dispute ${updated.disputeId} marked as ${status.toUpperCase()}.`);
    }
  };

  const columns: Column<AdminDisputeRecord>[] = [
    {
      header: 'Dispute Ticket',
      cell: (d) => (
        <div>
          <span className="font-mono text-orange-400 font-semibold block">{d.disputeId}</span>
          <span className="text-[10px] text-zinc-400">By: {d.complainantName}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Hackathon Track',
      accessorKey: 'hackathonTitle',
    },
    {
      header: 'Priority',
      cell: (d) => (
        <Badge
          variant={
            d.priority === 'critical' || d.priority === 'high'
              ? 'rose'
              : d.priority === 'medium'
              ? 'amber'
              : 'neutral'
          }
          size="sm"
        >
          {d.priority}
        </Badge>
      ),
    },
    {
      header: 'Status',
      cell: (d) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
            d.status === 'resolved'
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
              : d.status === 'under_investigation'
              ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
              : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
          }`}
        >
          {d.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (d) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedDispute(d)}>
          Inspect Ticket
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Disputes & Escalation Tickets"
        subtitle="Platform integrity investigations: plagiarism allegations, judging bias claims, and prize disputes."
      />

      <Table columns={columns} data={disputes} keyExtractor={(d) => d.id} />

      {/* Ticket Details & Resolution Modal */}
      <Modal
        isOpen={!!selectedDispute}
        onClose={() => setSelectedDispute(null)}
        title={`Dispute Ticket #${selectedDispute?.disputeId}`}
        subtitle="Comprehensive allegation details, AST comparison logs, and resolution tools."
      >
        {selectedDispute && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Complainant:</span>
                <span className="font-semibold text-zinc-100">
                  {selectedDispute.complainantName} ({selectedDispute.complainantRole})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Email:</span>
                <span className="font-mono text-zinc-300">{selectedDispute.complainantEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Track:</span>
                <span className="text-zinc-200">{selectedDispute.hackathonTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Category:</span>
                <span className="font-semibold text-amber-400">{selectedDispute.category}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                Allegation Description
              </span>
              <p className="text-zinc-300 leading-relaxed">{selectedDispute.description}</p>
            </div>

            {selectedDispute.resolutionNotes && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                  Investigator Notes
                </span>
                <p className="text-zinc-300 italic">{selectedDispute.resolutionNotes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2A2A]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDispute(null)}
              >
                Close
              </Button>
              {selectedDispute.status !== 'resolved' && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleResolve('dismissed')}
                  >
                    Dismiss Claim
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleResolve('resolved')}
                  >
                    Mark Resolved
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
