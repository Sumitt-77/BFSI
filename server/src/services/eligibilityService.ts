import {
  LoanEligibilityInput,
  LoanEligibilityResult,
  EligibilityStatus,
  RiskLevel,
  EligibilityFactor,
} from '../types';
import { FINANCIAL_THRESHOLDS } from '../config/thresholds';
import { EmiService } from './emiService';

export class EligibilityService {
  public static evaluateEligibility(input: LoanEligibilityInput): LoanEligibilityResult {
    const totalIncome = input.monthlyIncome + (input.otherMonthlyIncome || 0);
    const existingObligations = input.existingEmi;
    const livingExpenses = input.monthlyExpenses;

    // Debt to Income Ratio based on current existing commitments
    const dtiRatio = Math.round((existingObligations / Math.max(1, totalIncome)) * 100);

    // Net disposable income after living expenses and obligations
    const netDisposable = Math.max(0, totalIncome - existingObligations - livingExpenses);

    // Calculate Proposed EMI for requested loan
    const requestedEmiResult = EmiService.calculateEmi({
      principalAmount: input.requestedLoanAmount,
      annualInterestRate: input.annualInterestRate,
      tenureMonths: input.preferredTenureMonths,
    });
    const requestedLoanEmi = requestedEmiResult.monthlyEmi;

    // Allowable total EMI capacity under banking FOIR standard
    let maxFoirPct = FINANCIAL_THRESHOLDS.foirAllowedPercentage.midIncome;
    if (totalIncome < FINANCIAL_THRESHOLDS.incomeTiers.lowIncomeMax) {
      maxFoirPct = FINANCIAL_THRESHOLDS.foirAllowedPercentage.lowIncome;
    } else if (totalIncome > FINANCIAL_THRESHOLDS.incomeTiers.midIncomeMax) {
      maxFoirPct = FINANCIAL_THRESHOLDS.foirAllowedPercentage.highIncome;
    }

    const totalAllowedObligation = Math.round((totalIncome * maxFoirPct) / 100);
    const maxAvailableEmiForNewLoan = Math.max(0, totalAllowedObligation - existingObligations);

    // Reverse calculate maximum loan amount based on maxAvailableEmiForNewLoan
    let maxEligibleLoan = 0;
    if (maxAvailableEmiForNewLoan > 0) {
      const r = input.annualInterestRate > 0 ? (input.annualInterestRate / 12) / 100 : 0;
      const n = input.preferredTenureMonths;
      if (r === 0) {
        maxEligibleLoan = maxAvailableEmiForNewLoan * n;
      } else {
        const factor = Math.pow(1 + r, n);
        maxEligibleLoan = Math.round((maxAvailableEmiForNewLoan * (factor - 1)) / (r * factor));
      }
    }

    // Min eligible range benchmark (approx 70% of max for a conservative band)
    const minEligibleLoan = Math.round(maxEligibleLoan * 0.7);

    // FOIR with proposed loan
    const foir = Math.round(((existingObligations + requestedLoanEmi) / Math.max(1, totalIncome)) * 100);

    // Scoring and factors evaluation
    const factors: EligibilityFactor[] = [];
    const suggestions: string[] = [];
    let score = 50; // base score

    // 1. Credit Score Impact
    if (input.creditScore >= FINANCIAL_THRESHOLDS.creditScore.excellent) {
      score += 25;
      factors.push({
        factor: 'Credit Score',
        status: 'positive',
        description: `Strong credit score (${input.creditScore}) indicates high credit discipline and lower risk.`,
        impactScore: 9,
      });
    } else if (input.creditScore >= FINANCIAL_THRESHOLDS.creditScore.fair) {
      score += 10;
      factors.push({
        factor: 'Credit Score',
        status: 'neutral',
        description: `Moderate credit score (${input.creditScore}). Meets baseline requirements of most retail banks.`,
        impactScore: 4,
      });
      suggestions.push('Keep credit card utilization below 30% and ensure zero late payments to reach 750+ tier.');
    } else {
      score -= 25;
      factors.push({
        factor: 'Credit Score',
        status: 'negative',
        description: `Sub-optimal credit score (${input.creditScore}) may lead to higher risk assessment or stricter terms.`,
        impactScore: -8,
      });
      suggestions.push('Clear any delinquent accounts or overdue dues to rapidly rebuild your credit history.');
    }

    // 2. DTI Impact
    if (dtiRatio <= FINANCIAL_THRESHOLDS.dti.excellentMax) {
      score += 20;
      factors.push({
        factor: 'Debt-to-Income (DTI)',
        status: 'positive',
        description: `Healthy DTI of ${dtiRatio}%. Ample room for additional credit obligations.`,
        impactScore: 8,
      });
    } else if (dtiRatio <= FINANCIAL_THRESHOLDS.dti.moderateMax) {
      score += 5;
      factors.push({
        factor: 'Debt-to-Income (DTI)',
        status: 'neutral',
        description: `DTI is at ${dtiRatio}%. Within manageable bounds but leaves narrower margin for unforeseen shocks.`,
        impactScore: 2,
      });
      suggestions.push('Consider prepaying high-interest personal loans or credit card balances to lower current DTI.');
    } else {
      score -= 20;
      factors.push({
        factor: 'Debt-to-Income (DTI)',
        status: 'negative',
        description: `High existing DTI of ${dtiRatio}%. Significant portion of monthly income is already committed to debt.`,
        impactScore: -8,
      });
      suggestions.push('Consolidate or foreclose smaller ongoing EMIs before taking on another major facility.');
    }

    // 3. Employment and Stability
    if (input.employmentType === 'Salaried' && input.employmentDurationYears >= 2) {
      score += 10;
      factors.push({
        factor: 'Employment Stability',
        status: 'positive',
        description: `${input.employmentDurationYears} years of stable salaried employment provides steady cashflow certainty.`,
        impactScore: 6,
      });
    } else if (input.employmentDurationYears < 1) {
      score -= 10;
      factors.push({
        factor: 'Employment Tenure',
        status: 'neutral',
        description: 'Less than 1 year at current employment. Lenders prefer minimum continuous job or business stability.',
        impactScore: -2,
      });
      suggestions.push('Providing additional income proofs or co-applicant backing can mitigate short employment tenure.');
    } else {
      factors.push({
        factor: 'Employment Profile',
        status: 'neutral',
        description: `${input.employmentType} profile with ${input.employmentDurationYears} years track record.`,
        impactScore: 3,
      });
    }

    // 4. Requested Loan vs Capacity
    const requestedLoanAffordable = requestedLoanEmi <= maxAvailableEmiForNewLoan && netDisposable >= requestedLoanEmi;
    if (requestedLoanAffordable) {
      score += 15;
      factors.push({
        factor: 'Loan Affordability',
        status: 'positive',
        description: `Estimated EMI (₹${requestedLoanEmi.toLocaleString('en-IN')}) fits within your calculated surplus capacity (₹${maxAvailableEmiForNewLoan.toLocaleString('en-IN')}).`,
        impactScore: 7,
      });
    } else {
      score -= 20;
      factors.push({
        factor: 'Loan Affordability',
        status: 'negative',
        description: `Estimated EMI (₹${requestedLoanEmi.toLocaleString('en-IN')}) exceeds available surplus budget of ₹${maxAvailableEmiForNewLoan.toLocaleString('en-IN')}.`,
        impactScore: -7,
      });
      suggestions.push('Extending the loan tenure will reduce monthly EMI and improve affordability.');
      suggestions.push('Adding a co-applicant with independent earnings can substantially increase loan eligibility.');
    }

    // 5. Active loans & cards
    if (input.activeLoansCount >= 3 || input.creditCardsCount >= 4) {
      factors.push({
        factor: 'Multiple Active Facilities',
        status: 'neutral',
        description: `Multiple ongoing credit facilities (${input.activeLoansCount} loans, ${input.creditCardsCount} cards) observed.`,
        impactScore: -3,
      });
      suggestions.push('Avoid multiple simultaneous credit inquiries within a short 30-day window.');
    }

    // Determine Final Status
    let eligibilityStatus: EligibilityStatus = 'Moderate estimated eligibility';
    let riskCategory: RiskLevel = 'Moderate';

    if (score >= 70 && requestedLoanAffordable && input.creditScore >= 700) {
      eligibilityStatus = 'High estimated eligibility';
      riskCategory = score >= 85 ? 'Low' : 'Low to Moderate';
    } else if (score < 45 || dtiRatio > 55 || input.creditScore < 600 || !requestedLoanAffordable) {
      eligibilityStatus = 'Low estimated eligibility';
      riskCategory = score < 30 ? 'High' : 'Moderate to High';
    } else {
      eligibilityStatus = 'Moderate estimated eligibility';
      riskCategory = 'Moderate';
    }

    return {
      eligibilityStatus,
      riskCategory,
      totalMonthlyIncome: totalIncome,
      totalMonthlyObligations: existingObligations,
      netDisposableIncome: netDisposable,
      dtiRatio,
      foir,
      maxEligibleLoanAmount: maxEligibleLoan,
      minEligibleLoanAmount: minEligibleLoan,
      estimatedAffordableEmi: maxAvailableEmiForNewLoan,
      requestedLoanAffordable,
      requestedLoanEmi,
      factors,
      improvementSuggestions: suggestions.length > 0 ? suggestions : [
        'Maintain timely payments across all current credit accounts.',
        'Keep overall credit card utilization below 30% of aggregate limit.',
        'Review your annual credit report for any reporting discrepancies.',
      ],
      disclaimer: 'This estimation is based on rule-based algorithmic heuristics and educational guidelines. It does not represent an actual loan sanction or credit offer from a licensed financial institution. Final approval is subject to individual bank underwriting and verification.',
    };
  }
}
