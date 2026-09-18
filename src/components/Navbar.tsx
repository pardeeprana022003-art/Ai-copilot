import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Zap,
  Bot,
  ScanLine,
  BrainCircuit,
  Users,
  MessageSquare,
  Star,
  BarChart3,
  Layers,
  Settings,
  CreditCard,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Building2,
  Plus,
  LogOut,
  User as UserIcon,
  Shield,
  Check,
  HardDrive,
  Database,
} from 'lucide-react';
import { AppView, BusinessProfile, User } from '../types';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  pendingActionsCount: number;
  unreadMessagesCount: number;
  pendingReviewsCount: number;
  business: BusinessProfile | null;
  userBusinesses: BusinessProfile[];
  currentUser: User | null;
  onSwitchBusiness: (businessId: string) => void;
  onOpenAddBusiness: () => void;
  onLogout: () => void;
  onOpenAccountSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  pendingActionsCount,
  unreadMessagesCount,
  pendingReviewsCount,
  business,
  userBusinesses,
  currentUser,
  onSwitchBusiness,
  onOpenAddBusiness,
  onLogout,
  onOpenAccountSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const businessMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (businessMenuRef.current && !businessMenuRef.current.contains(event.target as Node)) {
        setBusinessDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: AppView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'actions', label: 'Action Center', icon: Zap, badge: pendingActionsCount },
    { id: 'employees', label: 'AI Employees', icon: Bot },
    { id: 'scanner', label: 'Business Scanner', icon: ScanLine },
    { id: 'analyst', label: 'AI Copilot', icon: BrainCircuit },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: pendingReviewsCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'bi_engine', label: 'Power BI Engine', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'storage', label: 'Drive Vault', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand + Business Switcher */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectView('landing')}
              className="flex items-center gap-2.5 text-left hover:opacity-90 transition cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-indigo-100 font-bold text-lg tracking-tight">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
                    AI BUSINESS AUTOPILOT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none mt-1">
                  Your business has an AI team now
                </p>
              </div>
            </button>

            {/* Business Switcher Dropdown (Requirements 7 & 8) */}
            {currentUser && business && (
              <div className="relative" ref={businessMenuRef}>
                <button
                  type="button"
                  id="business-switcher-btn"
                  onClick={() => setBusinessDropdownOpen(!businessDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800 shadow-2xs cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="max-w-[140px] truncate">{business.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {businessDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Your Businesses
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1">
                      {userBusinesses.map((b) => {
                        const isCurrent = b.id === business.id;
                        return (
                          <button
                            key={b.id}
                            onClick={() => {
                              onSwitchBusiness(b.id);
                              setBusinessDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-50/80 text-indigo-900 font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Building2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} />
                              <div className="truncate">
                                <div className="truncate font-medium">{b.name}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{b.category}</div>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setBusinessDropdownOpen(false);
                          onOpenAddBusiness();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Business</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          {currentUser && (
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.slice(0, 8).map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                          isActive ? 'bg-indigo-400 text-slate-950' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Secondary Navigation Items */}
              <div className="flex items-center pl-1 border-l border-slate-200 gap-1">
                {navItems.slice(8).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => onSelectView(item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          )}

          {/* Right Action: User Menu or Auth Buttons */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-xs cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-semibold text-slate-900 text-xs leading-none truncate max-w-[100px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none mt-0.5">Owner</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      {business && (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                          <Building2 className="w-3 h-3" />
                          <span>{business.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSelectView('settings');
                        }}
                        className="w-full px-3.5 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Business Settings</span>
                      </button>

                      {onOpenAccountSettings && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAccountSettings();
                          }}
                          className="w-full px-3.5 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Account Profile</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSelectView('landing');
                        }}
                        className="w-full px-3.5 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                        <span>Product Overview</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        id="user-logout-btn"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-xs font-semibold transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectView('login')}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onSelectView('signup')}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                >
                  Start Free
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            {currentUser && (
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 xl:hidden cursor-pointer"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && currentUser && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {business && (
            <div className="py-2.5 px-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <div className="text-xs font-bold text-slate-900">{business.name}</div>
              </div>
              <button
                onClick={() => {
                  onOpenAddBusiness();
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                + Add Business
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 py-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
