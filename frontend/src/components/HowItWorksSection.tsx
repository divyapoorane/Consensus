import React, { useState } from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/landingData';
import { SectionEyebrow } from './shared/SectionEyebrow';
import {
  Compass,
  Users,
  Code2,
  Send,
  Scale,
  Award,
  ArrowRight,
  Check,
  Shield,
  ExternalLink,
  Terminal,
  GitBranch,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const currentStep = HOW_IT_WORKS_STEPS[activeStageIdx];

  const getStepIcon = (idx: number, className = 'w-4 h-4') => {
    switch (idx) {
      case 0:
        return <Compass className={className} />;
      case 1:
        return <Users className={className} />;
      case 2:
        return <Code2 className={className} />;
      case 3:
        return <Send className={className} />;
      case 4:
        return <Scale className={className} />;
      case 5:
        return <Award className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  return (
    <section id="how-it-works" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Section Header */}
      <div className="mb-12">
        <SectionEyebrow number="02" label="ARENA PROTOCOL" status="VERIFIED PIPELINE" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display uppercase">
              SIX STAGES. ZERO BIAS. <span className="bg-gradient-to-r from-[#00F0FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">PRODUCTION IMPACT.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Every Consensus hackathon operates on a deterministic six-stage lifecycle, taking ideas from track discovery through cryptographic double-blind jury evaluation and automated prize escrow.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>STAGES: 6</span>
            <span>•</span>
            <span className="text-[#00F0FF] font-bold">ACTIVE STAGE: {currentStep.step}</span>
          </div>
        </div>
      </div>

      {/* 6-Stage Horizontal Interactive Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
        {HOW_IT_WORKS_STEPS.map((step, idx) => {
          const isActive = activeStageIdx === idx;
          const isPassed = idx < activeStageIdx;

          return (
            <button
              key={step.step}
              type="button"
              onClick={() => setActiveStageIdx(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#151D42] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-102'
                  : isPassed
                  ? 'bg-[#0B1021]/80 border-emerald-500/30 hover:border-emerald-400/50'
                  : 'bg-[#0B1021]/70 border-indigo-500/20 hover:border-indigo-400/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isActive ? 'text-[#00F0FF]' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {step.step}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                    isActive
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : isPassed
                      ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                      : 'bg-[#070A16] border-indigo-500/20 text-slate-400'
                  }`}
                >
                  {getStepIcon(idx, 'w-3.5 h-3.5')}
                </div>
              </div>

              <div>
                <span
                  className={`text-xs font-mono font-bold block leading-tight uppercase tracking-wider ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {step.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">
                  {step.tagline}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Deep Dive Command Panel (Editorial Split Layout) */}
      <div className="bg-[#0B1021]/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_4px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Subtle decorative energy line on top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Stage Breakdown & Description */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E152F] border border-cyan-500/30 shadow-xs">
                <span className="text-[10px] font-mono font-bold text-[#00F0FF]">
                  STAGE {currentStep.step} OF 06
                </span>
                <span className="text-indigo-400/40">/</span>
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                  {currentStep.tagline}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display uppercase">
                {currentStep.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {currentStep.description}
            </p>

            {/* Stage Technical Checkpoints */}
            <div className="p-4 rounded-xl bg-[#070A16] border border-indigo-500/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Protocol Guarantee</span>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed font-sans">
                {currentStep.highlight}
              </p>
            </div>

            {/* Navigation buttons between stages */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={activeStageIdx === 0}
                onClick={() => setActiveStageIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-[#0E152F] hover:bg-[#152044] border border-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-slate-200 font-mono font-bold uppercase transition-all cursor-pointer"
              >
                ← Previous Stage
              </button>

              <button
                type="button"
                disabled={activeStageIdx === HOW_IT_WORKS_STEPS.length - 1}
                onClick={() =>
                  setActiveStageIdx((prev) => Math.min(HOW_IT_WORKS_STEPS.length - 1, prev + 1))
                }
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#818CF8] hover:opacity-95 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Stage Terminal Simulation */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-indigo-500/30 bg-[#070A16]/95 overflow-hidden shadow-2xl backdrop-blur-md">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#0B1021] border-b border-indigo-500/25 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-[11px] font-mono text-cyan-300 ml-2 font-bold">
                    consensus://protocol/stage-0{activeStageIdx + 1}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00F0FF] px-2.5 py-0.5 rounded-full bg-[#0E152F] border border-cyan-500/35 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  ACTIVE TELEMETRY
                </span>
              </div>

              {/* Dynamic Interactive Stage View */}
              <div className="p-5 font-mono text-xs">
                {activeStageIdx === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-400 border-b border-indigo-500/20 pb-2">
                      <span className="text-[#00F0FF] font-bold">$ consensus tracks list --status=open</span>
                      <span className="text-[10px] text-cyan-300">VERIFIED CHALLENGES</span>
                    </div>
                    <div className="space-y-2 text-slate-200">
                      <div className="p-3 rounded-xl bg-[#0B1021] border border-indigo-500/20 flex items-center justify-between hover:border-cyan-400/40 transition-colors">
                        <div>
                          <p className="font-bold text-white uppercase tracking-wider">TRACK 01: Autonomous Systems & AI Agents</p>
                          <p className="text-[11px] text-slate-400 font-sans mt-0.5">Multi-agent coordination protocol with verifiable decision logs</p>
                        </div>
                        <span className="text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">$25,000 ESCROW</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0B1021] border border-indigo-500/20 flex items-center justify-between hover:border-cyan-400/40 transition-colors">
                        <div>
                          <p className="font-bold text-white uppercase tracking-wider">TRACK 02: Decentralized Tech & Zero-Knowledge</p>
                          <p className="text-[11px] text-slate-400 font-sans mt-0.5">Cryptographic privacy primitives and trustless state verification</p>
                        </div>
                        <span className="text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">$30,000 ESCROW</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStageIdx === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-400 border-b border-indigo-500/20 pb-2">
                      <span className="text-[#00F0FF] font-bold">$ consensus squad room --generate-invite</span>
                      <span className="text-[10px] text-cyan-300">ENCRYPTED CONSTELLATION</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B1021] border border-indigo-500/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Squad Code:</span>
                        <code className="px-2.5 py-1 rounded-lg bg-[#151D42] text-[#00F0FF] font-bold border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]">CNS-9021-ALPHA</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Team Roster:</span>
                        <span className="text-white font-bold">2 / 4 Builders</span>
                      </div>
                      <div className="pt-2 border-t border-indigo-500/20 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Shield className="w-3.5 h-3.5 text-[#FF5500]" />
                          <span>Leader (Full-Stack)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Member (ML Systems)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStageIdx === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-400 border-b border-indigo-500/20 pb-2">
                      <span className="text-amber-400 font-bold">$ consensus workspace sync --git</span>
                      <span className="text-[10px] text-cyan-300">CONNECTED WORKSPACE</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B1021] border border-indigo-500/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Source Repository:</span>
                        <span className="text-cyan-300 truncate font-semibold">github.com/builder/agent-consensus</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Live Endpoint:</span>
                        <span className="text-emerald-400 font-bold">https://prototype.arena.internal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Commit Hash:</span>
                        <code className="text-slate-300 bg-[#070A16] px-2 py-0.5 rounded border border-indigo-500/20">9f1d8c4 (HEAD: main)</code>
                      </div>
                    </div>
                  </div>
                )}

                {activeStageIdx === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-400 border-b border-indigo-500/20 pb-2">
                      <span className="text-[#FF5500] font-bold">$ consensus verify --preflight-gate</span>
                      <span className="text-[10px] text-cyan-300">VALIDATION SEQUENCE</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B1021] border border-indigo-500/20 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[PASS] Repository HTTPS clone verification</span>
                        <span className="font-bold">SHA256 OK</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[PASS] Live demo HTTP 200 health response</span>
                        <span className="font-bold">142ms</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>[PASS] Architecture specification attached</span>
                        <span className="font-bold">MARKDOWN OK</span>
                      </div>
                      <div className="flex items-center justify-between text-white font-bold pt-2 border-t border-indigo-500/20">
                        <span>GATE STATUS: READY FOR JURY ENROLLMENT</span>
                        <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStageIdx === 4 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-400 border-b border-indigo-500/20 pb-2">
                      <span className="text-[#C084FC] font-bold">$ consensus jury --double-blind-matrix</span>
                      <span className="text-[10px] text-cyan-300">VARIANCE NORMALIZATION</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B1021] border border-indigo-500/20 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Author Anonymization:</span>
                        <span className="text-emerald-400 font-bold">ACTIVE (ID MASKED)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-indigo-500/20">
                        <div className="p-2 rounded-lg bg-[#070A16] border border-indigo-500/20">
                          <span className="text-slate-400 block text-[10px]">Technical Depth:</span>
                          <span className="text-[#00F0FF] font-black text-sm">28.5 / 30</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#070A16] border border-indigo-500/20">
                          <span className="text-slate-400 block text-[10px]">Innovation:</span>
                          <span className="text-[#00F0FF] font-black text-sm">24.0 / 25</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-200 pt-1">
                        <span>Jury Outlier Variance:</span>
                        <span className="text-emerald-400 font-mono font-bold">0.04 (ACCEPTED)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStageIdx === 5 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-400 border-b border-indigo-500/20 pb-2">
                      <span className="text-emerald-400 font-bold">$ consensus escrow disburse --id=CNS-WIN-01</span>
                      <span className="text-[10px] text-cyan-300">IMMUTABLE SETTLEMENT</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B1021] border border-indigo-500/20 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Composite Score:</span>
                        <span className="text-[#00F0FF] font-black text-sm drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">94.2 / 100</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Prize Placement:</span>
                        <span className="text-emerald-400 font-black">1st Place ($15,000)</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Credential Issued:</span>
                        <code className="text-cyan-300 bg-[#070A16] px-2 py-0.5 rounded border border-indigo-500/20">CERT-CNS-2026-901</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
