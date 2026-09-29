import React from 'react';
import { HackathonCardData } from '../types';
import { X, Calendar, Users, Trophy, UserCheck, Shield } from 'lucide-react';

interface HackathonDetailModalProps {
  hackathon: HackathonCardData | null;
  onClose: () => void;
  onRegister: (hackathon: HackathonCardData, role: string) => void;
}

export const HackathonDetailModal: React.FC<HackathonDetailModalProps> = ({
  hackathon,
  onClose,
  onRegister,
}) => {
  if (!hackathon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 text-[#F5F5F0] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A1A1A1] hover:text-[#F5F5F0] rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Badges */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-xs font-medium text-[#FF7F50] bg-[#FF6B35]/15 border border-[#FF6B35]/30 px-2.5 py-0.5 rounded">
            {hackathon.category}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#202020] border border-[#2A2A2A] text-[#A1A1A1]">
            {hackathon.status}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#F5F5F0] mb-1.5 leading-tight">
          {hackathon.title}
        </h2>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-[#A1A1A1] mb-5 leading-relaxed">
          {hackathon.tagline}
        </p>

        {/* Specs Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#141414] border border-[#2A2A2A] p-3.5 rounded-lg mb-5 text-xs">
          <div>
            <span className="text-[10px] text-[#A1A1A1] block mb-0.5">Timeline</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#F5F5F0]">
              <Calendar className="w-3.5 h-3.5 text-[#A1A1A1]" />
              <span>{hackathon.date}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#A1A1A1] block mb-0.5">Enrollment</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#F5F5F0]">
              <Users className="w-3.5 h-3.5 text-[#A1A1A1]" />
              <span>{hackathon.participants}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#A1A1A1] block mb-0.5">Team Size</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#F5F5F0]">
              <UserCheck className="w-3.5 h-3.5 text-[#A1A1A1]" />
              <span>{hackathon.teamSize}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#A1A1A1] block mb-0.5">Prize Pool</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#FF7F50]">
              <Trophy className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{hackathon.prizePool}</span>
            </div>
          </div>
        </div>

        {/* Admin note notice */}
        <div className="p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] text-xs text-[#A1A1A1] flex items-start gap-2.5 mb-5">
          <Shield className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            This is an open arena track slot. Official challenge briefs, milestone criteria, and prize distributions are moderated by track administrators.
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {hackathon.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-[#202020] border border-[#2A2A2A] text-[11px] text-[#A1A1A1]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-[#2A2A2A]">
          <button
            type="button"
            onClick={() => onRegister(hackathon, 'Judge')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-[#2A2A2A] hover:bg-white/[0.04] text-xs font-medium text-[#F5F5F0] transition-colors cursor-pointer"
          >
            Apply as Evaluator
          </button>

          <button
            type="button"
            onClick={() => onRegister(hackathon, 'Participant')}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Register for Track
          </button>
        </div>
      </div>
    </div>
  );
};
