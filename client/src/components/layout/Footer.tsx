import React from 'react';
import { PageId } from '../../types';
import { ShieldCheck, Lock, Sparkles, Heart } from 'lucide-react';

export interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-white/10 mt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-600 to-emerald-400 p-0.5 shadow-glow flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-['Outfit']">FinAI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven BFSI intelligence designed to empower borrowers with transparent loan eligibility calculations, credit health diagnostics, and prudent debt planning.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero credentials exposed in browser</span>
            </div>
          </div>

          {/* Col 2: Core Financial Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Financial Tools</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('loan-eligibility')} className="hover:text-sky-400 transition-colors">
                  Loan Eligibility Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('credit-analyzer')} className="hover:text-sky-400 transition-colors">
                  Credit Score Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('emi-calculator')} className="hover:text-sky-400 transition-colors">
                  EMI & Amortization Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-tips')} className="hover:text-sky-400 transition-colors">
                  AI Financial Advisor (Claude)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform & Data</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-sky-400 transition-colors">
                  Overview Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-sky-400 transition-colors">
                  Calculation History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-sky-400 transition-colors">
                  Financial Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-sky-400 transition-colors">
                  Security & Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Compliance & Disclaimer */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Compliance & Privacy</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              FinAI is an educational financial decision-support system. We do not issue loans, sanction credit, or act as an official credit bureau (CIBIL/Experian).
            </p>
            <button
              onClick={() => onNavigate('about')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4"
            >
              Read full compliance notice →
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} FinAI Platform. Built for intelligent, transparent Indian BFSI decisions.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for financial wellness
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
