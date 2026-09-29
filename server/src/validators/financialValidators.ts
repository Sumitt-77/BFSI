import { z } from 'zod';

export const EmploymentTypeEnum = z.enum([
  'Salaried',
  'Self-employed',
  'Business owner',
  'Freelancer',
  'Other',
]);

export const LoanEligibilitySchema = z.object({
  age: z
    .number({ required_error: 'Age is required', invalid_type_error: 'Age must be a valid number' })
    .min(18, 'Age must be at least 18 years')
    .max(80, 'Age must be 80 or below'),
  employmentType: EmploymentTypeEnum,
  employmentDurationYears: z
    .number({ required_error: 'Employment duration is required' })
    .min(0, 'Employment duration cannot be negative')
    .max(60, 'Employment duration exceeds valid working span'),
  monthlyIncome: z
    .number({ required_error: 'Monthly income is required' })
    .positive('Monthly income must be greater than zero'),
  otherMonthlyIncome: z
    .number()
    .min(0, 'Other income cannot be negative')
    .default(0)
    .optional(),
  existingEmi: z
    .number({ required_error: 'Existing EMI is required' })
    .min(0, 'Existing EMI cannot be negative'),
  monthlyExpenses: z
    .number({ required_error: 'Monthly expenses are required' })
    .min(0, 'Monthly expenses cannot be negative'),
  existingLoanAmount: z
    .number()
    .min(0, 'Existing loan amount cannot be negative')
    .default(0)
    .optional(),
  creditScore: z
    .number({ required_error: 'Credit score is required' })
    .min(300, 'Credit score must be between 300 and 900')
    .max(900, 'Credit score must be between 300 and 900'),
  activeLoansCount: z
    .number()
    .int('Active loans must be an integer')
    .min(0, 'Active loans count cannot be negative')
    .default(0),
  creditCardsCount: z
    .number()
    .int('Credit card count must be an integer')
    .min(0, 'Credit card count cannot be negative')
    .default(0),
  requestedLoanAmount: z
    .number({ required_error: 'Requested loan amount is required' })
    .positive('Requested loan amount must be greater than zero'),
  preferredTenureMonths: z
    .number({ required_error: 'Preferred tenure is required' })
    .int('Tenure must be in full months')
    .min(1, 'Tenure must be at least 1 month')
    .max(360, 'Tenure cannot exceed 360 months (30 years)'),
  annualInterestRate: z
    .number({ required_error: 'Interest rate is required' })
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate exceeds typical retail ceiling'),
});

export const CreditScoreSchema = z.object({
  creditScore: z
    .number({ required_error: 'Credit score is required' })
    .min(300, 'Credit score must be between 300 and 900')
    .max(900, 'Credit score must be between 300 and 900'),
  paymentHistoryPercentage: z
    .number()
    .min(0, 'Payment history cannot be negative')
    .max(100, 'Payment history cannot exceed 100%')
    .default(95)
    .optional(),
  creditUtilizationPercentage: z
    .number()
    .min(0, 'Credit utilization cannot be negative')
    .max(100, 'Credit utilization cannot exceed 100%')
    .default(25)
    .optional(),
  activeAccountsCount: z
    .number()
    .int('Active accounts must be an integer')
    .min(0, 'Active accounts cannot be negative')
    .default(2)
    .optional(),
  creditAgeYears: z
    .number()
    .min(0, 'Credit age cannot be negative')
    .default(3)
    .optional(),
  recentInquiriesCount: z
    .number()
    .int('Recent inquiries must be an integer')
    .min(0, 'Recent inquiries cannot be negative')
    .default(1)
    .optional(),
  existingDebtAmount: z
    .number()
    .min(0, 'Existing debt cannot be negative')
    .default(0)
    .optional(),
  totalCreditLimit: z
    .number()
    .min(0, 'Total credit limit cannot be negative')
    .default(100000)
    .optional(),
});

export const EmiCalculationSchema = z.object({
  principalAmount: z
    .number({ required_error: 'Principal amount is required' })
    .positive('Principal amount must be greater than zero'),
  annualInterestRate: z
    .number({ required_error: 'Interest rate is required' })
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate cannot exceed 100%'),
  tenureMonths: z
    .number({ required_error: 'Tenure is required' })
    .int('Tenure must be an integer')
    .min(1, 'Tenure must be at least 1 month')
    .max(360, 'Tenure cannot exceed 360 months (30 years)'),
});

export const AiAdviceSchema = z.object({
  monthlyIncome: z.number().positive('Monthly income must be greater than zero'),
  otherIncome: z.number().min(0).default(0).optional(),
  monthlyExpenses: z.number().min(0),
  existingEmi: z.number().min(0),
  creditScore: z.number().min(300).max(900),
  requestedLoanAmount: z.number().positive().optional(),
  loanTenureMonths: z.number().int().min(1).max(360).optional(),
  employmentType: EmploymentTypeEnum,
  dtiRatio: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const SaveRecordSchema = z.object({
  name: z.string().optional(),
  age: z.number().min(18).max(80),
  employmentType: z.string(),
  monthlyIncome: z.number().positive(),
  monthlyExpenses: z.number().min(0),
  existingEmi: z.number().min(0),
  creditScore: z.number().min(300).max(900),
  loanAmount: z.number().positive(),
  loanTenure: z.number().int().min(1),
  estimatedEligibility: z.string(),
  dti: z.number().min(0),
  estimatedRisk: z.string(),
  aiSummary: z.string().optional(),
});
