import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/MockAuthProvider';
import { Avatar } from '../ui/Avatar';
import { StatusBeacon } from '../orbital/StatusBeacon';
import { SpaceBackground } from '../orbital/SpaceBackground';
import {
  Menu,
  X,
  LogOut,
  ExternalLink,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Radio,
  Cpu,
} from 'lucide-react';

export interface ConsoleNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface ConsoleLayoutProps {
  portalTitle: string; // e.g. "Participant", "Organizer Console", "Judge Console", "Admin Portal"
  portalRole: string; // e.g. "Builder", "Organizer", "Juror", "Superuser"
  environmentLabel: string; // e.g. "Participant Sandbox", "Organizer Console", "Deliberation Chamber", "RBAC Enforced"
  navItems: ConsoleNavItem[];
  notificationsPath?: string;
  extraHeaderContent?: React.ReactNode;
  systemStatusText?: string;
}

const STORAGE_KEY = 'consensus_sidebar_collapsed';

export const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({
  portalTitle,
  portalRole,
  environmentLabel,
  navItems,
  notificationsPath,
  extraHeaderContent,
  systemStatusText = 'TELEMETRY ONLINE',
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar collapsed state persisted in localStorage
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch (err) {
        console.warn('Could not persist sidebar preference', err);
      }
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-[#06080F] text-[#F0F4FC] flex flex-col lg:flex-row font-sans selection:bg-[#FF5500]/30 selection:text-[#FFFFFF]">
      {/* Background space environment */}
      <SpaceBackground />

      {/* MOBILE TOP HEADER */}
      <header className="lg:hidden relative z-40 flex items-center justify-between px-4 py-3 bg-[#090D18]/95 backdrop-blur-xl border-b border-[#182238] sticky top-0">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#FF5500] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#FF5500]/25">
            C
          </div>
          <div>
            <span className="font-mono font-bold text-xs sm:text-sm text-[#F0F4FC] leading-none block uppercase">
              Consensus
            </span>
            <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider block mt-0.5 font-semibold">
              // {portalTitle}
            </span>
          </div>
        </a>

        <div className="flex items-center gap-2">
          {notificationsPath && (
            <button
              onClick={() => navigate(notificationsPath)}
              aria-label="Notifications"
              className="p-2 text-[#8E9BB5] hover:text-[#F0F4FC] rounded-lg bg-[#0D1220] border border-[#182238] relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] absolute top-1.5 right-1.5 animate-pulse" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer"
            className="p-2 text-[#8E9BB5] hover:text-[#F0F4FC] rounded-lg bg-[#0D1220] border border-[#182238] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MISSION CONTROL SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#090D18]/95 backdrop-blur-xl border-r border-[#182238] flex flex-col justify-between transition-all duration-200 ease-in-out lg:static ${
          mobileMenuOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-[72px]' : 'lg:w-64'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mission Control Deck Header */}
          <div
            className={`p-4 border-b border-[#182238] flex items-center justify-between ${
              collapsed ? 'lg:px-3 lg:justify-center' : ''
            }`}
          >
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-7 h-7 rounded bg-[#FF5500] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md shadow-[#FF5500]/25 group-hover:scale-105 transition-transform">
                C
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
              </div>
              {(!collapsed || mobileMenuOpen) && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs sm:text-sm font-bold tracking-tight text-[#F0F4FC] font-mono uppercase truncate">
                    Consensus
                  </span>
                  <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider truncate font-semibold">
                    // {portalTitle}
                  </span>
                </div>
              )}
            </a>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-[#8E9BB5] hover:text-[#F0F4FC] p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
              aria-label="Close navigation drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Operator Badge Block */}
          <div
            className={`p-2.5 mx-2.5 my-2.5 rounded-lg bg-[#0D1220] border border-[#182238] flex items-center gap-2.5 transition-all ${
              collapsed ? 'lg:mx-2 lg:p-2 lg:justify-center' : ''
            }`}
          >
            <div className="relative group flex-shrink-0">
              <Avatar name={user?.name || portalRole} src={user?.avatarUrl} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00E575] border border-[#090D18]" />
              {collapsed && (
                <div className="hidden lg:block absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md bg-[#0D1220] border border-[#182238] text-xs text-[#F0F4FC] font-mono shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                  <p className="font-bold">{user?.name || portalRole}</p>
                  <p className="text-[10px] text-[#00F0FF]">{user?.email}</p>
                </div>
              )}
            </div>

            {(!collapsed || mobileMenuOpen) && (
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F0F4FC] truncate leading-tight font-mono">
                  {user?.name || portalRole}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-mono text-[#00F0FF] uppercase tracking-wider font-semibold">
                    ROLE//{portalRole}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* System Telemetry Beacon */}
          {systemStatusText && (!collapsed || mobileMenuOpen) && (
            <div className="mx-2.5 mb-2 px-3 py-1.5 rounded bg-[#0A0E1A] border border-[#182238] flex items-center justify-between text-xs">
              <span className="text-[9px] font-mono uppercase text-[#8E9BB5] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#00F0FF]" />
                <span>CORE</span>
              </span>
              <StatusBeacon status="connected" label={systemStatusText} />
            </div>
          )}

          {/* Mission Modules Section Label */}
          {(!collapsed || mobileMenuOpen) && (
            <div className="px-4 pt-2 pb-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8E9BB5] font-semibold">
                MISSION MODULES
              </span>
            </div>
          )}

          {/* Navigation Links (Mission Modules) */}
          <nav
            aria-label="Console navigation"
            className="flex-1 px-2.5 py-1 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden"
          >
            {navItems.map((item, idx) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/50 ${
                    collapsed ? 'lg:px-0 lg:justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-[#0D1220] text-[#F0F4FC] border border-[#FF5500]/40 shadow-[0_0_15px_rgba(255,85,0,0.15)] font-bold'
                      : 'text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-[#11182B] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Accent Energy Line */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5500] rounded-l shadow-[0_0_8px_#FF5500]" />
                    )}

                    <span
                      className={`flex-shrink-0 flex items-center justify-center transition-colors ${
                        isActive ? 'text-[#FF5500]' : 'text-[#8E9BB5] group-hover:text-[#00F0FF]'
                      }`}
                    >
                      {item.icon}
                    </span>

                    {(!collapsed || mobileMenuOpen) && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {/* Badge if present */}
                    {item.badge !== undefined && (!collapsed || mobileMenuOpen) && (
                      <span className="px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded bg-[#FF5500]/20 text-[#FF7722] border border-[#FF5500]/30">
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Rail Tooltip */}
                    {collapsed && (
                      <div className="hidden lg:block absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md bg-[#0D1220] border border-[#182238] text-xs text-[#F0F4FC] font-mono uppercase tracking-wider shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-2.5 border-t border-[#182238] space-y-1 bg-[#090D18]">
            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              onClick={toggleSidebar}
              className={`hidden lg:flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-[#11182B] transition-colors cursor-pointer ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? (
                <PanelLeft className="w-4 h-4 text-[#8E9BB5]" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-[#8E9BB5]" />
                  <span className="truncate">Collapse Control</span>
                </>
              )}
            </button>

            {/* Public Portal Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#00F0FF] hover:bg-[#11182B] transition-colors ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              }`}
              title="Consensus Arena Home"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              {(!collapsed || mobileMenuOpen) && <span className="truncate">Public Arena</span>}
            </a>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono uppercase text-[#8E9BB5] hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              }`}
              title="Log Out"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {(!collapsed || mobileMenuOpen) && <span className="truncate">Disconnect</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT PANE */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Desktop Top Header Deck */}
        <header className="hidden lg:flex items-center justify-between px-6 py-3.5 bg-[#090D18]/90 backdrop-blur-xl border-b border-[#182238] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E9BB5]">
              STATION:
            </span>
            <span className="text-xs font-mono font-semibold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/25 px-2.5 py-1 rounded">
              {environmentLabel}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {extraHeaderContent}

            {notificationsPath && (
              <button
                onClick={() => navigate(notificationsPath)}
                aria-label="View notifications"
                className="relative p-2 text-[#8E9BB5] hover:text-[#F0F4FC] hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
                title="Telemetry Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] absolute top-1.5 right-1.5 animate-pulse" />
              </button>
            )}

            <div className="h-4 w-[1px] bg-[#182238]" />

            <div className="flex items-center gap-2.5">
              <Avatar name={user?.name || portalRole} src={user?.avatarUrl} size="sm" />
              <div className="text-left">
                <span className="text-xs font-bold text-[#F0F4FC] block leading-tight font-mono">
                  {user?.name || portalRole}
                </span>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase block">
                  {user?.role || portalRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
