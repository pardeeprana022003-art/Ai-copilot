import React from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Clock,
  Send,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  IndianRupee,
  Bot,
} from 'lucide-react';
import { ActionTask, TaskPriority, TaskStatus } from '../types';
import { apiService } from '../services/apiService';

interface ActionCenterViewProps {
  tasks: ActionTask[];
  onApproveTask: (taskId: string) => void;
  onDismissTask: (taskId: string) => void;
  onRestoreTask?: (taskId: string) => void;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({
  tasks,
  onApproveTask,
  onDismissTask,
  onRestoreTask,
}) => {
  const [filter, setFilter] = React.useState<string>('pending');
  const [reviewingTask, setReviewingTask] = React.useState<ActionTask | null>(null);
  const [executionBanner, setExecutionBanner] = React.useState<string | null>(null);
  const [isExecuting, setIsExecuting] = React.useState<boolean>(false);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'approved') return task.status === 'approved' || task.status === 'completed';
    if (filter === 'dismissed') return task.status === 'dismissed';
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const approvedCount = tasks.filter((t) => t.status === 'approved' || t.status === 'completed').length;
  const potentialSavingsTotal = tasks
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + (t.potentialValueINR || 0), 0);

  const getPriorityStyle = (priority: TaskPriority) => {
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

  const handleExecute = async (task: ActionTask) => {
    setIsExecuting(true);
    try {
      await apiService.executeAction(task.id, task.problem, task.category);
      onApproveTask(task.id);
      setExecutionBanner(`Demo action "${task.problem}" completed successfully.`);
      setReviewingTask(null);
    } catch (err) {
      console.error('Execution failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Notification if action just executed */}
      {executionBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start justify-between shadow-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-900">{executionBanner}</div>
              <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                Action marked as executed. Live business records updated.
              </p>
            </div>
          </div>
          <button
            onClick={() => setExecutionBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Action Center</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {pendingCount} Awaiting Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            PROBLEM &rarr; INSIGHT &rarr; RECOMMENDED ACTION &rarr; OPTIONAL EXECUTION
          </p>
        </div>

        {/* Financial Potential Badge */}
        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
              Pending Opportunities
            </div>
            <div className="text-lg font-black text-indigo-950">
              ₹{potentialSavingsTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Safe Autonomy Mode Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-white">Safe Execution Policy: </span>
            <span className="text-slate-300">
              Autonomy is set to &ldquo;Require Approval&rdquo;. No messages or customer alterations occur without your explicit confirmation.
            </span>
          </div>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden md:inline">
          Zero Hallucination Guard
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'pending'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'approved'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Approved &amp; Executed ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('dismissed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'dismissed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Dismissed
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Tasks
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">All caught up!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No tasks currently in this view. As AI employees monitor customer channels and reviews, new opportunities will appear here.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-xl border bg-white transition-all shadow-2xs ${
                task.status === 'approved' || task.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : task.status === 'dismissed'
                  ? 'border-slate-200 opacity-60'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Problem & Impact Details */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {task.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Bot className="w-3 h-3 text-indigo-600" />
                      Assigned: <strong className="text-slate-700">{task.assignedEmployee}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400">• {task.createdAt}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-950">{task.problem}</h3>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-slate-900">Recommended Action:</div>
                    <p className="leading-relaxed">{task.recommendedAction}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                    <div className="text-emerald-700 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Potential Opportunity: <strong>₹{task.potentialValueINR?.toLocaleString('en-IN')}</strong></span>
                    </div>
                    <div className="text-slate-600">
                      Estimated Impact: <span className="text-slate-800">{task.estimatedImpact}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Button Group */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  {task.status === 'pending' && (
                    <>
                      <button
                        id={`task-review-btn-${task.id}`}
                        onClick={() => setReviewingTask(task)}
                        className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Review</span>
                      </button>

                      <button
                        id={`task-approve-btn-${task.id}`}
                        onClick={() => handleExecute(task)}
                        disabled={isExecuting}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        id={`task-dismiss-btn-${task.id}`}
                        onClick={() => onDismissTask(task.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Dismiss task"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {(task.status === 'approved' || task.status === 'completed') && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Executed in Demo
                    </span>
                  )}

                  {task.status === 'dismissed' && (
                    <span className="text-xs text-slate-400 italic">Dismissed</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal with message preview and real execution disclaimer */}
      {reviewingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Review &amp; Approve Execution
                </span>
              </div>
              <button
                onClick={() => setReviewingTask(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${getPriorityStyle(
                  reviewingTask.priority
                )}`}
              >
                {reviewingTask.priority} Priority
              </span>
              <h3 className="text-base font-bold text-slate-950 mt-1">
                {reviewingTask.problem}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assigned to: {reviewingTask.assignedEmployee}
              </p>
            </div>

            {/* Simulated Draft Message Body */}
            {reviewingTask.payload?.messageDraft && (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Prepared Customer Communication:</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                    Channel: {reviewingTask.payload.channel || 'WhatsApp'}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed">
                  &ldquo;{reviewingTask.payload.messageDraft}&rdquo;
                </div>
              </div>
            )}

            {/* Clear Real vs Demo Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                Demo Mode Notice
              </div>
              <p>
                Clicking <strong>&ldquo;Execute (Demo)&rdquo;</strong> will mark this task completed and record an audit log. Connect an integration in Settings to execute this action in the real world.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setReviewingTask(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                id="modal-execute-demo-btn"
                onClick={() => handleExecute(reviewingTask)}
                disabled={isExecuting}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Processing...' : 'Execute (Demo Mode)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
