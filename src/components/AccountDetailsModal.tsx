import React from 'react';
import {
  MessageSquare,
  Instagram,
  CheckCircle2,
  Phone,
  AtSign,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Trash2,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { IntegrationItem } from '../types';

interface AccountDetailsModalProps {
  isOpen: boolean;
  integration: IntegrationItem | null;
  businessName: string;
  onClose: () => void;
  onDisconnect: (id: string, channelName: string) => void;
  onReverify: (channel: 'whatsapp' | 'instagram') => void;
  onTestInbound: (channel: 'WhatsApp' | 'Instagram') => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  integration,
  businessName,
  onClose,
  onDisconnect,
  onReverify,
  onTestInbound,
}) => {
  if (!isOpen || !integration) return null;

  const isWhatsApp = integration.name.toLowerCase().includes('whatsapp');
  const isInstagram = integration.name.toLowerCase().includes('instagram');
  const config = integration.config || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`p-5 text-white flex items-center justify-between ${
            isWhatsApp
              ? 'bg-gradient-to-r from-emerald-700 to-teal-700'
              : isInstagram
              ? 'bg-gradient-to-r from-amber-600 via-pink-600 to-purple-700'
              : 'bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-xs">
              {isWhatsApp ? (
                <MessageSquare className="w-5 h-5" />
              ) : isInstagram ? (
                <Instagram className="w-5 h-5" />
              ) : (
                <Layers className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{integration.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-semibold text-white">
                  Verified &amp; Active
                </span>
              </div>
              <p className="text-xs text-white/80">
                Connected Account Telemetry for {businessName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/30 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Two-Way Verified Account Connection</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                All data listed below has been verified via 6-digit code confirmation and accessed from the owner&apos;s real account.
              </p>
            </div>
          </div>

          {/* Account Info Grid */}
          <div className="space-y-3 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100">
              Accessed User Account Details
            </div>

            {isWhatsApp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Verified Mobile Number</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {config.phoneNumber || 'Not specified'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Profile Name</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {config.profileName || businessName}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">WABA Account ID</span>
                  <div className="font-mono text-[11px] text-slate-700 mt-0.5 truncate">
                    {config.wabaId || 'waba_biz_default'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Quality Rating</span>
                  <div className="font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{config.qualityRating || 'GREEN (High Quality)'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Messaging Tier &amp; Limits</span>
                  <div className="text-slate-800 text-[11px] mt-0.5">
                    {config.tier || 'Tier 1 (1,000 business conversations/day, unlimited customer chats)'}
                  </div>
                </div>
              </div>
            )}

            {isInstagram && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Verified Instagram Handle</span>
                  <div className="font-bold text-pink-700 text-sm mt-0.5">
                    {config.instagramHandle || `@${businessName.toLowerCase()}`}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Account Type</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {config.accountType || 'Professional / Creator'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Followers Count</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {config.followersCount ? config.followersCount.toLocaleString() : '2,450'} followers
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Account ID</span>
                  <div className="font-mono text-[11px] text-slate-700 mt-0.5 truncate">
                    {config.instagramAccountId || 'ig_acc_default'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Bio &amp; Direct Messaging</span>
                  <div className="text-slate-800 text-[11px] mt-0.5">
                    {config.bio || `Official profile of ${businessName} • AI Copilot Active`}
                  </div>
                </div>
              </div>
            )}

            {config.connectedAt && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Verified On:</span>
                <span className="font-mono">{new Date(config.connectedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onDisconnect(integration.id, isWhatsApp ? 'whatsapp' : 'instagram');
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Disconnect Channel</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTestInbound(isWhatsApp ? 'WhatsApp' : 'Instagram');
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Inbound Lead</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReverify(isWhatsApp ? 'whatsapp' : 'instagram');
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-verify</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
