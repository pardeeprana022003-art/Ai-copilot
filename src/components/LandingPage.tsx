import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  ScanLine,
  TrendingUp,
  MessageSquare,
  Star,
  CheckCircle2,
  Users,
  ChevronDown,
  Building2,
  PhoneCall,
  Clock,
  IndianRupee,
  Lock,
} from 'lucide-react';
import { AppView, BusinessProfile, PricingPlan } from '../types';

interface LandingPageProps {
  onStartFree: () => void;
  onExploreDemo: () => void;
  onOpenPricing: () => void;
  business: BusinessProfile;
  pricingPlans: PricingPlan[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onExploreDemo,
  onOpenPricing,
  business,
  pricingPlans,
}) => {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const steps = [
    {
      num: '01',
      title: 'Connect your business',
      desc: 'Link your WhatsApp Business, Google Profile, or enter basic store details in under 2 minutes.',
    },
    {
      num: '02',
      title: 'AI scans your data',
      desc: 'The system continuously monitors enquiries, reviews, customer intervals, and peak hour trends.',
    },
    {
      num: '03',
      title: 'AI finds opportunities',
      desc: 'Instead of raw data, receive prioritized opportunities with calculated INR revenue potential.',
    },
    {
      num: '04',
      title: 'You approve actions',
      desc: 'Zero risky automation. You retain 100% control with 1-click approvals for tailored messages and replies.',
    },
    {
      num: '05',
      title: 'Your business improves',
      desc: 'Recover abandoned leads, boost recurring customer visits, and protect your local star rating.',
    },
  ];

  const employees = [
    {
      name: 'AI Receptionist',
      role: '24/7 Front Desk Greeter',
      impact: 'Sub-5s response on WhatsApp & Instagram',
      desc: 'Answers pricing, timings, parking, and table reservation inquiries instantly day or night.',
      tag: 'Customer Response',
    },
    {
      name: 'AI Sales Assistant',
      role: 'Lead Qualifier & Upsell Pro',
      impact: '+24% catering & bulk order deals',
      desc: 'Identifies high-value intent (party bookings, office subscriptions) and prepares tailored proposals.',
      tag: 'Sales',
    },
    {
      name: 'AI Follow-Up Agent',
      role: 'Re-engagement Specialist',
      impact: 'Recovers 4-6 missed leads weekly',
      desc: 'Detects enquiries that went cold and dispatches personalized, polite follow-ups before they go to competitors.',
      tag: 'Follow-ups',
    },
    {
      name: 'AI Review Manager',
      role: 'Reputation Guardian',
      impact: 'Maintains 4.5+ Google Rating',
      desc: 'Flags negative reviews within 15 minutes and crafts empathetic, brand-safe resolution responses.',
      tag: 'Reputation',
    },
    {
      name: 'AI Marketing Assistant',
      role: 'Local Footfall Driver',
      impact: '62% WhatsApp open rates',
      desc: 'Drafts seasonal broadcasts, weekend specials, and personalized incentives for VIP customer segments.',
      tag: 'Marketing',
    },
    {
      name: 'AI Business Analyst',
      role: 'Executive CFO Advisor',
      impact: 'Real-time margin intelligence',
      desc: 'Answers "Why did sales drop?" and prepares 7-day revenue recovery roadmaps using live sales numbers.',
      tag: 'Intelligence',
    },
    {
      name: 'AI Customer Support',
      role: 'Resolution & Care Handler',
      impact: '82% first-contact resolution',
      desc: 'Handles dietary questions, complaints, item queries, and refund vouchers with polite, swift care.',
      tag: 'Support',
    },
  ];

  const faqs = [
    {
      q: 'Will the AI send messages to my customers automatically without asking me?',
      a: 'No. By default, AI Business Autopilot operates on "Require Approval" autonomy. Every outreach message, review response, or promotional broadcast requires your explicit 1-click review and approval in the Action Center. You maintain total control.',
    },
    {
      q: 'How does the AI understand Indian business nuances and pricing in ₹?',
      a: 'The system is architected natively for Indian SMBs—understanding conversational Indian English on WhatsApp, localized F&B/retail behaviors, weekend rush patterns, and standard INR (₹) economics.',
    },
    {
      q: 'What data do I need to get started?',
      a: 'You can start right away by entering basic business details in our 2-minute onboarding flow. You can also explore our pre-loaded Urban Brew Café demo to test the full operating layer instantly.',
    },
    {
      q: 'Can I connect my real WhatsApp Business API or Google My Business account?',
      a: 'Yes. The platform provides a clean modular Integrations architecture ready to link WhatsApp Cloud API, Google Business Profile webhooks, and Razorpay payment sync.',
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Business Autopilot • India Edition</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto uppercase leading-[1.1]">
            YOUR BUSINESS HAS AN <span className="text-indigo-600">AI TEAM</span> NOW.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            AI Business Autopilot finds missed opportunities, analyzes your business, and helps you take action —
            without requiring you to become an AI expert.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-start-free-btn"
              onClick={onStartFree}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Free — Launch Autopilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-watch-demo-btn"
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Live Demo (Urban Brew Café)</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Human-in-the-loop approval by default
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              Pre-loaded with realistic Indian SME data
            </span>
          </div>

          {/* Hero Dashboard Preview Visual (Realistic Commercial SaaS UI, not a robot graphic) */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white border border-slate-300 shadow-2xl p-4 sm:p-6 text-left relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="font-semibold text-slate-700 ml-2">Urban Brew Café — Health Overview</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                AI Autopilot Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
              {/* Health score card */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Business Health Score</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold text-white">72</span>
                    <span className="text-slate-400 text-lg">/ 100</span>
                  </div>
                  <p className="text-xs text-emerald-400 mt-1 font-medium">
                    +4 pts from last week • ₹56,900 unlockable opportunity
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">Response</div>
                    <div className="font-bold text-amber-400">64%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Sales</div>
                    <div className="font-bold text-emerald-400">68%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Reviews</div>
                    <div className="font-bold text-indigo-400">79%</div>
                  </div>
                </div>
              </div>

              {/* Today's Opportunities */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Today&apos;s Opportunities</span>
                  <span className="text-rose-600 font-bold">5 Action Items</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">11 missed customer enquiries</div>
                      <div className="text-slate-500 text-[11px]">Follow-up drafted by AI Agent</div>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      +₹18,500
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">3 negative Google reviews</div>
                      <div className="text-slate-500 text-[11px]">Empathetic responses prepared</div>
                    </div>
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                      High Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Center preview */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Action Center • 1-Click Workflow</span>
                  </div>
                  <p className="mt-2 text-xs text-indigo-900 font-medium leading-relaxed">
                    &ldquo;11 enquiries received no follow-up. Estimated opportunity: 4–6 potential orders (₹18,500).&rdquo;
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={onExploreDemo}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    [Review &amp; Approve Demo Action]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 bg-slate-100/70 border-b border-slate-200 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Designed for forward-thinking small and medium businesses in India
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-600 font-semibold text-sm">
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Specialty Cafés &amp; Restaurants
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Salons, Spas &amp; Wellness
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Fitness Gyms &amp; Yoga Studios
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Clinics &amp; Healthcare
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Retail &amp; Direct Brands
            </span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-18 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-wider text-indigo-600 font-bold">Simple Operational Model</h2>
            <p className="text-3xl font-extrabold text-slate-950 mt-1">How AI Business Autopilot Works</p>
            <p className="text-slate-600 text-sm mt-3">
              The AI converts raw business data into: <br />
              <span className="font-semibold text-slate-900">
                PROBLEM &rarr; INSIGHT &rarr; RECOMMENDED ACTION &rarr; OPTIONAL EXECUTION
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all shadow-xs"
              >
                <div className="text-2xl font-black text-indigo-600">{step.num}</div>
                <div className="mt-2 text-sm font-bold text-slate-900">{step.title}</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Employees Section */}
      <section className="py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-wider text-indigo-600 font-bold">The Virtual Operating Staff</h2>
            <p className="text-3xl font-extrabold text-slate-950 mt-1">7 Dedicated AI Employees</p>
            <p className="text-slate-600 text-sm mt-2">
              Each AI employee operates with clear business purpose, measurable task metrics, and human approval safeguards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {employees.map((emp) => (
              <div
                key={emp.name}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {emp.tag}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Agent
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900">{emp.name}</h3>
                  <div className="text-xs text-indigo-600 font-medium">{emp.role}</div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{emp.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="text-slate-500">Measurable Impact:</span>
                  <span className="text-emerald-700">{emp.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Features: Business Scanner & Action Center */}
      <section className="py-18 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200 mb-3">
                <ScanLine className="w-3.5 h-3.5" />
                Flagship Capability
              </div>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                The AI Business Scanner
              </h2>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Connect your business details and let the AI scan across 6 critical operational pillars:
                Customer Response, Sales &amp; Conversion, Reviews &amp; Reputation, Customer Retention, Operations, and Digital Presence.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">Health Scoring (0–100):</span>
                    <span className="text-xs text-slate-600 ml-1">
                      Instantly see which area of your business is losing money.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">Calculated Opportunity in ₹:</span>
                    <span className="text-xs text-slate-600 ml-1">
                      Every detected problem is tied to an estimated INR revenue recovery figure.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">Action Center Hand-off:</span>
                    <span className="text-xs text-slate-600 ml-1">
                      One click sends recommended solutions directly to the Action Center for approval.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <button
                  onClick={onExploreDemo}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Launch Business Scanner in Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scanner Visual Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Live Scanner Diagnostics</span>
                <span className="text-xs font-bold text-emerald-400">Score: 72/100</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Customer Response (42 min latency)</span>
                    <span className="text-amber-400 font-semibold">64 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Sales &amp; Conversion (11 missed leads)</span>
                    <span className="text-emerald-400 font-semibold">68 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Reviews &amp; Reputation (4.4 Google rating)</span>
                    <span className="text-indigo-400 font-semibold">79 / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: '79%' }} />
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                *Estimated total revenue upside: <span className="text-emerald-400 font-bold">₹56,900 / month</span> across all categories.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-wider text-indigo-600 font-bold">Customer Outcomes</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Built for Busy Indian Business Owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;Before Autopilot, we would finish the Saturday dinner rush and realize 8 catering inquiries on WhatsApp
                had been ignored for 6 hours. Now the AI Receptionist answers immediately and drafts custom packages for my 1-click approval.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  DR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Deepak Rao</div>
                  <div className="text-[11px] text-slate-500">Founder, The Daily Roast • Indiranagar</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;The AI Follow-Up Agent alone brought back 14 dormant clients who hadn&apos;t visited our salon in 2 months. That was ₹38,000 in recovered revenue with zero ad spending.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                  NM
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Nalini Murthy</div>
                  <div className="text-[11px] text-slate-500">Director, Apsara Hair &amp; Spa • Koramangala</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;When a negative review hit our Google profile on Friday night, AI Review Manager alerted me in 10 minutes and had a sincere, professional reply ready. We turned an angry diner into a loyal regular.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  AK
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Arun Khurana</div>
                  <div className="text-[11px] text-slate-500">Owner, Urban Crust Kitchen • Mumbai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-18 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-wider text-indigo-600 font-bold">Transparent Pricing</h2>
            <p className="text-3xl font-extrabold text-slate-950 mt-1">Simple Plans for Every Stage</p>
            <p className="text-slate-600 text-sm mt-2">
              Start free today. Upgrade anytime as your customer volume grows. No hidden contract locks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
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
                        Most Popular
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
                    onClick={onStartFree}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      plan.recommended
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {plan.priceINR === 0 ? 'Start Free' : `Select ${plan.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xs uppercase tracking-wider text-indigo-600 font-bold">Frequently Asked Questions</h2>
            <p className="text-2xl font-extrabold text-slate-950 mt-1">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stop managing everything manually.
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
            Give your business a dedicated AI team to handle missed leads, review responses, customer follow-ups, and daily performance checks.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartFree}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-lg cursor-pointer"
            >
              Start Free Today
            </button>
            <button
              onClick={onExploreDemo}
              className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-colors cursor-pointer"
            >
              View Urban Brew Demo
            </button>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            No credit card required • 2-minute setup • Full autonomy control
          </div>
        </div>
      </section>
    </div>
  );
};
