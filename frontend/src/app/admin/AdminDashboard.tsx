import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin/adminService';
import { AdminKPIs, AdminSecurityAlert, AdminHackathonRecord } from '../../types/admin';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { OrbitalRing } from '../../components/orbital/OrbitalRing';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  Receipt,
  Activity,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  RefreshCw,
  Lock,
  ExternalLink,
  Flame,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [alerts, setAlerts] = useState<AdminSecurityAlert[]>([]);
  const [pendingHackathons, setPendingHackathons] = useState<AdminHackathonRecord[]>([]);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  const loadData = () => {
    Promise.all([
      adminService.getKPIs(),
      adminService.getSecurityAlerts(),
      adminService.getHackathons(),
    ]).then(([kpiData, alertData, hackathons]) => {
      setKpis(kpiData);
      setAlerts(alertData);
      setPendingHackathons(
        (hackathons || []).filter((h) => h.status === 'draft' || h.status === 'pending')
      );
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveHackathon = async (id: string) => {
    setIsApproving(id);
    try {
      await adminService.updateHackathonStatus(id, 'active');
      loadData();
    } finally {
      setIsApproving(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Dashboard Header */}
      <DashboardHeader
        title="System Governance // Root Command"
        subtitle="Global platform supervision, security telemetry, user role moderation, and track verification gates."
        badge={
          <span className="text-[10px] font-mono bg-[#0D1220] text-[#00E575] border border-[#00E575]/30 px-2.5 py-0.5 rounded-full uppercase font-medium flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,229,117,0.15)]">
            <StatusBeacon color="green" size="sm" pulse />
            <span>ROOT GOVERNANCE // ACTIVE</span>
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/audit-logs')}
              icon={<ShieldAlert className="w-3.5 h-3.5" />}
            >
              Audit System Logs
            </Button>
          </div>
        }
      />

      {/* GLOBAL PLATFORM TELEMETRY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SystemPanel
          coordinate="TELEMETRY:01"
          status="ONLINE"
          accent="orange"
          className="p-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#FF5500]" />
              Platform Population
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {kpis?.totalUsers ?? 0}
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Registered Builders & Hosts
            </div>
          </div>
        </SystemPanel>

        <SystemPanel
          coordinate="TELEMETRY:02"
          status="RUNNING"
          accent="cyan"
          className="p-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
              Active Competitions
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {kpis?.activeHackathons ?? 0}
            </div>
            <div className="text-[10px] font-mono text-[#00F0FF]">
              {kpis?.pendingApprovals ?? pendingHackathons.length} Pending Approval
            </div>
          </div>
        </SystemPanel>

        <SystemPanel
          coordinate="TELEMETRY:03"
          status="LOCKED"
          accent="green"
          className="p-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block font-medium flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#00E575]" />
              Escrow Volume
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {kpis?.totalPaymentVolume || '$150,000'}
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Guaranteed Prize Contracts
            </div>
          </div>
        </SystemPanel>

        <SystemPanel
          coordinate="TELEMETRY:04"
          status="SEALED"
          accent="default"
          className="p-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Security Integrity
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#00E575] font-mono">
              OPTIMAL
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Zero Unresolved Breaches
            </div>
          </div>
        </SystemPanel>
      </div>

      {/* Governance Console Multi-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Role Distribution, Pending Proposals & Escrow */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: USERS ROLE DISTRIBUTION */}
          <SystemPanel
            coordinate="SECTOR:POPULATION"
            status="BALANCED"
            accent="orange"
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF5500]" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Platform Role Distribution
                </h3>
              </div>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-xs text-[#FF5500] hover:underline cursor-pointer font-mono flex items-center gap-1"
              >
                <span>Directory Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#06080F] border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block font-medium">
                  Builders / Participants
                </span>
                <p className="text-2xl font-bold text-white font-mono">
                  {kpis?.totalParticipants ?? 0}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-zinc-400 hover:text-white"
                  onClick={() => navigate('/admin/participants')}
                >
                  Inspect Builders →
                </Button>
              </div>

              <div className="bg-[#06080F] border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block font-medium">
                  Track Hosts / Organizers
                </span>
                <p className="text-2xl font-bold text-white font-mono">
                  {kpis?.totalOrganizers ?? 0}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-zinc-400 hover:text-white"
                  onClick={() => navigate('/admin/organizers')}
                >
                  Inspect Hosts →
                </Button>
              </div>

              <div className="bg-[#06080F] border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block font-medium">
                  Empaneled Jurors / Judges
                </span>
                <p className="text-2xl font-bold text-white font-mono">
                  {kpis?.totalJudges ?? 0}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-zinc-400 hover:text-white"
                  onClick={() => navigate('/admin/judges')}
                >
                  Inspect Jurors →
                </Button>
              </div>
            </div>
          </SystemPanel>

          {/* SECTION 2: TRACK PROPOSALS APPROVAL QUEUE */}
          <SystemPanel
            coordinate="SECTOR:TRACK_VERIFICATION"
            status="QUEUED"
            accent="cyan"
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Track Proposals & Verification Queue
                </h3>
              </div>
              <button
                onClick={() => navigate('/admin/hackathons')}
                className="text-xs text-[#00F0FF] hover:underline cursor-pointer font-mono"
              >
                All Competitions →
              </button>
            </div>

            {pendingHackathons.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#06080F] border border-white/5 text-center text-xs text-zinc-400 font-mono">
                All track proposals and hackathon submissions have been verified and activated.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingHackathons.map((h) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-xl bg-[#06080F] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{h.title}</span>
                        <Badge variant="cyan" size="sm">
                          {h.category || 'General Track'}
                        </Badge>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-1">
                        Hosted by {h.organizerName} • Prize Pool: {h.totalPrizePool || '$25,000'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isApproving === h.id}
                        onClick={() => handleApproveHackathon(h.id)}
                      >
                        Approve Track
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SystemPanel>

          {/* SECTION 5: PAYMENTS & ESCROW LEDGER */}
          <SystemPanel
            coordinate="SECTOR:ESCROW_LEDGER"
            status="ACTIVE"
            accent="green"
            className="space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#00E575]" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Disbursements & Escrow Integrity
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00E575] bg-[#00E575]/10 px-2 py-0.5 rounded border border-[#00E575]/20">
                SMART ESCROW READY
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#06080F] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">Prize Settlement Pipeline</div>
                <p className="text-[11px] text-zinc-400">
                  Total disbursed volume: <strong className="text-white font-mono">{kpis?.totalPayoutVolume || '$50,000'}</strong> across finalized tracks.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/payouts')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Inspect Payout Ledger
              </Button>
            </div>
          </SystemPanel>
        </div>

        {/* Right Column (4 cols): Security Telemetry, Disputes & System Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* SECTION 3: SECURITY TELEMETRY */}
          <SystemPanel
            coordinate="SECTOR:SECURITY_TELEMETRY"
            status="PROTECTED"
            accent="default"
            className="space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Security Integrity Feed
                </h3>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">REAL-TIME</span>
            </div>

            <div className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-xs text-zinc-400 py-3 text-center font-mono">
                  No active threat signals. All systems secured.
                </p>
              ) : (
                alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 rounded-xl bg-[#06080F] border border-white/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                        {alt.severity} Alert
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{alt.timestamp}</span>
                    </div>
                    <p className="font-semibold text-white">{alt.title}</p>
                    <p className="text-[11px] text-zinc-400">{alt.description}</p>
                  </div>
                ))
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/admin/disputes')}
            >
              Open Dispute Resolver
            </Button>
          </SystemPanel>

          {/* SECTION 6: SYSTEM STATUS TELEMETRY */}
          <SystemPanel
            coordinate="SECTOR:INFRASTRUCTURE"
            status="OPTIMAL"
            accent="cyan"
            className="space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Infrastructure Telemetry
                </h3>
              </div>
              <StatusBeacon color="cyan" size="sm" pulse />
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#06080F] border border-white/5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                  API Gateway Latency
                </span>
                <span className="text-[#00E575] font-bold">14ms</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#06080F] border border-white/5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-zinc-500" />
                  Database Pool
                </span>
                <span className="text-white font-bold">Optimal (Active)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#06080F] border border-white/5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-500" />
                  Consensus WebSocket Sync
                </span>
                <span className="text-[#00F0FF] font-bold">Synchronized</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#06080F] border border-white/5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  PDFKit Vector Engine
                </span>
                <span className="text-white font-bold">Ready</span>
              </div>
            </div>
          </SystemPanel>
        </div>
      </div>
    </div>
  );
};
