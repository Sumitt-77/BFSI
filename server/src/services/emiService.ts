import { EmiCalculationInput, EmiCalculationResult, AmortizationScheduleItem } from '../types';

export class EmiService {
  /**
   * Computes EMI using standard reducing-balance formula:
   * EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
   * Handles 0% interest loans cleanly.
   */
  public static calculateEmi(input: EmiCalculationInput): EmiCalculationResult {
    const { principalAmount: P, annualInterestRate, tenureMonths: n } = input;

    let emi = 0;
    let totalRepayment = 0;
    let totalInterest = 0;

    if (annualInterestRate === 0) {
      emi = P / n;
      totalRepayment = P;
      totalInterest = 0;
    } else {
      const r = annualInterestRate / 12 / 100;
      const factor = Math.pow(1 + r, n);
      emi = (P * r * factor) / (factor - 1);
      totalRepayment = emi * n;
      totalInterest = totalRepayment - P;
    }

    const roundedEmi = Math.round(emi);
    const roundedTotalRepayment = annualInterestRate === 0 ? P : roundedEmi * n;
    const roundedTotalInterest = Math.max(0, roundedTotalRepayment - P);

    const principalPct = Math.round((P / roundedTotalRepayment) * 100);
    const interestPct = Math.max(0, 100 - principalPct);

    // Generate monthly and yearly amortization
    const monthlySchedule: AmortizationScheduleItem[] = [];
    const yearlyMap = new Map<number, { principal: number; interest: number; balance: number }>();

    let currentBalance = P;
    const monthlyRate = (annualInterestRate / 12) / 100;

    for (let m = 1; m <= n; m++) {
      let interestForMonth = annualInterestRate === 0 ? 0 : currentBalance * monthlyRate;
      let principalForMonth = emi - interestForMonth;

      // Handle final month rounding
      if (m === n || principalForMonth > currentBalance) {
        principalForMonth = currentBalance;
        interestForMonth = Math.max(0, emi - principalForMonth);
        currentBalance = 0;
      } else {
        currentBalance -= principalForMonth;
      }

      const scheduleItem: AmortizationScheduleItem = {
        month: m,
        beginningBalance: Math.round(currentBalance + principalForMonth),
        emi: Math.round(principalForMonth + interestForMonth),
        principal: Math.round(principalForMonth),
        interest: Math.round(interestForMonth),
        endingBalance: Math.max(0, Math.round(currentBalance)),
      };

      monthlySchedule.push(scheduleItem);

      // Aggregate into yearly
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
      monthlyAmortizationSample: monthlySchedule.slice(0, 36), // first 3 years sample for clean rendering
    };
  }
}
