import React from 'react';
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Settings,
  HelpCircle,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from '../../types';
import { Logo } from '../shared/Logo';
import { getSiteDomain } from '../../lib/site';

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
  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'links', label: 'My Links', icon: Link2, badge: linksCount },
    { id: 'appearance', label: 'Appearance', icon: Palette, badge: '48 Themes' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'qr-code', label: 'Vector QR Code', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'guide', label: 'Guide & FAQ', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full font-sans select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Logo size="md" />
      </div>

      {/* Profile quick preview banner */}
      <div className="p-4 mx-4 mt-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name || user.username} className="w-full h-full rounded-xl object-cover" />
          ) : (
            (user.name || user.username || 'C').charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Creator'}</p>
          <p className="text-[11px] font-semibold text-indigo-600 truncate">@{user.username}</p>
        </div>
        <button
          onClick={onViewPublic}
          title="View public page"
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Dashboard Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Banner & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/80">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-indigo-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>100% Free Forever</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
            All themes, analytics, and features are completely unlocked.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
