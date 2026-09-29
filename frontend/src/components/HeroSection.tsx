import React, { useState } from 'react';
import {
  ArrowUpRight,
  Compass,
  PlusCircle,
  Trophy,
  Users,
  Code2,
  Award,
  Shield,
  ChevronRight,
  Send,
  Check,
  Radio,
  Scale,
  Sparkles,
} from 'lucide-react';
import { SectionEyebrow } from './shared/SectionEyebrow';
import { StatusBeacon } from './orbital/StatusBeacon';

interface HeroSectionProps {
  onExploreHackathons: () => void;
  onHostHackathon: () => void;
}

export type ArenaNodeKey =
  | 'hackathon'
  | 'squad'
  | 'build'
  | 'submit'
  | 'judge'
  | 'consensus'
  | 'win';

interface NodeDetail {
  step: string;
  title: string;
  category: string;
  lead: string;
  bullet1: string;
  bullet2: string;
  signal: string;
}

const ORBITAL_STEPS: Record<ArenaNodeKey, NodeDetail> = {
  hackathon: {
    step: '01',
    title: 'Mission Briefing & Track Activation',
    category: 'TRACK ENTRY',
    lead: 'Enter open competition tracks with locked escrow pools, transparent criteria, and immutable registration windows.',
    bullet1: 'Individual and squad entry rules programmatically enforced',
    bullet2: 'Direct access to official APIs, dependencies, and requirements',
    signal: 'Track Open',
  },
  squad: {
    step: '02',
    title: 'Squad Formation & Roster Lock',
    category: 'SQUAD COMMAND',
    lead: 'Assemble multidisciplinary developer units and issue cryptographic join codes to sync roles and skills.',
    bullet1: 'Squad leader synchronization and member invite protocols',
    bullet2: 'Automatic hackathon track enrollment upon squad join',
    signal: 'Squad Linked',
  },
  build: {
    step: '03',
    title: 'Mission Build Bay & Engineering',
    category: 'WORKSPACE BAY',
    lead: 'Link verified GitHub repositories, configure live demo endpoints, and document technical architecture.',
    bullet1: 'Full-stack tech stack tagging and prototype version tracking',
    bullet2: 'Live sandbox testing with team contributor telemetry',
    signal: 'Bay Active',
  },
  submit: {
    step: '04',
    title: 'Launch Sequence & Pre-Flight Verification',
    category: 'SUBMISSION LAUNCH',
    lead: 'Execute deterministic 5-step checklist verifying code origin, documentation, demo availability, and compliance.',
    bullet1: 'Cryptographic timestamping prior to hard deadline cutoff',
    bullet2: 'Zero-downtime payload handoff to the jury evaluation pool',
    signal: 'Payload Locked',
  },
  judge: {
    step: '05',
    title: 'Juror Command Deck & Rubric Review',
    category: 'JURY DECK',
    lead: 'Empaneled jurors evaluate blinded submissions across Innovation, Technical Quality, UI/UX, and Impact.',
    bullet1: 'Standardized quantitative scoring weights from 0 to 100',
    bullet2: 'Granular evaluation notes and direct code inspection',
    signal: 'Review Active',
  },
  consensus: {
    step: '06',
    title: 'Double-Blind Consensus Scoring Signal',
    category: 'CONSENSUS MATRIX',
    lead: 'The programmatic consensus engine aggregates, normalizes, and filters juror scores to eliminate bias.',
    bullet1: 'Outlier rejection and normalized multi-judge score blending',
    bullet2: 'Real-time consensus signal convergence tracking',
    signal: 'Consensus Converged',
  },
  win: {
    step: '07',
    title: 'Final Transmission & Escrow Settlement',
    category: 'ARENA SETTLEMENT',
    lead: 'Public broadcast of verified champions, automated prize payout disbursements, and cryptographic certificates.',
    bullet1: 'Verified digital achievement badges issued to contributors',
    bullet2: 'Permanent project inclusion into the Consensus Open Gallery',
    signal: 'Settled & Verified',
  },
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreHackathons,
  onHostHackathon,
}) => {
  const [hoveredNode, setHoveredNode] = useState<ArenaNodeKey | null>(null);
  const [selectedNode, setSelectedNode] = useState<ArenaNodeKey>('hackathon');

  const activeKey = hoveredNode || selectedNode;
  const activeDetail = ORBITAL_STEPS[activeKey];

  const stepsList: { key: ArenaNodeKey; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'hackathon', label: 'HACKATHON', icon: <Compass className="w-3.5 h-3.5" />, color: '#00F0FF' },
    { key: 'squad', label: 'SQUAD', icon: <Users className="w-3.5 h-3.5" />, color: '#38BDF8' },
    { key: 'build', label: 'BUILD', icon: <Code2 className="w-3.5 h-3.5" />, color: '#818CF8' },
    { key: 'submit', label: 'SUBMIT', icon: <Send className="w-3.5 h-3.5" />, color: '#FF7722' },
    { key: 'judge', label: 'JUDGE', icon: <Scale className="w-3.5 h-3.5" />, color: '#F59E0B' },
    { key: 'consensus', label: 'CONSENSUS', icon: <Award className="w-3.5 h-3.5" />, color: '#FF5500' },
    { key: 'win', label: 'WIN', icon: <Trophy className="w-3.5 h-3.5" />, color: '#00E575' },
  ];

  return (
    <section
      id="hero"
      aria-label="Consensus Orbital Arena"
      className="relative w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Dynamic Ambient Energy Auras */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-r from-[#00F0FF]/15 via-[#818CF8]/20 to-[#C084FC]/15 rounded-full blur-[100px] pointer-events-none animate-glow-drift" />

      {/* Main Glassmorphism Arena Stage Card */}
      <div className="relative max-w-6xl mx-auto rounded-[32px] bg-[#0A0D1D]/90 border border-indigo-500/25 p-8 sm:p-14 lg:p-20 shadow-[0_0_80px_rgba(30,27,75,0.45)] mb-12 relative overflow-hidden backdrop-blur-md text-center">
        {/* Concentric Circular Orbital Radar Lines */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-indigo-500/10 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-indigo-400/5 pointer-events-none" />

        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1A2C] border border-[#00F0FF]/35 text-[#00F0FF] text-[11px] font-mono font-bold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)] relative z-10">
          <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>READY TO BUILD WHAT'S NEXT?</span>
        </div>

        {/* Hero Display Heading */}
        <h1 className="relative text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] font-display uppercase mb-6 text-center z-10">
          YOUR NEXT<br />
          BREAKTHROUGH<br />
          <span className="bg-gradient-to-r from-[#00F0FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
            STARTS HERE.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed mb-10 font-sans text-center relative z-10">
          Whether you are writing code for the first time or deploying a multi-million-dollar hackathon track, the Consensus arena is live.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button
            onClick={onExploreHackathons}
            onMouseEnter={() => setHoveredNode('hackathon')}
            onMouseLeave={() => setHoveredNode(null)}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#818CF8] hover:from-[#38BDF8] hover:to-[#A78BFA] text-slate-950 font-black text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_30px_rgba(0,240,255,0.45)] hover:shadow-[0_12px_45px_rgba(0,240,255,0.65)] hover:scale-105 active:scale-95"
          >
            <span>JOIN A HACKATHON</span>
            <ArrowUpRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </button>

          <button
            onClick={onHostHackathon}
            onMouseEnter={() => setHoveredNode('consensus')}
            onMouseLeave={() => setHoveredNode(null)}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#12182B] hover:bg-[#1A233D] border border-[#232F4C] hover:border-indigo-400/50 text-slate-200 font-bold text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CREATE A HACKATHON</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE ORBITAL MISSION PATH */}
      <div className="relative w-full max-w-5xl mx-auto bg-[#090D18]/95 border border-[#00F0FF]/30 hover:border-[#00F0FF]/50 transition-colors rounded-2xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.1),0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#00F0FF] before:to-transparent">
        {/* Laser Sweep Energy Line on top */}
        <div className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FF5500] to-transparent animate-laser-sweep pointer-events-none" />
        {/* Aerospace Grid Lines */}
        <div className="absolute inset-0 orbital-grid opacity-30 pointer-events-none" />

        {/* Mission Path Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#182238]">
          <div className="flex items-center gap-2">
            <StatusBeacon status="mission" label="ORBITAL ARENA MISSION VECTOR" />
          </div>
          <span className="text-[11px] font-mono text-[#8E9BB5]">
            HOVER NODES TO INSPECT SQUAD FLIGHT PATH
          </span>
        </div>

        {/* 7-Step Orbital Mission Track */}
        <div className="relative z-10 py-3 sm:py-6">
          {/* Desktop/Tablet Horizontal Pipeline */}
          <div className="hidden lg:grid grid-cols-7 gap-2 relative">
            {/* Connecting Vector Line Behind Nodes */}
            <div className="absolute top-1/2 left-6 right-6 h-0.5 -translate-y-1/2 bg-[#182238] z-0">
              <div
                className="h-full bg-gradient-to-r from-[#00F0FF] via-[#FF5500] to-[#00E575] transition-all duration-300 shadow-[0_0_8px_#FF5500]"
                style={{
                  width: `${((stepsList.findIndex((s) => s.key === activeKey) + 1) / stepsList.length) * 100}%`,
                }}
              />
            </div>

            {stepsList.map((step, idx) => {
              const isActive = activeKey === step.key;
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => setSelectedNode(step.key)}
                  onMouseEnter={() => setHoveredNode(step.key)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`relative z-10 flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive ? 'scale-105' : 'hover:scale-102 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                      isActive
                        ? 'bg-[#0D1220] border-[#FF5500] text-white shadow-[0_0_20px_rgba(255,85,0,0.4)]'
                        : 'bg-[#090D18] border-[#182238] text-[#8E9BB5] hover:border-[#28375A]'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-[#8E9BB5] block">
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider block font-bold transition-colors ${
                        isActive ? 'text-[#F0F4FC]' : 'text-[#8E9BB5]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Vertical Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-2">
            {stepsList.map((step, idx) => {
              const isActive = activeKey === step.key;
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => setSelectedNode(step.key)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                    isActive
                      ? 'bg-[#0D1220] border-[#FF5500] text-white'
                      : 'bg-[#090D18] border-[#182238] text-[#8E9BB5]'
                  }`}
                >
                  <div className="w-7 h-7 rounded flex items-center justify-center bg-[#11182B] text-xs">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8E9BB5] block">0{idx + 1}</span>
                    <span className="text-[10px] font-mono font-bold uppercase">{step.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Detail Drawer for Active Mission Step */}
        <div className="mt-6 pt-5 border-t border-[#182238] bg-[#0D1220]/80 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 flex-1 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#11182B] text-[#FF5500] border border-[#FF5500]/30 font-semibold">
                PHASE {activeDetail.step} // {activeDetail.category}
              </span>
              <StatusBeacon status="live" label={activeDetail.signal} />
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#F0F4FC] font-mono uppercase tracking-wide">
              {activeDetail.title}
            </h3>

            <p className="text-xs text-[#8E9BB5] leading-relaxed max-w-3xl">
              {activeDetail.lead}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 text-[11px] text-[#8E9BB5] font-mono">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#00E575]" />
                <span>{activeDetail.bullet1}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#00E575]" />
                <span>{activeDetail.bullet2}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onExploreHackathons}
            className="flex-shrink-0 px-4 py-2.5 rounded-lg bg-[#FF5500]/15 hover:bg-[#FF5500]/25 border border-[#FF5500]/40 text-xs font-mono uppercase font-bold text-[#FF7722] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Enter Phase</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
