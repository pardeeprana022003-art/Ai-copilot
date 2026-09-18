import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
  Layers,
  Smartphone,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';
import { PricingPlan } from '../types';
import { UpiPaymentModal } from './UpiPaymentModal';

interface BillingViewProps {
  plans: PricingPlan[];
  upiId?: string;
  businessName?: string;
}

export const BillingView: React.FC<BillingViewProps> = ({
  plans,
  upiId = 'pardeeprana022003@okicici',
  businessName = 'Alpha Salon',
}) => {
  const [currentPlanId, setCurrentPlanId] = useState<string>('plan_growth');
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedPlanForUpi, setSelectedPlanForUpi] = useState<PricingPlan | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.priceINR > 0) {
      // Open UPI payment modal for direct payment
      setSelectedPlanForUpi(plan);
    } else {
      setCurrentPlanId(plan.id);
      setNotice(`Activated ${plan.name} free plan.`);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handlePaymentSuccess = (plan: PricingPlan, refNumber: string) => {
    setCurrentPlanId(plan.id);
    setNotice(
      `UPI Payment Verified (Ref: ${refNumber})! Upgraded active subscription tier to ${plan.name}.`
    );
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Notice Banner */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-bold text-emerald-700">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          Subscription &amp; Usage
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Simple pricing scaled for growing Indian local businesses. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Usage Meters */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Billing Cycle
            </div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              Active Plan: <span className="text-indigo-600 capitalize">{currentPlanId} Tier</span>
            </div>
          </div>
          <span className="text-xs text-slate-500">Renews on Oct 1, 2026 • Razorpay Autopay</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">AI Actions Executed</span>
              <span className="font-bold text-slate-900">86 / 200</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '43%' }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">43% quota utilized</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">Customer CRM Profiles</span>
              <span className="font-bold text-slate-900">428 / Unlimited</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <span className="text-[10px] text-emerald-600 mt-1 block font-medium">Unlimited available</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">Connected Channels</span>
              <span className="font-bold text-slate-900">3 / 5</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">WhatsApp, Google, Instagram</span>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isCurrent = currentPlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                plan.recommended
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{plan.name}</span>
                  {plan.recommended && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                      Recommended
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    ₹{plan.priceINR.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500">{plan.billingPeriod}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{plan.description}</p>

                <div className="mt-5 space-y-2 text-xs text-slate-700">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-500 cursor-default'
                      : plan.priceINR > 0
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isCurrent ? (
                    'Current Plan'
                  ) : plan.priceINR > 0 ? (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Pay ₹{plan.priceINR} via UPI</span>
                    </>
                  ) : (
                    `Switch to ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct UPI Payment Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-900/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight">Direct UPI Membership Payments</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Instant VPA
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
              Pay your business membership fee securely via any UPI application (GPay, PhonePe, Paytm, BHIM).
              All subscription tiers are lowered between ₹500 and ₹2,500/mo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-indigo-200 block font-semibold uppercase tracking-wider">
              Official UPI VPA
            </span>
            <span className="font-mono text-xs font-bold text-white tracking-wide">{upiId}</span>
          </div>
          <button
            onClick={handleCopyUpi}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer shadow-xs"
            title="Copy UPI ID"
          >
            {copiedUpi ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* UPI Payment Modal */}
      <UpiPaymentModal
        isOpen={Boolean(selectedPlanForUpi)}
        onClose={() => setSelectedPlanForUpi(null)}
        plan={selectedPlanForUpi}
        upiId={upiId}
        businessName={businessName}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
