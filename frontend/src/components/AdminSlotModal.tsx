import React, { useState } from 'react';
import { HackathonCardData } from '../types';
import { X, Shield } from 'lucide-react';

interface AdminSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHackathon: (hackathon: HackathonCardData) => void;
}

export const AdminSlotModal: React.FC<AdminSlotModalProps> = ({
  isOpen,
  onClose,
  onAddHackathon,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Autonomous Systems & AI');
  const [tagline, setTagline] = useState('');
  const [date, setDate] = useState('TBA by Admin');
  const [participants, setParticipants] = useState('Registration Pending');
  const [teamSize, setTeamSize] = useState('1 – 4 Builders');
  const [prizePool, setPrizePool] = useState('TBA by Host');
  const [status, setStatus] = useState<HackathonCardData['status']>('Upcoming');
  const [tagsInput, setTagsInput] = useState('AI, Open Track');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: HackathonCardData = {
      id: `slot-${Date.now()}`,
      title: title.trim() || `[Hackathon Track — Slot ${Math.floor(Math.random() * 900) + 100}]`,
      category,
      tagline: tagline.trim() || 'Configured by Admin. Parameters and guidelines to be announced.',
      date: date.trim() || 'TBA by Admin',
      participants: participants.trim() || 'Registration Pending',
      teamSize: teamSize.trim() || '1 – 4 Builders',
      prizePool: prizePool.trim() || 'TBA by Host',
      status,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      isCustom: true,
    };

    onAddHackathon(newSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 text-[#F5F5F0] shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A1A1A1] hover:text-[#F5F5F0] rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded bg-[#202020] text-[#FF6B35] border border-[#2A2A2A]">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono text-[#A1A1A1] font-medium">
            ADMIN CONSOLE
          </span>
        </div>

        <h2 className="text-xl font-bold text-[#F5F5F0] mb-1">
          Configure Hackathon Slot
        </h2>
        <p className="text-xs text-[#A1A1A1] mb-5 leading-relaxed">
          Create an empty placeholder slot or configure a custom competition track. Updates apply immediately to the Discover board.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#A1A1A1] font-medium mb-1">
              Track Title
            </label>
            <input
              type="text"
              placeholder="e.g. [Hackathon Track E — Slot Open] or custom name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A1A1A1] font-medium mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none"
              >
                <option value="Autonomous Systems & AI">Autonomous Systems & AI</option>
                <option value="Decentralized Tech & Web3">Decentralized Tech & Web3</option>
                <option value="Developer Tooling & Cloud">Developer Tooling & Cloud</option>
                <option value="Climate & Hardware Systems">Climate & Hardware Systems</option>
                <option value="Open Innovation Track">Open Innovation Track</option>
              </select>
            </div>

            <div>
              <label className="block text-[#A1A1A1] font-medium mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Draft">Draft</option>
                <option value="Registration Open">Registration Open</option>
                <option value="TBA">TBA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#A1A1A1] font-medium mb-1">
              Short Description / Brief
            </label>
            <textarea
              rows={2}
              placeholder="Brief overview or placeholder note..."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[#A1A1A1] font-medium mb-1 text-[11px]">
                Date
              </label>
              <input
                type="text"
                placeholder="TBA by Admin"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A1A1A1] font-medium mb-1 text-[11px]">
                Participants
              </label>
              <input
                type="text"
                placeholder="Registration Pending"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A1A1A1] font-medium mb-1 text-[11px]">
                Team Size
              </label>
              <input
                type="text"
                placeholder="1 – 4 Builders"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A1A1A1] font-medium mb-1 text-[11px]">
                Prize Pool
              </label>
              <input
                type="text"
                placeholder="TBA by Host"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A1A1A1] font-medium mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="AI, Smart Contracts, Global"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#2A2A2A] hover:bg-white/[0.04] text-[#A1A1A1] hover:text-[#F5F5F0] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#FF7F50] text-white font-semibold shadow-sm cursor-pointer"
            >
              Save Track Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
