import React from 'react';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Calculator,
  Sparkles,
} from 'lucide-react';

export interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const items: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'loan-eligibility', label: 'Loan', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'credit-analyzer', label: 'Credit', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'emi-calculator', label: 'EMI', icon: <Calculator className="w-5 h-5" /> },
    { id: 'ai-tips', label: 'AI Tips', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
              isActive ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`p-1 rounded-lg ${isActive ? 'bg-sky-500/15' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
