import React from 'react';
import { BarChart3, Eye, MousePointerClick, Smartphone, Globe } from 'lucide-react';
import { LinkItem, AnalyticsEvent } from '../../types';
import { StorageService } from '../../lib/storage';

interface AnalyticsPageProps {
  events: AnalyticsEvent[];
  links: LinkItem[];
  onViewPublic: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onViewPublic,
}) => {
  const summary = StorageService.getAnalyticsSummary(7);

  return (
    <div className="space-y-8 w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Real-Time Analytics Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track views, link clicks, device distribution, and traffic sources in real-time.
          </p>
        </div>
      </div>

      {/* Overview Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Profile Views</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalViews}</p>
          <p className="text-[11px] font-semibold text-slate-400">Total views over past 7 days</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Link Clicks</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalClicks}</p>
          <p className="text-[11px] font-semibold text-slate-400">Total clicks over past 7 days</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Click-Through Rate</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.clickRate}%</p>
          <p className="text-[11px] font-semibold text-slate-400">Clicks / Views ratio</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Unique Visitors</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.uniqueVisitors}</p>
          <p className="text-[11px] font-semibold text-slate-400">Unique devices tracked</p>
        </div>
      </div>

      {/* Top Links & Devices Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MousePointerClick className="w-4 h-4 text-emerald-600" />
            <span>Top Performing Links</span>
          </h3>

          {summary.topLinks.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No link clicks recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {summary.topLinks.map((lnk) => (
                <div
                  key={lnk.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{lnk.title}</p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">{lnk.url}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold shrink-0">
                    {lnk.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Device Distribution</span>
          </h3>

          {summary.devices.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No device data available yet.</p>
          ) : (
            <div className="space-y-3">
              {summary.devices.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{d.name}</span>
                    <span>{d.percentage}% ({d.count})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
