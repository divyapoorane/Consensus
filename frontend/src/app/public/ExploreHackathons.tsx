import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { SpaceBackground } from '../../components/orbital/SpaceBackground';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { HackathonCardData } from '../../types';
import { useAuth } from '../../auth/MockAuthProvider';
import { organizerService } from '../../services/organizer/organizerService';
import { Search } from '../../components/ui/Search';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SectionEyebrow } from '../../components/shared/SectionEyebrow';
import {
  Calendar,
  Users,
  Trophy,
  ArrowRight,
  Filter,
  Terminal,
  Shield,
  Clock,
  Compass,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const ExploreHackathons: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [hackathonsList, setHackathonsList] = useState<HackathonCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    organizerService.getHackathons().then((data) => {
      if (data && Array.isArray(data)) {
        const mapped: HackathonCardData[] = data.map((h: any) => ({
          id: h.id,
          title: h.name || h.title,
          category: h.category,
          tagline: h.tagline,
          date: `${h.schedule?.registrationStart || ''} – ${h.schedule?.hackathonEnd || ''}`,
          participants: `${h.registrationsCount || 0} Registered Builders`,
          teamSize: `${h.participation?.minTeamSize || 1} – ${h.participation?.maxTeamSize || 4} Builders`,
          prizePool: h.prizes?.totalPool || h.totalPrizePool || '$0',
          status: (h.status === 'active' || h.rawStatus === 'active' ? 'Registration Open' : 'Upcoming') as any,
          tags: h.tags || [h.category?.split(' ')[0] || 'Tech', 'Open Track', 'Global'],
        }));
        setHackathonsList(mapped);
      }
    });
  }, []);

  const categories = [
    'all',
    'Autonomous Systems & AI',
    'Decentralized Tech & Web3',
    'Developer Tooling & Cloud',
    'Climate & Hardware Systems',
  ];

  const filtered = hackathonsList.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || h.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-[#06080F] text-[#F0F4FC] flex flex-col justify-between selection:bg-[#FF5500]/30 selection:text-[#FFFFFF] overflow-x-hidden font-sans">
      <SpaceBackground />

      <Navbar
        session={{
          isLoggedIn: isAuthenticated,
          name: user?.name || '',
          role: user?.role || 'participant',
          email: user?.email || '',
        }}
        onLogout={logout}
      />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1">
        {/* Active Missions Header Deck */}
        <div className="mb-8">
          <SectionEyebrow number="02" label="SECTOR DIRECTORY" status="ACTIVE MISSIONS" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#F0F4FC] tracking-tight font-mono uppercase">
                Active Arena Missions
              </h1>
              <p className="text-xs sm:text-sm text-[#8E9BB5] mt-1.5 max-w-2xl leading-relaxed">
                Review live mission briefings, mobilize developer squads, and compete for verified escrow prize pools.
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#8E9BB5]">
              <StatusBeacon status="active" label={`MISSIONS: ${hackathonsList.length}`} />
              <span className="text-[#182238]">|</span>
              <span className="text-[#00F0FF]">FILTERED: {filtered.length}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8 bg-[#0D1220]/90 border border-[#182238] p-3 rounded-xl">
          <div className="w-full md:w-80">
            <Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by mission title, track, or tags..."
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-[#8E9BB5] ml-1 hidden sm:block flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#11182B] text-[#00F0FF] border border-[#00F0FF]/30 font-bold'
                    : 'text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {cat === 'all' ? 'All Missions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE MISSIONS BRIEFING DISPLAY */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl bg-[#0D1220]/80 border border-[#182238] max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#11182B] border border-[#182238] flex items-center justify-center text-[#FF5500] mx-auto mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            {hackathonsList.length === 0 ? (
              <>
                <h2 className="text-base sm:text-lg font-bold text-[#F0F4FC] mb-2 font-mono uppercase">
                  No active missions in this orbital sector.
                </h2>
                <p className="text-xs sm:text-sm text-[#8E9BB5] max-w-md mx-auto leading-relaxed mb-6 font-sans">
                  Certified organizers can create and deploy new hackathon challenge tracks. As soon as a competition opens, it will appear here.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {user?.role === 'organizer' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/organizer/hackathons/create')}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Commission Mission Track
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/')}
                    >
                      Return to Arena Home
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-[#F0F4FC] text-sm font-mono uppercase font-bold mb-1">No missions match filter parameters.</p>
                <p className="text-xs text-[#8E9BB5] mb-4">Adjust your search query or reset track category.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Reset Query
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((hackathon: HackathonCardData, index: number) => {
              const missionCode = `MSN-0${index + 1}`;
              const isPrimary = index === 0;

              return (
                <div
                  key={hackathon.id}
                  onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                  className={`group relative bg-[#0D1220]/90 border rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer overflow-hidden hover:scale-[1.005] ${
                    isPrimary
                      ? 'border-[#FF5500]/40 shadow-[0_0_25px_rgba(255,85,0,0.12)] hover:border-[#FF5500]/70'
                      : 'border-[#182238] hover:border-[#00F0FF]/40'
                  }`}
                >
                  {/* Subtle top hairline highlight */}
                  <div
                    className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-${
                      isPrimary ? '[#FF5500]/50' : '[#00F0FF]/30'
                    } to-transparent`}
                  />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Mission Marker + Title + Telemetry */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Mission ID Block */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-[#11182B] border border-[#182238] group-hover:border-[#00F0FF]/40 transition-colors">
                        <span className="text-[9px] font-mono text-[#8E9BB5] leading-none uppercase">SECTOR</span>
                        <span className="text-xs font-mono font-bold text-[#00F0FF] mt-0.5">{missionCode}</span>
                        {isPrimary && <Flame className="w-3 h-3 text-[#FF5500] mt-0.5" />}
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={isPrimary ? 'orange' : 'cyan'} size="sm">
                            {hackathon.category}
                          </Badge>
                          <StatusBeacon
                            status={hackathon.status === 'Registration Open' ? 'connected' : 'warning'}
                            label={hackathon.status}
                          />
                        </div>

                        <h3 className="text-base sm:text-xl font-bold text-[#F0F4FC] group-hover:text-white transition-colors font-mono uppercase tracking-wide">
                          {hackathon.title}
                        </h3>

                        <p className="text-xs text-[#8E9BB5] line-clamp-2 max-w-3xl leading-relaxed">
                          {hackathon.tagline}
                        </p>

                        {/* Technical Metadata Strip */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-[11px] font-mono text-[#8E9BB5]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
                            <span>{hackathon.date}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                            <span>{hackathon.teamSize}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-[#FF7722]" />
                            <span className="font-bold text-[#F0F4FC]">{hackathon.prizePool} Escrow</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Enter Mission Action Button */}
                    <div className="flex-shrink-0 flex items-center lg:flex-col lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#182238]">
                      <div className="text-left lg:text-right hidden sm:block">
                        <span className="text-[10px] font-mono text-[#8E9BB5] uppercase block">PROTOCOL</span>
                        <span className="text-xs font-mono font-bold text-[#00E575]">DOUBLE-BLIND CONSENSUS</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/hackathons/${hackathon.id}`);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF7722] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#FF5500]/20 group-hover:shadow-[0_0_18px_rgba(255,85,0,0.35)] cursor-pointer"
                      >
                        <span>Enter Mission</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
