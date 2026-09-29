import React, { useState } from 'react';
import { UserFinancialProfile, EmploymentType } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import { ApiService } from '../services/api';
import { formatINR } from '../utils/currency';
import {
  User,
  Save,
  CheckCircle2,
  Shield,
  Briefcase,
  Wallet,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

export interface FinancialProfilePageProps {
  userProfile: UserFinancialProfile;
  onProfileUpdate: (updated: UserFinancialProfile) => void;
}

export const FinancialProfilePage: React.FC<FinancialProfilePageProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  const { success, error: toastError } = useToast();
  const [formData, setFormData] = useState<UserFinancialProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof UserFinancialProfile, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toastError('Validation Failed', 'Please provide a profile name.');
      return;
    }
    if (formData.monthlyIncome <= 0) {
      toastError('Validation Failed', 'Monthly income must be greater than zero.');
      return;
    }
    if (formData.creditScore < 300 || formData.creditScore > 900) {
      toastError('Validation Failed', 'Credit score must be between 300 and 900.');
      return;
    }

    const updated: UserFinancialProfile = {
      ...formData,
      lastUpdated: new Date().toISOString(),
    };

    ApiService.saveUserProfile(updated);
    onProfileUpdate(updated);
    setIsSaved(true);
    success('Profile Synchronized', 'Your default financial parameters have been updated across all calculators.');
  };

  const handleResetDefaults = () => {
    const defaults = ApiService.getUserProfile();
    setFormData(defaults);
    setIsSaved(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Financial Profile
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Auto-Fill Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your default borrower baseline to auto-populate the eligibility checker, credit diagnostic, and EMI tools.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleResetDefaults}
          iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset to Defaults
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Profile */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <User className="w-5 h-5 text-sky-400" />
            <span>Borrower Identity & Age</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name / Display Label"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              label="Age"
              type="number"
              min={18}
              max={80}
              required
              suffixText="Years"
              value={formData.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
            />
          </div>
        </GlassCard>

        {/* Section 2: Employment */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span>Employment & Track Record</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Employment Nature"
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
              label="Years at Current Company / Business"
              type="number"
              min={0}
              suffixText="Years"
              value={formData.employmentDurationYears}
              onChange={(e) => handleChange('employmentDurationYears', Number(e.target.value))}
            />
          </div>
        </GlassCard>

        {/* Section 3: Incomes & Living Expenses */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            <span>Monthly Inflow & Living Expenses</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Monthly Take-Home Salary"
              type="number"
              required
              prefixText="₹"
              value={formData.monthlyIncome}
              onChange={(e) => handleChange('monthlyIncome', Number(e.target.value))}
            />
            <Input
              label="Other Monthly Inflow"
              type="number"
              prefixText="₹"
              value={formData.otherMonthlyIncome || ''}
              onChange={(e) => handleChange('otherMonthlyIncome', Number(e.target.value))}
            />
            <Input
              label="Monthly Household Living Costs"
              type="number"
              required
              prefixText="₹"
              value={formData.monthlyExpenses}
              onChange={(e) => handleChange('monthlyExpenses', Number(e.target.value))}
            />
          </div>
        </GlassCard>

        {/* Section 4: Existing Liabilities & Credit Score */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>Existing Debt & Credit Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Existing Total Monthly EMIs"
              type="number"
              required
              prefixText="₹"
              value={formData.existingEmi}
              onChange={(e) => handleChange('existingEmi', Number(e.target.value))}
            />
            <Input
              label="Total Outstanding Loan Balances"
              type="number"
              prefixText="₹"
              value={formData.existingLoanAmount || ''}
              onChange={(e) => handleChange('existingLoanAmount', Number(e.target.value))}
            />
            <Input
              label="Credit Bureau Score (CIBIL/Experian)"
              type="number"
              required
              min={300}
              max={900}
              value={formData.creditScore}
              onChange={(e) => handleChange('creditScore', Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Number of Active Loan Accounts"
              type="number"
              min={0}
              value={formData.activeLoansCount}
              onChange={(e) => handleChange('activeLoansCount', Number(e.target.value))}
            />
            <Input
              label="Number of Active Credit Cards"
              type="number"
              min={0}
              value={formData.creditCardsCount}
              onChange={(e) => handleChange('creditCardsCount', Number(e.target.value))}
            />
          </div>
        </GlassCard>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
            iconLeft={<Save className="w-4 h-4" />}
          >
            Save Financial Profile
          </Button>

          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved locally & ready for tools!</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
