import { CreditScoreInput, CreditScoreResult, CreditHealthCategory } from '../types';
import { FINANCIAL_THRESHOLDS } from '../config/thresholds';

export class CreditService {
  public static analyzeCredit(input: CreditScoreInput): CreditScoreResult {
    const {
      creditScore,
      paymentHistoryPercentage = 95,
      creditUtilizationPercentage = 28,
      activeAccountsCount = 3,
      creditAgeYears = 4,
      recentInquiriesCount = 1,
      existingDebtAmount = 0,
    } = input;

    // 1. Credit Health Category
    let category: CreditHealthCategory = 'Fair';
    let percentile = 50;

    if (creditScore >= FINANCIAL_THRESHOLDS.creditScore.excellent) {
      category = 'Excellent';
      percentile = 85 + Math.round(((creditScore - 750) / 150) * 14);
    } else if (creditScore >= FINANCIAL_THRESHOLDS.creditScore.good) {
      category = 'Good';
      percentile = 65 + Math.round(((creditScore - 700) / 50) * 19);
    } else if (creditScore >= FINANCIAL_THRESHOLDS.creditScore.fair) {
      category = 'Fair';
      percentile = 40 + Math.round(((creditScore - 650) / 50) * 24);
    } else if (creditScore >= FINANCIAL_THRESHOLDS.creditScore.poor) {
      category = 'Poor';
      percentile = 20 + Math.round(((creditScore - 600) / 50) * 19);
    } else {
      category = 'Very Poor';
      percentile = Math.max(5, Math.round(((creditScore - 300) / 300) * 19));
    }

    // 2. Payment History Rating
    let paymentHistoryRating: 'Excellent' | 'Good' | 'Average' | 'Needs Attention' = 'Good';
    if (paymentHistoryPercentage >= 99) {
      paymentHistoryRating = 'Excellent';
    } else if (paymentHistoryPercentage >= 95) {
      paymentHistoryRating = 'Good';
    } else if (paymentHistoryPercentage >= 88) {
      paymentHistoryRating = 'Average';
    } else {
      paymentHistoryRating = 'Needs Attention';
    }

    // 3. Credit Age Rating
    let creditAgeRating: 'Mature' | 'Moderate' | 'New' = 'Moderate';
    if (creditAgeYears >= 5) {
      creditAgeRating = 'Mature';
    } else if (creditAgeYears >= 2) {
      creditAgeRating = 'Moderate';
    } else {
      creditAgeRating = 'New';
    }

    // 4. Debt Burden Category
    let debtBurdenCategory: 'Low' | 'Manageable' | 'Elevated' | 'High' = 'Manageable';
    if (creditUtilizationPercentage <= 20) {
      debtBurdenCategory = 'Low';
    } else if (creditUtilizationPercentage <= 35) {
      debtBurdenCategory = 'Manageable';
    } else if (creditUtilizationPercentage <= 60) {
      debtBurdenCategory = 'Elevated';
    } else {
      debtBurdenCategory = 'High';
    }

    // 5. Positive Highlights & Risk Indicators
    const positiveHighlights: string[] = [];
    const riskIndicators: string[] = [];
    const improvementSuggestions: string[] = [];

    if (creditScore >= 750) {
      positiveHighlights.push('Excellent score qualifies for prime interest rates and preferential terms.');
    } else if (creditScore >= 700) {
      positiveHighlights.push('Solid credit footing accepted across mainstream commercial banks.');
    }

    if (paymentHistoryPercentage >= 98) {
      positiveHighlights.push('Superb on-time payment track record demonstrates creditworthiness.');
    } else {
      riskIndicators.push(`Payment reliability is at ${paymentHistoryPercentage}%; missed payments heavily impact the score.`);
      improvementSuggestions.push('Set up automated autopay or standing instructions for credit card statements.');
    }

    if (creditUtilizationPercentage <= 30) {
      positiveHighlights.push(`Credit utilization (${creditUtilizationPercentage}%) is well within the recommended 30% boundary.`);
    } else {
      riskIndicators.push(`Elevated credit card limit utilization (${creditUtilizationPercentage}%); exceeds recommended 30% ceiling.`);
      improvementSuggestions.push('Pay down revolving card balances or request a credit limit enhancement to dilute utilization.');
    }

    if (creditAgeYears >= 4) {
      positiveHighlights.push(`Established credit history vintage (${creditAgeYears} years) boosts bureau reliability.`);
    } else if (creditAgeYears < 2) {
      riskIndicators.push('Relatively young credit vintage; lenders prefer at least 24-36 months of demonstrated repayment.');
      improvementSuggestions.push('Keep your oldest credit card active with occasional low-ticket charges to age your profile.');
    }

    if (recentInquiriesCount > 3) {
      riskIndicators.push(`High credit-hungry behavior detected with ${recentInquiriesCount} recent hard inquiries.`);
      improvementSuggestions.push('Avoid applying for new credit cards or personal loans for the next 90 days.');
    } else {
      positiveHighlights.push('Disciplined credit inquiry count indicates low credit-hunger.');
    }

    if (existingDebtAmount > 0) {
      riskIndicators.push(`Carrying existing debt of ₹${existingDebtAmount.toLocaleString('en-IN')}.`);
    }

    return {
      creditScore,
      creditHealthCategory: category,
      scorePercentile: percentile,
      utilizationPercentage: creditUtilizationPercentage,
      paymentHistoryRating,
      creditAgeRating,
      debtBurdenCategory,
      riskIndicators,
      positiveHighlights,
      improvementSuggestions: improvementSuggestions.length > 0 ? improvementSuggestions : [
        'Maintain on-time bill settlements before the statement due date.',
        'Keep overall credit card utilization below 30% of aggregate limit.',
        'Review your annual CIBIL/Experian credit report once every 6 months.',
      ],
      disclaimer: 'Estimated Credit Health Analysis is an educational financial assessment tool. It does not represent an official credit bureau score (such as CIBIL, Experian, Equifax, or CRIF High Mark) and has no bearing on third-party underwriting decisions.',
    };
  }
}
