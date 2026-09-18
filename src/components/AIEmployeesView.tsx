import React from 'react';
import {
  Bot,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  IndianRupee,
  X,
  Layers,
} from 'lucide-react';
import { AIEmployee, AppView } from '../types';

interface AIEmployeesViewProps {
  employees: AIEmployee[];
  onToggleStatus: (id: string) => void;
  onUpdateEmployee: (updated: AIEmployee) => void;
  onNavigate: (view: AppView) => void;
}

export const AIEmployeesView: React.FC<AIEmployeesViewProps> = ({
  employees,
  onToggleStatus,
  onUpdateEmployee,
  onNavigate,
}) => {
  const [selectedEmployee, setSelectedEmployee] = React.useState<AIEmployee | null>(null);
  const [configEmployee, setConfigEmployee] = React.useState<AIEmployee | null>(null);

  const totalTasksToday = employees.reduce((acc, e) => acc + e.tasksToday, 0);
  const totalCompleted = employees.reduce((acc, e) => acc + e.completedToday, 0);
  const totalPendingApproval = employees.reduce((acc, e) => acc + e.waitingApproval, 0);

  const handleSaveConfig = () => {
    if (configEmployee) {
      onUpdateEmployee(configEmployee);
      setConfigEmployee(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">AI Employees</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {employees.filter((e) => e.status === 'active').length} of {employees.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous specialized assistants running 24/7 with human verification safeguards
          </p>
        </div>

        {/* Global Staff Metrics */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Handled Today</div>
            <div className="text-lg font-black text-slate-950">{totalTasksToday}</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Executed</div>
            <div className="text-lg font-black text-emerald-700">{totalCompleted}</div>
          </div>
          <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 text-center">
            <div className="text-[10px] text-indigo-700 uppercase font-semibold">Awaiting Approval</div>
            <div className="text-lg font-black text-indigo-950">{totalPendingApproval}</div>
          </div>
        </div>
      </div>

      {/* Grid of 7 Employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className={`p-5 rounded-xl border bg-white flex flex-col justify-between transition-all shadow-2xs ${
              emp.status === 'active' ? 'border-slate-200 hover:border-indigo-300' : 'border-slate-200 opacity-65 bg-slate-50'
            }`}
          >
            <div>
              {/* Top status bar */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {emp.role}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                    emp.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      emp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {emp.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </div>

              {/* Title & Purpose */}
              <h2 className="text-base font-bold text-slate-950 mt-3">{emp.name}</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{emp.purpose}</p>

              {/* Today's Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <div>
                  <div className="text-[10px] text-slate-500">Tasks Today</div>
                  <div className="text-xs font-bold text-slate-900">{emp.tasksToday}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Completed</div>
                  <div className="text-xs font-bold text-emerald-700">{emp.completedToday}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Waiting</div>
                  <div className="text-xs font-bold text-indigo-600">{emp.waitingApproval}</div>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Performance:</span>
                <span className="font-semibold text-slate-800 text-[11px]">{emp.performance}</span>
              </div>

              {/* Recent Activity snippet */}
              <div className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100 italic truncate">
                &ldquo;{emp.recentActivity[0] || 'Monitoring channels for new triggers'}&rdquo;
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleStatus(emp.id)}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  emp.status === 'active'
                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
                title={emp.status === 'active' ? 'Pause employee' : 'Resume employee'}
              >
                {emp.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{emp.status === 'active' ? 'Pause' : 'Resume'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setConfigEmployee(emp)}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Configure autonomy & rules"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('actions')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View Tasks</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {configEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Configure {configEmployee.name}
                </h3>
              </div>
              <button
                onClick={() => setConfigEmployee(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Autonomy Level */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Autonomy Level
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Controls whether this agent requires human approval before executing actions.
                </p>
                <div className="space-y-2">
                  {[
                    { id: 'suggest_only', label: 'Suggest Only', desc: 'Prepares drafts; never executes.' },
                    { id: 'require_approval', label: 'Require Approval (Recommended)', desc: 'Prepares actions for 1-click human verification.' },
                    { id: 'auto_execute', label: 'Autonomous Execution', desc: 'Executes approved categories within strict boundary limits.' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setConfigEmployee({
                          ...configEmployee,
                          autonomyLevel: opt.id as any,
                        })
                      }
                      className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                        configEmployee.autonomyLevel === opt.id
                          ? 'border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Assigned Channels */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Assigned Channels</label>
                <div className="flex flex-wrap gap-1.5">
                  {configEmployee.assignedChannels.map((ch) => (
                    <span
                      key={ch}
                      className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium text-[11px] border border-slate-200"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guardrails summary */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Protocol:</strong> Sensitive refunds or customer account overrides always route to human owner regardless of autonomy level.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfigEmployee(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
