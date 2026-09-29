import React, { useState } from 'react';
import { CreditScoreInput, CreditScoreResult, UserFinancialProfile } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Disclaimer } from '../components/ui/Disclaimer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { ApiService } from '../services/api';
import { formatINR } from '../utils/currency';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Info,
  Activity,
  Gauge,
} from 'lucide-react';

export interface CreditAnalyzerPageProps {
  userProfile: UserFinancialProfile;
  onProfileUpdate?: (score: number) => void;
}

export const CreditAnalyzerPage: React.FC<CreditAnalyzerPageProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  const { success, error: toastError } = useToast();

  const [inputs, setInputs] = useState<CreditScoreInput>({
    creditScore: userProfile.creditScore || 750,
    paymentHistoryPercentage: 96,
    creditUtilizationPercentage: 24,
    activeAccountsCount: userProfile.activeLoansCount + userProfile.creditCardsCount || 3,
    creditAgeYears: userProfile.employmentDurationYears || 4,
    recentInquiriesCount: 1,
    existingDebtAmount: userProfile.existingLoanAmount || 0,
    totalCreditLimit: 300000,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreditScoreResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputs.creditScore < 300 || inputs.creditScore > 900) {
      toastError('Invalid Score', 'Credit score must be between 300 and 900.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await ApiService.analyzeCreditScore(inputs);
      setResult(data);
      if (onProfileUpdate) {
        onProfileUpdate(inputs.creditScore);
      }
      success('Analysis Completed', 'Estimated Credit Health Analysis successfully generated.');
    } catch (err: any) {
      toastError('Analysis Failed', err.message || 'Error evaluating credit profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputs({
      creditScore: 750,
      paymentHistoryPercentage: 95,
      creditUtilizationPercentage: 25,
      activeAccountsCount: 3,
      creditAgeYears: 4,
      recentInquiriesCount: 1,
      existingDebtAmount: 50000,
      totalCreditLimit: 250000,
    });
    setResult(null);
  };

  // Helper for gauge rotation degrees
  const getGaugeAngle = (score: number) => {
    const min = 300;
    const max = 900;
    const pct = Math.min(1, Math.max(0, (score - min) / (max - min)));
    return pct * 180 - 90; // -90deg to +90deg
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Credit Score Analyzer
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Soft Simulation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Clearly Labeled: <strong className="text-sky-300">Estimated Credit Health Analysis</strong> (Zero Bureau Impact)
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Values
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <GlassCard className="space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Gauge className="w-5 h-5 text-emerald-400" />
                <span>Score & Core Metrics</span>
              </h3>

              {/* Credit Score Slider */}
              <Slider
                label="Self-Reported Credit Score"
                min={300}
                max={900}
                step={5}
                value={inputs.creditScore}
                formatValue={(v) => `${v} / 900`}
                minLabel="300 (Poor)"
                maxLabel="900 (Excellent)"
                onChange={(v) => setInputs((prev) => ({ ...prev, creditScore: v }))}
              />

              {/* Credit Utilization Slider */}
              <Slider
                label="Revolving Credit Card Utilization"
                min={0}
                max={100}
                step={1}
                value={inputs.creditUtilizationPercentage || 25}
                formatValue={(v) => `${v}%`}
                minLabel="0% (Ideal < 30%)"
                maxLabel="100% (High Risk)"
                onChange={(v) => setInputs((prev) => ({ ...prev, creditUtilizationPercentage: v }))}
              />

              {/* On-Time Payment History Slider */}
              <Slider
                label="On-Time Payment History Rate"
                min={50}
                max={100}
                step={1}
                value={inputs.paymentHistoryPercentage || 95}
                formatValue={(v) => `${v}%`}
                minLabel="50%"
                maxLabel="100% (Flawless)"
                onChange={(v) => setInputs((prev) => ({ ...prev, paymentHistoryPercentage: v }))}
              />
            </GlassCard>

            <GlassCard className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Activity className="w-5 h-5 text-sky-400" />
                <span>Account Vintage & Debt Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Oldest Credit Account Vintage"
                  type="number"
                  min={0}
                  max={40}
                  suffixText="Years"
                  value={inputs.creditAgeYears || 0}
                  onChange={(e) => setInputs((prev) => ({ ...prev, creditAgeYears: Number(e.target.value) }))}
                />

                <Input
                  label="Recent Hard Inquiries (Past 6 Mos)"
                  type="number"
                  min={0}
                  max={20}
                  suffixText="Inquiries"
                  value={inputs.recentInquiriesCount || 0}
                  onChange={(e) => setInputs((prev) => ({ ...prev, recentInquiriesCount: Number(e.target.value) }))}
                />

                <Input
                  label="Total Outstanding Revolving Debt"
                  type="number"
                  prefixText="₹"
                  value={inputs.existingDebtAmount || 0}
                  onChange={(e) => setInputs((prev) => ({ ...prev, existingDebtAmount: Number(e.target.value) }))}
                />

                <Input
                  label="Total Credit Card Limit"
                  type="number"
                  prefixText="₹"
                  value={inputs.totalCreditLimit || 100000}
                  onChange={(e) => setInputs((prev) => ({ ...prev, totalCreditLimit: Number(e.target.value) }))}
                />
              </div>
            </GlassCard>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              iconRight={<ShieldCheck className="w-5 h-5" />}
            >
              Run Credit Health Diagnostics
            </Button>
          </form>
        </div>

        {/* Results Column (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {isLoading ? (
            <GlassCard>
              <LoadingSpinner
                size="lg"
                text="Analyzing Credit Health Parameters..."
                subtext="Evaluating score percentile, limit utilization, and risk indicators..."
              />
            </GlassCard>
          ) : result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Visual Gauge Card */}
              <GlassCard
                glow={result.creditHealthCategory === 'Excellent' ? 'emerald' : result.creditHealthCategory === 'Good' ? 'cyan' : 'amber'}
                className="space-y-6 text-center"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Credit Health Analysis
                  </span>
                  <h3 className="text-3xl font-black text-white mt-1">
                    {result.creditHealthCategory}
                  </h3>
                  <p className="text-xs text-sky-400 font-medium">
                    Estimated in the top {100 - result.scorePercentile}% of Indian retail borrowers
                  </p>
                </div>

                {/* Semicircle Gauge Visual */}
                <div className="relative w-48 h-24 mx-auto overflow-hidden">
                  <div className="w-48 h-48 rounded-full border-[14px] border-slate-800 border-t-emerald-500 border-r-sky-500 border-b-transparent border-l-rose-500 transform -rotate-45" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                    <span className="text-3xl font-black text-white font-mono">{result.creditScore}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Score Benchmark</span>
                  </div>
                </div>

                {/* Score Bar Tiers */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold pt-2">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <span>300-649</span>
                    <span className="block text-[9px] text-slate-400">Subprime</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span>650-699</span>
                    <span className="block text-[9px] text-slate-400">Fair</span>
                  </div>
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <span>700-749</span>
                    <span className="block text-[9px] text-slate-400">Good</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span>750-900</span>
                    <span className="block text-[9px] text-slate-400">Prime</span>
                  </div>
                </div>

                {/* Diagnostic Indicators */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Utilization Ratio</p>
                    <p className="text-sm font-bold text-slate-200 font-mono">{result.utilizationPercentage}%</p>
                    <ProgressBar
                      value={result.utilizationPercentage}
                      variant={result.utilizationPercentage <= 30 ? 'emerald' : 'rose'}
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Payment Track</p>
                    <p className="text-sm font-bold text-slate-200">{result.paymentHistoryRating}</p>
                    <ProgressBar value={inputs.paymentHistoryPercentage || 95} variant="emerald" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Debt Burden</p>
                    <p className="text-sm font-bold text-slate-200">{result.debtBurdenCategory}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Credit Age</p>
                    <p className="text-sm font-bold text-slate-200">{result.creditAgeRating}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Highlights & Risk Indicators */}
              <GlassCard className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>Diagnostics Summary</span>
                </h4>

                {result.positiveHighlights.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Strengths</p>
                    {result.positiveHighlights.map((pos, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pos}</span>
                      </div>
                    ))}
                  </div>
                )}

                {result.riskIndicators.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Vulnerabilities</p>
                    {result.riskIndicators.map((risk, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{risk}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Improvement Roadmap */}
              {result.improvementSuggestions.length > 0 && (
                <GlassCard className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>How to Enhance Your Credit Standing</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.improvementSuggestions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}
            </div>
          ) : (
            <GlassCard className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">Evaluate Your Credit Standing</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Fine-tune your credit score slider and payment discipline metrics to see your estimated bureau tier and customized improvement roadmap.
              </p>
            </GlassCard>
          )}

          {/* Compliance Disclaimer */}
          <Disclaimer
            variant="card"
            customText="This Estimated Credit Health Analysis is an educational diagnostic tool. It does not pull data from or generate an official credit score from credit rating bureaus such as CIBIL, Experian, Equifax, or CRIF High Mark."
          />
        </div>
      </div>
    </div>
  );
};
