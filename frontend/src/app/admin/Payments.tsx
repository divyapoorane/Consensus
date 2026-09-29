import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminPaymentRecord } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { StatusPill } from '../../components/shared/StatusPill';

export const PaymentsAdmin: React.FC = () => {
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);

  useEffect(() => {
    adminService.getPayments().then(setPayments);
  }, []);

  const columns: Column<AdminPaymentRecord>[] = [
    {
      header: 'Transaction ID',
      cell: (p) => (
        <span className="font-mono text-zinc-300 font-medium text-xs">{p.transactionId}</span>
      ),
    },
    {
      header: 'Sponsor / Depositor',
      cell: (p) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{p.userName}</span>
          <span className="text-[10px] text-zinc-400 font-mono">{p.userEmail}</span>
        </div>
      ),
    },
    {
      header: 'Hackathon Track',
      accessorKey: 'hackathonTitle',
    },
    {
      header: 'Gross Volume',
      cell: (p) => <span className="font-mono font-semibold text-orange-400 text-sm">{p.amount}</span>,
    },
    {
      header: 'Settlement Status',
      cell: (p) => <StatusPill status={p.status} />,
    },
    {
      header: 'Date & Time',
      cell: (p) => <span className="font-mono text-[11px] text-zinc-400">{p.date}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Escrow Payments & Sponsor Deposits"
        subtitle="Immutable ledger of incoming sponsor funding, track deposits, and escrow locks."
      />
      <Table columns={columns} data={payments} keyExtractor={(p) => p.id} />
    </div>
  );
};
