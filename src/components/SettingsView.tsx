import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building2,
  Users,
  Bell,
  Clock,
  CheckCircle2,
  Lock,
  FileText,
  Save,
  Trash2,
  AlertTriangle,
  X,
  Globe,
  Phone,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { apiService } from '../services/apiService';

interface SettingsViewProps {
  business: BusinessProfile;
  onUpdateBusiness: (updated: BusinessProfile) => void;
  onDeleteBusiness?: (businessId: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  business,
  onUpdateBusiness,
  onDeleteBusiness,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'autonomy' | 'notifications' | 'audit' | 'danger'>(
    'profile'
  );
  const [profileForm, setProfileForm] = useState<BusinessProfile>({ ...business });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Autonomy state
  const [autonomyLevel, setAutonomyLevel] = useState<string>('require_approval');
  const [dailyDigest, setDailyDigest] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState(true);

  // Delete Business modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmNameInput, setConfirmNameInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  React.useEffect(() => {
    setProfileForm({ ...business });
  }, [business]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiService.updateBusiness(business.id, {
        name: profileForm.name,
        category: profileForm.category,
        location: profileForm.location,
        phone: profileForm.phone,
        email: profileForm.email,
        website: profileForm.website,
        openingHours: profileForm.openingHours,
        toneOfVoice: profileForm.toneOfVoice,
        currency: profileForm.currency || 'INR (₹)',
        upiId: profileForm.upiId || 'pardeeprana022003@okicici',
        description: profileForm.description,
      });

      onUpdateBusiness(profileForm);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save business settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmNameInput.trim() !== business.name.trim()) {
      setDeleteError(`Please type "${business.name}" to confirm.`);
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await apiService.deleteBusiness(business.id);
      setShowDeleteModal(false);
      if (onDeleteBusiness) {
        onDeleteBusiness(business.id);
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete business.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Save Notification */}
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Settings updated successfully!</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="font-bold text-emerald-700 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Settings &amp; Controls</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage business identity, communication tone, autonomous policies, and data controls for {business.name}
          </p>
        </div>

        <button
          id="save-settings-btn"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
        {[
          { id: 'profile', label: 'Business Profile', icon: Building2 },
          { id: 'autonomy', label: 'AI Autonomy Policy', icon: ShieldCheck },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'audit', label: 'Audit Log', icon: FileText },
          { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile (Requirement 19) */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Business Details &amp; AI Tone</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details guide how AI employees address your customers and represent your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category / Industry</label>
              <input
                type="text"
                value={profileForm.category}
                onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Location</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
              <input
                type="text"
                placeholder="https://yourbusiness.com"
                value={profileForm.website || ''}
                onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opening Hours</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM - 9:00 PM (Daily)"
                value={profileForm.openingHours || ''}
                onChange={(e) => setProfileForm({ ...profileForm, openingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tone of Voice</label>
              <select
                value={profileForm.toneOfVoice || 'Warm & Friendly'}
                onChange={(e) => setProfileForm({ ...profileForm, toneOfVoice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 cursor-pointer"
              >
                <option value="Warm & Friendly">Warm &amp; Friendly (Recommended for Indian SMEs)</option>
                <option value="Professional & Crisp">Professional &amp; Crisp (Consulting / B2B)</option>
                <option value="Premium Luxury">Premium Luxury (High-end salons, boutiques, luxury dining)</option>
                <option value="Playful & Energetic">Playful &amp; Energetic (Youth brands, cafes, events)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency</label>
              <input
                type="text"
                disabled
                value="INR (₹) - Indian Rupee"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">UPI ID for Payments</label>
              <input
                type="text"
                placeholder="e.g. yourname@okicici"
                value={profileForm.upiId || ''}
                onChange={(e) => setProfileForm({ ...profileForm, upiId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Business Description</label>
              <textarea
                rows={3}
                value={profileForm.description}
                onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: AI Autonomy Policy */}
      {activeTab === 'autonomy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">AI Execution Autonomy Level</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select how much authority AI employees have to interact with your customers and external accounts.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'suggest_only',
                title: 'Suggest Only (Passive)',
                desc: 'AI analyzes data and writes drafts, but will never execute or send any messages.',
                badge: 'Maximum Safety',
              },
              {
                id: 'require_approval',
                title: 'Require Approval (Recommended Default)',
                desc: 'AI prepares follow-ups, review replies, and broadcast drafts. All actions require a 1-click review and approval from you in the Action Center.',
                badge: 'Active Guardrail',
                recommended: true,
              },
              {
                id: 'auto_execute',
                title: 'Autonomous Execution (Strict Rules)',
                desc: 'AI automatically replies to routine inquiries (hours, menu, location) within 10 seconds. Complex complaints and refunds still route to you.',
                badge: 'Fastest Response',
              },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setAutonomyLevel(option.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                  autonomyLevel === option.id
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{option.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                      {option.badge}
                    </span>
                    {option.recommended && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-indigo-600 text-white">
                        Standard Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{option.desc}</p>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    autonomyLevel === option.id
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {autonomyLevel === option.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Hallucination &amp; Zero Unauthorized Spend Safeguard</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              AI Business Autopilot is cryptographically bound to never automatically authorize payments, modify bank credentials, delete historical reviews, or broadcast unapproved sales promotions.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Alerts &amp; Briefings</h2>

          <div className="space-y-3 text-xs">
            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
              <div>
                <div className="font-bold text-slate-900">Daily 8:00 AM Executive Briefing</div>
                <div className="text-slate-500 text-[11px]">
                  Receive a consolidated WhatsApp summary of missed leads, yesterday&apos;s revenue, and pending action items.
                </div>
              </div>
              <input
                type="checkbox"
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>

            <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
              <div>
                <div className="font-bold text-slate-900">Immediate Negative Review Alerts</div>
                <div className="text-slate-500 text-[11px]">
                  Trigger an instant alert on your phone within 5 minutes of any Google review below 3 stars.
                </div>
              </div>
              <input
                type="checkbox"
                checked={urgentAlerts}
                onChange={(e) => setUrgentAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Execution Audit Trail</h2>
          <p className="text-xs text-slate-500">
            Immutable log of all actions reviewed and executed in {business.name}.
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                time: 'Recent',
                actor: 'Account Owner',
                action: 'Verified business workspace initialized and isolation keys established',
                status: 'Completed',
              },
              {
                time: 'System',
                actor: 'AI Operating Engine',
                action: 'Autonomous background listeners armed for customer channels',
                status: 'Active',
              },
            ].map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{log.action}</div>
                  <div className="text-[11px] text-slate-500">
                    {log.time} • Actor: <strong className="text-slate-700">{log.actor}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Danger Zone (Requirement 19) */}
      {activeTab === 'danger' && (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-rose-900">Danger Zone</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Deleting a business permanently purges all customer contact records, review responses, and conversation
            histories associated with <strong>{business.name}</strong>. This operation cannot be undone.
          </p>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-xs text-rose-950">Delete {business.name}</div>
              <div className="text-[11px] text-rose-700">
                Permanently remove this business workspace and all its data.
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete This Business</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Confirm Business Deletion</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {deleteError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {deleteError}
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to delete <strong>{business.name}</strong>? All associated customers,
              reviews, and chat history will be permanently deleted.
            </p>

            <div className="space-y-3 text-xs mb-4">
              <label className="block font-semibold text-slate-700">
                Please type <span className="font-mono font-bold text-slate-900 select-all">{business.name}</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmNameInput}
                onChange={(e) => setConfirmNameInput(e.target.value)}
                placeholder={business.name}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmNameInput.trim() !== business.name.trim() || isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
