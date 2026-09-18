import React from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  MapPin,
  FileText,
  Package,
  Target,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBusiness: (profile: BusinessProfile) => void;
  currentBusiness: BusinessProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveBusiness,
  currentBusiness,
}) => {
  const [step, setStep] = React.useState<number>(1);
  const totalSteps = 7;

  // Form State initialized with current business or blank defaults
  const [formData, setFormData] = React.useState<BusinessProfile>({
    ...currentBusiness,
  });

  if (!isOpen) return null;

  const categories = [
    'Restaurant / Café',
    'Salon / Spa',
    'Gym / Fitness Studio',
    'Clinic / Healthcare',
    'Retail Store',
    'E-commerce Brand',
    'Real Estate',
    'Professional Services',
    'Repair Service',
    'Other',
  ];

  const goalOptions = [
    'Increase sales',
    'Get more customers',
    'Improve customer service',
    'Reduce missed enquiries',
    'Increase repeat customers',
    'Improve reviews',
    'Save time',
    'Understand business performance',
  ];

  const handleToggleGoal = (goal: string) => {
    const currentGoals = formData.goals || [];
    if (currentGoals.includes(goal)) {
      setFormData({ ...formData, goals: currentGoals.filter((g) => g !== goal) });
    } else {
      setFormData({ ...formData, goals: [...currentGoals, goal] });
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSaveBusiness(formData);
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const resetToUrbanBrew = () => {
    setFormData({
      id: 'biz_urban_brew',
      name: 'Urban Brew Café',
      category: 'Restaurant / Café',
      location: '12th Main Road, Indiranagar, Bengaluru, Karnataka 560038',
      description: 'Specialty coffee roastery, artisanal sourdough bakery, and all-day brunch kitchen.',
      monthlyRevenue: 482000,
      customersCount: 428,
      missedEnquiries: 11,
      avgRating: 4.4,
      reviewsCount: 312,
      inactiveCustomers: 24,
      currency: '₹',
      phone: '+91 98450 19283',
      email: 'hello@urbanbrew.in',
      website: 'https://urbanbrew.in',
      onboarded: true,
      goals: [
        'Reduce missed enquiries',
        'Increase repeat customers',
        'Improve customer service',
        'Improve reviews',
        'Increase sales',
      ],
    });
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              {step}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Business Setup Wizard</h2>
              <div className="text-[11px] text-slate-500">
                Step {step} of {totalSteps} • AI Autopilot Initializer
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetToUrbanBrew}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              Load Urban Brew Demo
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Step 1: Business Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">What is your business name?</h3>
              </div>
              <p className="text-xs text-slate-600">
                This name will be used across AI employee interactions, customer WhatsApp drafts, and public review responses.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Urban Brew Café"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">Select your business category</h3>
              <p className="text-xs text-slate-600">
                Our AI employees tailor their vocabulary, peak hour detection, and margin models to your industry.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      formData.category === cat
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Where is your business located?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Helps AI receptionist give accurate directions, parking tips, and local delivery boundaries.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Store / Clinic / Office Address</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Indiranagar, Bengaluru, Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Describe your business &amp; vibe</h3>
              </div>
              <p className="text-xs text-slate-600">
                Provide 1–2 sentences explaining what makes your brand unique.
              </p>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Specialty coffee roastery, artisanal sourdough bakery, and all-day brunch kitchen."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Step 5: Products & Services */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Package className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Primary products or services</h3>
              </div>
              <p className="text-xs text-slate-600">
                List the core offerings that drive your revenue (comma-separated or keywords).
              </p>
              <textarea
                rows={3}
                defaultValue="Specialty Pour-Over, Artisanal Sourdough, Cold Brew, Weekend Brunch, Coffee Beans"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600">Approx. Monthly Revenue (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyRevenue}
                    onChange={(e) => setFormData({ ...formData, monthlyRevenue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600">Active Customer Count</label>
                  <input
                    type="number"
                    value={formData.customersCount}
                    onChange={(e) => setFormData({ ...formData, customersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Business Goals */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Target className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">What are your immediate business goals?</h3>
              </div>
              <p className="text-xs text-slate-600">
                Select all that apply. The AI will prioritize action cards and insight alerts accordingly.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map((goal) => {
                  const isSelected = (formData.goals || []).includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleToggleGoal(goal)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 7: Connect Integrations */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Layers className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Connect your channels</h3>
              </div>
              <p className="text-xs text-slate-600">
                For demo testing, channels can be toggled to simulated data. No real credentials are required right now.
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Google Business Profile</div>
                    <div className="text-slate-500 text-[11px]">Sync reviews and location updates</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    Demo Connected
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">WhatsApp Business API</div>
                    <div className="text-slate-500 text-[11px]">Direct customer messaging &amp; follow-ups</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    Demo Connected
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Instagram Direct</div>
                    <div className="text-slate-500 text-[11px]">Auto-reply to story leads and DMs</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
                    Connect in Settings
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Payment Platform (Razorpay)</div>
                    <div className="text-slate-500 text-[11px]">Sync live orders and ticket sizes</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
                    Coming Soon
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Safe Demo Mode:</strong> Actions executed in this environment will simulate messages and log audit records without posting externally.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>{step === totalSteps ? 'Complete Onboarding & Run Scanner' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
