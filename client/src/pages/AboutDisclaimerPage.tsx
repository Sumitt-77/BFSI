import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Disclaimer } from '../components/ui/Disclaimer';
import { useToast } from '../components/ui/Toast';
import {
  ShieldAlert,
  Lock,
  Cpu,
  Trash2,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Scale,
} from 'lucide-react';

export const AboutDisclaimerPage: React.FC = () => {
  const { success } = useToast();
  const [dataWiped, setDataWiped] = useState(false);

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to purge all cached profiles and records from this browser?')) {
      localStorage.removeItem('finai_records_cache');
      localStorage.removeItem('finai_user_profile');
      setDataWiped(true);
      success('Data Wiped', 'All locally cached financial information has been permanently purged.');
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Page Title */}
      <div className="text-center space-y-2 pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Transparency & Consumer Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
          About FinAI & Compliance Guidelines
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Built according to Indian BFSI underwriting heuristics to promote financial literacy, responsible debt management, and borrower transparency.
        </p>
      </div>

      {/* Prominent Educational Notice */}
      <Disclaimer variant="card" />

      {/* Underwriting Heuristics & Methodology */}
      <GlassCard className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <Cpu className="w-5 h-5 text-sky-400" />
          <span>Algorithmic Methodology & Regulatory Grounding</span>
        </h3>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <h4 className="font-bold text-slate-100 text-sm">1. Fixed Obligation to Income Ratio (FOIR)</h4>
            <p>
              Under Reserve Bank of India (RBI) retail prudential lending guidelines, commercial banks calculate the borrower's total existing commitments plus the proposed new EMI against their net monthly take-home income. FinAI evaluates FOIR on a tiered income scale:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2 pt-1 font-mono">
              <li>Income &lt; ₹30,000: Permissible FOIR ceiling of 40%</li>
              <li>Income ₹30,000 - ₹1,00,000: Permissible FOIR ceiling of 50%</li>
              <li>Income &gt; ₹1,00,000: Permissible FOIR ceiling up to 60%</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <h4 className="font-bold text-slate-100 text-sm">2. Standard Reducing Balance EMI Formula</h4>
            <p>
              All EMI computations use standard reducing-balance actuarial mathematics:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-sky-300 text-center text-xs">
              EMI = [P × r × (1 + r)ⁿ] / [(1 + r)ⁿ - 1]
            </div>
            <p className="text-slate-400">
              Where <strong>P</strong> represents the principal, <strong>r</strong> represents the monthly interest rate (Annual % / 12 / 100), and <strong>n</strong> represents the tenure in calendar months. For 0% interest promotions, installment equals <strong>P / n</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <h4 className="font-bold text-slate-100 text-sm">3. Credit Bureau Soft Simulation</h4>
            <p>
              Official credit scores in India are exclusively managed by licensed credit information companies (CIBIL, Experian, Equifax, CRIF High Mark). FinAI’s Credit Score Analyzer performs a soft mathematical estimation of score percentile and utilization risk based on self-reported inputs without generating hard credit bureau inquiries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <h4 className="font-bold text-slate-100 text-sm">4. Anthropic Claude AI Guardrails</h4>
            <p>
              Claude 3.5 Sonnet operates behind an institutional prompt guardrail instructing the AI to provide transparent financial education, identify risk factors, and prepare negotiation questions. The AI is strictly barred from offering legal lending commitments or guaranteeing underwriting outcomes.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Privacy Notice (Conforming to Section 29) */}
      <GlassCard className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>Data Privacy, Storage & User Rights</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h5 className="font-bold text-slate-100">What We Collect</h5>
            <p className="text-slate-400 leading-relaxed">
              Only high-level financial parameters necessary for calculation: self-reported income, existing EMI sum, living expenses, age, and desired loan terms. We never collect Aadhaar numbers, PAN cards, or bank net-banking passwords.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h5 className="font-bold text-slate-100">Why It Is Collected</h5>
            <p className="text-slate-400 leading-relaxed">
              Exclusively to calculate real-time FOIR, DTI ratios, and amortization schedules for educational financial planning.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h5 className="font-bold text-slate-100">Where It Is Stored</h5>
            <p className="text-slate-400 leading-relaxed">
              Your profile is stored locally in your browser’s localStorage. If Google Sheets integration is enabled on the server, saved assessments are transmitted securely over HTTPS to your configured spreadsheet.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <h5 className="font-bold text-slate-100">How to Request Deletion</h5>
            <p className="text-slate-400 leading-relaxed">
              You maintain total data sovereignty. You can instantly wipe all local data using the one-click purge action below, or delete rows directly from your Google Sheet.
            </p>
          </div>
        </div>

        {/* Data Wipe Action */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="text-sm font-bold text-white">Purge Local Financial Data</h5>
            <p className="text-xs text-slate-400">Permanently clears your cached profile and calculations from this device.</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAllData}
            iconLeft={<Trash2 className="w-4 h-4" />}
          >
            {dataWiped ? 'Data Purged' : 'Purge All Local Data'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
