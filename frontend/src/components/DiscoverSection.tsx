import React, { useState } from 'react';
import { HackathonCardData } from '../types';
import { Search, Filter, Calendar, Users, Trophy, UserCheck, Plus, ArrowRight } from 'lucide-react';

interface DiscoverSectionProps {
  hackathons: HackathonCardData[];
  onSelectHackathon: (hackathon: HackathonCardData) => void;
  onOpenAdminSlotModal: () => void;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({
  hackathons,
  onSelectHackathon,
  onOpenAdminSlotModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAllCards, setShowAllCards] = useState(false);

  const categories = ['All', 'Autonomous Systems & AI', 'Decentralized Tech & Web3', 'Developer Tooling & Cloud', 'Climate & Hardware Systems'];
  const statusFilters = ['All', 'Upcoming', 'Draft', 'Registration Open', 'TBA'];

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || h.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || h.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const displayedList = showAllCards ? filteredHackathons : filteredHackathons.slice(0, 4);

  return (
    <section id="discover" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1A2C] border border-[#00F0FF]/35 text-[#00F0FF] text-[11px] font-mono font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
            <span>DISCOVER TRACKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display uppercase">
            FIND YOUR NEXT <span className="bg-gradient-to-r from-[#00F0FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">CHALLENGE</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl font-sans">
            Explore active hackathon arenas and open tracks available for registration and project deployment.
          </p>
        </div>

        {/* Admin configure button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdminSlotModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E152F] hover:bg-[#152044] border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Deploy Track Slot</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0B1021]/85 backdrop-blur-md border border-indigo-500/25 rounded-2xl p-4 sm:p-5 mb-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" />
            <input
              type="text"
              placeholder="Search challenges, keywords, or tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070A16] border border-indigo-500/30 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:shadow-[0_0_18px_rgba(0,240,255,0.25)] transition-all font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1 uppercase tracking-wider">
              <Filter className="w-3 h-3 text-[#00F0FF]" /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#151D42] text-[#00F0FF] border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.2)] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {cat === 'All' ? 'All Categories' : cat.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary status pill bar */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-indigo-500/20 text-xs flex-wrap">
          <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider">Status:</span>
          {statusFilters.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-[#FF5500]/20 text-[#FF7722] border border-[#FF5500]/40 shadow-[0_0_10px_rgba(255,85,0,0.2)] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Hackathon Cards Grid */}
      {displayedList.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#0B1021]/80 border border-indigo-500/25 max-w-xl mx-auto shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-[#0F1630] border border-cyan-500/30 flex items-center justify-center text-[#00F0FF] mx-auto mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Trophy className="w-7 h-7" />
          </div>
          {hackathons.length === 0 ? (
            <>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-display uppercase tracking-wider">
                No active hackathon tracks in the arena yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 max-w-md mx-auto font-sans">
                Certified organizers can launch open or curated competition tracks directly. As soon as an organizer publishes a track, it appears live on this board.
              </p>
              <button
                onClick={onOpenAdminSlotModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#818CF8] hover:opacity-95 text-slate-950 text-xs font-mono font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Deploy New Track Slot</span>
              </button>
            </>
          ) : (
            <>
              <p className="text-white text-sm font-bold font-mono mb-1">No track slots match your filter criteria.</p>
              <p className="text-xs text-slate-400 mb-4 font-sans">Try adjusting your search terms or clearing track category filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                }}
                className="text-[#00F0FF] hover:underline text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Reset filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedList.map((hackathon) => (
            <div
              key={hackathon.id}
              onClick={() => onSelectHackathon(hackathon)}
              className="group bg-[#0B1021]/85 hover:bg-[#0E152C] border border-indigo-500/25 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_40px_rgba(0,240,255,0.15)] hover:-translate-y-1 relative overflow-hidden backdrop-blur-md"
            >
              {/* Subtle top laser highlight on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF]/0 to-transparent group-hover:via-[#00F0FF] transition-all duration-300" />

              <div>
                {/* Header: Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {hackathon.category}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                      hackathon.status === 'Registration Open'
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : hackathon.status === 'Draft'
                        ? 'bg-amber-950/70 text-amber-300 border-amber-400/40'
                        : 'bg-[#12182B] text-slate-400 border-slate-700/40'
                    }`}
                  >
                    {hackathon.status === 'Registration Open' && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                    )}
                    {hackathon.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-white group-hover:text-[#00F0FF] transition-colors leading-snug mb-2 font-display uppercase tracking-wide">
                  {hackathon.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2 font-sans">
                  {hackathon.tagline}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {hackathon.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-[#11182B] border border-indigo-500/30 text-[10px] font-mono text-indigo-300 font-semibold shadow-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specs footer */}
              <div className="pt-4 border-t border-indigo-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-slate-400 mb-0.5">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>Timeline</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 block truncate">
                    {hackathon.date}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-slate-400 mb-0.5">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span>Enrolled</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 block truncate">
                    {hackathon.participants}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-slate-400 mb-0.5">
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                    <span>Team</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 block truncate">
                    {hackathon.teamSize}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-slate-400 mb-0.5">
                    <Trophy className="w-3 h-3 text-[#FF5500]" />
                    <span>Prize</span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#00F0FF] block truncate drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                    {hackathon.prizePool}
                  </span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="mt-4 pt-3 border-t border-indigo-500/15 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors">
                <span className="text-[11px] font-mono uppercase">Inspect challenge protocol</span>
                <span className="flex items-center gap-1 text-[#00F0FF] font-mono font-bold text-xs group-hover:translate-x-1 transition-transform">
                  View Track <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {filteredHackathons.length > 4 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAllCards(!showAllCards)}
            className="px-6 py-2.5 rounded-xl border border-indigo-500/30 hover:border-cyan-400/50 bg-[#0E152F] hover:bg-[#152044] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] cursor-pointer active:scale-95"
          >
            {showAllCards ? 'Show Less' : `View All Tracks (${filteredHackathons.length})`}
          </button>
        </div>
      )}

    </section>
  );
};
