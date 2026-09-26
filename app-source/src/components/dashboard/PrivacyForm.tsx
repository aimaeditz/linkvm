import React from 'react';

interface PrivacyFormProps {
  formData: {
    searchIndexing: boolean;
    anonymousAnalytics: boolean;
  };
  onChange: (updated: Partial<PrivacyFormProps['formData']>) => void;
}

export const PrivacyForm: React.FC<PrivacyFormProps> = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Privacy &amp; Data Controls</h3>
        <p className="text-xs text-slate-500">Manage search engine indexing and analytics privacy</p>
      </div>

      <div className="space-y-4">
        {[
          {
            id: 'indexing',
            title: 'Search Engine Indexing',
            desc: 'Allow search engines (Google, Bing, DuckDuckGo) to discover and index your public LinkVM page. Toggling this off adds a noindex tag to your page.',
            checked: formData.searchIndexing,
            setter: (val: boolean) => onChange({ searchIndexing: val }),
          },
          {
            id: 'anonymousAnalytics',
            title: 'Anonymous Analytics Collection',
            desc: 'Scrub referrers and visitor user agents before aggregating cookieless click and view statistics.',
            checked: formData.anonymousAnalytics,
            setter: (val: boolean) => onChange({ anonymousAnalytics: val }),
          },
        ].map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">{item.title}</p>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.setter(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
