import React from 'react';
import {
  BookOpen,
  X,
  Code2,
  Database,
  BrainCircuit,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Layers,
  Sparkles,
  Server,
} from 'lucide-react';

interface ArchitectureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureGuideModal: React.FC<ArchitectureGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = React.useState<string>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">AI Business Autopilot • Developer &amp; Architecture Guide</h2>
              <p className="text-[11px] text-slate-300">
                Commercial SaaS System Blueprint, Schema, Gemini Integration, &amp; Deployment Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: '1. Architecture & Folders' },
            { id: 'database', label: '2. Database Schema' },
            { id: 'gemini', label: '3. Gemini AI Endpoints' },
            { id: 'real_apis', label: '4. Connecting Real APIs' },
            { id: 'deployment', label: '5. Local Setup & Deploy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Overview & Folders */}
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                Full-Stack Architecture &amp; Folder Map
              </h3>
              <p>
                The application is structured as a full-stack commercial SaaS platform powered by <strong>Express (Node.js)</strong> on the backend and <strong>React (Vite + Tailwind CSS)</strong> on the frontend.
              </p>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto">
                {`/ai-business-autopilot
├── server.ts              # Express Backend: Gemini AI proxies, Action execution, & Vite middleware
├── src/
│   ├── types.ts           # Core Domain TypeScript entities (Business, Customer, Review, Task, etc.)
│   ├── data/
│   │   └── mockData.ts    # Seed dataset for "Urban Brew Café" demo
│   ├── services/
│   │   └── apiService.ts  # Client-side API proxy calling /api/ai endpoints
│   ├── components/
│   │   ├── Navbar.tsx             # Global navigation, demo badge & mobile menu
│   │   ├── LandingPage.tsx        # High-converting SaaS landing page
│   │   ├── DashboardView.tsx      # Business Health Score, 5 Opportunities, 4 Insights
│   │   ├── ActionCenterView.tsx   # Problem -> Insight -> Action -> Execution workflow
│   │   ├── AIEmployeesView.tsx    # 7 Autonomous employee cards with autonomy toggles
│   │   ├── CustomersView.tsx      # CRM table + Gemini personalized message generator
│   │   ├── ConversationsView.tsx  # Omnichannel inbox (WhatsApp, IG, Web, Email)
│   │   ├── ReviewsView.tsx        # Reviews analytics + Gemini response generator
│   │   ├── AnalyticsView.tsx      # Revenue velocity, SVG trend chart, top products
│   │   ├── BusinessAnalystView.tsx# Gemini conversational analyst with task creator
│   │   ├── BusinessScannerView.tsx# 6-Pillar operational health scanner
│   │   ├── IntegrationsView.tsx   # Channel connections & webhook management
│   │   ├── SettingsView.tsx       # Autonomy levels (Suggest, Require Approval, Auto)
│   │   └── BillingView.tsx        # ₹0, ₹999, ₹2,499, ₹4,999 plans & usage meters
│   ├── App.tsx            # State store & root routing
│   └── main.tsx           # React DOM bootstrapping`}
              </div>

              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                <span className="font-bold text-indigo-950 text-xs">Top 3 Files to Study First:</span>
                <ol className="list-decimal list-inside text-indigo-900 space-y-1 mt-1">
                  <li><strong>/server.ts:</strong> Understand how `@google/genai` is instantiated server-side and structured with fallback logic.</li>
                  <li><strong>/src/types.ts:</strong> Review the clean, commercial data structures designed for enterprise scaling.</li>
                  <li><strong>/src/components/ActionCenterView.tsx:</strong> Study the human-in-the-loop approval mechanism that prevents unauthorized AI actions.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Section 2: Database Schema */}
          {activeSection === 'database' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Relational / Document Database Schema
              </h3>
              <p>
                When connecting to PostgreSQL, Cloud SQL, or MongoDB, map the following schema entities:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">1. businesses Table</div>
                  <div className="font-mono text-[11px] text-slate-600 mt-1">
                    id, name, category, location, monthly_revenue, customer_count, currency, autonomy_level, created_at
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">2. customers Table</div>
                  <div className="font-mono text-[11px] text-slate-600 mt-1">
                    id, business_id, name, phone, email, total_spend, visits_count, last_visit_date, status, notes
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">3. action_tasks Table</div>
                  <div className="font-mono text-[11px] text-slate-600 mt-1">
                    id, business_id, priority, category, problem, recommended_action, potential_inr, status, executed_at
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">4. conversations &amp; messages</div>
                  <div className="font-mono text-[11px] text-slate-600 mt-1">
                    id, customer_id, channel, sender, content, timestamp, status, ai_draft_response
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">5. reviews Table</div>
                  <div className="font-mono text-[11px] text-slate-600 mt-1">
                    id, business_id, customer_name, platform, rating, text, sentiment, responded, reply_text
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">6. ai_employees Table</div>
                  <div className="font-mono text-[11px] text-slate-600 mt-1">
                    id, business_id, role, name, status, autonomy_level, tasks_today, assigned_channels
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Gemini Endpoints */}
          {activeSection === 'gemini' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                Gemini API Implementation Details
              </h3>
              <p>
                All AI functions run strictly server-side inside <code>server.ts</code> using the official <strong>@google/genai</strong> SDK and model <strong>gemini-2.5-flash</strong>:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">POST /api/ai/scan-business</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">gemini-2.5-flash</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Takes business metrics and performs 6-pillar diagnostic scoring with JSON schema enforcement.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">POST /api/ai/chat-analyst</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">gemini-2.5-flash</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Acts as the virtual CFO. Provides direct answers, driving factors, and concrete action steps.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">POST /api/ai/generate-customer-message</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">gemini-2.5-flash</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Generates respectful, high-converting WhatsApp drafts personalized to the customer&apos;s past purchase frequency and favorite items.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">POST /api/ai/generate-review-response</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">gemini-2.5-flash</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Evaluates customer review sentiment and composes polite, brand-safe Google My Business responses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Connecting Real APIs */}
          {activeSection === 'real_apis' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                How to Connect Real Production APIs
              </h3>
              <p>
                When taking this product to live commercial rollout, follow these steps to connect real channels:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">1. WhatsApp Cloud API (Meta for Developers)</div>
                  <p className="text-slate-600">
                    Create a Meta Business App, verify phone number, and configure a webhook endpoint pointing to <code>/api/webhooks/whatsapp</code>. Store <code>WHATSAPP_TOKEN</code> and <code>WHATSAPP_PHONE_NUMBER_ID</code> in <code>.env</code>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">2. Google My Business API (Reviews &amp; Q&amp;A)</div>
                  <p className="text-slate-600">
                    Enable the Google Business Profile API in Google Cloud Console. Use OAuth 2.0 to request <code>https://www.googleapis.com/auth/business.manage</code> so the AI Review Manager can publish real replies.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">3. Razorpay Indian Payment Gateway</div>
                  <p className="text-slate-600">
                    Add Razorpay Standard Checkout for the ₹999, ₹2,499, and ₹4,999 plans. Set up webhook handling for <code>subscription.charged</code> events to auto-refresh user quotas.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">4. Google Drive Cloud Storage (drive.file OAuth)</div>
                  <p className="text-slate-600">
                    Integrated using Firebase Google Auth with <code>https://www.googleapis.com/auth/drive.file</code> scope. Enables 1-click business JSON snapshots, customer CSV exports, and AI audit reports saved directly to Google Drive.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Local Run & Deployment */}
          {activeSection === 'deployment' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                Local Setup &amp; Deployment Commands
              </h3>

              <div className="space-y-2">
                <div className="font-bold text-slate-900">Run Locally:</div>
                <div className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg">
                  {`# 1. Clone repository
git clone https://github.com/your-org/ai-business-autopilot.git
cd ai-business-autopilot

# 2. Install dependencies
npm install

# 3. Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# 4. Start local development server (runs on port 3000)
npm run dev`}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-bold text-slate-900">Deploy to Cloud Run / Vercel / Railway:</div>
                <div className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg">
                  {`# Build frontend & bundle backend into single CommonJS file
npm run build

# Start production server
npm start`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">AI Business Autopilot SaaS Architecture Specification</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
