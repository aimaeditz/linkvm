import React, { useState } from 'react';
import { X, HelpCircle, BookOpen, MessageSquare, ChevronRight, CheckCircle2 } from 'lucide-react';
import { FAQ_ITEMS, BRAND } from '../../lib/constants';
import { StorageService } from '../../lib/storage';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentUser = StorageService.getCurrentUser();
  const links = StorageService.getLinks();
  const hasUsername = Boolean(currentUser?.username);
  const hasProfile = Boolean(currentUser?.bio || currentUser?.avatarUrl || currentUser?.name);
  const hasLinks = links.length > 0;
  const hasTheme = Boolean(StorageService.getTheme());

  if (!isOpen) return null;

  const checklist = [
    { title: 'Claim your unique username', completed: hasUsername },
    { title: 'Set up your profile avatar and bio', completed: hasProfile },
    { title: 'Add your first link', completed: hasLinks },
    { title: 'Choose a personalized theme (28 free presets)', completed: hasTheme },
    { title: `Share your public link (${BRAND.domain})`, completed: hasLinks && hasProfile },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Help &amp; Knowledge Base</h3>
              <p className="text-[11px] text-slate-500">Everything you need to master LinkVM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Start Guide with Real DB Checkmarks */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Creator Onboarding Checklist
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      item.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                    }`}
                  />
                  <span className={item.completed ? 'font-medium text-slate-900' : 'text-slate-600'}>
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, idx) => {
                const isItemOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-xl overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => setOpenFaq(isItemOpen ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isItemOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {isItemOpen && (
                      <div className="px-3 pb-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 bg-slate-50/40">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Support Direct */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white">Need Personal Help?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reach out to our creator support team directly at {BRAND.supportEmail}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
