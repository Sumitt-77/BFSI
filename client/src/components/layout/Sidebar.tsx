import React from 'react';
import { PageId, UserFinancialProfile } from '../../types';
import {
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Calculator,
  Sparkles,
  History,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { formatINR } from '../../utils/currency';

export interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  userProfile: UserFinancialProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
  userProfile,
}) => {
  const mainNav: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'loan-eligibility', label: 'Loan Eligibility', icon: <TrendingUp className="w-5 h-5" />, badge: 'Core' },
    { id: 'credit-analyzer', label: 'Credit Analyzer', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'emi-calculator', label: 'EMI Calculator', icon: <Calculator className="w-5 h-5" /> },
    { id: 'ai-tips', label: 'AI Financial Tips', icon: <Sparkles className="w-5 h-5" />, badge: 'AI' },
    { id: 'history', label: 'Records / History', icon: <History className="w-5 h-5" /> },
    { id: 'profile', label: 'Financial Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-white/10 bg-slate-950/70 backdrop-blur-2xl transition-all duration-300 relative z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-800 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50 cursor-pointer"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation items list */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={`shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Profile Summary Card at bottom of sidebar */}
      {!isCollapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-slate-900/80 border border-white/10 shadow-glass">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {userProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-100 truncate">{userProfile.name}</p>
              <p className="text-[11px] text-slate-400 font-mono truncate">{formatINR(userProfile.monthlyIncome)}/mo</p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Credit Score</span>
            <span className="font-bold text-emerald-400 font-mono">{userProfile.creditScore}</span>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center">
          <div
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs cursor-pointer hover:opacity-90"
            title={userProfile.name}
          >
            {userProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      )}

      {/* Disclaimer / About link */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => onNavigate('about')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors ${
            currentPage === 'about' ? 'text-sky-400 font-bold' : ''
          }`}
          title={isCollapsed ? 'About & Disclaimer' : undefined}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>About & Disclaimer</span>}
        </button>
      </div>
    </aside>
  );
};
