import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Settings,
  Sparkles,
  ExternalLink,
  Plus,
  HelpCircle,
  X,
} from 'lucide-react';
import { User } from '../../types';
import { buildPublicUrl } from '../../lib/utils';
import { getSiteDomain } from '../../lib/site';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewLinkModal?: () => void;
  onOpenHelp?: () => void;
  user: User;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenNewLinkModal,
  onOpenHelp,
  user,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'add-link',
      title: 'Add New Link',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onNavigateTab('links');
        if (onOpenNewLinkModal) onOpenNewLinkModal();
        onClose();
      },
    },
    {
      id: 'view-public',
      title: `View Public Profile (${getSiteDomain()})`,
      category: 'Actions',
      icon: ExternalLink,
      action: () => {
        window.open(buildPublicUrl(user.username), '_blank');
        onClose();
      },
    },
    {
      id: 'help-center',
      title: 'Help & Knowledge Base',
      category: 'Support',
      icon: HelpCircle,
      action: () => {
        if (onOpenHelp) onOpenHelp();
        onClose();
      },
    },
    {
      id: 'nav-overview',
      title: 'Go to Overview',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => {
        onNavigateTab('overview');
        onClose();
      },
    },
    {
      id: 'nav-links',
      title: 'Go to Links',
      category: 'Navigation',
      icon: Link2,
      action: () => {
        onNavigateTab('links');
        onClose();
      },
    },
    {
      id: 'nav-appearance',
      title: 'Go to Appearance (28 Free Themes)',
      category: 'Navigation',
      icon: Palette,
      action: () => {
        onNavigateTab('appearance');
        onClose();
      },
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics',
      category: 'Navigation',
      icon: BarChart3,
      action: () => {
        onNavigateTab('analytics');
        onClose();
      },
    },
    {
      id: 'nav-qr',
      title: 'Go to QR Code Generator',
      category: 'Navigation',
      icon: QrCode,
      action: () => {
        onNavigateTab('qr-code');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        onNavigateTab('settings');
        onClose();
      },
    },
    {
      id: 'nav-changelog',
      title: 'View Changelog',
      category: 'Navigation',
      icon: Sparkles,
      action: () => {
        onNavigateTab('changelog');
        onClose();
      },
    },
  ];

  const filtered = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/40 backdrop-blur-xs font-sans">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search commands, navigate pages, or add content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200"
          >
            ESC
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-indigo-50/80 group text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-950">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium group-hover:text-indigo-600">
                    Jump &rarr;
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
