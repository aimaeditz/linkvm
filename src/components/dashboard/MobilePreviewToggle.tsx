import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { User, LinkItem, ThemeConfig, SocialLinks } from '../../types';
import { ProfilePreview } from './ProfilePreview';
import { motion, AnimatePresence } from 'framer-motion';

interface MobilePreviewToggleProps {
  user: User;
  links: LinkItem[];
  theme: ThemeConfig;
  socials?: SocialLinks;
}

export const MobilePreviewToggle: React.FC<MobilePreviewToggleProps> = ({
  user,
  links,
  theme,
  socials,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button (Mobile / Tablet only: < 1024px) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700/60 active:scale-95 transition-all cursor-pointer"
        aria-label="Show Preview"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Show Preview</span>
      </button>

      {/* Slide-over Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            {/* Slide-over Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 w-[340px] max-w-full h-full bg-white/95 backdrop-blur-xl border-l border-slate-200/80 p-4 overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Live Preview
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex justify-center items-center py-2">
                <ProfilePreview user={user} links={links} theme={theme} socials={socials} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
