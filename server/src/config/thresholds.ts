/**
 * Configurable thresholds for financial rules engine
 * Lenders in India (RBI guidelines & standard BFSI banking practices) typically cap FOIR/DTI at 40-50% for lower incomes and 60-65% for high net worth individuals.
 */
export const FINANCIAL_THRESHOLDS = {
  // DTI (Debt-to-Income) ratio thresholds (%)
  dti: {
    excellentMax: 25,     // Under 25% is low risk
    moderateMax: 45,      // 25% - 45% is acceptable/moderate
    highRiskMin: 50,      // Above 50% is high risk for lenders
  },

  // Fixed Obligation to Income Ratio (FOIR) permissible allocation for new EMI
  // Max percentage of net income allowed for all EMIs combined
  foirAllowedPercentage: {
    lowIncome: 40,        // Income < 30k
    midIncome: 50,        // Income 30k - 1 Lakh
    highIncome: 60,       // Income > 1 Lakh
  },

  // Income tier cutoffs in INR
  incomeTiers: {
    lowIncomeMax: 30000,
    midIncomeMax: 100000,
  },

  // Credit Score Tiers (CIBIL/Experian standard 300 - 900)
  creditScore: {
    excellent: 750,       // 750 - 900
    good: 700,            // 700 - 749
    fair: 650,            // 650 - 699
    poor: 600,            // 600 - 649
    veryPoor: 300,        // 300 - 599
  },

  // Minimum & Maximum age for standard retail loans
  age: {
    min: 21,
    max: 65,
    idealMin: 23,
    idealMax: 58,
  },

  // Multiplier for estimated eligible loan amount based on net surplus income
  // (Approximate maximum loan size = Monthly Surplus * tenure factor)
  loanSurplusMultiplier: {
    salaried: 60,         // ~60x surplus
    selfEmployed: 50,
    businessOwner: 55,
    freelancer: 40,
    other: 35,
  },

  // Standard benchmark benchmark interest rate assumption when estimating range
  defaultAnnualInterestRate: 10.5, // 10.5% p.a.
  defaultTenureMonths: 60,         // 5 years default

  // Maximum recommended credit utilization
  maxRecommendedCreditUtilization: 30, // 30%
};
