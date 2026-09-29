import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { OrbitalRing } from '../../components/orbital/OrbitalRing';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Trophy,
  Award,
  Zap,
  Lock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ProjectRankRecord {
  rank: number;
  id: string;
  title: string;
  squad: string;
  judgeScore: number;
  communityVotes: number;
  finalScore: number;
  assignedAward?: string;
  track?: string;
}

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const [projects] = useState<ProjectRankRecord[]>([
    {
      rank: 1,
      id: 'proj-01',
      title: 'SynapseAgent: Multi-Modal Consensus Engine',
      squad: 'NeuralForge',
      judgeScore: 93.2,
      communityVotes: 142,
      finalScore: 94.1,
      assignedAward: 'Grand Consensus Winner ($25,000)',
      track: 'Autonomous Systems & Multi-Agent Swarms',
    },
    {
      rank: 2,
      id: 'proj-02',
      title: 'SwarmProtocol: Decentralized Task Routing',
      squad: 'AgentMesh',
      judgeScore: 88.5,
      communityVotes: 98,
      finalScore: 89.2,
      assignedAward: 'Runner-Up Track Excellence ($15,000)',
      track: 'Decentralized Compute & Routing',
    },
    {
      rank: 3,
      id: 'proj-03',
      title: 'OmniChain Agent Bridge',
      squad: 'CrossLinkers',
      judgeScore: 86.0,
      communityVotes: 64,
      finalScore: 86.4,
      assignedAward: 'Most Innovative Architecture ($10,000)',
      track: 'Interoperable Protocol Bridges',
    },
  ]);

  const [finalized, setFinalized] = useState(false);

  const handleFinalizeWinners = () => {
    setFinalized(true);
    setTimeout(() => {
      alert('Official Consensus results committed to platform ledger! Ready to trigger prize payouts.');
      navigate('/organizer/payouts');
    }, 1200);
  };

  const champion = projects.find((p) => p.rank === 1);
  const runnerUp = projects.find((p) => p.rank === 2);
  const thirdPlace = projects.find((p) => p.rank === 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Final Transmission // Winner Culmination"
        subtitle="Composite consensus scoring derived from empaneled jury deliberation and community signal. Lock results to initiate prize disbursement protocol."
        badge={
          <span className="text-[10px] font-mono bg-[#0D1220] text-[#00F0FF] border border-[#00F0FF]/30 px-2.5 py-0.5 rounded-full uppercase font-medium flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <StatusBeacon color="cyan" size="sm" pulse />
            <span>TRANSMISSION GATE // ACTIVE</span>
          </span>
        }
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={handleFinalizeWinners}
            isLoading={finalized}
            icon={finalized ? <Lock className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
          >
            {finalized ? 'Committing to Ledger...' : 'Finalize & Lock Winners'}
          </Button>
        }
      />

      {/* Lock Notice Telemetry */}
      <div className="p-4 rounded-xl bg-[#090D18] border border-[#FF5500]/30 relative overflow-hidden flex items-start sm:items-center justify-between gap-4">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider">
                Consensus Deliberation Complete
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-[#0D1220] px-2 py-0.5 rounded border border-white/5">
                3 OF 3 PODIUM SLOTS ALLOCATED
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Juror rubric scores (80%) and quadratic community voting (20%) have been synthesized. Finalizing creates irreversible payout contracts.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-right font-mono shrink-0">
          <div className="text-[10px] text-zinc-500 uppercase">Prize Pool Allocated</div>
          <div className="text-base font-bold text-white">$50,000 USD</div>
        </div>
      </div>

      {/* PODIUM DISPLAY — CYBER ORBITAL PODIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        {/* #02 RUNNER-UP */}
        {runnerUp && (
          <SystemPanel
            coordinate="PODIUM:02"
            status="RUNNER-UP"
            accent="cyan"
            className="order-2 md:order-1 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-mono font-bold text-base flex items-center justify-center">
                  #02
                </span>
                <span className="text-[10px] font-mono uppercase text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/20">
                  Tier II Laureate
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-tight font-display">
                  {runnerUp.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="cyan" size="sm">
                    {runnerUp.squad}
                  </Badge>
                  <span className="text-[10px] font-mono text-zinc-500 truncate">
                    {runnerUp.track}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#06080F] border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">Jury Score:</span>
                  <span className="text-white font-bold">{runnerUp.judgeScore}/100</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">Community Votes:</span>
                  <span className="text-white font-bold">{runnerUp.communityVotes}</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center font-mono">
                  <span className="text-xs text-zinc-400">Composite:</span>
                  <span className="text-lg font-bold text-[#00F0FF]">{runnerUp.finalScore}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Assigned Prize</div>
                <div className="text-xs font-mono font-semibold text-[#00F0FF] px-2.5 py-1.5 rounded-lg bg-[#00F0FF]/5 border border-[#00F0FF]/20">
                  {runnerUp.assignedAward}
                </div>
              </div>
            </div>
          </SystemPanel>
        )}

        {/* #01 CHAMPION — APEX POSITION */}
        {champion && (
          <SystemPanel
            coordinate="PODIUM:01"
            status="CHAMPION"
            accent="orange"
            className="order-1 md:order-2 relative overflow-hidden md:-translate-y-2 border-[#FF5500]/50 shadow-[0_0_35px_rgba(255,85,0,0.18)]"
          >
            {/* Concentric subtle orbital rings in background */}
            <div className="absolute -top-16 -right-16 opacity-30 pointer-events-none">
              <OrbitalRing size={200} accent="orange" speed="fast" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-11 h-11 rounded-xl bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/50 font-mono font-black text-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,85,0,0.3)]">
                    #01
                  </span>
                  <Trophy className="w-5 h-5 text-[#FF5500] animate-pulse" />
                </div>
                <span className="text-[10px] font-mono uppercase text-[#FF5500] bg-[#FF5500]/15 px-2.5 py-1 rounded-full border border-[#FF5500]/30 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  GRAND CHAMPION
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-tight font-display">
                  {champion.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="orange" size="sm">
                    {champion.squad}
                  </Badge>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {champion.track}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#06080F] border border-[#FF5500]/20 space-y-2.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Jury Consensus Score:</span>
                  <span className="text-white font-bold">{champion.judgeScore}/100</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Community Signal:</span>
                  <span className="text-white font-bold">{champion.communityVotes} votes</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center font-mono">
                  <span className="text-xs text-zinc-300 font-semibold">Composite Score:</span>
                  <span className="text-2xl font-black text-[#FF5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.4)]">
                    {champion.finalScore}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-mono text-[#FF5500] uppercase font-bold mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Grand Prize Award
                </div>
                <div className="text-xs font-mono font-bold text-white px-3 py-2 rounded-lg bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-between">
                  <span>{champion.assignedAward}</span>
                  <span className="text-[10px] text-[#00E575] font-mono">READY TO PAY</span>
                </div>
              </div>
            </div>
          </SystemPanel>
        )}

        {/* #03 INNOVATION */}
        {thirdPlace && (
          <SystemPanel
            coordinate="PODIUM:03"
            status="INNOVATION"
            accent="default"
            className="order-3 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono font-bold text-base flex items-center justify-center">
                  #03
                </span>
                <span className="text-[10px] font-mono uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Architecture Award
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-tight font-display">
                  {thirdPlace.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="neutral" size="sm">
                    {thirdPlace.squad}
                  </Badge>
                  <span className="text-[10px] font-mono text-zinc-500 truncate">
                    {thirdPlace.track}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#06080F] border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">Jury Score:</span>
                  <span className="text-white font-bold">{thirdPlace.judgeScore}/100</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">Community Votes:</span>
                  <span className="text-white font-bold">{thirdPlace.communityVotes}</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center font-mono">
                  <span className="text-xs text-zinc-400">Composite:</span>
                  <span className="text-lg font-bold text-purple-400">{thirdPlace.finalScore}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Assigned Prize</div>
                <div className="text-xs font-mono font-semibold text-purple-300 px-2.5 py-1.5 rounded-lg bg-purple-950/20 border border-purple-500/20">
                  {thirdPlace.assignedAward}
                </div>
              </div>
            </div>
          </SystemPanel>
        )}
      </div>

      {/* FULL TELEMETRY RANKING TABLE */}
      <SystemPanel
        coordinate="LEDGER:VERIFIED_RANKINGS"
        status="FINAL"
        className="space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Comprehensive Deliberation Ledger
            </h3>
            <p className="text-xs text-zinc-400">
              Verified cryptographic rankings sealed with composite juror consensus metrics
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/organizer/payouts')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Review Prize Escrow
          </Button>
        </div>

        <div className="space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-[#090D18] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-black text-sm flex-shrink-0 ${
                    proj.rank === 1
                      ? 'bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40'
                      : proj.rank === 2
                      ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                      : 'bg-purple-950/30 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  #{proj.rank}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                    <Badge variant="neutral" size="sm">
                      {proj.squad}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
                    <span>
                      Jury Consensus: <strong className="text-white">{proj.judgeScore}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Community Signal: <strong className="text-zinc-200">{proj.communityVotes}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Composite Score:{' '}
                      <strong className="text-[#00E575] font-semibold">{proj.finalScore}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1 self-start sm:self-center">
                <span className="text-[10px] font-mono uppercase text-zinc-500">Prize Allocation</span>
                <span className="text-xs font-semibold text-[#FF5500] font-mono px-3 py-1 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/20">
                  {proj.assignedAward}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SystemPanel>
    </div>
  );
};
