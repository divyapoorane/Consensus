import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminAuditLogRecord } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, RefreshCw, Filter, Search, ShieldCheck, Database } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLogRecord[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAuditLogs({
        search: search || undefined,
        userRole: roleFilter !== 'all' ? roleFilter : undefined,
        action: actionFilter !== 'all' ? actionFilter : undefined,
      });
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, actionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchLogs]);

  const handleExportCsv = () => {
    window.open(adminService.getAuditLogsCsvUrl(), '_blank');
  };

  const columns: Column<AdminAuditLogRecord>[] = [
    {
      header: 'Timestamp',
      cell: (l) => <span className="font-mono text-[11px] text-zinc-400">{l.timestamp}</span>,
    },
    {
      header: 'Actor & Role',
      cell: (l) => (
        <div>
          <span className="font-semibold text-zinc-100 block text-xs">{l.userEmail}</span>
          <span className="text-[10px] text-orange-400 font-mono uppercase">{l.userRole}</span>
        </div>
      ),
    },
    {
      header: 'System Action',
      cell: (l) => (
        <span className="font-mono text-zinc-200 font-medium text-xs">{l.action}</span>
      ),
    },
    {
      header: 'Resource Target',
      cell: (l) => <span className="text-zinc-300 text-xs font-mono">{l.resource}</span>,
    },
    {
      header: 'Status',
      cell: (l) => (
        <Badge
          variant={
            l.status === 'SUCCESS' ? 'emerald' : l.status === 'WARNING' ? 'amber' : 'rose'
          }
          size="sm"
        >
          {l.status}
        </Badge>
      ),
    },
    {
      header: 'IP Address',
      cell: (l) => <span className="font-mono text-[11px] text-zinc-400">{l.ipAddress}</span>,
    },
    {
      header: 'Metadata Telemetry',
      cell: (l) => (
        <span className="text-[11px] text-zinc-400 truncate max-w-xs block font-mono">
          {l.metadata || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Immutable Platform Audit Trail"
        subtitle="Real-time security telemetry, administrative access logs, and consensus protocol state transitions."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={isLoading}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportCsv}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Persistence Notice */}
      <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/20 flex items-start gap-3">
        <Database className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 space-y-1">
          <p className="font-semibold text-orange-300">
            PostgreSQL-Backed Audit Ledger (No Passwords or Secrets Logged)
          </p>
          <p className="text-zinc-400">
            Every platform action (logins, hackathon publications, team formation, jury grading, escrow releases, disputes) writes an immutable record to the database. "Export CSV" generates and downloads live records directly from the database table.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#141414] rounded-xl border border-[#2A2A2A]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email, action, resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#1C1C1C] border border-[#2E2E2E] rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#1C1C1C] border border-[#2E2E2E] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Actor Roles</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="judge">Judge</option>
            <option value="participant">Participant</option>
          </select>
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#1C1C1C] border border-[#2E2E2E] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Actions</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="HACKATHON_STATUS_MODIFIED">HACKATHON_STATUS_MODIFIED</option>
            <option value="PAYOUT_STATUS_CHANGED">PAYOUT_STATUS_CHANGED</option>
            <option value="DISPUTE_FILED">DISPUTE_FILED</option>
            <option value="DISPUTE_RESOLVED">DISPUTE_RESOLVED</option>
            <option value="CERTIFICATE_ISSUED">CERTIFICATE_ISSUED</option>
            <option value="EVALUATION_SUBMITTED">EVALUATION_SUBMITTED</option>
            <option value="PROJECT_SUBMITTED">PROJECT_SUBMITTED</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={logs} keyExtractor={(l) => l.id} />
    </div>
  );
};

