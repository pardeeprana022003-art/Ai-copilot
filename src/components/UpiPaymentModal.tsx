import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  ShieldCheck,
  IndianRupee,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PricingPlan } from '../types';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  upiId: string;
  businessName: string;
  onPaymentSuccess: (plan: PricingPlan, refNumber: string) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  upiId,
  businessName,
  onPaymentSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'pay' | 'success'>('pay');

  if (!isOpen || !plan) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Standard NPCI UPI URI scheme for app intent links / QR codes
  const payeeName = encodeURIComponent('AI Business Autopilot');
  const transactionNote = encodeURIComponent(`${plan.name} Membership for ${businessName}`);
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${payeeName}&am=${plan.priceINR}&cu=INR&tn=${transactionNote}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntentUri)}&margin=10`;

  const handleConfirmPayment = () => {
    if (!utrNumber.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      onPaymentSuccess(plan, utrNumber.trim());
    }, 1200);
  };

  const handleDone = () => {
    setStep('pay');
    setUtrNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">UPI Direct Payment</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Instant
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                {plan.name} Tier Membership • ₹{plan.priceINR.toLocaleString('en-IN')}/mo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'pay' ? (
          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-indigo-900 block">Total Payable Amount</span>
                <span className="text-2xl font-black text-indigo-950 flex items-center mt-0.5">
                  <IndianRupee className="w-5 h-5 -mr-0.5" />
                  {plan.priceINR.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-slate-500 block">Plan Tier</span>
                <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block mt-0.5">
                  {plan.name}
                </span>
              </div>
            </div>

            {/* UPI ID Copy Box */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official UPI VPA / ID
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono text-xs font-semibold text-slate-900 flex-1 px-1 select-all">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Supports Google Pay, PhonePe, Paytm, BHIM, and any Indian banking UPI app.
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
              <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200">
                <img
                  src={qrCodeUrl}
                  alt={`UPI QR Code for ${upiId}`}
                  className="w-36 h-36 rounded-lg object-contain"
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                Scan using any UPI App to Pay ₹{plan.priceINR.toLocaleString('en-IN')}
              </span>
              <a
                href={upiIntentUri}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 sm:hidden"
              >
                <span>Tap to open in UPI App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Transaction Verification Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                12-digit UTR / UPI Reference Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g. 425618991024"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={!utrNumber.trim() || isVerifying}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isVerifying ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Activate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Zero commission • Direct to verified account • Instant activation</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-950">Membership Activated!</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Payment received via UPI ({upiId}). Your business is now upgraded to the{' '}
                <span className="font-bold text-slate-900">{plan.name} Tier</span>.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
              Ref UTR: {utrNumber || 'UPI-REF-OKICICI'}
            </div>
            <button
              type="button"
              onClick={handleDone}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
