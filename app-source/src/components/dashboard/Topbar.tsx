import React, { useState } from 'react';
import {
  Menu,
  ExternalLink,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { User } from '../../types';
import { getSiteUrl, getSiteDomain } from '../../lib/site';
import { copyToClipboard } from '../../lib/utils';
import { CommandPalette } from './CommandPalette';

interface TopbarProps {
  title: string;
  user: User;
  onOpenMobileNav: () => void;
  onViewPublic: () => void;
  onNavigateSettings: () => void;
  onNavigateTab: (tab: string) => void;
  onLogout: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onRetrySave?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  user,
  onOpenMobileNav,
  onViewPublic,
  onNavigateTab,
  saveStatus = 'saved',
  onRetrySave,
}) => {
  const [copied, setCopied] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const siteUrl = getSiteUrl();
  const publicPageUrl = `${siteUrl}/${user.username}`;
  const displayDomain = `${getSiteDomain()}/${user.username}`;

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(publicPageUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0 font-sans">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-base font-extrabold text-slate-900 capitalize truncate">
            {title}
          </h1>

          {/* Auto-save status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-[11px] font-bold text-slate-600">
            {saveStatus === 'saving' && (
              <>
                <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <button
                onClick={onRetrySave}
                className="flex items-center gap-1 text-rose-600 hover:underline cursor-pointer"
              >
                <AlertCircle className="w-3 h-3" />
                <span>Save failed - Retry</span>
              </button>
            )}
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-slate-200/60"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white rounded border border-slate-200 font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Page Link Display / Copy */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-xs font-mono font-semibold text-slate-600 truncate max-w-[160px]">
              {displayDomain}
            </span>
            <button
              onClick={handleCopyLink}
              title="Copy link"
              className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* View Live Page */}
          <button
            type="button"
            onClick={onViewPublic}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Page</span>
            <span className="sm:hidden">Live</span>
          </button>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigateTab={onNavigateTab}
        user={user}
      />
    </>
  );
};
