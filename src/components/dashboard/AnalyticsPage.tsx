import React, { useState } from 'react';
import { AnalyticsEvent, LinkItem } from '../../types';
import { StorageService } from '../../lib/storage';
import { StatCard } from './StatCard';
import { AnalyticsCharts } from './AnalyticsCharts';
import { Download, Eye, MousePointerClick, Users, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { formatNumber } from '../../lib/utils';

interface AnalyticsPageProps {
  events: AnalyticsEvent[];
  links: LinkItem[];
  onViewPublic: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  events,
  links,
  onViewPublic,
}) => {
  const [timeRange, setTimeRange] = useState<number>(7);
  const summary = StorageService.getAnalyticsSummary(timeRange);

  const handleExportCSV = () => {
    const csvContent = [
      'Date,Event,Device,Referrer',
      ...events.map(
        (e) => `"${e.createdAt}","${e.event}","${e.device || 'Desktop'}","${e.referrer || 'Direct'}"`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `linkvm-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Analytics &amp; Performance
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              100% Free Suite
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time tracking of visitor traffic, link click-through rates, and referrers.
          </p>
        </div>

        {/* Timeframe & Export */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl">
            {[
              { days: 7, label: '7D' },
              { days: 30, label: '30D' },
              { days: 90, label: '90D' },
            ].map((t) => (
              <button
                key={t.days}
                onClick={() => setTimeRange(t.days)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === t.days
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={summary.totalViews === 0 ? '0' : summary.totalViews.toLocaleString()}
          change={summary.totalViews === 0 ? '0 — No data yet' : `Last ${timeRange} days`}
          isPositive={summary.totalViews > 0}
          icon={<Eye size={20} />}
          description="Profile page impressions"
        />
        <StatCard
          title="Total Clicks"
          value={summary.totalClicks === 0 ? '0' : summary.totalClicks.toLocaleString()}
          change={summary.totalClicks === 0 ? '0 — No data yet' : `Last ${timeRange} days`}
          isPositive={summary.totalClicks > 0}
          icon={<MousePointerClick size={20} />}
          description="Outbound link conversions"
        />
        <StatCard
          title="Unique Visitors"
          value={summary.uniqueVisitors === 0 ? '0' : summary.uniqueVisitors.toLocaleString()}
          change={summary.uniqueVisitors === 0 ? '0 — No data yet' : 'Distinct browsers'}
          isPositive={summary.uniqueVisitors > 0}
          icon={<Users size={20} />}
          description="Distinct individual visitors"
        />
        <StatCard
          title="CTR Conversion"
          value={summary.clickRate > 0 ? `${summary.clickRate}%` : '0.0%'}
          change={summary.totalViews === 0 ? '0 — No data yet' : 'Overall conversion'}
          isPositive={summary.clickRate > 0}
          icon={<TrendingUp size={20} />}
          description="Click-to-view ratio"
        />
      </div>

      {/* Main Charts & Rankings */}
      <AnalyticsCharts summary={summary} />
    </div>
  );
};
