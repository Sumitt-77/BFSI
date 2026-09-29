import React, { useState } from 'react';
import {
  LoanEligibilityInput,
  LoanEligibilityResult,
  EmploymentType,
  UserFinancialProfile,
  FinancialRecord,
} from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Slider } from '../components/ui/Slider';
import { RiskBadge } from '../components/ui/RiskBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Disclaimer } from '../components/ui/Disclaimer';
import { useToast } from '../components/ui/Toast';
import { ApiService } from '../services/api';
import { formatINR, formatLakhsCrores } from '../utils/currency';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Layers,
} from 'lucide-react';

export interface LoanEligibilityPageProps {
  userProfile: UserFinancialProfile;
  onRecordSaved: (record: FinancialRecord) => void;
}

export const LoanEligibilityPage: React.FC<LoanEligibilityPageProps> = ({
  userProfile,
  onRecordSaved,
}) => {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState<LoanEligibilityInput>({
    age: userProfile.age,
    employmentType: userProfile.employmentType,
    employmentDurationYears: userProfile.employmentDurationYears,
    monthlyIncome: userProfile.monthlyIncome,
    otherMonthlyIncome: userProfile.otherMonthlyIncome,
    existingEmi: userProfile.existingEmi,
    monthlyExpenses: userProfile.monthlyExpenses,
    existingLoanAmount: userProfile.existingLoanAmount,
    creditScore: userProfile.creditScore,
    activeLoansCount: userProfile.activeLoansCount,
    creditCardsCount: userProfile.creditCardsCount,
    requestedLoanAmount: 2000000,
    preferredTenureMonths: userProfile.preferredTenureMonths || 60,
    annualInterestRate: userProfile.annualInterestRate || 9.5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LoanEligibilityResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Form field changes
  const handleChange = (field: keyof LoanEligibilityInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Client validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || formData.age < 18 || formData.age > 80) {
      newErrors.age = 'Age must be between 18 and 80 years.';
    }
    if (formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome = 'Monthly income must be greater than zero.';
    }
    if (formData.existingEmi < 0) {
      newErrors.existingEmi = 'Existing EMI cannot be negative.';
    }
    if (formData.monthlyExpenses < 0) {
      newErrors.monthlyExpenses = 'Monthly expenses cannot be negative.';
    }
    if (formData.creditScore < 300 || formData.creditScore > 900) {
      newErrors.creditScore = 'Credit score must be between 300 and 900.';
    }
    if (formData.requestedLoanAmount <= 0) {
      newErrors.requestedLoanAmount = 'Requested loan amount must be positive.';
    }
    if (formData.preferredTenureMonths < 1 || formData.preferredTenureMonths > 360) {
      newErrors.preferredTenureMonths = 'Tenure must be between 1 and 360 months.';
    }
    if (formData.annualInterestRate < 0) {
      newErrors.annualInterestRate = 'Interest rate cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toastError('Validation Failed', 'Please correct the highlighted inputs before analyzing.');
      return;
    }

    setIsLoading(true);
    setHasSaved(false);

    try {
      const evaluation = await ApiService.analyzeLoanEligibility(formData);
      setResult(evaluation);

      // Trigger celebratory confetti on high eligibility!
      if (evaluation.eligibilityStatus.includes('High')) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0ea5e9', '#10b981', '#6366f1', '#fbbf24'],
        });
      }
    } catch (err: any) {
      toastError('Analysis Failed', err.message || 'Error communicating with analysis service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToRecords = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const saved = await ApiService.saveRecord({
        name: userProfile.name,
        age: formData.age,
        employmentType: formData.employmentType,
        monthlyIncome: formData.monthlyIncome,
        monthlyExpenses: formData.monthlyExpenses,
        existingEmi: formData.existingEmi,
        creditScore: formData.creditScore,
        loanAmount: formData.requestedLoanAmount,
        loanTenure: formData.preferredTenureMonths,
        estimatedEligibility: result.eligibilityStatus,
        dti: result.dtiRatio,
        estimatedRisk: result.riskCategory,
        aiSummary: `Estimated borrowing capacity up to ${formatINR(result.maxEligibleLoanAmount)} with ${result.dtiRatio}% DTI.`,
      });
      onRecordSaved(saved);
      setHasSaved(true);
      success('Record Saved', 'Analysis record added to history and synchronized with Google Sheets.');
    } catch (err: any) {
      toastError('Save Error', err.message || 'Could not save record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: 30,
      employmentType: 'Salaried',
      employmentDurationYears: 3,
      monthlyIncome: 75000,
      otherMonthlyIncome: 0,
      existingEmi: 10000,
      monthlyExpenses: 25000,
      existingLoanAmount: 0,
      creditScore: 750,
      activeLoansCount: 1,
      creditCardsCount: 1,
      requestedLoanAmount: 1500000,
      preferredTenureMonths: 60,
      annualInterestRate: 9.5,
    });
    setErrors({});
    setResult(null);
    setHasSaved(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Loan Eligibility Checker
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              FOIR Algorithm
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate your institutional borrowing eligibility based on debt-to-income benchmarks.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Form
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Section 1: Personal & Employment */}
            <GlassCard className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </span>
                <span>Personal & Employment Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Age"
                  type="number"
                  required
                  min={18}
                  max={80}
                  value={formData.age}
                  error={errors.age}
                  suffixText="Yrs"
                  onChange={(e) => handleChange('age', Number(e.target.value))}
                />

                <Select
                  label="Employment Type"
                  value={formData.employmentType}
                  options={[
                    { label: 'Salaried', value: 'Salaried' },
                    { label: 'Self-employed', value: 'Self-employed' },
                    { label: 'Business owner', value: 'Business owner' },
                    { label: 'Freelancer', value: 'Freelancer' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  onChange={(e) => handleChange('employmentType', e.target.value as EmploymentType)}
                />

                <Input
                  label="Work Vintage"
                  type="number"
                  min={0}
                  max={50}
                  value={formData.employmentDurationYears}
                  suffixText="Yrs"
                  helperText="Years in current role/biz"
                  onChange={(e) => handleChange('employmentDurationYears', Number(e.target.value))}
                />
              </div>
            </GlassCard>

            {/* Section 2: Income & Existing Obligations */}
            <GlassCard className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                <span>Monthly Cash Flow & Debt Obligations</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Monthly Income"
                  type="number"
                  required
                  prefixText="₹"
                  value={formData.monthlyIncome}
                  error={errors.monthlyIncome}
                  helperText="Net in-hand take-home salary/earnings"
                  onChange={(e) => handleChange('monthlyIncome', Number(e.target.value))}
                />

                <Input
                  label="Other Monthly Income"
                  type="number"
                  prefixText="₹"
                  value={formData.otherMonthlyIncome || ''}
                  helperText="Rental, investments, dividends"
                  onChange={(e) => handleChange('otherMonthlyIncome', Number(e.target.value))}
                />

                <Input
                  label="Existing Monthly EMIs"
                  type="number"
                  required
                  prefixText="₹"
                  value={formData.existingEmi}
                  error={errors.existingEmi}
                  helperText="Total ongoing car, personal, or home EMIs"
                  onChange={(e) => handleChange('existingEmi', Number(e.target.value))}
                />

                <Input
                  label="Monthly Living Expenses"
                  type="number"
                  required
                  prefixText="₹"
                  value={formData.monthlyExpenses}
                  error={errors.monthlyExpenses}
                  helperText="Household, utilities, rents, grocery"
                  onChange={(e) => handleChange('monthlyExpenses', Number(e.target.value))}
                />
              </div>
            </GlassCard>

            {/* Section 3: Credit & Loan Requirement */}
            <GlassCard className="space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                  3
                </span>
                <span>Credit Health & Loan Requirement</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Credit Score (CIBIL/Experian)"
                  type="number"
                  required
                  min={300}
                  max={900}
                  value={formData.creditScore}
                  error={errors.creditScore}
                  helperText="Benchmark 300 - 900"
                  onChange={(e) => handleChange('creditScore', Number(e.target.value))}
                />

                <Input
                  label="Active Loans Count"
                  type="number"
                  min={0}
                  value={formData.activeLoansCount}
                  onChange={(e) => handleChange('activeLoansCount', Number(e.target.value))}
                />

                <Input
                  label="Active Credit Cards"
                  type="number"
                  min={0}
                  value={formData.creditCardsCount}
                  onChange={(e) => handleChange('creditCardsCount', Number(e.target.value))}
                />
              </div>

              {/* Sliders for Loan Amount, Tenure, Rate */}
              <div className="space-y-4 pt-2">
                <Slider
                  label="Requested Loan Amount"
                  min={50000}
                  max={20000000}
                  step={50000}
                  value={formData.requestedLoanAmount}
                  formatValue={(v) => formatINR(v)}
                  minLabel="₹50k"
                  maxLabel="₹2 Cr"
                  onChange={(v) => handleChange('requestedLoanAmount', v)}
                />

                <Slider
                  label="Preferred Tenure"
                  min={12}
                  max={240}
                  step={6}
                  value={formData.preferredTenureMonths}
                  formatValue={(v) => `${v} Months (${(v / 12).toFixed(1)} Yrs)`}
                  minLabel="1 Yr"
                  maxLabel="20 Yrs"
                  onChange={(v) => handleChange('preferredTenureMonths', v)}
                />

                <Slider
                  label="Expected Interest Rate (p.a.)"
                  min={6.5}
                  max={24}
                  step={0.25}
                  value={formData.annualInterestRate}
                  formatValue={(v) => `${v}% p.a.`}
                  minLabel="6.5%"
                  maxLabel="24%"
                  onChange={(v) => handleChange('annualInterestRate', v)}
                />
              </div>
            </GlassCard>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              iconRight={<TrendingUp className="w-5 h-5" />}
            >
              Analyze Loan Eligibility
            </Button>
          </form>
        </div>

        {/* Right Output Results Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {isLoading ? (
            <GlassCard>
              <LoadingSpinner
                size="lg"
                text="Evaluating borrowing capacity..."
                subtext="Calculating DTI ratios, FOIR allocation, and loan band models..."
              />
            </GlassCard>
          ) : result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Main Result Card */}
              <GlassCard
                glow={result.eligibilityStatus.includes('High') ? 'emerald' : result.eligibilityStatus.includes('Moderate') ? 'cyan' : 'amber'}
                className="space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Eligibility Verdict
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {result.eligibilityStatus}
                    </h3>
                  </div>
                  <RiskBadge level={result.riskCategory} size="md" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Eligible Loan Range</p>
                    <p className="text-base font-bold text-sky-400 font-mono mt-0.5">
                      {formatLakhsCrores(result.minEligibleLoanAmount)} - {formatLakhsCrores(result.maxEligibleLoanAmount)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Affordable EMI Cap</p>
                    <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                      {formatINR(result.estimatedAffordableEmi)}/mo
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Current DTI</p>
                    <p className="text-base font-bold text-amber-400 font-mono mt-0.5">
                      {result.dtiRatio}%
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Requested EMI</p>
                    <p className="text-base font-bold text-slate-200 font-mono mt-0.5">
                      {formatINR(result.requestedLoanEmi)}/mo
                    </p>
                  </div>
                </div>

                {/* Save Record Action */}
                <div className="pt-2">
                  <Button
                    variant={hasSaved ? 'secondary' : 'success'}
                    size="md"
                    className="w-full"
                    isLoading={isSaving}
                    disabled={hasSaved}
                    onClick={handleSaveToRecords}
                    iconLeft={<BookmarkCheck className="w-4 h-4" />}
                  >
                    {hasSaved ? 'Saved to Google Sheets & History' : 'Save Record to History & Google Sheets'}
                  </Button>
                </div>
              </GlassCard>

              {/* Factors Evaluation Breakdown */}
              <GlassCard className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Key Factors Influencing Your Result</span>
                </h4>
                <div className="space-y-2.5">
                  {result.factors.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3"
                    >
                      {f.status === 'positive' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : f.status === 'negative' ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-xs font-bold text-slate-200">{f.factor}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Improvement Suggestions */}
              {result.improvementSuggestions.length > 0 && (
                <GlassCard className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Actionable Recommendations</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.improvementSuggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span className="leading-relaxed">{sug}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}
            </div>
          ) : (
            <GlassCard className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">Ready to Evaluate Your Capacity</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Adjust your income, liabilities, and desired loan terms on the left, then click <strong>Analyze Loan Eligibility</strong> to generate your custom borrowing verdict.
              </p>
            </GlassCard>
          )}

          {/* Compliance Disclaimer */}
          <Disclaimer variant="card" />
        </div>
      </div>
    </div>
  );
};
