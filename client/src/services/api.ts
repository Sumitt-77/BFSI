import {
  LoanEligibilityInput,
  LoanEligibilityResult,
  CreditScoreInput,
  CreditScoreResult,
  EmiCalculationInput,
  EmiCalculationResult,
  AiFinancialAdviceInput,
  AiFinancialAdviceResult,
  FinancialRecord,
  UserFinancialProfile,
} from '../types';
import {
  calculateLocalEmi,
  calculateLocalEligibility,
  calculateLocalCredit,
} from '../utils/calculations';

const API_BASE_URL = '/api';

const LOCAL_STORAGE_RECORDS_KEY = 'finai_records_cache';
const LOCAL_STORAGE_PROFILE_KEY = 'finai_user_profile';

export class ApiService {
  /**
   * Evaluates loan eligibility via backend API with fallback
   */
  public static async analyzeLoanEligibility(
    input: LoanEligibilityInput
  ): Promise<LoanEligibilityResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/loan/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend call failed, using client-side calculation engine:', err);
      return calculateLocalEligibility(input);
    }
  }

  /**
   * Analyzes credit score via backend API with fallback
   */
  public static async analyzeCreditScore(
    input: CreditScoreInput
  ): Promise<CreditScoreResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/credit/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend call failed, using client-side credit engine:', err);
      return calculateLocalCredit(input);
    }
  }

  /**
   * Calculates EMI via backend API with fallback
   */
  public static async calculateEmi(
    input: EmiCalculationInput
  ): Promise<EmiCalculationResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/emi/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend call failed, using client-side EMI engine:', err);
      return calculateLocalEmi(input);
    }
  }

  /**
   * Gets AI financial advice from Claude through backend endpoint
   */
  public static async getAiFinancialAdvice(
    input: AiFinancialAdviceInput
  ): Promise<AiFinancialAdviceResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/financial-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json.data;
    } catch (err: any) {
      console.warn('AI backend call error:', err);
      throw new Error(err.message || 'Unable to connect to AI advisor. Please try again.');
    }
  }

  /**
   * Saves a financial record to Google Sheets / backend storage
   */
  public static async saveRecord(
    recordData: Omit<FinancialRecord, 'id' | 'timestamp'>
  ): Promise<FinancialRecord> {
    const localId = `FIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newRecord: FinancialRecord = {
      id: localId,
      timestamp: new Date().toISOString(),
      ...recordData,
    };

    // Save to local cache first
    try {
      const cached = this.getLocalRecords();
      cached.unshift(newRecord);
      localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(cached));
    } catch {
      // ignore
    }

    try {
      const res = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });

      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Could not sync to backend records, saved locally in browser:', err);
    }

    return newRecord;
  }

  /**
   * Retrieves all records from backend or local storage
   */
  public static async getRecords(): Promise<FinancialRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/records`);
      if (res.ok) {
        const json = await res.json();
        const serverRecords: FinancialRecord[] = json.data || [];
        if (serverRecords.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(serverRecords));
          return serverRecords;
        }
      }
    } catch (err) {
      console.warn('Could not fetch server records, using local cache:', err);
    }

    return this.getLocalRecords();
  }

  public static getLocalRecords(): FinancialRecord[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_RECORDS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }

    // Default mock records for stunning initial dashboard experience
    const initialRecords: FinancialRecord[] = [
      {
        id: 'FIN-DEMO-001',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        name: 'Rahul Sharma',
        age: 31,
        employmentType: 'Salaried',
        monthlyIncome: 85000,
        monthlyExpenses: 28000,
        existingEmi: 12000,
        creditScore: 760,
        loanAmount: 1500000,
        loanTenure: 60,
        estimatedEligibility: 'High estimated eligibility',
        dti: 14,
        estimatedRisk: 'Low to Moderate',
        aiSummary: 'Strong profile with 14% DTI and prime 760 credit score. High loan sanction likelihood at competitive interest rates.',
      },
      {
        id: 'FIN-DEMO-002',
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
        name: 'Priya Patel',
        age: 28,
        employmentType: 'Business owner',
        monthlyIncome: 120000,
        monthlyExpenses: 42000,
        existingEmi: 38000,
        creditScore: 690,
        loanAmount: 2500000,
        loanTenure: 84,
        estimatedEligibility: 'Moderate estimated eligibility',
        dti: 32,
        estimatedRisk: 'Moderate',
        aiSummary: 'Moderate eligibility. Existing EMI obligation represents 32% of monthly cash flow. Prepaying short-term debt is advised.',
      },
    ];

    try {
      localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(initialRecords));
    } catch {
      // ignore
    }

    return initialRecords;
  }

  /**
   * Profile storage helpers
   */
  public static getUserProfile(): UserFinancialProfile {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }

    return {
      name: 'Aditya Verma',
      age: 30,
      employmentType: 'Salaried',
      employmentDurationYears: 4,
      monthlyIncome: 95000,
      otherMonthlyIncome: 15000,
      monthlyExpenses: 32000,
      existingEmi: 14000,
      existingLoanAmount: 450000,
      creditScore: 755,
      activeLoansCount: 1,
      creditCardsCount: 2,
      preferredTenureMonths: 60,
      annualInterestRate: 9.5,
      lastUpdated: new Date().toISOString(),
    };
  }

  public static saveUserProfile(profile: UserFinancialProfile): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  /**
   * Checks server health
   */
  public static async checkHealth(): Promise<{ status: string; integrations: any } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignore
    }
    return null;
  }
}
