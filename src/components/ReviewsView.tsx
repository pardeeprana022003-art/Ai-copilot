import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Send,
  Filter,
  RefreshCw,
  ExternalLink,
  Plus,
  X,
  Share2,
} from 'lucide-react';
import { ReviewItem, ReviewSentiment, AppView } from '../types';
import { apiService } from '../services/apiService';

interface ReviewsViewProps {
  reviews: ReviewItem[];
  businessName: string;
  businessId: string;
  onReviewAdded?: (review: ReviewItem) => void;
  onNavigate?: (view: AppView) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews: initialReviews,
  businessName,
  businessId,
  onReviewAdded,
  onNavigate,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);
  const [customResponseText, setCustomResponseText] = useState<string>('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  // Add Review Modal state
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [revCustomerName, setRevCustomerName] = useState('');
  const [revRating, setRevRating] = useState('5');
  const [revContent, setRevContent] = useState('');
  const [revPlatform, setRevPlatform] = useState('Google Business Profile');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Sync state when props update
  React.useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  // Dynamically calculated real stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? Number((reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)) : 0;
  const positiveCount = reviews.filter((r) => r.rating >= 4).length;
  const negativeCount = reviews.filter((r) => r.rating <= 3).length;
  const requiringResponse = reviews.filter((r) => !r.responded).length;

  const filteredReviews = reviews.filter((r) => {
    if (selectedSentiment === 'all') return true;
    return r.sentiment.toLowerCase() === selectedSentiment.toLowerCase();
  });

  const getSentimentBadge = (sentiment: ReviewSentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Negative':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Neutral':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Urgent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleApproveResponse = (reviewId: string) => {
    const rev = reviews.find((r) => r.id === reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, responded: true } : r))
    );
    setActionSuccessNotice(
      `Response for ${rev?.customerName} approved and marked ready for posting.`
    );
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleRegenerateWithGemini = async (review: ReviewItem) => {
    setIsRegenerating(review.id);
    try {
      const res = await apiService.generateReviewResponse(businessId, review.id);
      if (res && res.data) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === review.id
              ? {
                  ...r,
                  suggestedResponse: res.data.suggestedResponse,
                  aiAnalysis: res.data.analysis,
                }
              : r
          )
        );
      }
    } catch (err) {
      console.error('Failed to regenerate response:', err);
    } finally {
      setIsRegenerating(null);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revCustomerName.trim() || !revContent.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await apiService.addReview(businessId, {
        customerName: revCustomerName.trim(),
        rating: Number(revRating),
        content: revContent.trim(),
        platform: revPlatform,
      });

      if (onReviewAdded && res.review) {
        onReviewAdded(res.review);
      }
      setReviews((prev) => [res.review, ...prev]);
      setShowAddReviewModal(false);
      setRevCustomerName('');
      setRevContent('');
      setRevRating('5');
    } catch (err) {
      console.error('Failed to add review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Action Notification */}
      {actionSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActionSuccessNotice(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Review Hub</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {totalReviews} Verified Review{totalReviews === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reputation protection &amp; AI response synthesizer for {businessName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddReviewModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review / Feedback</span>
          </button>
        </div>
      </div>

      {/* Real Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Average Rating</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-950">
              {avgRating > 0 ? avgRating : '—'}
            </span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Reviews</div>
          <div className="text-2xl font-black text-slate-950 mt-1">{totalReviews}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Positive (4-5 ★)</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{positiveCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pending Response</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{requiringResponse}</div>
        </div>
      </div>

      {/* EMPTY STATE (Requirement 16) */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Star className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No reviews available yet</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Your Google Business Profile or feedback channel hasn&apos;t received customer reviews yet. Connect your
            Google Profile to sync reviews automatically or log customer feedback manually.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('integrations');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span>Connect Google Business Profile</span>
            </button>
            <button
              onClick={() => setShowAddReviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer Review / Feedback</span>
            </button>
          </div>
        </div>
      ) : (
        /* Reviews List */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Customer Feedback Feed ({filteredReviews.length})
            </span>

            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white cursor-pointer"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative / At Risk</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {rev.customerName[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{rev.customerName}</div>
                      <div className="text-[10px] text-slate-400">
                        {rev.platform} • {rev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSentimentBadge(
                        rev.sentiment
                      )}`}
                    >
                      {rev.sentiment}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  &ldquo;{rev.content}&rdquo;
                </p>

                {/* AI Crafted Response Box */}
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>AI Review Manager Suggested Response:</span>
                    </span>
                    <button
                      onClick={() => handleRegenerateWithGemini(rev)}
                      disabled={isRegenerating === rev.id}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRegenerating === rev.id ? 'animate-spin' : ''}`} />
                      <span>Regenerate</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-indigo-200 leading-relaxed shadow-2xs">
                    {rev.suggestedResponse}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-slate-500">
                      Status:{' '}
                      <strong className={rev.responded ? 'text-emerald-700' : 'text-amber-700'}>
                        {rev.responded ? 'Approved & Posted' : 'Awaiting Approval'}
                      </strong>
                    </span>

                    {!rev.responded ? (
                      <button
                        onClick={() => handleApproveResponse(rev.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve &amp; Post Response</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Responded</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add Customer Review</h3>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={revCustomerName}
                  onChange={(e) => setRevCustomerName(e.target.value)}
                  placeholder="e.g. Vikram Seth"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                  <select
                    value={revRating}
                    onChange={(e) => setRevRating(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 cursor-pointer"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Negative)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                  <select
                    value={revPlatform}
                    onChange={(e) => setRevPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 cursor-pointer"
                  >
                    <option value="Google Business Profile">Google Business</option>
                    <option value="WhatsApp Direct">WhatsApp Direct</option>
                    <option value="Zomato / Swiggy">Zomato / Swiggy</option>
                    <option value="Practo / JustDial">Practo / JustDial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Review Text <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={revContent}
                  onChange={(e) => setRevContent(e.target.value)}
                  placeholder="Enter the review text as submitted by the customer..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  {isSubmittingReview ? 'Adding...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
