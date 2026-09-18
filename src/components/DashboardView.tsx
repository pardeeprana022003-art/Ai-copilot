import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Zap,
  Bot,
  ScanLine,
  BrainCircuit,
  Users,
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Plus,
  Upload,
  Layers,
  FileCheck,
} from 'lucide-react';
import {
  BusinessProfile,
  BusinessHealth,
  OpportunityMetric,
  AIInsight,
  AppView,
  ActionTask,
} from '../types';

interface DashboardViewProps {
  business: BusinessProfile;
  health: BusinessHealth;
  opportunities: OpportunityMetric[];
  insights: AIInsight[];
  hasData?: boolean;
  onNavigate: (view: AppView) => void;
  onTakeAction: (insight: AIInsight) => void;
  onRunScanner: () => void;
  onOpenCustomerModal?: () => void;
  onOpenImportModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  business,
  health,
  opportunities,
  insights,
  hasData = false,
  onNavigate,
  onTakeAction,
  onRunScanner,
  onOpenCustomerModal,
  onOpenImportModal,
}) => {
  const [selectedInsight, setSelectedInsight] = React.useState<AIInsight | null>(null);

  // Determine if this business has any real logged records
  const isBrandNewBusiness = !hasData && (!business.customersCount || business.customersCount === 0);

  // Health Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome & Live Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              {business.name}
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Private SaaS Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {business.category} • {business.location} • Autonomous OS
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="dash-run-scanner-btn"
            onClick={onRunScanner}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Run Business Scanner</span>
          </button>
          <button
            id="dash-analyst-chat-btn"
            onClick={() => onNavigate('analyst')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Ask AI Analyst</span>
          </button>
        </div>
      </div>

      {/* NEW BUSINESS EMPTY STATE & GETTING STARTED CHECKLIST (Requirement 11) */}
      {isBrandNewBusiness && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to AI Business Autopilot</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Let&apos;s get {business.name} connected and operating on autopilot
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Your workspace has been created with a private database. Connect your channels, import existing customer
            contacts, or record your first customer order to activate real-time intelligence.
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">
                Getting Started Checklist
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">1. Business Profile Created ({business.name})</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[10px] text-white/60">
                      2
                    </div>
                    <span className="text-slate-200">Add or Import Customers</span>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenImportModal) onOpenImportModal();
                      else onNavigate('customers');
                    }}
                    className="px-2.5 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-[11px] font-semibold text-white transition cursor-pointer"
                  >
                    Import CSV
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[10px] text-white/60">
                      3
                    </div>
                    <span className="text-slate-200">Connect Messaging Channels</span>
                  </div>
                  <button
                    onClick={() => onNavigate('integrations')}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white transition cursor-pointer"
                  >
                    Connect WhatsApp
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[10px] text-white/60">
                      4
                    </div>
                    <span className="text-slate-200">Configure &amp; Activate AI Employees</span>
                  </div>
                  <button
                    onClick={() => onNavigate('employees')}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white transition cursor-pointer"
                  >
                    Configure Team
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Real Data First Guarantee</span>
                </span>
                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                  Unlike traditional demo software, AI Business Autopilot never injects fake revenue or fabricated
                  reviews into your workspace. As your customers interact and orders flow in, your AI team analyzes
                  real opportunities.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (onOpenCustomerModal) onOpenCustomerModal();
                    else onNavigate('customers');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-xs font-semibold text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Customer</span>
                </button>
                <button
                  onClick={() => onNavigate('settings')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. BUSINESS HEALTH SCORE & PILLARS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Dial */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center rounded-2xl bg-slate-950 text-white shadow-inner">
              <div className="text-center">
                <div className="text-3xl font-black tracking-tight">
                  {health.overallScore > 0 ? health.overallScore : '—'}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">/ 100</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">
                  Business Health Diagnostic
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {health.overallScore > 0 ? 'Live Telemetry' : 'Awaiting Initial Data'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {health.overallScore > 0
                  ? `Overall Diagnostic Rating: ${health.overallScore}/100`
                  : 'Not enough business data to generate reliable insights'}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                {health.overallScore > 0
                  ? 'Continuous diagnostic score across customer response, reviews, sales conversion, and repeat visits.'
                  : 'Add customer records, log customer inquiries, or connect your Google Profile to unlock your 6-pillar business diagnostic.'}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => onNavigate('scanner')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start lg:self-center cursor-pointer"
          >
            <span>View Full Diagnostic Breakdown</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Category Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100">
          {health.categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 truncate">{cat.name}</span>
                <span className="text-xs font-black text-slate-900">
                  {cat.score > 0 ? cat.score : '—'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full ${
                    cat.score >= 75
                      ? 'bg-emerald-500'
                      : cat.score >= 60
                      ? 'bg-amber-500'
                      : cat.score > 0
                      ? 'bg-rose-500'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${Math.max(5, cat.score)}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] text-slate-500 truncate">
                {cat.score > 0 ? `${cat.problems.length} detected` : 'No data yet'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. LIVE OPPORTUNITIES & METRICS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Live Business Overview
            </h2>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Filtered exclusively for {business.name}
            </span>
          </div>
          <button
            onClick={() => onNavigate('actions')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Action Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              onClick={() => onNavigate(opp.targetView)}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <span className="text-xs text-slate-500 font-medium block truncate">
                  {opp.label}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 tracking-tight">
                  {opp.count}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 truncate">{opp.subtitle}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI INSIGHTS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              AI Insights &amp; Detections
            </h2>
            <p className="text-xs text-slate-500">
              Synthesized from customer interactions, review sentiments, and repeat intervals
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {insights.length} Prioritized Item{insights.length === 1 ? '' : 's'}
          </span>
        </div>

        {insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityBadge(
                        insight.priority
                      )}`}
                    >
                      {insight.priority} • {insight.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {insight.potentialImpact}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{insight.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <strong className="text-slate-800">Why it matters:</strong> {insight.whyItMatters}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                    Action: {insight.recommendedAction}
                  </div>
                  <button
                    onClick={() => onTakeAction(insight)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Approve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No critical issues detected</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Your business operations and customer communications are running smoothly. As new interactions take
              place, opportunities will automatically surface here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
