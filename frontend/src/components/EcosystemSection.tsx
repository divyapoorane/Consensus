import React, { useState } from 'react';
import { ECOSYSTEM_ROLES } from '../data/landingData';
import { UserRole } from '../types';
import { SectionEyebrow } from './shared/SectionEyebrow';
import { ArrowUpRight, Check, Shield, Cpu, Scale, Compass } from 'lucide-react';

interface EcosystemSectionProps {
  onSelectRoleAction: (role: UserRole) => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({
  onSelectRoleAction,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('participant');

  const currentRoleInfo =
    ECOSYSTEM_ROLES.find((r) => r.id === selectedRole) || ECOSYSTEM_ROLES[0];

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'participant':
        return <Cpu className="w-4 h-4 text-[#FF6B35]" />;
      case 'organizer':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'judge':
        return <Scale className="w-4 h-4 text-purple-400" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-amber-400" />;
      default:
        return <Cpu className="w-4 h-4 text-[#FF6B35]" />;
    }
  };

  return (
    <section id="ecosystem" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="mb-12">
        <SectionEyebrow number="03" label="ROLE ARCHITECTURE" status="4 DEDICATED CONSOLES" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display uppercase">
              FOUR STAKEHOLDERS. <span className="bg-gradient-to-r from-[#00F0FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">DISTINCT ENVIRONMENTS.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Consensus provisions tailor-made operational interfaces for each participant in the hackathon ecosystem — from code submission workspaces to mathematical jury deliberation matrices.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>ENVIRONMENTS: PRODUCTION</span>
            <span>•</span>
            <span className="text-[#00F0FF] font-bold uppercase">{currentRoleInfo.title}</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Command Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {ECOSYSTEM_ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              type="button"
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-[#151D42] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-102'
                  : 'bg-[#0B1021]/80 border-indigo-500/20 hover:border-cyan-400/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                    isSelected
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'bg-[#070A16] border-indigo-500/20 text-slate-400'
                  }`}
                >
                  {getRoleIcon(role.id)}
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                    {role.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {role.tagline}
                  </span>
                </div>
              </div>

              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isSelected
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                    : 'bg-[#0E152F] text-slate-500 border border-slate-700/30'
                }`}
              >
                {isSelected ? 'ACTIVE' : 'SELECT'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded Role Console Environment */}
      <div className="bg-[#0B1021]/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_4px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Subtle decorative energy line on top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Overview & Launch Action */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E152F] border border-cyan-500/30">
                <span className="text-[10px] font-mono text-slate-400 uppercase">SPEC:</span>
                <span className="text-[10px] font-mono text-[#00F0FF] font-bold uppercase tracking-wider">{currentRoleInfo.title}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
                {currentRoleInfo.tagline}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {currentRoleInfo.overview}
            </p>

            <button
              onClick={() => onSelectRoleAction(currentRoleInfo.id)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#818CF8] hover:opacity-95 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:scale-105 active:scale-95"
            >
              <span>{currentRoleInfo.primaryAction}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Right Column: High-Density Capability Matrix */}
          <div className="lg:col-span-7 bg-[#070A16] border border-indigo-500/25 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Core Operational Tooling ({currentRoleInfo.capabilities.length} Features)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                ACTIVE IN V2.8
              </span>
            </div>

            <div className="space-y-3">
              {currentRoleInfo.capabilities.map((cap, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 rounded-md bg-[#0E152F] text-[#00F0FF] border border-cyan-500/30 flex-shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-slate-200 leading-relaxed font-sans">
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
