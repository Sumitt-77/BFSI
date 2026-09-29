import Anthropic from '@anthropic-ai/sdk';
import { AiFinancialAdviceInput, AiFinancialAdviceResult, RiskLevel } from '../types';
import { ENV } from '../config/env';

export class ClaudeAiService {
  private static anthropicClient: Anthropic | null = null;

  private static getClient(): Anthropic | null {
    if (!this.anthropicClient && ENV.hasAnthropicKey) {
      this.anthropicClient = new Anthropic({
        apiKey: ENV.ANTHROPIC_API_KEY,
      });
    }
    return this.anthropicClient;
  }

  public static async generateFinancialAdvice(
    input: AiFinancialAdviceInput
  ): Promise<AiFinancialAdviceResult> {
    const totalIncome = input.monthlyIncome + (input.otherIncome || 0);
    const calculatedDti =
      input.dtiRatio ??
      Math.round((input.existingEmi / Math.max(1, totalIncome)) * 100);

    const client = this.getClient();

    if (client) {
      try {
        const systemPrompt = `You are FinAI, an expert Indian BFSI (Banking, Financial Services, and Insurance) senior financial advisor.
Your goal is to provide transparent, educational financial guidance and loan affordability analysis based on Indian banking standards (RBI guidelines, CIBIL benchmarks, FOIR norms).
CRITICAL RULES:
1. You must NEVER guarantee loan sanction, approval, or specific interest rates.
2. You must NEVER claim to provide official credit bureau scores.
3. Your output MUST be strict, parseable JSON matching the requested schema. No markdown formatting outside JSON.
4. Use Indian Rupee (₹) formatting and Lakh/Crore naming where applicable.`;

        const userPrompt = `Analyze the following financial profile:
- Monthly Income: ₹${input.monthlyIncome.toLocaleString('en-IN')}
- Other Monthly Income: ₹${(input.otherIncome || 0).toLocaleString('en-IN')}
- Monthly Expenses: ₹${input.monthlyExpenses.toLocaleString('en-IN')}
- Existing EMI Obligations: ₹${input.existingEmi.toLocaleString('en-IN')}
- Current DTI: ${calculatedDti}%
- Credit Score: ${input.creditScore}
- Employment Type: ${input.employmentType}
- Requested Loan: ${input.requestedLoanAmount ? `₹${input.requestedLoanAmount.toLocaleString('en-IN')}` : 'Not specified'}
- Preferred Tenure: ${input.loanTenureMonths ? `${input.loanTenureMonths} months` : 'Not specified'}
${input.notes ? `- User notes: "${input.notes}"` : ''}

Respond ONLY with a JSON object in this exact structure:
{
  "summary": "Concise 2-3 sentence overview of this financial and credit profile.",
  "riskLevel": "Low" | "Low to Moderate" | "Moderate" | "Moderate to High" | "High",
  "loanInsights": ["insight 1", "insight 2", "insight 3"],
  "creditInsights": ["credit observation 1", "credit observation 2"],
  "spendingObservations": ["spending observation 1", "spending observation 2"],
  "financialTips": ["practical action tip 1", "practical action tip 2", "practical action tip 3"],
  "warnings": ["warning or risk factor 1", "warning 2"],
  "questionsForLenders": ["question to ask lender 1", "question to ask lender 2", "question 3"]
}`;

        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-latest',
          max_tokens: 1500,
          temperature: 0.2,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        });

        const rawContent = response.content[0];
        if (rawContent && rawContent.type === 'text') {
          // Extract JSON from response text
          let jsonText = rawContent.text.trim();
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
          }

          const parsed = JSON.parse(jsonText);
          return {
            summary: parsed.summary || 'Financial analysis completed.',
            riskLevel: (parsed.riskLevel as RiskLevel) || 'Moderate',
            loanInsights: Array.isArray(parsed.loanInsights) ? parsed.loanInsights : [],
            creditInsights: Array.isArray(parsed.creditInsights) ? parsed.creditInsights : [],
            spendingObservations: Array.isArray(parsed.spendingObservations) ? parsed.spendingObservations : [],
            financialTips: Array.isArray(parsed.financialTips) ? parsed.financialTips : [],
            warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
            questionsForLenders: Array.isArray(parsed.questionsForLenders) ? parsed.questionsForLenders : [],
            disclaimer: 'AI-generated information is educational and should not be treated as professional financial advice or a guaranteed lending decision.',
            generatedAt: new Date().toISOString(),
          };
        }
      } catch (err: any) {
        console.warn('Claude API request error or key missing, falling back to local BFSI financial intelligence engine:', err?.message || err);
      }
    }

    // High-fidelity algorithmic BFSI intelligence engine fallback
    return this.generateAlgorithmicAdvice(input, totalIncome, calculatedDti);
  }

  private static generateAlgorithmicAdvice(
    input: AiFinancialAdviceInput,
    totalIncome: number,
    dti: number
  ): AiFinancialAdviceResult {
    const surplus = Math.max(0, totalIncome - input.existingEmi - input.monthlyExpenses);
    const savingsRate = Math.round((surplus / Math.max(1, totalIncome)) * 100);

    let riskLevel: RiskLevel = 'Moderate';
    if (input.creditScore >= 750 && dti <= 30 && savingsRate >= 25) {
      riskLevel = 'Low';
    } else if (input.creditScore >= 700 && dti <= 40) {
      riskLevel = 'Low to Moderate';
    } else if (input.creditScore < 600 || dti > 50 || surplus < 5000) {
      riskLevel = 'High';
    } else if (input.creditScore < 670 || dti > 45) {
      riskLevel = 'Moderate to High';
    }

    const loanInsights: string[] = [];
    const creditInsights: string[] = [];
    const spendingObservations: string[] = [];
    const financialTips: string[] = [];
    const warnings: string[] = [];
    const questionsForLenders: string[] = [
      'What is the benchmark repo rate spread and what is the exact reset frequency for floating rate loans?',
      'Are there any prepayment or foreclosure penalties under RBI retail loan guidelines?',
      'What are the one-time processing charges, legal inspection fees, and stamp duty expenses?',
      'Is credit life insurance optional or mandatory for this loan sanction?',
    ];

    // Loan insights
    if (input.requestedLoanAmount) {
      loanInsights.push(
        `For your requested loan of ₹${input.requestedLoanAmount.toLocaleString('en-IN')}, aim to keep the resulting EMI under 50% of your net monthly surplus (₹${surplus.toLocaleString('en-IN')}).`
      );
    }
    loanInsights.push(
      `Your current debt-to-income (DTI) ratio is ${dti}%. Indian retail banks typically prefer a combined FOIR (existing + new EMI) below 45% - 50%.`
    );
    if (dti > 40) {
      loanInsights.push('Higher existing commitments may compress your sanctioned loan amount unless you extend the repayment tenure.');
    }

    // Credit insights
    if (input.creditScore >= 750) {
      creditInsights.push(`Credit score of ${input.creditScore} puts you in the prime borrower bracket, unlocking lowest available interest rates.`);
    } else if (input.creditScore >= 680) {
      creditInsights.push(`Credit score of ${input.creditScore} is acceptable, but improving it above 750 could save 50-75 bps on annual interest.`);
    } else {
      creditInsights.push(`Credit score of ${input.creditScore} may trigger additional risk loading or require asset-backed collateral.`);
      warnings.push('Low credit score might lead to loan rejection or higher interest rates; repair before applying.');
    }

    // Spending observations
    spendingObservations.push(
      `Monthly non-debt living expenses are ₹${input.monthlyExpenses.toLocaleString('en-IN')} (${Math.round((input.monthlyExpenses / totalIncome) * 100)}% of income).`
    );
    spendingObservations.push(
      `Net unallocated monthly surplus is ₹${surplus.toLocaleString('en-IN')} (approx ${savingsRate}% savings buffer).`
    );

    // Tips
    financialTips.push('Build an emergency fund equivalent to 6 months of non-discretionary expenses before taking large leverage.');
    financialTips.push('Opt for automated ECS/NACH mandates on repayment to avoid accidental 30-day delinquency marks.');
    if (dti > 30) {
      financialTips.push('Target closing small outstanding consumer loans or card debt to swiftly bring your DTI below 30%.');
    }
    financialTips.push('Compare offers across at least two public sector banks and two private lenders to negotiate processing fee waivers.');

    if (savingsRate < 15) {
      warnings.push(`Current savings cushion (${savingsRate}%) is narrow; unexpected health or job disruptions could impair loan repayment.`);
    }
    if (input.employmentType === 'Freelancer' || input.employmentType === 'Other') {
      warnings.push('Variable income profiles require at least 2-3 years of audited ITR filings to prove earnings consistency.');
    }

    const summary = `Based on your monthly income of ₹${totalIncome.toLocaleString('en-IN')}, DTI of ${dti}%, and credit score of ${input.creditScore}, your financial health demonstrates ${riskLevel.toLowerCase()} risk. Your estimated surplus gives you room for disciplined borrowing if tenure and EMI are planned prudently.`;

    return {
      summary,
      riskLevel,
      loanInsights,
      creditInsights,
      spendingObservations,
      financialTips,
      warnings,
      questionsForLenders,
      disclaimer: 'AI-generated information is educational and should not be treated as professional financial advice or a guaranteed lending decision.',
      generatedAt: new Date().toISOString(),
    };
  }
}
