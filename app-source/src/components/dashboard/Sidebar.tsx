import React, { useState } from 'react';
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Settings,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react';
import { User } from '../../types';
import { Logo } from '../shared/Logo';
import { copyToClipboard } from '../../lib/utils';
import { getSiteUrl } from '../../lib/site';
import { BRAND } from '../../lib/constants';
import { buildPatternDisplayUrl, buildPatternUrl } from '../../lib/username-patterns';
import { PatternList } from './PatternList';
import { StorageService } from '../../lib/storage';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User;
  linksCount: number;
  onLogout: () => void;
  onViewPublic: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  linksCount,
  onLogout,
  onViewPublic,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPatternPopover, setShowPatternPopover] = useState(false);

  const siteUrl = getSiteUrl();
  const cleanUsername = (user.username || 'user').replace(/^[@$\-+!~]/, '').trim();
  const fullPublicUrl = `https://linkvm.online/${cleanUsername}`;
  const displayUrl = `linkvm.online/${cleanUsername}`;
  const sharePattern = user.sharePattern || '{username}';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'links', label: 'Links', icon: Link2, badge: linksCount > 0 ? String(linksCount) : undefined },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'qr-code', label: 'QR Code', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'guide', label: 'Guide & About', icon: BookOpen },
  ];

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(fullPublicUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSetDefaultPattern = (pattern: string) => {
    StorageService.updateUser({ sharePattern: pattern });
    setShowPatternPopover(false);
    // Trigger quick page reload / state refresh via window event if needed
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen select-none shrink-0 z-30 relative">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Logo size="md" showSubtitle={true} />
      </div>

      {/* Public URL Mini-Card */}
      <div className="p-3.5 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs relative">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Your Public Page
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
            Live
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 mt-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-800 truncate font-mono" title={fullPublicUrl}>
            {displayUrl}
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={handleCopyUrl}
              className="p-1 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onViewPublic}
              className="p-1 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Open public page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowPatternPopover(!showPatternPopover)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                showPatternPopover ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Alternative URLs & Share Patterns"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPatternPopover ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Alternative URLs Popover */}
        {showPatternPopover && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-3 w-[280px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Alternative URLs</h4>
                <p className="text-[10px] text-slate-500">Same profile, different ways to share.</p>
              </div>
              <button
                onClick={() => setShowPatternPopover(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[260px] overflow-y-auto pr-1">
              <PatternList
                username={user.username}
                currentPattern={sharePattern}
                onSetDefault={handleSetDefaultPattern}
                compact={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation List (Exactly 7 items) */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Plan Card & Footer */}
      <div className="p-3.5 border-t border-slate-100 space-y-3">
        {/* Free Forever badge card */}
        <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold text-slate-200">
              {BRAND.planLabel}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-white ring-1 ring-white/20">
              100% Free
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            All themes, vector QR codes, and unlimited links unlocked.
          </p>
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || user.username}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name || user.username}</p>
                {user.isDemoUser && (
                  <span className="shrink-0 px-1 py-0.2 text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 rounded">
                    Demo Account
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
