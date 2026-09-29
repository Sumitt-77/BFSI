export type EmploymentType =
  | 'Salaried'
  | 'Self-employed'
  | 'Business owner'
  | 'Freelancer'
  | 'Other';

export type EligibilityStatus =
  | 'High estimated eligibility'
  | 'Moderate estimated eligibility'
  | 'Low estimated eligibility';

export type RiskLevel = 'Low' | 'Low to Moderate' | 'Moderate' | 'Moderate to High' | 'High';

export type CreditHealthCategory =
  | 'Excellent'
  | 'Good'
  | 'Fair'
  | 'Poor'
  | 'Very Poor';

export interface LoanEligibilityInput {
  age: number;
  employmentType: EmploymentType;
  employmentDurationYears: number;
  monthlyIncome: number;
  otherMonthlyIncome?: number;
  existingEmi: number;
  monthlyExpenses: number;
  existingLoanAmount?: number;
  creditScore: number;
  activeLoansCount: number;
  creditCardsCount: number;
  requestedLoanAmount: number;
  preferredTenureMonths: number;
  annualInterestRate: number;
}

export interface EligibilityFactor {
  factor: string;
  status: 'positive' | 'neutral' | 'negative';
  description: string;
  impactScore: number;
}

export interface LoanEligibilityResult {
  eligibilityStatus: EligibilityStatus;
  riskCategory: RiskLevel;
  totalMonthlyIncome: number;
  totalMonthlyObligations: number;
  netDisposableIncome: number;
  dtiRatio: number;
  foir: number;
  maxEligibleLoanAmount: number;
  minEligibleLoanAmount: number;
  estimatedAffordableEmi: number;
  requestedLoanAffordable: boolean;
  requestedLoanEmi: number;
  factors: EligibilityFactor[];
  improvementSuggestions: string[];
  disclaimer: string;
}

export interface CreditScoreInput {
  creditScore: number;
  paymentHistoryPercentage?: number;
  creditUtilizationPercentage?: number;
  activeAccountsCount?: number;
  creditAgeYears?: number;
  recentInquiriesCount?: number;
  existingDebtAmount?: number;
  totalCreditLimit?: number;
}

export interface CreditScoreResult {
  creditScore: number;
  creditHealthCategory: CreditHealthCategory;
  scorePercentile: number;
  utilizationPercentage: number;
  paymentHistoryRating: 'Excellent' | 'Good' | 'Average' | 'Needs Attention';
  creditAgeRating: 'Mature' | 'Moderate' | 'New';
  debtBurdenCategory: 'Low' | 'Manageable' | 'Elevated' | 'High';
  riskIndicators: string[];
  positiveHighlights: string[];
  improvementSuggestions: string[];
  disclaimer: string;
}

export interface EmiCalculationInput {
  principalAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
}

export interface AmortizationScheduleItem {
  month: number;
  beginningBalance: number;
  emi: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export interface EmiCalculationResult {
  monthlyEmi: number;
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  principalAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  principalPercentage: number;
  interestPercentage: number;
  yearlyAmortization: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
  monthlyAmortizationSample: AmortizationScheduleItem[];
}

export interface AiFinancialAdviceInput {
  monthlyIncome: number;
  otherIncome?: number;
  monthlyExpenses: number;
  existingEmi: number;
  creditScore: number;
  requestedLoanAmount?: number;
  loanTenureMonths?: number;
  employmentType: EmploymentType;
  dtiRatio?: number;
  notes?: string;
}

export interface AiFinancialAdviceResult {
  summary: string;
  riskLevel: RiskLevel;
  loanInsights: string[];
  creditInsights: string[];
  spendingObservations: string[];
  financialTips: string[];
  warnings: string[];
  questionsForLenders: string[];
  disclaimer: string;
  generatedAt: string;
}

export interface FinancialRecord {
  id: string;
  timestamp: string;
  name?: string;
  age: number;
  employmentType: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingEmi: number;
  creditScore: number;
  loanAmount: number;
  loanTenure: number;
  estimatedEligibility: string;
  dti: number;
  estimatedRisk: string;
  aiSummary?: string;
}

export interface UserFinancialProfile {
  name: string;
  age: number;
  employmentType: EmploymentType;
  employmentDurationYears: number;
  monthlyIncome: number;
  otherMonthlyIncome: number;
  monthlyExpenses: number;
  existingEmi: number;
  existingLoanAmount: number;
  creditScore: number;
  activeLoansCount: number;
  creditCardsCount: number;
  preferredTenureMonths: number;
  annualInterestRate: number;
  lastUpdated: string;
}

export type PageId =
  | 'landing'
  | 'dashboard'
  | 'loan-eligibility'
  | 'credit-analyzer'
  | 'emi-calculator'
  | 'ai-tips'
  | 'profile'
  | 'history'
  | 'about';
