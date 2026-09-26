import React from 'react';
import { Logo } from '../shared/Logo';
import { User } from '../../types';
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Settings,
  Sparkles,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
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
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'qr-code', label: 'QR Code', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'changelog', label: 'Changelog', icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Light Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Slide-in Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="relative w-72 bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Logo size="sm" showSubtitle={true} />
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                type="button"
                onClick={() => {
                  onViewPublic();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <span>View Public Page</span>
                <ExternalLink size={13} />
              </button>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Creator'}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
