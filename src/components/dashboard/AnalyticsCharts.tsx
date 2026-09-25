import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { AnalyticsSummary } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { MousePointerClick, Eye, Smartphone, Monitor, Globe, ArrowUpRight } from 'lucide-react';

interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
}

const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ summary }) => {
  const hasData = summary.totalViews > 0 || summary.totalClicks > 0;

  return (
    <div className="space-y-6">
      {/* Views & Clicks Over Time Area Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Traffic &amp; Engagement</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily breakdown of page views and outbound link clicks
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-slate-600">Views ({summary.totalViews})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Clicks ({summary.totalClicks})</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                  }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#clickGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Referrers & Devices Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referrer Sources Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrer Channels</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Where your bio visitors arrive from</p>
          </CardHeader>
          <CardContent>
            {summary.referrers.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No referral traffic recorded yet.
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {summary.referrers.map((item, idx) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{item.name}</span>
                      </div>
                      <span>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.max(item.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Devices Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Desktop vs Mobile vs Tablet</p>
          </CardHeader>
          <CardContent>
            {summary.devices.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No device analytics recorded yet.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
                <div className="w-44 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.devices}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {summary.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '8px',
                          color: '#FFF',
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2.5">
                  {summary.devices.map((d, index) => (
                    <div key={d.name} className="flex items-center gap-2.5 text-xs font-semibold">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-slate-700">{d.name}</span>
                      <span className="text-slate-400 ml-auto font-normal">
                        {d.percentage}% ({d.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Links</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by outbound click conversions
          </p>
        </CardHeader>
        <CardContent>
          {summary.topLinks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No link clicks recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {summary.topLinks.map((link, rank) => (
                <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {rank + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{link.title}</p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                      {link.clicks} clicks
                    </span>
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
