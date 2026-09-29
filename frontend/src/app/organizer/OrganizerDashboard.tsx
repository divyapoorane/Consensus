import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizerService } from '../../services/organizer/organizerService';
import { OrganizerStats, HackathonConfig } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { MetricStrip } from '../../components/shared/MetricStrip';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Calendar,
  Users,
  FileCheck2,
  Scale,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Compass,
  Trophy,
  DollarSign,
  Scroll,
  Radio,
  Cpu,
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [hackathons, setHackathons] = useState<HackathonConfig[]>([]);

  useEffect(() => {
    Promise.all([organizerService.getStats(), organizerService.getHackathons()]).then(
      ([statsData, hackathonsData]) => {
        setStats(statsData);
        setHackathons(hackathonsData);
      }
    );
  }, []);

  const totalRegistered = stats?.totalRegistrations ?? 0;
  const totalSubmissions = stats?.totalSubmissions ?? 0;
  const pendingJudging = stats?.pendingJudging ?? 0;

  return (
    <div className="space-y-6">
      {/* Event Control Center Header */}
      <DashboardHeader
        title="Event Control Center"
        subtitle="Mission host telemetry: competition lifecycles, builder applications, double-blind jury consensus, and prize escrow disbursement."
        badge={<StatusBeacon status="connected" label="CONTROL CENTER ONLINE" />}
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/organizer/hackathons/create')}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Commission Track
          </Button>
        }
      />

      {/* REAL TELEMETRY METRIC STRIP */}
      <MetricStrip
        items={[
          {
            label: 'Hosted Tracks',
            value: stats?.totalHackathons ?? 0,
            subtext: `${stats?.activeHackathons ?? 0} Live Challenges`,
            icon: <Calendar className="w-4 h-4" />,
            accent: 'orange',
            highlight: true,
          },
          {
            label: 'Builder Registrations',
            value: totalRegistered,
            subtext: 'Enrolled Hackers',
            icon: <Users className="w-4 h-4" />,
            accent: 'emerald',
          },
          {
            label: 'Shipped Submissions',
            value: totalSubmissions,
            subtext: 'Codebases Received',
            icon: <FileCheck2 className="w-4 h-4" />,
            accent: 'cyan',
          },
          {
            label: 'Awaiting Jury Scoring',
            value: pendingJudging,
            subtext: 'Pending Deliberation',
            icon: <Scale className="w-4 h-4" />,
            accent: 'amber',
          },
        ]}
      />

      {/* MISSION MODULES QUICK MATRIX */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'REGISTRATION', value: `${totalRegistered} Enrolled`, path: '/organizer/participants', icon: <Users className="w-4 h-4 text-[#00F0FF]" /> },
          { label: 'TEAMS', value: 'Squad Rosters', path: '/organizer/teams', icon: <Users className="w-4 h-4 text-[#38BDF8]" /> },
          { label: 'SUBMISSIONS', value: `${totalSubmissions} Codebases`, path: '/organizer/submissions', icon: <FileCheck2 className="w-4 h-4 text-[#00E575]" /> },
          { label: 'JUDGING', value: `${pendingJudging} Pending`, path: '/organizer/judging', icon: <Scale className="w-4 h-4 text-amber-400" /> },
          { label: 'RESULTS', value: 'Winner Ranking', path: '/organizer/results', icon: <Trophy className="w-4 h-4 text-[#FF7722]" /> },
          { label: 'PAYOUTS', value: 'Prize Escrow', path: '/organizer/payouts', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
          { label: 'CERTIFICATES', value: 'Credentials', path: '/organizer/certificates', icon: <Scroll className="w-4 h-4 text-[#A5B4FC]" /> },
        ].map((mod) => (
          <button
            key={mod.label}
            type="button"
            onClick={() => navigate(mod.path)}
            className="p-3 rounded-lg bg-[#0D1220]/90 border border-[#182238] hover:border-[#00F0FF]/40 text-left transition-all hover:scale-102 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase text-[#8E9BB5] font-bold">{mod.label}</span>
              {mod.icon}
            </div>
            <span className="text-[11px] font-mono font-bold text-[#F0F4FC] truncate">{mod.value}</span>
          </button>
        ))}
      </div>

      {/* Control Room Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Managed Hackathon Tracks (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F0F4FC] flex items-center gap-2 font-mono uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#FF5500]" />
              <span>Managed Competition Tracks ({hackathons.length})</span>
            </h2>
            <button
              onClick={() => navigate('/organizer/hackathons')}
              className="text-xs text-[#00F0FF] hover:underline cursor-pointer font-mono uppercase"
            >
              All Tracks ({hackathons.length}) →
            </button>
          </div>

          <div className="divide-y divide-[#182238] rounded-xl border border-[#182238] bg-[#0D1220]/95 overflow-hidden">
            {hackathons.length === 0 ? (
              <div className="p-8 text-center bg-[#090D18] space-y-3">
                <p className="text-xs text-[#8E9BB5] font-mono">No hackathon tracks commissioned yet.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/organizer/hackathons/create')}
                >
                  Commission Your First Track
                </Button>
              </div>
            ) : (
              hackathons.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="p-5 hover:bg-[#11182B] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TechnicalLabel label="STATUS" value={hackathon.status} variant={hackathon.status === 'active' ? 'green' : 'amber'} />
                      <Badge variant="slate" size="sm">
                        {hackathon.category}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-[#F0F4FC] font-mono uppercase">
                      {hackathon.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#8E9BB5] font-mono">
                      <span>
                        BUILDERS:{' '}
                        <strong className="text-[#00F0FF]">{hackathon.registrationsCount}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        SUBMISSIONS:{' '}
                        <strong className="text-[#00E575]">{hackathon.submissionsCount}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        ESCROW:{' '}
                        <strong className="text-[#FF7722]">
                          {hackathon.prizes?.totalPool || '$0'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/organizer/hackathons/${hackathon.id}`)}
                    >
                      Manage Track
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/organizer/judging')}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Jury Deliberation
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-Time Consensus Signal & Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* VISUAL CONSENSUS SIGNAL AREA */}
          <SystemPanel title="Consensus Signal Telemetry" accent="orange">
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-[#090D18] border border-[#182238]">
                <span className="text-[10px] text-[#8E9BB5]">DELIBERATION MATRIX</span>
                <StatusBeacon
                  status={pendingJudging === 0 && totalSubmissions > 0 ? 'connected' : 'live'}
                  label={pendingJudging === 0 && totalSubmissions > 0 ? 'CONVERGED' : 'SCORING IN FLIGHT'}
                />
              </div>

              <div className="p-3 rounded bg-[#090D18] border border-[#182238] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#8E9BB5]">Jury Evaluated</span>
                  <span className="font-bold text-[#00E575]">
                    {Math.max(0, totalSubmissions - pendingJudging)} / {totalSubmissions}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#182238] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F0FF] via-[#FF5500] to-[#00E575] transition-all duration-300"
                    style={{
                      width: totalSubmissions > 0
                        ? `${((totalSubmissions - pendingJudging) / totalSubmissions) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/organizer/judging')}
                icon={<Scale className="w-3.5 h-3.5" />}
              >
                Inspect Consensus Signals
              </Button>
            </div>
          </SystemPanel>

          {/* Quick Navigation to Final Transmission & Results */}
          <SystemPanel title="Settlement Protocol" accent="cyan">
            <p className="text-xs text-[#8E9BB5] mb-3 font-mono">
              Lock composite scores, confirm grand prize rankings, and disburse cryptographic certificates.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/organizer/results')}
                icon={<Trophy className="w-3.5 h-3.5" />}
              >
                View Final Transmissions
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/organizer/payouts')}
                icon={<DollarSign className="w-3.5 h-3.5" />}
              >
                Review Prize Payouts
              </Button>
            </div>
          </SystemPanel>
        </div>
      </div>
    </div>
  );
};
