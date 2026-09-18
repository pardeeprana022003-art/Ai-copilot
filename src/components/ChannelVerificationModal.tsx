import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Instagram,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Phone,
  AtSign,
  KeyRound,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { IntegrationItem } from '../types';
import { apiService } from '../services/apiService';

interface ChannelVerificationModalProps {
  isOpen: boolean;
  channel: 'whatsapp' | 'instagram';
  businessName: string;
  businessId: string;
  onClose: () => void;
  onVerified: (integration: IntegrationItem, accountInfo: any) => void;
  onNavigateToInbox?: () => void;
}

export const ChannelVerificationModal: React.FC<ChannelVerificationModalProps> = ({
  isOpen,
  channel,
  businessName,
  businessId,
  onClose,
  onVerified,
  onNavigateToInbox,
}) => {
  const isWhatsApp = channel === 'whatsapp';

  const [step, setStep] = useState<'input' | 'code' | 'success'>('input');
  const [identifier, setIdentifier] = useState(
    isWhatsApp ? '+91 97361 85986' : '@pardeep3943'
  );
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sentCodeNotice, setSentCodeNotice] = useState<{
    code?: string;
    message: string;
    expiresAt: number;
    deliveryMethod?: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [verifiedAccountData, setVerifiedAccountData] = useState<any | null>(null);
  const [verifiedIntegration, setVerifiedIntegration] = useState<IntegrationItem | null>(null);

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setIdentifier(isWhatsApp ? '+91 97361 85986' : '@pardeep3943');
      setCodeDigits(['', '', '', '', '', '']);
      setErrorMessage(null);
      setSentCodeNotice(null);
      setVerifiedAccountData(null);
      setVerifiedIntegration(null);
      setCountdown(60);
    }
  }, [isOpen, isWhatsApp, businessName]);

  // Countdown timer for code resend
  useEffect(() => {
    if (step !== 'code' || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendVerificationCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage(
        isWhatsApp
          ? 'Please enter your WhatsApp mobile phone number.'
          : 'Please enter your Instagram account handle.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.sendIntegrationVerificationCode(businessId, channel, cleanId);
      if (res && res.success) {
        setSentCodeNotice({
          code: res.code,
          message: res.message,
          expiresAt: res.expiresAt,
        });
        setStep('code');
        setCountdown(60);
        // Autofocus first digit box
        setTimeout(() => {
          digitInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setErrorMessage('Failed to send verification code. Please try again.');
      }
    } catch (err: any) {
      console.error('Send verification code error:', err);
      setErrorMessage(err.message || 'Error sending code. Please verify details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const copy = [...codeDigits];
      copy[index] = '';
      setCodeDigits(copy);
      return;
    }

    if (cleaned.length > 1) {
      // User pasted multiple digits
      const pastedChars = cleaned.slice(0, 6).split('');
      const copy = [...codeDigits];
      pastedChars.forEach((ch, i) => {
        if (index + i < 6) copy[index + i] = ch;
      });
      setCodeDigits(copy);
      const nextIdx = Math.min(index + pastedChars.length, 5);
      digitInputRefs.current[nextIdx]?.focus();
      return;
    }

    const copy = [...codeDigits];
    copy[index] = cleaned;
    setCodeDigits(copy);

    if (index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const fullCode = codeDigits.join('').trim();
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.verifyIntegrationCode(businessId, channel, identifier.trim(), fullCode);
      if (res && res.success) {
        setVerifiedAccountData(res.accountInfo);
        setVerifiedIntegration(res.integration);
        onVerified(res.integration, res.accountInfo);
        setStep('success');
      } else {
        setErrorMessage('Verification failed. Please check the code and try again.');
      }
    } catch (err: any) {
      console.error('Verify code error:', err);
      setErrorMessage(err.message || 'Verification failed. Code may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div
          className={`p-5 text-white flex items-center justify-between relative overflow-hidden ${
            isWhatsApp
              ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700'
              : 'bg-gradient-to-r from-amber-600 via-pink-600 to-purple-700'
          }`}
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-xs">
              {isWhatsApp ? (
                <MessageSquare className="w-5 h-5" />
              ) : (
                <Instagram className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {isWhatsApp ? 'Connect WhatsApp Business' : 'Connect Instagram Direct API'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold tracking-wide uppercase text-white/90">
                  {step === 'input' ? 'Step 1 of 2' : step === 'code' ? 'Step 2 of 2' : 'Verified'}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {isWhatsApp
                  ? 'Official Meta Cloud API Verification & Sync'
                  : 'Meta Graph API Security Verification & Direct Messages'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/30 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer relative z-10"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* STEP 1: Input Account Number or Handle */}
          {step === 'input' && (
            <form onSubmit={handleSendVerificationCode} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Two-Way Account Verification &amp; Ownership Check</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isWhatsApp
                    ? `To connect ${businessName}'s WhatsApp Business channel, we will dispatch a secure 6-digit verification code directly to your mobile phone via SMS / WhatsApp.`
                    : `To connect ${businessName}'s Instagram Direct channel, we will dispatch a 6-digit security code to your Instagram account via Direct Message and security notification.`}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {isWhatsApp
                    ? 'User WhatsApp Business Mobile Number'
                    : 'User Instagram Account Handle / Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {isWhatsApp ? <Phone className="w-4 h-4" /> : <AtSign className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isWhatsApp ? '+91 98765 43210' : '@your_brand'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {isWhatsApp
                    ? 'Include country code (e.g. +91 for India, +1 for US).'
                    : 'Your Instagram professional or creator username.'}
                </p>
              </div>

              {/* Data Access Disclosures */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Every info accessed directly from user&apos;s verified account:</span>
                </div>
                <ul className="list-disc pl-4 text-amber-800 space-y-0.5 text-[10px]">
                  {isWhatsApp ? (
                    <>
                      <li>Verified phone number and WhatsApp Business Account (WABA ID)</li>
                      <li>Business profile name, catalog sync, and green quality score</li>
                      <li>Live inbound customer inquiries routed to AI Copilot</li>
                    </>
                  ) : (
                    <>
                      <li>Instagram username, verified profile details, and follower count</li>
                      <li>Direct Message (DM) threads &amp; Story inquiries</li>
                      <li>Automated reply permissions &amp; lead ingestion</li>
                    </>
                  )}
                </ul>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-2 cursor-pointer transition ${
                    isWhatsApp
                      ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400'
                      : 'bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Code...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isWhatsApp
                          ? 'Send 6-Digit Code to Mobile'
                          : 'Send Security Code to Instagram'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter 6-digit Verification Code */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {/* Real device delivery notification toast */}
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  isWhatsApp
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-pink-50 border-pink-300 text-pink-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isWhatsApp ? 'Live Carrier / Device Dispatch' : 'Instagram Security Alert'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-emerald-800 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sent to device
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {sentCodeNotice?.message ||
                    `A 6-digit real OTP verification code was sent to ${identifier}. Valid for 10 minutes.`}
                </p>

                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Real-time delivery to owner device: <strong className="text-slate-900">{identifier}</strong></span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Dispatched to Device
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Enter 6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Change {isWhatsApp ? 'Mobile' : 'Handle'}
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  {codeDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        digitInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg font-bold rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50 focus:bg-white text-slate-950 shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Code expires in 10 minutes</span>
                {countdown > 0 ? (
                  <span className="font-mono text-[11px]">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendVerificationCode()}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || codeDigits.join('').length !== 6}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-2 cursor-pointer transition ${
                    isWhatsApp
                      ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400'
                      : 'bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying &amp; Accessing Info...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Verify &amp; Access Account Info</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Verification Success & Data Accessed */}
          {step === 'success' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-950">
                  {isWhatsApp
                    ? 'WhatsApp Business Verified & Linked!'
                    : 'Instagram Direct Verified & Linked!'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Verification successful. Every piece of account information has been accessed and synchronized into {businessName}&apos;s AI Copilot.
                </p>
              </div>

              {/* Accessed Account Details Card */}
              {verifiedAccountData && (
                <div className="text-left p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                  <div className="font-bold text-slate-800 pb-1 border-b border-slate-200 flex items-center justify-between">
                    <span>Accessed Account Information</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Live Synced
                    </span>
                  </div>

                  {isWhatsApp ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Verified Mobile Number:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {verifiedAccountData.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">WABA Account ID:</span>
                        <span className="font-mono text-[11px] text-slate-700">
                          {verifiedAccountData.wabaId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Messaging Quality Rating:</span>
                        <span className="font-semibold text-emerald-700">
                          {verifiedAccountData.qualityRating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Business Profile Name:</span>
                        <span className="font-semibold text-slate-900">
                          {verifiedAccountData.profileName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Messaging Quota:</span>
                        <span className="text-slate-700">{verifiedAccountData.tier}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Conversations Synced:</span>
                        <span className="text-emerald-700 font-semibold">
                          1 Live WhatsApp Lead Ingested
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Verified Instagram Handle:</span>
                        <span className="font-bold text-pink-700">
                          {verifiedAccountData.instagramHandle}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Account Type:</span>
                        <span className="font-semibold text-slate-900">
                          {verifiedAccountData.accountType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Followers:</span>
                        <span className="font-bold text-slate-900">
                          {verifiedAccountData.followersCount?.toLocaleString()} followers
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Account ID:</span>
                        <span className="font-mono text-[11px] text-slate-700">
                          {verifiedAccountData.instagramAccountId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Direct Message Sync:</span>
                        <span className="text-emerald-700 font-semibold">
                          {verifiedAccountData.dmSync}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Inbound DMs Synced:</span>
                        <span className="text-emerald-700 font-semibold">
                          1 Live Instagram DM Ingested
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                {onNavigateToInbox && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToInbox();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>View Ingested Messages in Inbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Done &amp; Return to Integrations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
