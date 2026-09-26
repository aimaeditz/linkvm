import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  ExternalLink,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { User } from '../../types';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { CommandPalette } from './CommandPalette';
import { HelpDrawer } from './HelpDrawer';
import { NotificationsPopover } from './NotificationsPopover';
import { getSiteUrl } from '../../lib/site';

interface TopbarProps {
  title: string;
  user: User;
  onOpenMobileNav: () => void;
  onViewPublic: () => void;
  onNavigateSettings: () => void;
  onNavigateTab?: (tab: string) => void;
  onLogout: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onRetrySave?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  user,
  onOpenMobileNav,
  onViewPublic,
  onNavigateSettings,
  onNavigateTab,
  onLogout,
  saveStatus = 'saved',
  onRetrySave,
}) => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabNavigation = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else if (tab === 'settings') {
      onNavigateSettings();
    }
  };

  const handlePreviewPage = () => {
    if (!user.username) return;
    const cleanUsername = user.username.replace(/^[@$\-+!~]/, '').trim();
    const url = `https://linkvm.online/${cleanUsername}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Determine if auto-save indicator should be visible for the current page
  const cleanTitle = title.trim().toLowerCase();
  const isEditablePage = ['overview', 'links', 'appearance', 'settings'].includes(cleanTitle);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Mobile hamburger & Section breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Dashboard</span>
            <span className="text-xs font-semibold text-slate-300 hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 capitalize">
              {title}
            </h1>
          </div>
        </div>

        {/* Center: Command Palette Search Trigger Button */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => setPaletteOpen(true)}
            className="rounded-full bg-slate-50 border border-slate-200 px-4 py-2 flex items-center gap-2 text-sm text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition min-w-[240px] max-w-[360px] cursor-pointer"
          >
            <Search size={16} className="text-slate-400 shrink-0" />
            <span className="truncate">Quick search actions...</span>
          </button>
        </div>

        {/* Right Actions: AutoSave, Help, Notifications, Public View, User Profile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* AutoSave Live Indicator */}
          {isEditablePage && (
            <div className="hidden sm:block">
              <AutoSaveIndicator status={saveStatus} onRetry={onRetrySave} />
            </div>
          )}

          {/* Search Trigger for Mobile/Tablet */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Help "?" Button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Help & Knowledge Base"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Popover */}
          <NotificationsPopover />

          {/* Public Page View Button */}
          <div className="relative group">
            <button
              onClick={onViewPublic}
              disabled={!user.username}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
                user.username
                  ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200'
                  : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
              }`}
              title={!user.username ? "Set a username first." : `Preview ${user.username}'s public profile`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Page</span>
            </button>
            {!user.username && (
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap z-50">
                Set a username first.
              </span>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{user.name ? user.name.charAt(0).toUpperCase() : (user.username || 'C').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name || user.username}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">@{user.username}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onViewPublic();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Public Page</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleTabNavigation('settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setHelpOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Help &amp; FAQs</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigateTab={handleTabNavigation}
        onOpenHelp={() => setHelpOpen(true)}
        user={user}
      />

      {/* Global Help Drawer */}
      <HelpDrawer isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};
