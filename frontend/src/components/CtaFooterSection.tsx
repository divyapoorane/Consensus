import React from 'react';
import { ArrowUpRight, Github, Twitter, Disc as Discord } from 'lucide-react';
import { SectionEyebrow } from './shared/SectionEyebrow';

interface CtaFooterSectionProps {
  onJoinHackathon: () => void;
  onCreateHackathon: () => void;
  onExploreTracks: () => void;
}

export const CtaFooterSection: React.FC<CtaFooterSectionProps> = ({
  onJoinHackathon,
  onCreateHackathon,
  onExploreTracks,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="cta-footer" className="relative w-full border-t border-indigo-500/20 pt-20 pb-12 bg-[#06080F]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Terminal Call-to-Action Command Box */}
        <div className="relative rounded-[28px] bg-[#0B1021]/90 backdrop-blur-md border border-indigo-500/30 p-8 sm:p-14 text-center mb-16 overflow-hidden shadow-[0_0_60px_rgba(30,27,75,0.4)]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#00F0FF]/15 via-[#818CF8]/20 to-[#C084FC]/15 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <SectionEyebrow number="04" label="DEPLOY YOUR PROTOTYPE" status="ARENA STANDBY" />

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3 mb-4 font-display uppercase">
              READY TO BUILD <span className="bg-gradient-to-r from-[#00F0FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">WHAT MATTERS?</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed font-sans">
              Join active technical tracks as a solo engineer or multidisciplinary squad. Submit working code, live demos, and documentation to undergo double-blind consensus evaluation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onJoinHackathon}
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#818CF8] hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95"
              >
                <span>Enter Hackathon Arena</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onCreateHackathon}
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0E152F] hover:bg-[#152044] border border-cyan-500/30 hover:border-cyan-400 text-slate-200 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Host a Track</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-indigo-500/20 text-xs">
          {/* Brand & Verification Stamp */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-[#0B1528] border-2 border-[#00F0FF]/70 flex items-center justify-center text-[#00F0FF] font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <span className="font-display font-black">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-widest text-white font-display uppercase leading-tight">
                  CONSENSUS
                </span>
                <span className="text-[8px] font-mono text-[#00F0FF] uppercase tracking-widest font-bold -mt-0.5">
                  HACKATHON ARENA
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-sans">
              The high-integrity hackathon platform engineered for rigorous technical evaluation, double-blind juror deliberation, and verified merit-based consensus.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0E152F] hover:bg-[#152044] border border-indigo-500/25 flex items-center justify-center text-slate-400 hover:text-[#00F0FF] transition-all shadow-xs"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0E152F] hover:bg-[#152044] border border-indigo-500/25 flex items-center justify-center text-slate-400 hover:text-[#00F0FF] transition-all shadow-xs"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0E152F] hover:bg-[#152044] border border-indigo-500/25 flex items-center justify-center text-slate-400 hover:text-[#00F0FF] transition-all shadow-xs"
                aria-label="Discord"
              >
                <Discord className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Ecosystem */}
          <div className="space-y-3">
            <span className="font-mono uppercase tracking-wider text-white text-xs block font-bold">
              Ecosystem
            </span>
            <ul className="space-y-2 text-slate-400 font-sans">
              <li>
                <button onClick={() => scrollTo('ecosystem')} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Participants
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('ecosystem')} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Organizers
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('ecosystem')} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Judges
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('ecosystem')} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Platform Admins
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <span className="font-mono uppercase tracking-wider text-white text-xs block font-bold">
              Platform
            </span>
            <ul className="space-y-2 text-slate-400 font-sans">
              <li>
                <button onClick={() => scrollTo('discover')} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Browse Tracks
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Six-Stage Flow
                </button>
              </li>
              <li>
                <button onClick={onExploreTracks} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Double-Blind Jury
                </button>
              </li>
              <li>
                <button onClick={onCreateHackathon} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
                  Host Track
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Specs */}
          <div className="space-y-3">
            <span className="font-mono uppercase tracking-wider text-white text-xs block font-bold">
              Governance
            </span>
            <ul className="space-y-2 text-slate-400 font-sans">
              <li>
                <span className="hover:text-[#00F0FF] cursor-pointer transition-colors">Consensus Protocol</span>
              </li>
              <li>
                <span className="hover:text-[#00F0FF] cursor-pointer transition-colors">Scoring Rubrics</span>
              </li>
              <li>
                <span className="hover:text-[#00F0FF] cursor-pointer transition-colors">Code of Conduct</span>
              </li>
              <li>
                <span className="hover:text-[#00F0FF] cursor-pointer transition-colors">Terms & Security</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span>© {new Date().getFullYear()} Consensus Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE ARENA v2.8
            </span>
            <span className="text-indigo-500/40">·</span>
            <span className="text-cyan-300 font-bold">DOUBLE-BLIND CONSENSUS SCORING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
