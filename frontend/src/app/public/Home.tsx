import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBackground } from '../../components/orbital/SpaceBackground';
import { Navbar } from '../../components/Navbar';
import { HeroSection } from '../../components/HeroSection';
import { DiscoverSection } from '../../components/DiscoverSection';
import { HowItWorksSection } from '../../components/HowItWorksSection';
import { EcosystemSection } from '../../components/EcosystemSection';
import { CtaFooterSection } from '../../components/CtaFooterSection';
import { AdminSlotModal } from '../../components/AdminSlotModal';
import { HackathonDetailModal } from '../../components/HackathonDetailModal';
import { HackathonCardData, UserRole } from '../../types';
import { useAuth } from '../../auth/MockAuthProvider';
import { organizerService } from '../../services/organizer/organizerService';
import { Check, X } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [hackathons, setHackathons] = useState<HackathonCardData[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonCardData | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        setHackathons(mapped);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleExploreHackathons = () => {
    const el = document.getElementById('discover');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/hackathons');
    }
  };

  const handleHostHackathon = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else if (user?.role === 'organizer') {
      navigate('/organizer/hackathons/create');
    } else {
      setAdminModalOpen(true);
    }
  };

  const handleRoleAction = (role: UserRole) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === role) {
      navigate(`/${role}/dashboard`);
    } else {
      showToast(`Logged in as ${user?.role.toUpperCase()}. Navigate to your dashboard.`);
    }
  };

  const handleAddHackathonSlot = (newSlot: HackathonCardData) => {
    setHackathons((prev) => [newSlot, ...prev]);
    showToast(`New hackathon track "${newSlot.title}" added to Discover board.`);
  };

  const handleRegisterForTrack = (hackathon: HackathonCardData, _role: string) => {
    setSelectedHackathon(null);
    navigate(`/hackathons/${hackathon.id}`);
  };

  return (
    <div className="relative min-h-screen bg-[#06080F] text-[#F0F4FC] flex flex-col justify-between selection:bg-[#FF5500]/30 selection:text-white overflow-x-hidden font-sans">
      {/* Dynamic Live Space Gaming Techno Background */}
      <SpaceBackground />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#181818] border border-[#2A2A2A] text-[#F5F5F0] px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#A1A1A1] hover:text-[#F5F5F0] ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        session={{
          isLoggedIn: isAuthenticated,
          name: user?.name || '',
          role: user?.role || 'participant',
          email: user?.email || '',
        }}
        onExploreHackathons={handleExploreHackathons}
        onHostHackathon={handleHostHackathon}
        onOpenAdminSlot={() => setAdminModalOpen(true)}
        onLogout={logout}
      />

      {/* Main Preserved Sections */}
      <main className="relative z-10 w-full flex flex-col">
        {/* SECTION 1: HERO */}
        <HeroSection
          onExploreHackathons={handleExploreHackathons}
          onHostHackathon={handleHostHackathon}
        />

        {/* SECTION 2: DISCOVER */}
        <DiscoverSection
          hackathons={hackathons}
          onSelectHackathon={(hack) => setSelectedHackathon(hack)}
          onOpenAdminSlotModal={() => setAdminModalOpen(true)}
        />

        {/* SECTION 3: HOW IT WORKS */}
        <HowItWorksSection />

        {/* SECTION 4: THE ECOSYSTEM */}
        <EcosystemSection onSelectRoleAction={handleRoleAction} />

        {/* SECTION 5: CTA / FOOTER */}
        <CtaFooterSection
          onJoinHackathon={handleExploreHackathons}
          onCreateHackathon={handleHostHackathon}
          onExploreTracks={handleExploreHackathons}
        />
      </main>

      {/* Admin Add/Configure Hackathon Slot Modal */}
      <AdminSlotModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onAddHackathon={handleAddHackathonSlot}
      />

      {/* Hackathon Detail Inspection Modal */}
      <HackathonDetailModal
        hackathon={selectedHackathon}
        onClose={() => setSelectedHackathon(null)}
        onRegister={handleRegisterForTrack}
      />
    </div>
  );
};
