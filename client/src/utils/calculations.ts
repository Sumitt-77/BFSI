import {
  EmiCalculationInput,
  EmiCalculationResult,
  LoanEligibilityInput,
  LoanEligibilityResult,
  CreditScoreInput,
  CreditScoreResult,
} from '../types';

export function calculateLocalEmi(input: EmiCalculationInput): EmiCalculationResult {
  const { principalAmount: P, annualInterestRate, tenureMonths: n } = input;

  let emi = 0;
  if (annualInterestRate === 0) {
    emi = P / n;
  } else {
    const r = annualInterestRate / 12 / 100;
    const factor = Math.pow(1 + r, n);
    emi = (P * r * factor) / (factor - 1);
  }

  const roundedEmi = Math.round(emi);
  const roundedTotalRepayment = annualInterestRate === 0 ? P : roundedEmi * n;
  const roundedTotalInterest = Math.max(0, roundedTotalRepayment - P);

  const principalPct = Math.round((P / roundedTotalRepayment) * 100);
  const interestPct = Math.max(0, 100 - principalPct);

  const monthlySchedule = [];
  const yearlyMap = new Map<number, { principal: number; interest: number; balance: number }>();
  let currentBalance = P;
  const monthlyRate = annualInterestRate / 12 / 100;

  for (let m = 1; m <= n; m++) {
    let interestForMonth = annualInterestRate === 0 ? 0 : currentBalance * monthlyRate;
    let principalForMonth = emi - interestForMonth;

    if (m === n || principalForMonth > currentBalance) {
      principalForMonth = currentBalance;
      interestForMonth = Math.max(0, emi - principalForMonth);
      currentBalance = 0;
    } else {
      currentBalance -= principalForMonth;
    }

    monthlySchedule.push({
      month: m,
      beginningBalance: Math.round(currentBalance + principalForMonth),
      emi: Math.round(principalForMonth + interestForMonth),
      principal: Math.round(principalForMonth),
      interest: Math.round(interestForMonth),
      endingBalance: Math.max(0, Math.round(currentBalance)),
    });

    const year = Math.ceil(m / 12);
    if (!yearlyMap.has(year)) {
      yearlyMap.set(year, { principal: 0, interest: 0, balance: 0 });
    }
    const yData = yearlyMap.get(year)!;
    yData.principal += principalForMonth;
    yData.interest += interestForMonth;
    yData.balance = Math.max(0, currentBalance);
  }

  const yearlyAmortization = Array.from(yearlyMap.entries()).map(([year, val]) => ({
    year,
    principalPaid: Math.round(val.principal),
    interestPaid: Math.round(val.interest),
    remainingBalance: Math.round(val.balance),
  }));

  return {
    monthlyEmi: roundedEmi,
    totalInterestPayable: roundedTotalInterest,
    totalRepaymentAmount: roundedTotalRepayment,
    principalAmount: P,
    annualInterestRate,
    tenureMonths: n,
    principalPercentage: principalPct,
    interestPercentage: interestPct,
    yearlyAmortization,
    monthlyAmortizationSample: monthlySchedule.slice(0, 36),
  };
}

export function calculateLocalEligibility(input: LoanEligibilityInput): LoanEligibilityResult {
  const totalIncome = input.monthlyIncome + (input.otherMonthlyIncome || 0);
  const existingObligations = input.existingEmi;
  const livingExpenses = input.monthlyExpenses;

  const dtiRatio = Math.round((existingObligations / Math.max(1, totalIncome)) * 100);
  const netDisposable = Math.max(0, totalIncome - existingObligations - livingExpenses);

  const emiCalc = calculateLocalEmi({
    principalAmount: input.requestedLoanAmount,
    annualInterestRate: input.annualInterestRate,
    tenureMonths: input.preferredTenureMonths,
  });
  const requestedLoanEmi = emiCalc.monthlyEmi;

  let maxFoirPct = 50;
  if (totalIncome < 30000) maxFoirPct = 40;
  else if (totalIncome > 100000) maxFoirPct = 60;

  const totalAllowedObligation = Math.round((totalIncome * maxFoirPct) / 100);
  const maxAvailableEmi = Math.max(0, totalAllowedObligation - existingObligations);

  let maxEligibleLoan = 0;
  if (maxAvailableEmi > 0) {
    const r = input.annualInterestRate > 0 ? (input.annualInterestRate / 12) / 100 : 0;
    const n = input.preferredTenureMonths;
    if (r === 0) {
      maxEligibleLoan = maxAvailableEmi * n;
    } else {
      const factor = Math.pow(1 + r, n);
      maxEligibleLoan = Math.round((maxAvailableEmi * (factor - 1)) / (r * factor));
    }
  }

  const minEligibleLoan = Math.round(maxEligibleLoan * 0.7);
  const foir = Math.round(((existingObligations + requestedLoanEmi) / Math.max(1, totalIncome)) * 100);

  let score = 50;
  const factors = [];
  const suggestions = [];

  if (input.creditScore >= 750) {
    score += 25;
    factors.push({
      factor: 'Credit Score',
      status: 'positive' as const,
      description: `Strong credit score (${input.creditScore}) qualifies for preferential terms.`,
      impactScore: 9,
    });
  } else if (input.creditScore >= 650) {
    score += 10;
    factors.push({
      factor: 'Credit Score',
      status: 'neutral' as const,
      description: `Acceptable credit score (${input.creditScore}). Meets baseline banking threshold.`,
      impactScore: 4,
    });
    suggestions.push('Keep credit card balances low to push score past 750.');
  } else {
    score -= 25;
    factors.push({
      factor: 'Credit Score',
      status: 'negative' as const,
      description: `Low credit score (${input.creditScore}) may limit loan sanction limits.`,
      impactScore: -8,
    });
    suggestions.push('Rebuild score by clearing any overdue bills and disputing discrepancies.');
  }

  if (dtiRatio <= 25) {
    score += 20;
    factors.push({
      factor: 'Debt-to-Income (DTI)',
      status: 'positive' as const,
      description: `Low DTI of ${dtiRatio}%. Significant borrowing capacity available.`,
      impactScore: 8,
    });
  } else if (dtiRatio <= 45) {
    score += 5;
    factors.push({
      factor: 'Debt-to-Income (DTI)',
      status: 'neutral' as const,
      description: `Moderate DTI of ${dtiRatio}%. Within manageable bounds.`,
      impactScore: 2,
    });
  } else {
    score -= 20;
    factors.push({
      factor: 'Debt-to-Income (DTI)',
      status: 'negative' as const,
      description: `Elevated DTI of ${dtiRatio}%. High existing EMI obligations.`,
      impactScore: -8,
    });
    suggestions.push('Prepay smaller outstanding loans to lower monthly debt commitments.');
  }

  const requestedLoanAffordable = requestedLoanEmi <= maxAvailableEmi && netDisposable >= requestedLoanEmi;
  if (requestedLoanAffordable) {
    score += 15;
    factors.push({
      factor: 'Loan Affordability',
      status: 'positive' as const,
      description: 'Requested loan EMI is within your calculated surplus capacity.',
      impactScore: 7,
    });
  } else {
    score -= 20;
    factors.push({
      factor: 'Loan Affordability',
      status: 'negative' as const,
      description: 'Requested loan EMI exceeds permissible surplus capacity.',
      impactScore: -7,
    });
    suggestions.push('Consider a longer tenure to reduce the monthly EMI burden.');
  }

  let eligibilityStatus: 'High estimated eligibility' | 'Moderate estimated eligibility' | 'Low estimated eligibility' = 'Moderate estimated eligibility';
  let riskCategory: 'Low' | 'Low to Moderate' | 'Moderate' | 'Moderate to High' | 'High' = 'Moderate';

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
    estimatedAffordableEmi: maxAvailableEmi,
    requestedLoanAffordable,
    requestedLoanEmi,
    factors,
    improvementSuggestions: suggestions.length > 0 ? suggestions : [
      'Maintain timely repayments across all ongoing facilities.',
      'Maintain credit card utilization under 30%.',
    ],
    disclaimer: 'This estimation is based on educational heuristics and does not constitute a guaranteed loan sanction.',
  };
}

export function calculateLocalCredit(input: CreditScoreInput): CreditScoreResult {
  const {
    creditScore,
    paymentHistoryPercentage = 95,
    creditUtilizationPercentage = 25,
    creditAgeYears = 3,
    recentInquiriesCount = 1,
    existingDebtAmount = 0,
  } = input;

  let category: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor' = 'Fair';
  let percentile = 50;

  if (creditScore >= 750) {
    category = 'Excellent';
    percentile = 88;
  } else if (creditScore >= 700) {
    category = 'Good';
    percentile = 70;
  } else if (creditScore >= 650) {
    category = 'Fair';
    percentile = 48;
  } else if (creditScore >= 600) {
    category = 'Poor';
    percentile = 28;
  } else {
    category = 'Very Poor';
    percentile = 12;
  }

  const positiveHighlights = [];
  const riskIndicators = [];
  const suggestions = [];

  if (creditScore >= 750) {
    positiveHighlights.push('Prime credit score unlocks lowest interest rates across top lenders.');
  }
  if (creditUtilizationPercentage <= 30) {
    positiveHighlights.push(`Healthy credit utilization (${creditUtilizationPercentage}%); well under the 30% ceiling.`);
  } else {
    riskIndicators.push(`High credit card utilization (${creditUtilizationPercentage}%) exerts downward pressure on score.`);
    suggestions.push('Pay off credit card balances before statement generation to lower reported utilization.');
  }

  if (paymentHistoryPercentage < 95) {
    riskIndicators.push(`Payment track record is at ${paymentHistoryPercentage}%; late payments negatively impact history.`);
    suggestions.push('Activate autopay on all credit accounts to avoid unintentional default marks.');
  } else {
    positiveHighlights.push('Consistent on-time payment track record.');
  }

  if (recentInquiriesCount > 3) {
    riskIndicators.push(`${recentInquiriesCount} recent hard inquiries may signal high credit reliance to lenders.`);
    suggestions.push('Limit hard credit card/loan applications to once every 3-6 months.');
  }

  return {
    creditScore,
    creditHealthCategory: category,
    scorePercentile: percentile,
    utilizationPercentage: creditUtilizationPercentage,
    paymentHistoryRating: paymentHistoryPercentage >= 98 ? 'Excellent' : paymentHistoryPercentage >= 92 ? 'Good' : 'Needs Attention',
    creditAgeRating: creditAgeYears >= 4 ? 'Mature' : creditAgeYears >= 2 ? 'Moderate' : 'New',
    debtBurdenCategory: creditUtilizationPercentage <= 20 ? 'Low' : creditUtilizationPercentage <= 35 ? 'Manageable' : 'High',
    riskIndicators,
    positiveHighlights,
    improvementSuggestions: suggestions.length > 0 ? suggestions : [
      'Keep credit card utilization below 30% of total limit.',
      'Ensure on-time payment settlements each month.',
    ],
    disclaimer: 'Estimated Credit Health Analysis is for educational assessment only and does not represent an official credit bureau score.',
  };
}
