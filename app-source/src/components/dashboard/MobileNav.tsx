import React from 'react';
import {
  X,
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Settings,
  HelpCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { User } from '../../types';
import { Logo } from '../shared/Logo';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  onViewPublic: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  open,
  onClose,
  currentTab,
  onSelectTab,
  user,
  onLogout,
  onViewPublic,
}) => {
  if (!open) return null;

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'links', label: 'My Links', icon: Link2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'qr-code', label: 'Vector QR Code', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'guide', label: 'Guide & FAQ', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Slide drawer */}
      <div className="relative w-full max-w-xs bg-white h-full flex flex-col z-10 shadow-2xl font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile info */}
        <div className="p-4 mx-4 mt-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
            {(user.name || user.username || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Creator'}</p>
            <p className="text-[11px] font-semibold text-indigo-600 truncate">@{user.username}</p>
          </div>
          <button
            onClick={onViewPublic}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
