import React, { useState } from 'react';
import { Bot, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2, UserCheck, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { User, BusinessProfile } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (user: User, businesses: BusinessProfile[]) => void;
  onNavigateSignup: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateSignup,
  onNavigateForgotPassword,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiService.login({ email, password });
      onLoginSuccess(response.user, response.businesses || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillTestAccount = async (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiService.login({ email: testEmail, password: testPass });
      onLoginSuccess(response.user, response.businesses || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to login with test account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">AI BUSINESS AUTOPILOT</span>
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your business</h2>
        <p className="mt-1 text-sm text-slate-500">
          Access your AI operating assistant and private business workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourbusiness.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Test Multi-Tenant Accounts Widget (Requirement 28) */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Multi-Tenant Demo Accounts
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                Isolated Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Test two independent business owners with completely separate databases:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillTestAccount('ownerA@example.com', 'password123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left transition group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-900">
                    Alpha Salon
                  </div>
                  <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">ownerA@example.com</div>
                <div className="text-[10px] text-indigo-600 font-medium mt-1">1-Click Login →</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillTestAccount('ownerB@example.com', 'password123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-900">
                    Beta Café
                  </div>
                  <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">ownerB@example.com</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">1-Click Login →</div>
              </button>
            </div>
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <button
              onClick={onNavigateSignup}
              className="text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer"
            >
              Create free SaaS account
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to product overview
          </button>
        </div>
      </div>
    </div>
  );
};
