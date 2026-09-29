import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminPayoutRecord } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { StatusPill } from '../../components/shared/StatusPill';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Info, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export const PayoutsAdmin: React.FC = () => {
  const [payouts, setPayouts] = useState<AdminPayoutRecord[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadPayouts = () => {
    adminService.getPayouts().then(setPayouts);
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      await adminService.updatePayoutStatus(id, newStatus);
      await loadPayouts();
    } catch (err) {
      console.error('Failed to update payout status:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const columns: Column<AdminPayoutRecord>[] = [
    {
      header: 'Payout ID',
      cell: (p) => (
        <div>
          <span className="font-mono text-xs text-orange-400 font-semibold block">{p.payoutId}</span>
          <span className="text-[10px] text-zinc-500 font-mono">SIMULATED ESCROW</span>
        </div>
      ),
    },
    {
      header: 'Recipient & Winning Squad',
      cell: (p) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{p.winnerTeam}</span>
          <span className="text-[10px] text-zinc-400 font-mono">{p.recipientEmail}</span>
        </div>
      ),
    },
    {
      header: 'Hackathon Track & Award',
      cell: (p) => (
        <div>
          <span className="text-zinc-100 block font-medium">{p.prizeTitle}</span>
          <span className="text-[10px] text-zinc-400">{p.hackathonTitle}</span>
        </div>
      ),
    },
    {
      header: 'Prize Amount',
      cell: (p) => <span className="font-mono font-semibold text-orange-400 text-sm">{p.amount}</span>,
    },
    {
      header: 'Disbursement Status',
      cell: (p) => <StatusPill status={p.status} />,
    },
    {
      header: 'Date',
      cell: (p) => <span className="font-mono text-xs text-zinc-400">{p.date}</span>,
    },
    {
      header: 'Admin Actions',
      cell: (p) => {
        const isBusy = loadingId === p.id;
        if (p.status === 'held_for_review') {
          return (
            <div className="flex items-center gap-1.5">
              <Button
                variant="primary"
                size="sm"
                disabled={isBusy}
                onClick={() => handleStatusChange(p.id, 'completed')}
              >
                {isBusy ? 'Releasing...' : 'Release Escrow'}
              </Button>
            </div>
          );
        }
        if (p.status === 'processing') {
          return (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={() => handleStatusChange(p.id, 'completed')}
              >
                Mark Paid
              </Button>
            </div>
          );
        }
        if (p.status === 'completed') {
          return (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Settled</span>
            </div>
          );
        }
        return (
          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => handleStatusChange(p.id, 'processing')}
          >
            Retry Escrow
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Prize Payouts & Escrow Settlements"
        subtitle="Global governance of prize disbursements, simulated escrow vaults, and multi-sig compliance."
        action={
          <Button variant="outline" size="sm" onClick={loadPayouts} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh Ledger
          </Button>
        }
      />

      {/* Demo Simulation Banner */}
      <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 space-y-1">
          <p className="font-semibold text-orange-300">
            Simulated Demo Escrow Ledger (Hackathon Evaluation Mode)
          </p>
          <p className="text-zinc-400">
            All prize disbursements, balances, and multi-sig escrow locks are simulated demonstration records persisted in the local PostgreSQL database. No real banking networks, Stripe accounts, or crypto transactions are processed.
          </p>
        </div>
      </div>

      <Table columns={columns} data={payouts} keyExtractor={(p) => p.id} />
    </div>
  );
};

