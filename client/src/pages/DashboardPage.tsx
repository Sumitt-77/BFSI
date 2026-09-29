import React from 'react';
import { PageId, UserFinancialProfile, FinancialRecord } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { FinancialMetricCard } from '../components/ui/FinancialMetricCard';
import { RiskBadge } from '../components/ui/RiskBadge';
import { ChartCard } from '../components/ui/ChartCard';
import { Disclaimer } from '../components/ui/Disclaimer';
import { formatINR } from '../utils/currency';
import { calculateLocalEligibility } from '../utils/calculations';
import {
  TrendingUp,
  ShieldCheck,
  Calculator,
  Sparkles,
  ArrowUpRight,
  Wallet,
  CreditCard,
  PieChart as PieChartIcon,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export interface DashboardPageProps {
  userProfile: UserFinancialProfile;
  records: FinancialRecord[];
  onNavigate: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userProfile,
  records,
  onNavigate,
}) => {
  // Live calculation based on user profile
  const eligibility = calculateLocalEligibility({
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
    requestedLoanAmount: 1500000,
    preferredTenureMonths: userProfile.preferredTenureMonths || 60,
    annualInterestRate: userProfile.annualInterestRate || 9.5,
  });

  const totalIncome = userProfile.monthlyIncome + (userProfile.otherMonthlyIncome || 0);
  const netSurplus = Math.max(0, totalIncome - userProfile.existingEmi - userProfile.monthlyExpenses);

  // 1. Income vs Expenses Bar Chart Data
  const cashFlowData = [
    { name: 'Income', amount: totalIncome, fill: '#0ea5e9' },
    { name: 'Living Expenses', amount: userProfile.monthlyExpenses, fill: '#f59e0b' },
    { name: 'Existing EMI', amount: userProfile.existingEmi, fill: '#ec4899' },
    { name: 'Free Surplus', amount: netSurplus, fill: '#10b981' },
  ];

  // 2. DTI Donut Chart Data
  const dtiData = [
    { name: 'Existing Debt Obligations', value: eligibility.dtiRatio, color: '#f43f5e' },
    { name: 'Remaining Safe Margin', value: Math.max(0, 100 - eligibility.dtiRatio), color: '#10b981' },
  ];

  // 3. Credit Health Radar Chart Data
  const creditRadarData = [
    { subject: 'Credit Score', score: Math.round((userProfile.creditScore / 900) * 100) },
    { subject: 'Payment History', score: 95 },
    { subject: 'Credit Limit Cushion', score: 75 }, // inverse of utilization
    { subject: 'Vintage Stability', score: Math.min(100, userProfile.employmentDurationYears * 20) },
    { subject: 'Debt Capacity', score: Math.max(10, 100 - eligibility.dtiRatio) },
  ];

  // 4. Loan Affordability Line Chart Data (varying tenure 1 to 7 years)
  const affordabilityData = [
    { tenure: '1 Yr', maxLoan: Math.round(eligibility.estimatedAffordableEmi * 11.5) },
    { tenure: '2 Yrs', maxLoan: Math.round(eligibility.estimatedAffordableEmi * 21.8) },
    { tenure: '3 Yrs', maxLoan: Math.round(eligibility.estimatedAffordableEmi * 31.2) },
    { tenure: '5 Yrs', maxLoan: Math.round(eligibility.maxEligibleLoanAmount) },
    { tenure: '7 Yrs', maxLoan: Math.round(eligibility.maxEligibleLoanAmount * 1.28) },
  ];

  const COLORS = ['#f43f5e', '#10b981', '#0ea5e9', '#6366f1'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Financial Overview
            </h1>
            <RiskBadge level={eligibility.riskCategory} />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time borrowing readiness and financial health for <span className="text-sky-300 font-semibold">{userProfile.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('profile')}
            iconLeft={<Layers className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('loan-eligibility')}
            iconLeft={<TrendingUp className="w-3.5 h-3.5" />}
          >
            New Loan Assessment
          </Button>
        </div>
      </div>

      {/* KPI Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          title="Estimated Eligibility"
          value={formatINR(eligibility.maxEligibleLoanAmount)}
          subtitle={`Range: ${formatINR(eligibility.minEligibleLoanAmount)} - ${formatINR(eligibility.maxEligibleLoanAmount)}`}
          icon={<TrendingUp className="w-5 h-5 text-sky-400" />}
          variant="cyan"
          trend={{ value: eligibility.eligibilityStatus.replace(' estimated eligibility', ''), isPositive: eligibility.eligibilityStatus.includes('High') }}
        />

        <FinancialMetricCard
          title="Estimated Credit Health"
          value={`${userProfile.creditScore} / 900`}
          subtitle="Prime Borrower Category"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          variant="emerald"
          trend={{ value: 'Top 15% in India', isPositive: true }}
        />

        <FinancialMetricCard
          title="Debt-to-Income (DTI)"
          value={`${eligibility.dtiRatio}%`}
          subtitle={`Permissible FOIR ceiling: ${eligibility.foir}%`}
          icon={<CreditCard className="w-5 h-5 text-amber-400" />}
          variant={eligibility.dtiRatio <= 30 ? 'emerald' : 'amber'}
          trend={{ value: eligibility.dtiRatio <= 30 ? 'Low Risk DTI' : 'Moderate Debt', isPositive: eligibility.dtiRatio <= 30 }}
        />

        <FinancialMetricCard
          title="Net Monthly Surplus"
          value={formatINR(netSurplus)}
          subtitle={`Total Income: ${formatINR(totalIncome)}`}
          icon={<Wallet className="w-5 h-5 text-purple-400" />}
          variant="purple"
          trend={{ value: `${Math.round((netSurplus / Math.max(1, totalIncome)) * 100)}% savings rate`, isPositive: true }}
        />
      </div>

      {/* Charts Grid: 4 Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Income vs Expenses & Surplus */}
        <ChartCard
          title="Monthly Cash Flow Allocation"
          subtitle="Monthly Income vs Living Costs, Ongoing Debt, and Net Surplus (INR)"
          action={
            <span className="text-xs text-slate-400 font-mono">
              Surplus: <strong className="text-emerald-400">{formatINR(netSurplus)}</strong>
            </span>
          }
        >
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [formatINR(Number(value)), 'Amount']}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {cashFlowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: DTI Ratio Breakdown */}
        <ChartCard
          title="Debt-to-Income (DTI) & Safe Margin"
          subtitle="Proportion of gross earnings committed to fixed debt obligations"
          action={
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              DTI: {eligibility.dtiRatio}%
            </span>
          }
        >
          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dtiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dtiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3: Credit Health Multi-Vector Radar */}
        <ChartCard
          title="Credit Health Vector Diagnostics"
          subtitle="Multi-factor evaluation across payment track record, limits, and vintage"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('credit-analyzer')}
              iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Analyze Credit
            </Button>
          }
        >
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={creditRadarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Radar
                  name="Health Vector"
                  dataKey="score"
                  stroke="#38bdf8"
                  fill="#0ea5e9"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 4: Loan Affordability Curve by Tenure */}
        <ChartCard
          title="Max Eligible Loan by Tenure"
          subtitle={`How extending loan tenure scales maximum permissible loan sanction (at ₹${eligibility.estimatedAffordableEmi.toLocaleString('en-IN')}/mo EMI cap)`}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('emi-calculator')}
              iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              EMI Tool
            </Button>
          }
        >
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={affordabilityData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="tenure" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `₹${v / 100000}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatINR(Number(val)), 'Max Sanction']}
                />
                <Line
                  type="monotone"
                  dataKey="maxLoan"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 8, fill: '#34d399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* "Why this result?" Explainability Section (conforming to Section 27) */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white">Why This Result? Detailed Underwriting Logic</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <p className="font-semibold text-slate-200">Income & Surplus Cushion</p>
            <p className="text-slate-400 leading-relaxed">
              Your monthly income of {formatINR(totalIncome)} against {formatINR(userProfile.monthlyExpenses)} living expenses leaves a net surplus of {formatINR(netSurplus)}.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <p className="font-semibold text-slate-200">Existing Obligations & DTI</p>
            <p className="text-slate-400 leading-relaxed">
              Current EMI commitments total {formatINR(userProfile.existingEmi)} ({eligibility.dtiRatio}% of income), well within the safe 45% banking threshold.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <p className="font-semibold text-slate-200">Credit Score Tier</p>
            <p className="text-slate-400 leading-relaxed">
              Score of {userProfile.creditScore} qualifies you for prime retail lending slabs (approx 8.5% - 9.5% p.a. for secured facilities).
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Educational Notice */}
      <Disclaimer variant="inline" />
    </div>
  );
};
