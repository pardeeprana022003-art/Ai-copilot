import React from 'react';
import {
  ScanLine,
  Play,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  IndianRupee,
} from 'lucide-react';
import { BusinessProfile, BusinessHealth, ActionTask, CategoryHealth } from '../types';
import { apiService } from '../services/apiService';

interface BusinessScannerViewProps {
  business: BusinessProfile;
  health: BusinessHealth;
  onUpdateHealth: (newHealth: BusinessHealth) => void;
  onAddActionTask: (task: ActionTask) => void;
}

export const BusinessScannerView: React.FC<BusinessScannerViewProps> = ({
  business,
  health,
  onUpdateHealth,
  onAddActionTask,
}) => {
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanStep, setScanStep] = React.useState<string>('');
  const [addedActionId, setAddedActionId] = React.useState<string | null>(null);

  const [insufficientDataMsg, setInsufficientDataMsg] = React.useState<string | null>(null);

  const handleRunScan = async () => {
    setIsScanning(true);
    setInsufficientDataMsg(null);
    setScanStep('Auditing customer response latency on WhatsApp & Instagram...');
    await new Promise((r) => setTimeout(r, 600));

    setScanStep('Analyzing Google Business Profile reviews & negative sentiment clusters...');
    await new Promise((r) => setTimeout(r, 600));

    setScanStep('Synthesizing revenue velocity vs dormant regular customer cohorts...');
    await new Promise((r) => setTimeout(r, 600));

    try {
      const res = await apiService.scanBusiness(business.id);
      if (res && res.sufficientData && res.data) {
        const updatedHealth: BusinessHealth = {
          overallScore: res.data.overallScore,
          lastScanDate: 'Just now',
          categories: res.data.categories.map((c) => ({
            id: c.id,
            name: c.name,
            score: c.score,
            problems: c.problems,
            opportunity: c.opportunity,
            recommendedAction: c.recommendedAction,
            priority: c.priority,
          })),
        };
        onUpdateHealth(updatedHealth);
      } else if (res && !res.sufficientData) {
        setInsufficientDataMsg(
          res.message || 'Not enough business records yet. Import customers or log reviews to unlock full diagnostic analysis.'
        );
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleQueueTask = (cat: CategoryHealth) => {
    const newTask: ActionTask = {
      id: `task_scanner_${Date.now()}_${cat.id}`,
      priority: cat.priority,
      category: cat.name,
      problem: cat.problems[0] || `${cat.name} bottleneck detected`,
      recommendedAction: cat.recommendedAction,
      estimatedImpact: cat.opportunity,
      potentialValueINR: 14000,
      status: 'pending',
      assignedEmployee: 'AI Business Analyst',
      createdAt: 'Just now',
    };

    onAddActionTask(newTask);
    setAddedActionId(cat.id);
    setTimeout(() => setAddedActionId(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              AI Business Scanner
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              6 Pillar Diagnostics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated deep operational health audit connecting missed enquiries, review sentiment, and revenue bottlenecks
          </p>
        </div>

        <button
          id="scanner-execute-btn"
          onClick={handleRunScan}
          disabled={isScanning}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          {isScanning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Scanning Operations...</span>
            </>
          ) : (
            <>
              <ScanLine className="w-4 h-4" />
              <span>Run Live AI Business Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Notice if insufficient data */}
      {insufficientDataMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{insufficientDataMsg}</span>
          </div>
          <button
            onClick={() => setInsufficientDataMsg(null)}
            className="text-amber-800 hover:text-amber-950 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Scanning Animation Banner */}
      {isScanning && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              {scanStep}
            </span>
            <span className="text-indigo-600 font-mono text-[11px]">Gemini 2.5 Flash</span>
          </div>
          <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Main Health Card */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-center">
            <div>
              <div className="text-4xl font-black text-white">{health.overallScore}</div>
              <div className="text-[10px] text-slate-400 font-semibold">/ 100 Health</div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Scan Status: Up to date ({health.lastScanDate})
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              {health.overallScore >= 80
                ? 'Strong Business Health — Ready to Scale'
                : 'Moderate Health — High-Yield Bottlenecks Found'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Your primary drag is customer response delay (+34% latency spike) and 11 unanswered enquiries. Resolving these will unlock ₹56,900 in potential monthly revenue.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1 text-center sm:text-right shrink-0">
          <div className="text-slate-400 font-medium">Estimated Unlockable Value:</div>
          <div className="text-2xl font-black text-emerald-400 flex items-center justify-center sm:justify-end gap-1">
            <IndianRupee className="w-5 h-5" />
            <span>₹56,900 / mo</span>
          </div>
          <div className="text-[11px] text-slate-400">Across 6 operational pillars</div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {health.categories.map((cat) => {
          const isAdded = addedActionId === cat.id;
          return (
            <div
              key={cat.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Header & Score Bar */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded ${
                      cat.score >= 75
                        ? 'bg-emerald-50 text-emerald-700'
                        : cat.score >= 65
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {cat.score} / 100
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2.5">
                  <div
                    className={`h-full rounded-full ${
                      cat.score >= 75
                        ? 'bg-emerald-500'
                        : cat.score >= 65
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                {/* Detected Problems */}
                <div className="mt-4 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Detected Problems:
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-600 text-xs">
                    {cat.problems.map((prob, i) => (
                      <li key={i}>{prob}</li>
                    ))}
                  </ul>
                </div>

                {/* Opportunity in INR */}
                <div className="mt-3 p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-100 text-xs flex items-center justify-between">
                  <span className="text-emerald-900 font-medium text-[11px]">Potential Opportunity:</span>
                  <span className="font-bold text-emerald-800">{cat.opportunity}</span>
                </div>

                {/* Recommended Immediate Action */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="font-bold text-slate-900 text-[11px]">Recommended Action:</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{cat.recommendedAction}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleQueueTask(cat)}
                  disabled={isAdded}
                  className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Queued in Action Center!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Add to Action Center</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
