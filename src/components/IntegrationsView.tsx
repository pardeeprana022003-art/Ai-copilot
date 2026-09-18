import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  MessageSquare,
  Instagram,
  QrCode,
  KeyRound,
  Link2,
  Send,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  HardDrive,
  Sparkles,
  Smartphone,
  RefreshCw,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { IntegrationItem } from '../types';
import { googleDriveService } from '../services/googleDriveService';
import { apiService } from '../services/apiService';
import { ChannelVerificationModal } from './ChannelVerificationModal';
import { AccountDetailsModal } from './AccountDetailsModal';

interface IntegrationsViewProps {
  integrations: IntegrationItem[];
  businessName: string;
  businessId: string;
  onSaveIntegration: (
    id: string,
    status: 'connected' | 'not_connected',
    config?: {
      phoneNumber?: string;
      accountSid?: string;
      apiKey?: string;
      websiteDomain?: string;
      [key: string]: any;
    }
  ) => Promise<void>;
  onSendTestInbound?: (channel: string, message: string, senderName: string, phone: string) => Promise<void>;
  onOpenGoogleDrive?: () => void;
  onIntegrationVerified?: (integration: IntegrationItem) => void;
  onNavigateToInbox?: () => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  integrations,
  businessName,
  businessId,
  onSaveIntegration,
  onSendTestInbound,
  onOpenGoogleDrive,
  onIntegrationVerified,
  onNavigateToInbox,
}) => {
  const [modalIntegration, setModalIntegration] = useState<IntegrationItem | null>(null);
  const [isDriveConnected, setIsDriveConnected] = useState(googleDriveService.isConnected());
  const [driveUser, setDriveUser] = useState(googleDriveService.getUser());

  // Verification & Account details modals
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verifyChannel, setVerifyChannel] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [inspectingIntegration, setInspectingIntegration] = useState<IntegrationItem | null>(null);

  useEffect(() => {
    const unsub = googleDriveService.onAuthChange((user, token) => {
      setIsDriveConnected(Boolean(token));
      setDriveUser(user);
    });
    return unsub;
  }, []);

  const [phoneInput, setPhoneInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [accountSidInput, setAccountSidInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live inbound message simulation modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testSenderName, setTestSenderName] = useState('Rahul Verma');
  const [testSenderPhone, setTestSenderPhone] = useState('+91 97361 85986');
  const [testSenderMessage, setTestSenderMessage] = useState(
    'Hi! I saw your catalog online. Are you available for a booking today, and what are your rates?'
  );
  const [testTargetChannel, setTestTargetChannel] = useState<'WhatsApp' | 'Instagram' | 'Website'>('WhatsApp');
  const [testDispatchSuccess, setTestDispatchSuccess] = useState<string | null>(null);

  const openConfigModal = (item: IntegrationItem) => {
    setModalIntegration(item);
    setPhoneInput(item.config?.phoneNumber || '+91 97361 85986');
    setApiSecretInput(item.config?.apiKey || '');
    setAccountSidInput(item.config?.accountSid || '');
    setDomainInput(item.config?.websiteDomain || `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
  };

  const handleStartVerification = (channel: 'whatsapp' | 'instagram') => {
    setVerifyChannel(channel);
    setVerificationModalOpen(true);
  };

  const handleInspectAccountDetails = (item: IntegrationItem) => {
    setInspectingIntegration(item);
    setDetailsModalOpen(true);
  };

  const handleDisconnectChannel = async (id: string, channelName: string) => {
    setIsSubmitting(true);
    try {
      await apiService.disconnectIntegrationChannel(businessId, channelName);
      await onSaveIntegration(id, 'not_connected', {});
      setDetailsModalOpen(false);
      setModalIntegration(null);
    } catch (err) {
      console.error('Failed to disconnect channel:', err);
      await onSaveIntegration(id, 'not_connected', {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleConfirmConnection = async () => {
    if (!modalIntegration) return;
    setIsSubmitting(true);
    try {
      const isCurrentlyConnected = modalIntegration.status === 'connected';
      const newStatus = isCurrentlyConnected ? 'not_connected' : 'connected';

      await onSaveIntegration(modalIntegration.id, newStatus, {
        phoneNumber: phoneInput.trim(),
        apiKey: apiSecretInput.trim(),
        accountSid: accountSidInput.trim(),
        websiteDomain: domainInput.trim(),
      });
      setModalIntegration(null);
    } catch (err) {
      console.error('Failed to configure integration:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendLiveInbound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSendTestInbound) return;
    setIsSubmitting(true);
    try {
      await onSendTestInbound(
        testTargetChannel.toLowerCase(),
        testSenderMessage.trim(),
        testSenderName.trim(),
        testSenderPhone.trim()
      );
      setTestDispatchSuccess(
        `Live message received from ${testSenderName} via ${testTargetChannel}. AI Copilot has ingested the lead and prepared a response!`
      );
      setTimeout(() => {
        setTestDispatchSuccess(null);
        setTestModalOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to dispatch test message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Live Channels &amp; Integrations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {connectedCount} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Production-ready channels connecting your WhatsApp, Website, and Google accounts directly to {businessName}&apos;s AI Copilot
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTestModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Live Test Inbound Message</span>
          </button>
        </div>
      </div>

      {/* Production Architecture Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>Production Ingestion Engine Active</span>
              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                100% Real Live Ingestion
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Every connected channel feeds real-time customer data, order inquiries, and reviews straight into your AI Copilot and Executive Analyst without artificial limitations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-400">Webhook Host</div>
            <div className="text-[11px] font-mono text-emerald-400">api.businessautopilot.in</div>
          </div>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const isGDrive = item.id.includes('gdrive') || item.category === 'Cloud Storage';
          const isConnected = isGDrive ? (item.status === 'connected' || isDriveConnected) : item.status === 'connected';
          const isWhatsApp = item.name.toLowerCase().includes('whatsapp');
          const isInstagram = item.name.toLowerCase().includes('instagram');
          const isWebsite = item.name.toLowerCase().includes('website');
          // Instagram is fully enabled with live verification flow
          const isComingSoon = item.status === 'coming_soon' && !isInstagram;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border bg-white flex flex-col justify-between transition-all shadow-2xs ${
                isConnected
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                  : isComingSoon
                  ? 'border-slate-200 opacity-70 bg-slate-50/60'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : isComingSoon
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {isConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />}
                    {isConnected ? 'Connected & Live' : isComingSoon ? 'Coming Soon' : 'Not Connected'}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isWhatsApp
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : isInstagram
                        ? 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white border-pink-200 shadow-2xs'
                        : isWebsite
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : isGDrive
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isWhatsApp ? (
                      <MessageSquare className="w-5 h-5" />
                    ) : isInstagram ? (
                      <Instagram className="w-5 h-5" />
                    ) : isWebsite ? (
                      <Globe className="w-5 h-5" />
                    ) : isGDrive ? (
                      <HardDrive className="w-5 h-5" />
                    ) : (
                      <Layers className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">{item.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Configuration details if connected */}
                {isConnected && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
                    {isGDrive && driveUser?.email ? (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Google Account:</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[170px]">{driveUser.email}</span>
                      </div>
                    ) : null}

                    {isWhatsApp && item.config?.phoneNumber && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Verified Mobile:</span>
                        <span className="font-mono font-semibold text-slate-900">{item.config.phoneNumber}</span>
                      </div>
                    )}

                    {isWhatsApp && item.config?.wabaId && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">WABA ID:</span>
                        <span className="font-mono text-[10px] text-slate-700 truncate max-w-[150px]">{item.config.wabaId}</span>
                      </div>
                    )}

                    {isInstagram && item.config?.instagramHandle && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Verified Handle:</span>
                        <span className="font-bold text-pink-700">{item.config.instagramHandle}</span>
                      </div>
                    )}

                    {isInstagram && item.config?.followersCount && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Followers:</span>
                        <span className="font-semibold text-slate-900">{item.config.followersCount.toLocaleString()}</span>
                      </div>
                    )}

                    {item.config?.websiteDomain && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Domain:</span>
                        <span className="font-mono font-semibold text-slate-900">{item.config.websiteDomain}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live Ingestion
                      </span>
                    </div>
                  </div>
                )}

                {/* Features List */}
                <div className="mt-4 space-y-1.5">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 truncate">
                  {isConnected ? 'Real data feed' : isComingSoon ? 'Roadmap item' : 'Inactive'}
                </span>

                <div className="flex items-center gap-1.5">
                  {isWhatsApp ? (
                    isConnected ? (
                      <>
                        <button
                          onClick={() => handleInspectAccountDetails(item)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          Account Info
                        </button>
                        <button
                          onClick={() => handleDisconnectChannel(item.id, 'whatsapp')}
                          className="px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Disconnect WhatsApp"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartVerification('whatsapp')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Verify &amp; Connect</span>
                      </button>
                    )
                  ) : isInstagram ? (
                    isConnected ? (
                      <>
                        <button
                          onClick={() => handleInspectAccountDetails(item)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          Account Info
                        </button>
                        <button
                          onClick={() => handleDisconnectChannel(item.id, 'instagram')}
                          className="px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Disconnect Instagram"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartVerification('instagram')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        <span>Verify &amp; Connect</span>
                      </button>
                    )
                  ) : !isComingSoon ? (
                    <button
                      onClick={() => {
                        if (isGDrive && onOpenGoogleDrive) {
                          onOpenGoogleDrive();
                        } else {
                          openConfigModal(item);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isConnected
                          ? 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                      }`}
                    >
                      {isGDrive
                        ? isConnected
                          ? 'Manage Drive Vault'
                          : 'Connect Google Drive'
                        : isConnected
                        ? 'Configure'
                        : 'Connect Live'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-slate-100 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Live Configuration Modal */}
      {modalIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {modalIntegration.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">Live API Setup for {businessName}</p>
                </div>
              </div>
              <button
                onClick={() => setModalIntegration(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {modalIntegration.status === 'connected'
                ? `This channel is currently live and actively sending customer leads to your AI Copilot. You can update your credentials or disconnect.`
                : `Connect your real account details below. Once verified, incoming messages and customer inquiries are processed live by your AI Copilot.`}
            </p>

            {/* Inputs based on type */}
            <div className="space-y-3.5 text-xs">
              {modalIntegration.name.toLowerCase().includes('whatsapp') && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      WhatsApp Business Phone Number
                    </label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 98200 12345"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Meta Cloud API Permanent Access Token
                    </label>
                    <input
                      type="password"
                      value={apiSecretInput}
                      onChange={(e) => setApiSecretInput(e.target.value)}
                      placeholder="EAAG..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                  </div>
                </>
              )}

              {modalIntegration.name.toLowerCase().includes('website') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Website Domain
                  </label>
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              )}

              {/* Webhook Endpoint for external configuration */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Your Live Webhook URL:</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `https://api.businessautopilot.in/api/webhooks/inbound/${businessId}/${modalIntegration.name.toLowerCase().includes('whatsapp') ? 'whatsapp' : 'website'}`,
                        'webhook'
                      )
                    }
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'webhook' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'webhook' ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 break-all select-all">
                  https://api.businessautopilot.in/api/webhooks/inbound/{businessId}/{modalIntegration.name.toLowerCase().includes('whatsapp') ? 'whatsapp' : 'website'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalIntegration(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConnection}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs cursor-pointer ${
                  modalIntegration.status === 'connected'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSubmitting
                  ? 'Saving...'
                  : modalIntegration.status === 'connected'
                  ? 'Disconnect Channel'
                  : 'Save & Activate Live Channel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Inbound Message Test Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Send Real Inbound Test Message
                </h3>
              </div>
              <button
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Verify your live pipeline. This posts an actual inbound customer enquiry through your live ingestion endpoint so your AI Copilot drafts a response and your Virtual CFO updates metrics instantly.
            </p>

            {testDispatchSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testDispatchSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendLiveInbound} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTestTargetChannel('WhatsApp');
                      setTestSenderPhone('+91 98765 43210');
                      setTestSenderMessage('Hi! I saw your catalog online. Are you available for a booking today, and what are your rates?');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      testTargetChannel === 'WhatsApp'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTestTargetChannel('Instagram');
                      setTestSenderPhone('@meera_designer');
                      setTestSenderName('Meera Kapoor');
                      setTestSenderMessage('Hey! Loved your story post showcasing the new collection. Do you have slots available this weekend?');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      testTargetChannel === 'Instagram'
                        ? 'bg-pink-50 border-pink-500 text-pink-900 ring-2 ring-pink-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTestTargetChannel('Website');
                      setTestSenderPhone('+91 98111 22334');
                      setTestSenderMessage('Hi there! Looking for your pricing packages.');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      testTargetChannel === 'Website'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Website</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={testSenderName}
                  onChange={(e) => setTestSenderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {testTargetChannel === 'Instagram' ? 'Instagram Handle / Username' : 'Customer Phone / Contact'}
                </label>
                <input
                  type="text"
                  required
                  value={testSenderPhone}
                  onChange={(e) => setTestSenderPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:bg-white text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inbound Message</label>
                <textarea
                  required
                  rows={3}
                  value={testSenderMessage}
                  onChange={(e) => setTestSenderMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-slate-900 text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Dispatching...' : 'Dispatch to Live Pipeline'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Way Channel Verification Modal (WhatsApp & Instagram) */}
      <ChannelVerificationModal
        isOpen={verificationModalOpen}
        channel={verifyChannel}
        businessName={businessName}
        businessId={businessId}
        onClose={() => setVerificationModalOpen(false)}
        onVerified={(updatedIntegration) => {
          if (onIntegrationVerified) {
            onIntegrationVerified(updatedIntegration);
          }
        }}
        onNavigateToInbox={onNavigateToInbox}
      />

      {/* Accessed Account Details Modal */}
      <AccountDetailsModal
        isOpen={detailsModalOpen}
        integration={inspectingIntegration}
        businessName={businessName}
        onClose={() => setDetailsModalOpen(false)}
        onDisconnect={(id, channelName) => handleDisconnectChannel(id, channelName)}
        onReverify={(channel) => {
          setDetailsModalOpen(false);
          handleStartVerification(channel);
        }}
        onTestInbound={(channel) => {
          setDetailsModalOpen(false);
          setTestTargetChannel(channel);
          setTestModalOpen(true);
        }}
      />
    </div>
  );
};
