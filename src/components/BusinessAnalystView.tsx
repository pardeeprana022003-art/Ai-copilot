import React, { useState, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  RotateCcw,
  Copy,
  Check,
  Download,
  Bot,
  User,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Flame,
  LineChart,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { BusinessProfile, ActionTask } from '../types';
import { apiService, AnalystResponse } from '../services/apiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'analyst';
  text: string;
  data?: AnalystResponse;
  timestamp: string;
}

interface BusinessAnalystViewProps {
  business: BusinessProfile;
  onAddActionTask: (task: ActionTask) => void;
}

type PromptCategory = 'growth' | 'whatsapp' | 'retention' | 'operations';

export const BusinessAnalystView: React.FC<BusinessAnalystViewProps> = ({
  business,
  onAddActionTask,
}) => {
  const initialGreeting: ChatMessage = {
    id: 'init_welcome',
    sender: 'analyst',
    text: `### 🎯 Welcome to your AI Business Copilot

I'm your **Virtual Chief Strategy Officer & Operations Analyst**, operating with the analytical depth and conversational reasoning of **ChatGPT**.

I continuously analyze **${business.name}**'s financial velocity, customer transaction history, live messaging lead latency, and review sentiment.

**How can I assist you right now?**
- Diagnose revenue drops or conversion bottlenecks
- Model unit economics and pricing expansion
- Formulate high-converting WhatsApp reactivation playbooks
- Audit operational workflows and team priorities

Choose a strategic prompt below or ask any direct question about your numbers.`,
    data: {
      answer: `AI Copilot is ready to analyze ${business.name}'s revenue, lead latency, and retention.`,
      content: `### 🎯 Welcome to your AI Business Copilot\n\nI'm your **Virtual Chief Strategy Officer & Operations Analyst**, operating with the analytical depth and conversational reasoning of **ChatGPT**.\n\nI continuously monitor **${business.name}**'s financial velocity, customer transaction history, live messaging lead latency, and review sentiment.\n\n**How can I assist you right now?**\n- Diagnose revenue drops or conversion bottlenecks\n- Model unit economics and pricing expansion\n- Formulate high-converting WhatsApp reactivation playbooks\n- Audit operational workflows and team priorities\n\nChoose a strategic prompt below or ask any direct question about your numbers.`,
      metricHighlight: `Real-time Telemetry • ${business.category} • ${business.location}`,
      followUpPrompts: [
        'Why did my sales drop this month and where is the leak?',
        'How are our WhatsApp and Website leads converting?',
        'Draft a 48-hour win-back message for inactive customers.',
      ],
      timestamp: new Date().toISOString(),
    },
    timestamp: 'Just now',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('growth');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [queuedTaskIds, setQueuedTaskIds] = useState<Record<string, boolean>>({});
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const categorizedPrompts: Record<PromptCategory, { title: string; prompts: string[] }> = {
    growth: {
      title: '📈 Growth & Revenue Strategy',
      prompts: [
        'Why did my sales drop this month and where is the leak?',
        'How can we increase average customer spend by 25%?',
        'Give me a prioritized 7-day revenue acceleration plan.',
        'Which services or customer segments yield the highest margins?',
      ],
    },
    whatsapp: {
      title: '💬 WhatsApp & Lead Conversion',
      prompts: [
        'How are my WhatsApp and Website leads performing?',
        'Draft a high-converting WhatsApp auto-reply for first-time inquiries.',
        'How can we reduce our lead response latency to under 5 minutes?',
        'Provide a message script to follow up with unread inquiries.',
      ],
    },
    retention: {
      title: '👥 Customer Retention & Churn',
      prompts: [
        'Which customers should I contact today to prevent churn?',
        'Draft a 48-hour win-back WhatsApp campaign for inactive clients.',
        'How do our repeat purchase rates compare to industry benchmarks?',
        'Design a VIP loyalty perk program for our top-tier customers.',
      ],
    },
    operations: {
      title: '⚡ Operations & Team Playbook',
      prompts: [
        'What should our daily operational priorities be this week?',
        'Model the profit impact if we increase prices by 12%.',
        'How can our AI employees autonomously handle customer support?',
        'Generate an audit of our pending tasks in the Action Center.',
      ],
    },
  };

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: 'Just now',
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    // Build multi-turn conversation history for ChatGPT-style contextual memory
    const historyPayload = newMessages
      .filter((m) => m.id !== 'init_welcome')
      .slice(-6)
      .map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.data?.content || m.text,
      }));

    try {
      const res = await apiService.askBusinessAnalyst(business.id, q.trim(), historyPayload);
      if (res && res.data) {
        const analystMsg: ChatMessage = {
          id: `analyst_${Date.now()}`,
          sender: 'analyst',
          text: res.data.content || res.data.answer,
          data: res.data,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, analystMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: `analyst_fb_${Date.now()}`,
          sender: 'analyst',
          text: `### Strategic Diagnosis\n\nI have reviewed your inquiry regarding "${q.trim()}". For **${business.name}**, operational telemetry is currently active. Connecting additional messaging channels or uploading recent transaction records will further sharpen my predictive models.`,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err: any) {
      console.error('Analyst query error:', err);
      const errorMsg: ChatMessage = {
        id: `analyst_err_${Date.now()}`,
        sender: 'analyst',
        text: `### ⚠️ Diagnostic Note\n\nI encountered an unexpected interruption while processing that question: *${err?.message || 'Network delay'}*.\n\nPlease feel free to retry your prompt, or pick one of the recommended analysis templates above.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleConvertToAction = (rec: string, msgId: string, index: number) => {
    const key = `${msgId}_${index}`;
    const newTask: ActionTask = {
      id: `task_copilot_${Date.now()}_${index}`,
      priority: 'high',
      category: 'Strategic Growth',
      problem: `Copilot Recommendation: ${rec.slice(0, 50)}...`,
      recommendedAction: rec,
      estimatedImpact: 'High revenue acceleration & churn prevention',
      potentialValueINR: 15000,
      status: 'pending',
      assignedEmployee: 'AI Business Copilot',
      createdAt: 'Just now',
    };

    onAddActionTask(newTask);
    setQueuedTaskIds((prev) => ({ ...prev, [key]: true }));
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2500);
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
  };

  const handleExportChat = () => {
    const transcript = messages
      .map((m) => {
        const speaker = m.sender === 'user' ? '👤 User' : '🤖 AI Business Copilot (ChatGPT Mode)';
        const content = m.data?.content || m.text;
        return `## ${speaker} (${m.timestamp})\n\n${content}\n\n---\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 3000);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
              <span>AI Business Copilot</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>ChatGPT Analytical Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Telemetry Active</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Talk and strategize with your autonomous Chief Strategy Officer. Powered by real-time unit economics, multi-turn reasoning, and instant Action Center execution.
          </p>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportChat}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            title="Copy entire conversation to clipboard"
          >
            {copiedTranscript ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Transcript Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Chat</span>
              </>
            )}
          </button>
          <button
            onClick={handleResetChat}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            title="Start a new chat session"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Strategy Prompt Library by Category */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Executive Prompt Library (ChatGPT Analytical Prompts)</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['growth', 'whatsapp', 'retention', 'operations'] as PromptCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer capitalize whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {categorizedPrompts[activeCategory].prompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-left px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-xs text-slate-700 hover:text-indigo-950 transition flex items-start justify-between gap-2 group cursor-pointer disabled:opacity-50"
            >
              <span className="line-clamp-2 leading-relaxed">{prompt}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[560px]">
        {/* Messages Scroll Area */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 max-h-[640px] bg-slate-50/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const rawContent = msg.data?.content || msg.text;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white ring-2 ring-indigo-100'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <BrainCircuit className="w-5 h-5" />}
                </div>

                {/* Message Bubble Container */}
                <div
                  className={`max-w-3xl rounded-2xl p-5 text-xs leading-relaxed transition ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs space-y-4'
                  }`}
                >
                  {/* Top Bar for Assistant: Identity & Copy */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">AI Business Copilot</span>
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 font-semibold px-1.5 py-0.5 rounded border border-indigo-100">
                          ChatGPT Reasoning
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyMessage(rawContent, msg.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
                        title="Copy analysis"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Highlight Metric Badge */}
                  {msg.data?.metricHighlight && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 font-semibold text-xs flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{msg.data.metricHighlight}</span>
                    </div>
                  )}

                  {/* Markdown Content (Rendered with ReactMarkdown) */}
                  <div className={`markdown-body leading-relaxed text-xs sm:text-sm ${isUser ? 'text-white' : 'text-slate-800'}`}>
                    <Markdown>{rawContent}</Markdown>
                  </div>

                  {/* Contributing Factors Snapshot */}
                  {msg.data?.factors && msg.data.factors.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1.5">
                        <LineChart className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Observed Financial & Operational Signals:</span>
                      </div>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                        {msg.data.factors.map((factor, idx) => (
                          <li key={idx} className="leading-normal">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Concrete Recommendations with 1-Click Action Center Hand-off */}
                  {msg.data?.recommendations && msg.data.recommendations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Actionable Execution Tasks (Convert to Action Center):</span>
                      </div>
                      <div className="space-y-1.5">
                        {msg.data.recommendations.map((rec, idx) => {
                          const taskKey = `${msg.id}_${idx}`;
                          const isQueued = queuedTaskIds[taskKey];

                          return (
                            <div
                              key={idx}
                              className="p-3 bg-indigo-50/60 hover:bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                            >
                              <span className="text-xs text-indigo-950 font-medium leading-relaxed">
                                {rec}
                              </span>
                              <button
                                onClick={() => handleConvertToAction(rec, msg.id, idx)}
                                disabled={isQueued}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold shrink-0 flex items-center gap-1.5 transition cursor-pointer ${
                                  isQueued
                                    ? 'bg-emerald-600 text-white cursor-default'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                                }`}
                              >
                                {isQueued ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Queued in Actions</span>
                                  </>
                                ) : (
                                  <>
                                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                                    <span>Queue in Action Center</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ChatGPT-style Suggested Follow-Up Prompts */}
                  {msg.data?.followUpPrompts && msg.data.followUpPrompts.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-indigo-500" />
                        <span>Suggested Next Questions:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.data.followUpPrompts.map((followUp, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSend(followUp)}
                            disabled={isLoading}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200 text-[11px] text-slate-700 transition flex items-center gap-1.5 text-left cursor-pointer disabled:opacity-50"
                          >
                            <span>👉 {followUp}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className={`text-[10px] ${isUser ? 'text-slate-300' : 'text-slate-400'} text-right pt-1`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Reasoning / Thinking Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BrainCircuit className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 bg-white border border-indigo-100 rounded-2xl text-xs text-indigo-900 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span>AI Copilot is analyzing real-time business telemetry...</span>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Synthesizing customer records, transaction intervals, unread inquiries, and unit economics to deliver a ChatGPT-grade strategic breakdown...
                </p>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar (ChatGPT-style) */}
        <div className="p-3.5 border-t border-slate-200 bg-white space-y-2">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={2}
              placeholder="Ask anything about sales, WhatsApp leads, churn, or margins (e.g., 'Draft a WhatsApp reactivation campaign for our inactive customers')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none leading-relaxed"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Copilot</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500">Tip:</span>
              <span>Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">Shift+Enter</kbd> for newline</span>
            </div>
            <span className="hidden md:inline text-slate-500">
              Zero fake data • 100% grounded in {business.name}'s verified telemetry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
