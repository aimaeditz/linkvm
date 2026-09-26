import React, { useState } from 'react';
import {
  Sparkles,
  Rocket,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Share2,
  ShieldCheck,
  Settings,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { GUIDE_SECTIONS } from '../../lib/guide-content';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Rocket,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Share2,
  ShieldCheck,
  Settings,
  BookOpen,
  HelpCircle,
};

export const GuidePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(GUIDE_SECTIONS[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 w-full min-w-0 font-sans pb-16">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Guide &amp; About
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Documentation &amp; Overview
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Everything you need to know about LinkVM.
        </p>
      </div>

      {/* Mobile In-Page Nav Dropdown */}
      <div className="block lg:hidden w-full">
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 shadow-2xs cursor-pointer"
        >
          <span>Jump to Section...</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileNavOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileNavOpen && (
          <div className="mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1 z-50">
            {GUIDE_SECTIONS.map((sec) => {
              const IconComp = iconMap[sec.iconName] || BookOpen;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid Layout: Sticky Sidebar Navigation (Left) + Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Navigation (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-1">
            <h3 className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Table of Contents
            </h3>
            {GUIDE_SECTIONS.map((sec) => {
              const IconComp = iconMap[sec.iconName] || BookOpen;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`} />
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {GUIDE_SECTIONS.map((sec) => {
            const IconComp = iconMap[sec.iconName] || BookOpen;
            return (
              <div
                key={sec.id}
                id={sec.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4 scroll-mt-6"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{sec.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {sec.content.map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {sec.steps && sec.steps.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mt-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Step-by-Step Instructions
                    </h4>
                    <div className="space-y-1.5">
                      {sec.steps.map((step, sIdx) => (
                        <div key={sIdx} className="text-xs text-slate-700 font-medium flex items-start gap-2">
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer Signature */}
          <div className="pt-8 text-center text-xs font-bold text-slate-400 border-t border-slate-200/60">
            Created by AiMAEditz
          </div>
        </div>
      </div>
    </div>
  );
};
