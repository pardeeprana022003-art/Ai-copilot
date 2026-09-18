import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
  User,
  Bot,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Conversation, MessageItem, ChannelType, AppView } from '../types';
import { apiService } from '../services/apiService';

interface ConversationsViewProps {
  conversations: Conversation[];
  businessName: string;
  businessId: string;
  onConversationUpdated?: (conversation: Conversation) => void;
  onNavigate?: (view: AppView) => void;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  conversations: initialConversations,
  businessName,
  businessId,
  onConversationUpdated,
  onNavigate,
}) => {
  const [convoList, setConvoList] = useState<Conversation[]>(initialConversations);
  const [selectedConvoId, setSelectedConvoId] = useState<string>(
    initialConversations[0]?.id || ''
  );
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  React.useEffect(() => {
    setConvoList(initialConversations);
    if (!selectedConvoId && initialConversations.length > 0) {
      setSelectedConvoId(initialConversations[0].id);
    }
  }, [initialConversations]);

  const activeConvo = convoList.find((c) => c.id === selectedConvoId) || convoList[0];

  const getChannelBadge = (channel: ChannelType) => {
    switch (channel) {
      case 'WhatsApp':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Instagram':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'Website':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Email':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || typedMessage;
    if (!text.trim() || !activeConvo) return;

    const newMessage: MessageItem = {
      id: `msg_${Date.now()}`,
      sender: 'business',
      senderName: businessName,
      text: text.trim(),
      timestamp: 'Just now',
      status: 'sent',
    };

    const updated = {
      ...activeConvo,
      messages: [...activeConvo.messages, newMessage],
      unread: false,
      suggestedResponse: undefined,
    };

    const updatedList = convoList.map((c) => (c.id === activeConvo.id ? updated : c));
    setConvoList(updatedList);
    setTypedMessage('');
    setSentNotice(`Message dispatched to ${activeConvo.customerName} via ${activeConvo.channel}.`);

    // Sync to backend API
    try {
      await apiService.sendConversationReply(businessId, activeConvo.id, text.trim());
    } catch (e) {
      console.warn('Could not sync reply to server endpoint:', e);
    }

    if (onConversationUpdated) {
      onConversationUpdated(updated);
    }

    setTimeout(() => {
      setSentNotice(null);
    }, 4000);
  };

  const handleSimulateInbound = async () => {
    setIsSimulating(true);
    try {
      const res = await apiService.sendInboundWebhook(businessId, 'whatsapp', {
        customerName: 'Aarav Patel',
        customerPhone: '+91 98200 45892',
        message: 'Hi, are you open this Sunday? Can I book an appointment / place an order?',
      });

      if (res && res.conversation) {
        const updated = [res.conversation, ...convoList.filter((c) => c.id !== res.conversation.id)];
        setConvoList(updated);
        setSelectedConvoId(res.conversation.id);
        if (onConversationUpdated) {
          onConversationUpdated(res.conversation);
        }
      }
    } catch (err) {
      console.error('Failed to receive inbound lead:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredConversations = convoList.filter((c) => {
    if (selectedChannelFilter === 'all') return true;
    return c.channel === selectedChannelFilter;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Notice Banner */}
      {sentNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{sentNotice}</span>
          </div>
          <button
            onClick={() => setSentNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Omnichannel Conversations
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {convoList.filter((c) => c.unread).length} Unanswered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time customer messages for {businessName} with instant AI reply drafting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateInbound}
            disabled={isSimulating}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Receive Live Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* EMPTY STATE (Requirement 17) */}
      {convoList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No conversations yet</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Your unified inbox has no active customer inquiries yet. Connect your WhatsApp or Instagram channel to
            receive live messages, or trigger a test customer lead to evaluate your AI Sales Assistant.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('integrations');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              <span>Connect WhatsApp</span>
            </button>
            <button
              onClick={handleSimulateInbound}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Receive Live Inbound Lead</span>
            </button>
          </div>
        </div>
      ) : (
        /* Two-Column Chat App Layout */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Conversation List */}
          <div className="lg:col-span-4 border-r border-slate-200 flex flex-col">
            <div className="p-3 border-b border-slate-100 flex items-center gap-2">
              <select
                value={selectedChannelFilter}
                onChange={(e) => setSelectedChannelFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="all">All Channels ({convoList.length})</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Website">Website</option>
              </select>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[520px]">
              {filteredConversations.map((c) => {
                const isSelected = activeConvo?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConvoId(c.id)}
                    className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                      isSelected ? 'bg-indigo-50/70 border-l-3 border-indigo-600' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {c.customerName[0].toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {c.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{c.lastTimestamp}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 truncate mt-0.5">{c.lastMessage}</p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getChannelBadge(
                            c.channel
                          )}`}
                        >
                          {c.channel}
                        </span>
                        {c.unread && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Needs Reply
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat Window */}
          {activeConvo ? (
            <div className="lg:col-span-8 flex flex-col justify-between h-[580px] bg-slate-50/50">
              {/* Top Bar */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {activeConvo.customerName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{activeConvo.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {activeConvo.customerPhone} • {activeConvo.channel}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getChannelBadge(
                    activeConvo.channel
                  )}`}
                >
                  {activeConvo.channel} Live Thread
                </span>
              </div>

              {/* Messages scroll */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeConvo.messages.map((m) => {
                  const isBusiness = m.sender === 'business';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isBusiness ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs shadow-2xs leading-relaxed ${
                          isBusiness
                            ? 'bg-slate-900 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                    </div>
                  );
                })}

                {/* AI Suggested Response Box */}
                {activeConvo.suggestedResponse && (
                  <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2 mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-900 flex items-center gap-1 text-[11px]">
                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Response Drafter (Sales Assistant):</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 font-semibold">1-Click Approve</span>
                    </div>
                    <p className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-indigo-200">
                      {activeConvo.suggestedResponse}
                    </p>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleSend(activeConvo.suggestedResponse)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Approve &amp; Send</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Input */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${activeConvo.customerName} via ${activeConvo.channel}...`}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!typedMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-8 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Select a conversation thread on the left.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
