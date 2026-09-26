import React from 'react';
import {
  Link2,
  BarChart3,
  Eye,
  MousePointerClick,
  Plus,
  Palette,
  QrCode,
  ExternalLink,
  Share2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { User, LinkItem, AnalyticsEvent } from '../../types';
import { StorageService } from '../../lib/storage';
import { getSiteUrl, getSiteDomain } from '../../lib/site';

interface OverviewPageProps {
  user: User;
  links: LinkItem[];
  analytics: AnalyticsEvent[];
  onNavigateTab: (tab: string) => void;
  onViewPublic: () => void;
  onOpenShareModal: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  user,
  links,
  onNavigateTab,
  onViewPublic,
  onOpenShareModal,
}) => {
  const summary = StorageService.getAnalyticsSummary(7);

  return (
    <div className="space-y-8 w-full font-sans">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-bold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Welcome Back, {user.name || 'Creator'}!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Your page is live &amp; ready to share
            </h2>
            <p className="text-indigo-200/90 text-xs sm:text-sm leading-relaxed">
              Consolidate all your links, portfolio, and digital presence into one unified link page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('links')}
              className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add New Link</span>
            </button>
            <button
              onClick={onViewPublic}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Preview Page</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Views</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalViews.toLocaleString()}</p>
          <p className="text-[11px] font-semibold text-slate-400">Past 7 days profile views</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Clicks</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalClicks.toLocaleString()}</p>
          <p className="text-[11px] font-semibold text-slate-400">Past 7 days link clicks</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CTR</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.clickRate}%</p>
          <p className="text-[11px] font-semibold text-slate-400">Click-through rate</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Links</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{links.filter((l) => l.visible).length}</p>
          <p className="text-[11px] font-semibold text-slate-400">Published on your profile</p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigateTab('links')}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Link2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Manage Links</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Add, reorder, or edit your social profiles &amp; bio links.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('appearance')}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Themes &amp; Styling</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Choose from 48 crafted themes, fonts, colors, and button shapes.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('qr-code')}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Vector QR Code</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Generate high-resolution PNG &amp; vector SVG QR codes.
          </p>
        </button>
      </div>

      {/* Recent Links Overview */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Your Active Links</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quick view of published links on your page</p>
          </div>
          <button
            onClick={() => onNavigateTab('links')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            View All ({links.length})
          </button>
        </div>

        {links.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <Link2 className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">No links added yet</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Click below to add your first social profile or portfolio link.
            </p>
            <button
              onClick={() => onNavigateTab('links')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Link</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {links.slice(0, 5).map((lnk) => (
              <div
                key={lnk.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{lnk.title}</p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">{lnk.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {lnk.clicks || 0} clicks
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lnk.visible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {lnk.visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
