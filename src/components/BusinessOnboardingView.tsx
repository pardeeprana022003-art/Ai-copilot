import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { BusinessProfile } from '../types';

interface BusinessOnboardingViewProps {
  userEmail?: string;
  onOnboardingComplete: (newBusiness: BusinessProfile) => void;
  onCancel?: () => void;
  isAddingAdditionalBusiness?: boolean;
}

const CATEGORIES = [
  'Café / Restaurant',
  'Salon / Spa',
  'Dental / Healthcare Clinic',
  'Coaching / Education',
  'Retail Store',
  'Fitness / Gym',
  'Real Estate',
  'Automobile Service',
  'B2B Professional Services',
  'Other',
];

const PRESET_GOALS = [
  'Reduce missed customer enquiries',
  'Increase repeat orders & client visits',
  'Improve Google ratings & public reviews',
  'Automate WhatsApp customer follow-ups',
  'Upsell high-margin packages & services',
  'Save owner & staff management time',
];

export const BusinessOnboardingView: React.FC<BusinessOnboardingViewProps> = ({
  userEmail = '',
  onOnboardingComplete,
  onCancel,
  isAddingAdditionalBusiness = false,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(userEmail);

  useEffect(() => {
    if (userEmail && !email) {
      setEmail(userEmail);
    }
  }, [userEmail]);
  const [website, setWebsite] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Reduce missed customer enquiries',
    'Increase repeat orders & client visits',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddService = () => {
    if (!servicesInput.trim()) return;
    if (!servicesList.includes(servicesInput.trim())) {
      setServicesList([...servicesList, servicesInput.trim()]);
    }
    setServicesInput('');
  };

  const handleRemoveService = (srv: string) => {
    setServicesList(servicesList.filter((s) => s !== srv));
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Business name is required.');
      return;
    }
    if (!category) {
      setErrorMessage('Please select a business category.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.onboardBusiness({
        name: name.trim(),
        category,
        location: location.trim() || 'Indiranagar, Bengaluru',
        description: description.trim(),
        phone: phone.trim() || '+91 98450 00000',
        email: email.trim() || userEmail,
        website: website.trim(),
        goals: selectedGoals,
        services: servicesList.length > 0 ? servicesList : ['Core Offerings'],
      } as any);

      onOnboardingComplete(response.business);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete onboarding.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            {isAddingAdditionalBusiness ? 'Add Business' : 'Step 1 of 1: Business Profile Setup'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isAddingAdditionalBusiness ? 'Create Another Business Workspace' : 'Tell us about your business'}
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Your AI operating assistant uses this information to personalize customer replies, analyze opportunities,
            and monitor performance.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Basics */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Basic Business Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apex Dental Clinic, Royal Biryani Hub, Studio Lush"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Koramangala, Bengaluru"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description &amp; Specialty
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what makes your business special, your target patrons, or signature specialties..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>Contact Channels</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@business.in"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Website (Optional)</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Offerings */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Key Services &amp; Products</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                List the main products or services your customers ask about or buy.
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                  placeholder="e.g. Hair Coloring, Root Canal, Cold Brew, SAT Prep"
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {servicesList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((srv) => (
                    <span
                      key={srv}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-medium border border-indigo-100"
                    >
                      {srv}
                      <button
                        type="button"
                        onClick={() => handleRemoveService(srv)}
                        className="text-indigo-400 hover:text-indigo-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No specific items added yet (optional).</div>
              )}
            </div>

            {/* Business Goals */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Primary Business Goals</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Select what you want AI Business Autopilot to prioritize:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{goal}</span>
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ml-2 ${
                          isSelected ? 'text-indigo-600' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              {isAddingAdditionalBusiness && onCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition shadow-xs cursor-pointer ml-auto"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Setting up workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Onboarding &amp; Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
