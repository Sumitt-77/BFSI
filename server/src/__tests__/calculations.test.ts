import { describe, it, expect } from 'vitest';
import { EmiService } from '../services/emiService';
import { EligibilityService } from '../services/eligibilityService';
import { CreditService } from '../services/creditService';
import { LoanEligibilitySchema, CreditScoreSchema, EmiCalculationSchema } from '../validators/financialValidators';

describe('EMI Calculator Service', () => {
  it('correctly calculates EMI for standard home loan parameters', () => {
    // Principal: ₹50,00,000, 8.5% p.a., 20 years (240 months)
    const result = EmiService.calculateEmi({
      principalAmount: 5000000,
      annualInterestRate: 8.5,
      tenureMonths: 240,
    });

    // Known standard banking EMI for 50L @ 8.5% for 20 yrs is ~₹43,391
    expect(result.monthlyEmi).toBeGreaterThanOrEqual(43380);
    expect(result.monthlyEmi).toBeLessThanOrEqual(43410);
    expect(result.totalRepaymentAmount).toBe(result.monthlyEmi * 240);
    expect(result.totalInterestPayable).toBe(result.totalRepaymentAmount - 5000000);
    expect(result.principalPercentage + result.interestPercentage).toBe(100);
    expect(result.yearlyAmortization.length).toBe(20);
  });

  it('handles zero interest (0% p.a.) loans correctly without division by zero', () => {
    const result = EmiService.calculateEmi({
      principalAmount: 120000,
      annualInterestRate: 0,
      tenureMonths: 12,
    });

    expect(result.monthlyEmi).toBe(10000);
    expect(result.totalInterestPayable).toBe(0);
    expect(result.totalRepaymentAmount).toBe(120000);
    expect(result.interestPercentage).toBe(0);
    expect(result.principalPercentage).toBe(100);
  });

  it('handles large loan amounts (e.g. ₹10 Crores) and long tenures safely', () => {
    const result = EmiService.calculateEmi({
      principalAmount: 100000000, // 10 Cr
      annualInterestRate: 9.0,
      tenureMonths: 360, // 30 years
    });

    expect(result.monthlyEmi).toBeGreaterThan(0);
    expect(result.totalRepaymentAmount).toBeGreaterThan(100000000);
    expect(Number.isFinite(result.monthlyEmi)).toBe(true);
  });
});

describe('Loan Eligibility Service', () => {
  it('awards High Estimated Eligibility for prime profile with low DTI and high credit score', () => {
    const result = EligibilityService.evaluateEligibility({
      age: 32,
      employmentType: 'Salaried',
      employmentDurationYears: 5,
      monthlyIncome: 150000,
      otherMonthlyIncome: 20000,
      existingEmi: 15000,
      monthlyExpenses: 45000,
      creditScore: 785,
      activeLoansCount: 1,
      creditCardsCount: 2,
      requestedLoanAmount: 2500000,
      preferredTenureMonths: 60,
      annualInterestRate: 9.5,
    });

    expect(result.eligibilityStatus).toBe('High estimated eligibility');
    expect(result.riskCategory).toMatch(/Low/);
    expect(result.dtiRatio).toBeLessThanOrEqual(15);
    expect(result.requestedLoanAffordable).toBe(true);
    expect(result.maxEligibleLoanAmount).toBeGreaterThan(2500000);
  });

  it('flags Low Estimated Eligibility for high DTI and low credit score', () => {
    const result = EligibilityService.evaluateEligibility({
      age: 26,
      employmentType: 'Freelancer',
      employmentDurationYears: 1,
      monthlyIncome: 40000,
      existingEmi: 26000, // 65% DTI
      monthlyExpenses: 12000,
      creditScore: 590, // Subprime
      activeLoansCount: 3,
      creditCardsCount: 3,
      requestedLoanAmount: 1500000,
      preferredTenureMonths: 36,
      annualInterestRate: 14,
    });

    expect(result.eligibilityStatus).toBe('Low estimated eligibility');
    expect(result.riskCategory).toMatch(/High/);
    expect(result.dtiRatio).toBeGreaterThan(50);
    expect(result.improvementSuggestions.length).toBeGreaterThan(0);
  });
});

describe('Credit Score Analyzer Service', () => {
  it('correctly maps scores to health categories and percentiles', () => {
    const excellent = CreditService.analyzeCredit({ creditScore: 820 });
    expect(excellent.creditHealthCategory).toBe('Excellent');
    expect(excellent.scorePercentile).toBeGreaterThanOrEqual(85);

    const fair = CreditService.analyzeCredit({ creditScore: 660 });
    expect(fair.creditHealthCategory).toBe('Fair');

    const poor = CreditService.analyzeCredit({ creditScore: 550 });
    expect(poor.creditHealthCategory).toBe('Very Poor');
  });

  it('detects high utilization risk indicators', () => {
    const result = CreditService.analyzeCredit({
      creditScore: 710,
      creditUtilizationPercentage: 75,
      recentInquiriesCount: 5,
    });

    expect(result.debtBurdenCategory).toBe('High');
    expect(result.riskIndicators.some((r) => r.includes('utilization'))).toBe(true);
    expect(result.riskIndicators.some((r) => r.includes('inquiries'))).toBe(true);
  });
});

describe('Zod Validation Schemas', () => {
  it('rejects negative or zero monthly income', () => {
    const invalid = {
      age: 25,
      employmentType: 'Salaried',
      employmentDurationYears: 2,
      monthlyIncome: -5000,
      existingEmi: 0,
      monthlyExpenses: 10000,
      creditScore: 700,
      activeLoansCount: 0,
      creditCardsCount: 1,
      requestedLoanAmount: 100000,
      preferredTenureMonths: 12,
      annualInterestRate: 10,
    };

    const parseResult = LoanEligibilitySchema.safeParse(invalid);
    expect(parseResult.success).toBe(false);
  });

  it('rejects out-of-range credit scores (< 300 or > 900)', () => {
    expect(CreditScoreSchema.safeParse({ creditScore: 250 }).success).toBe(false);
    expect(CreditScoreSchema.safeParse({ creditScore: 950 }).success).toBe(false);
    expect(CreditScoreSchema.safeParse({ creditScore: 750 }).success).toBe(true);
  });

  it('rejects negative interest rates or zero tenure in EMI schema', () => {
    expect(
      EmiCalculationSchema.safeParse({
        principalAmount: 50000,
        annualInterestRate: -2,
        tenureMonths: 12,
      }).success
    ).toBe(false);

    expect(
      EmiCalculationSchema.safeParse({
        principalAmount: 50000,
        annualInterestRate: 10,
        tenureMonths: 0,
      }).success
    ).toBe(false);
  });
});
