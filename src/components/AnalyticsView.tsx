import React from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  MessageSquare,
  IndianRupee,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AnalyticsPeriod, TopProduct } from '../types';

interface AnalyticsViewProps {
  topProducts: TopProduct[];
  analyticsPeriod: AnalyticsPeriod;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  topProducts,
  analyticsPeriod,
}) => {
  const [selectedRange, setSelectedRange] = React.useState<string>('30d');

  const trendData = analyticsPeriod.revenueTrend;
  const maxRevenue = Math.max(...trendData.map((d) => d.revenue));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Date Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Revenue velocity, customer conversion channels, and peak hour operational telemetry
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: '1y', label: '1 Year' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedRange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedRange === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500">Monthly Revenue</div>
          <div className="text-xl font-black text-slate-950 mt-1">
            ₹{analyticsPeriod.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-0.5 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% MoM</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500">Customer Base</div>
          <div className="text-xl font-black text-slate-950 mt-1">
            {analyticsPeriod.customerCount}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-0.5 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+38 new patrons</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500">Inbound Enquiries</div>
          <div className="text-xl font-black text-slate-950 mt-1">
            {analyticsPeriod.totalEnquiries}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 channels</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500">Conversion Rate</div>
          <div className="text-xl font-black text-slate-950 mt-1">
            {analyticsPeriod.conversionRate}%
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-0.5 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+3.2% vs target</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500">Avg Response Time</div>
          <div className="text-xl font-black text-amber-600 mt-1">
            {analyticsPeriod.averageResponseTimeMinutes} min
          </div>
          <div className="text-[11px] text-rose-600 flex items-center gap-0.5 mt-1 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>+34% latency spike</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500">Repeat Patron Rate</div>
          <div className="text-xl font-black text-slate-950 mt-1">
            {analyticsPeriod.repeatCustomerRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">High brand loyalty</div>
        </div>
      </div>

      {/* Interactive Revenue & Enquiries Trend SVG Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Revenue &amp; Enquiry Velocity
            </h2>
            <p className="text-xs text-slate-500">
              Weekly breakdown showing correlation between response volume and gross sales
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block" /> Revenue (₹)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Enquiries (Count)
            </span>
          </div>
        </div>

        {/* SVG Responsive Chart */}
        <div className="pt-4 overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-6 gap-3 items-end h-56 border-b border-slate-200 pb-2">
              {trendData.map((d, i) => {
                const heightPct = (d.revenue / maxRevenue) * 100;
                return (
                  <div key={i} className="flex flex-col items-center h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 mb-1">
                      ₹{d.revenue.toLocaleString('en-IN')}
                    </div>
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Revenue Bar */}
                      <div
                        className="w-8 bg-indigo-600 rounded-t-md hover:bg-indigo-500 transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      {/* Enquiry Bar */}
                      <div
                        className="w-4 bg-amber-400 rounded-t-md hover:bg-amber-300 transition-all"
                        style={{ height: `${(d.enquiries / 35) * 80}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 mt-2 truncate">
                      {d.period}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & AI Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Offerings */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
            Top Revenue Offerings
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {topProducts.map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {p.ordersCount} orders • Margin: {p.marginPercent}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-950">
                    ₹{p.revenueINR.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    High Margin
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance Analysis Synthesis */}
        <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-950 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Analyst Performance Synthesis</span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-indigo-100">
                <div className="font-bold text-slate-900">Friday Peak Bottleneck:</div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Friday evenings between 5 PM and 9 PM generate 28% of all weekly enquiries, but average response time slips to 42 minutes, causing an estimated 18% lead drop-off.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100">
                <div className="font-bold text-slate-900">Artisanal Sourdough &amp; Pour-Over Synergy:</div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Customers purchasing single-origin pour-overs have a 68% attach rate with sourdough bread. Bundling this as a morning combo could yield an extra ₹14,000/month.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100 text-[11px] text-indigo-900 font-semibold">
            Recommendation: Deploy AI Receptionist auto-tagging for Friday evening catering requests.
          </div>
        </div>
      </div>
    </div>
  );
};
