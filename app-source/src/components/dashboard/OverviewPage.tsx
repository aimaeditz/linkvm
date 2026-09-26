import React from 'react';
import { User, LinkItem, AnalyticsEvent } from '../../types';
import { StatCard } from './StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CopyButton } from '../shared/CopyButton';
import { EmptyState } from '../shared/EmptyState';
import {
  Link2,
  Eye,
  MousePointerClick,
  TrendingUp,
  Plus,
  Palette,
  BarChart3,
  ExternalLink,
  Share2,
  Sparkles,
  Activity,
  QrCode,
} from 'lucide-react';
import { buildPatternDisplayUrl, buildPatternUrl } from '../../lib/username-patterns';
import { getSiteUrl } from '../../lib/site';
import { BRAND } from '../../lib/constants';

export interface OverviewPageProps {
  user: User;
  links: LinkItem[];
  analytics: AnalyticsEvent[];
  onNavigateTab: (tabId: string) => void;
  onViewPublic: () => void;
  onOpenShareModal: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  user,
  links,
  analytics,
  onNavigateTab,
  onViewPublic,
  onOpenShareModal,
}) => {
  const totalViews = analytics.filter((e) => e.event === 'view').length;
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const clickRate = totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}%` : '0.0%';

  const siteUrl = getSiteUrl();
  const cleanUsername = (user.username || 'user').replace(/^[@$\-+!~]/, '').trim();
  const fullPublicUrl = `https://linkvm.online/${cleanUsername}`;
  const displayPublicUrl = `linkvm.online/${cleanUsername}`;

  const recentEvents = [...analytics]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
                <Sparkles size={13} className="text-emerald-600" />
                <span>{BRAND.planLabel}</span>
                <span className="font-normal text-emerald-600">({BRAND.badge})</span>
              </div>
              {user.isDemoUser && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold">
                  Demo Account
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {user.name || 'Creator'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-normal">
              Your LinkVM creator page is live, optimized, and ready to share with your audience worldwide.
            </p>

            {/* Public URL Box */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-800">
                <span>{displayPublicUrl}</span>
              </div>
              <CopyButton textToCopy={fullPublicUrl} variant="outline" className="border-slate-200 hover:bg-slate-50 text-xs" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={onViewPublic}
              variant="outline"
              size="md"
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer"
            >
              <span>View Page</span>
              <ExternalLink size={14} />
            </Button>
            <Button
              onClick={onOpenShareModal}
              variant="primary"
              size="md"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share Link</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards - Real Data from DB or 0 Empty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Links"
          value={links.length}
          change={links.length === 0 ? '0 — No data yet' : `${links.length} active links`}
          isPositive={links.length > 0}
          icon={<Link2 size={20} />}
          description="Active in your bio"
        />
        <StatCard
          title="Total Views"
          value={totalViews === 0 ? '0' : totalViews.toLocaleString()}
          change={totalViews === 0 ? '0 — No data yet' : 'Real-time verified'}
          isPositive={totalViews > 0}
          icon={<Eye size={20} />}
          description="Total page visits"
        />
        <StatCard
          title="Total Clicks"
          value={totalClicks === 0 ? '0' : totalClicks.toLocaleString()}
          change={totalClicks === 0 ? '0 — No data yet' : 'Outbound clicks'}
          isPositive={totalClicks > 0}
          icon={<MousePointerClick size={20} />}
          description="Total link clicks"
        />
        <StatCard
          title="Click Rate"
          value={clickRate}
          change={totalViews === 0 ? '0 — No data yet' : 'Conversion rate'}
          isPositive={totalViews > 0}
          icon={<TrendingUp size={20} />}
          description="CTR conversion"
        />
      </div>

      {/* Quick Actions (4 cards: Links, Appearance, QR Code, Analytics) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigateTab('links')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex items-center gap-4 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
              <Plus size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Add New Link
              </h4>
              <p className="text-xs text-slate-500">60+ Lucide icons & styling</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('appearance')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex items-center gap-4 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors shrink-0">
              <Palette size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Customize Theme
              </h4>
              <p className="text-xs text-slate-500">34 free presets &amp; live preview</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('qr-code')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex items-center gap-4 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
              <QrCode size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Vector QR Code
              </h4>
              <p className="text-xs text-slate-500">Custom colors &amp; SVG download</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex items-center gap-4 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <BarChart3 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                View Analytics
              </h4>
              <p className="text-xs text-slate-500">Referrer traffic &amp; conversion</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">Real-time engagement from your public bio page</p>
          </div>
          {recentEvents.length > 0 && (
            <Button
              onClick={() => onNavigateTab('analytics')}
              variant="ghost"
              size="sm"
              className="text-xs text-indigo-600 font-semibold cursor-pointer"
            >
              Full Analytics →
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="py-6">
              <EmptyState
                icon={<Activity size={32} className="text-slate-400" />}
                title="No activity yet"
                description="Share your LinkVM profile to start recording live views, clicks, and analytics."
                actionLabel="View Public Page"
                onAction={onViewPublic}
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentEvents.map((ev) => (
                <div key={ev.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        ev.event === 'click'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {ev.event === 'click' ? (
                        <MousePointerClick size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">
                        {ev.event === 'click' ? 'Link clicked' : 'Profile viewed'}
                      </span>
                      <span className="text-slate-400 ml-2">
                        via {ev.referrer || 'Direct'} ({ev.device || 'Desktop'})
                      </span>
                    </div>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
