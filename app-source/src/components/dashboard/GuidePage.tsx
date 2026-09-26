import React from 'react';
import { HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { getGuideSections } from '../../lib/guide-content';

export const GuidePage: React.FC = () => {
  const sections = getGuideSections();

  return (
    <div className="space-y-8 w-full max-w-4xl font-sans pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Creator Guide &amp; Knowledge Base
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            LinkVM Documentation
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Everything you need to know about customizing your page, analytics, QR codes, and features.
        </p>
      </div>

      {/* Guide Sections */}
      <div className="space-y-6">
        {sections.map((sec) => (
          <div
            key={sec.id}
            id={sec.id}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{sec.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{sec.subtitle}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              {sec.content.map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line">{paragraph}</p>
              ))}
            </div>

            {sec.steps && (
              <div className="pt-2 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Step-by-step:</span>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                  {sec.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
