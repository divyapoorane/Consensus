import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserSession } from '../types';
import {
  LogOut,
  Terminal,
  Shield,
  Award,
  PlusCircle,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  Layers,
  HelpCircle,
  FolderGit2,
  Radio,
} from 'lucide-react';
import { StatusBeacon } from './orbital/StatusBeacon';

interface NavbarProps {
  session: UserSession;
  onExploreHackathons?: () => void;
  onHostHackathon?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenAdminSlot?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onExploreHackathons,
  onOpenAuth,
  onOpenAdminSlot,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'organizer':
        return <Shield className="w-3.5 h-3.5 text-[#FF5500]" />;
      case 'judge':
        return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />;
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHackathonsClick = () => {
    setMobileMenuOpen(false);
    if (onExploreHackathons) {
      onExploreHackathons();
    } else {
      navigate('/hackathons');
    }
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    if (onOpenAuth) {
      onOpenAuth('login');
    } else {
      navigate('/login');
    }
  };

  const handleSignupClick = () => {
    setMobileMenuOpen(false);
    if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      navigate('/register');
    }
  };

  const handleDashboardClick = () => {
    setMobileMenuOpen(false);
    if (session.role) {
      navigate(`/${session.role}/dashboard`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#06080F]/90 backdrop-blur-xl border-b border-[#182238] transition-colors before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#00F0FF]/25 before:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Wordmark & Telemetry Status */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={handleBrandClick}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-8 h-8 rounded-full bg-[#0B1528] border-2 border-[#00F0FF]/70 flex items-center justify-center text-[#00F0FF] font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
              <span className="font-display font-black">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-widest text-white font-display uppercase leading-tight">
                CONSENSUS
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-[#00F0FF] uppercase tracking-widest font-bold -mt-0.5">
                HACKATHON ARENA
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-[#8E9BB5]">
            <button
              onClick={() => scrollTo('discover')}
              className="hover:text-[#F0F4FC] transition-colors cursor-pointer focus-visible:outline-none"
            >
              Discover
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-[#F0F4FC] transition-colors cursor-pointer focus-visible:outline-none"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('ecosystem')}
              className="hover:text-[#F0F4FC] transition-colors cursor-pointer focus-visible:outline-none"
            >
              Ecosystem
            </button>
            <button
              onClick={() => scrollTo('cta')}
              className="hover:text-[#F0F4FC] transition-colors cursor-pointer focus-visible:outline-none"
            >
              Get Started
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Add Quick Action (Desktop) */}
          {onOpenAdminSlot && (
            <button
              onClick={onOpenAdminSlot}
              title="Add or edit hackathon slots"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1424] hover:bg-[#161E36] border border-slate-700/60 text-[11px] font-mono font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Admin Add</span>
            </button>
          )}

          {/* HACKATHONS Glow Pill Badge (Desktop) */}
          <button
            onClick={handleHackathonsClick}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold text-indigo-200 bg-[#0E132B] hover:bg-[#151D42] border border-indigo-500/40 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all cursor-pointer active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
            <span>HACKATHONS</span>
          </button>

          {/* User Auth / Profile Badge */}
          {session.isLoggedIn ? (
            <div className="flex items-center gap-2 bg-[#0D1220] border border-[#182238] px-2.5 py-1 rounded-lg">
              <button
                type="button"
                onClick={handleDashboardClick}
                className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none"
                title="Go to Mission Control"
              >
                <div className="w-6 h-6 rounded bg-[#11182B] flex items-center justify-center border border-[#182238]">
                  {getRoleIcon(session.role)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-[#F0F4FC] leading-tight flex items-center gap-1">
                    <span>{session.name}</span>
                    <LayoutDashboard className="w-3 h-3 text-[#8E9BB5] inline" />
                  </p>
                  <p className="text-[10px] text-[#00F0FF] font-mono capitalize">{session.role} console</p>
                </div>
              </button>
              <button
                onClick={onLogout}
                title="Log Out"
                className="text-[#8E9BB5] hover:text-red-400 p-1 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLoginClick}
                type="button"
                className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                LOG IN
              </button>
              <button
                onClick={handleSignupClick}
                type="button"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#67E8F9] via-[#A5F3FC] to-[#DDD6FE] hover:opacity-95 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(103,232,249,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                SIGN UP
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#8E9BB5] hover:text-[#F0F4FC] rounded-lg bg-[#0D1220] border border-[#182238] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/85 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-150"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[#090D18] border-b border-[#182238] p-4 space-y-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-2 border-b border-[#182238] flex items-center justify-between">
              <StatusBeacon status="connected" label="NODE // ONLINE" />
              <span className="text-[10px] font-mono text-[#8E9BB5]">ORBITAL 01</span>
            </div>
            <button
              onClick={() => scrollTo('discover')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-white/[0.04] transition-colors text-left"
            >
              <Sparkles className="w-4 h-4 text-[#FF5500]" />
              <span>Discover Tracks</span>
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-white/[0.04] transition-colors text-left"
            >
              <HelpCircle className="w-4 h-4 text-[#FF5500]" />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => scrollTo('ecosystem')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-white/[0.04] transition-colors text-left"
            >
              <Layers className="w-4 h-4 text-[#FF5500]" />
              <span>Ecosystem</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/gallery');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-white/[0.04] transition-colors text-left"
            >
              <FolderGit2 className="w-4 h-4 text-[#FF5500]" />
              <span>Submissions Gallery</span>
            </button>
            <button
              onClick={handleHackathonsClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-white/[0.04] transition-colors text-left"
            >
              <Terminal className="w-4 h-4 text-[#00F0FF]" />
              <span>Active Missions</span>
            </button>

            {onOpenAdminSlot && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminSlot();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase font-semibold text-[#FF7722] bg-[#FF5500]/10 border border-[#FF5500]/25 text-left"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Track Slot</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
