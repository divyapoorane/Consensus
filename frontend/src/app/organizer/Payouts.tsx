import React, { useState, useEffect } from 'react';
import { organizerService } from '../../services/organizer/organizerService';
import { OrganizerPayout } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/shared/StatusPill';
import { ShieldCheck, Info } from 'lucide-react';

export const Payouts: React.FC = () => {
  const [payouts, setPayouts] = useState<OrganizerPayout[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    organizerService.getPayouts().then(setPayouts);
  }, []);

  const handleDisburse = async (id: string) => {
    setIsProcessing(true);
    const updated = await organizerService.updatePayoutStatus(id, 'completed');
    if (updated) {
      setPayouts((prev) =>
        prev.map((p) => (p.id === id || (p as any).payoutId === id ? { ...p, status: 'completed', completedAt: new Date().toISOString() } : p))
      );
    } else {
      // optimistic update
      setPayouts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'completed', completedAt: new Date().toISOString() } : p))
      );
    }
    setIsProcessing(false);
  };

  const columns: Column<OrganizerPayout>[] = [
    {
      header: 'Winning Squad',
      cell: (p) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{p.winnerTeam}</span>
          <span className="text-[10px] text-zinc-400 font-mono">{(p as any).payoutId || `ID: ${p.id}`}</span>
        </div>
      ),
    },
    {
      header: 'Track & Prize Award',
      cell: (p) => (
        <div>
          <span className="text-zinc-100 block font-medium">{p.prizeTitle}</span>
          <span className="text-[10px] text-zinc-400">{p.hackathonTitle}</span>
        </div>
      ),
    },
    {
      header: 'Disbursement Amount',
      cell: (p) => <span className="font-mono font-semibold text-orange-400 text-sm">{p.amount}</span>,
    },
    {
      header: 'Settlement Mode',
      cell: (p) => <span className="font-mono text-xs text-zinc-300">{p.payoutMethod || 'Simulated Escrow (Demo)'}</span>,
    },
    {
      header: 'Status',
      cell: (p) => <StatusPill status={p.status} />,
    },
    {
      header: 'Actions',
      cell: (p) =>
        p.status === 'pending' || p.status === 'processing' ? (
          <Button
            variant="primary"
            size="sm"
            disabled={isProcessing}
            onClick={() => handleDisburse(p.id)}
          >
            Disburse Demo Prize
          </Button>
        ) : (
          <span className="text-[11px] font-mono text-emerald-400">Settled (Demo)</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Prize Escrow & Disbursements"
        subtitle="Review, approve, and track transparent prize settlements to validated winning squads."
        badge={
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Escrow Protected</span>
            </span>
            <span className="text-[10px] font-mono bg-amber-950/40 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase font-medium">
              Demo Simulation
            </span>
          </div>
        }
      />

      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Demo Escrow Notice:</strong> Payout disbursements and escrow settlements are simulated in PostgreSQL. No real currency or payment gateways are processed.
        </span>
      </div>

      <Table columns={columns} data={payouts} keyExtractor={(p) => p.id} />
    </div>
  );
};
