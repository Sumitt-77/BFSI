# FinAI – API Specification & Reference

All endpoints return a standardized JSON response:

```json
{
  "success": true,
  "data": { ... }
}
```

Or on error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | INTERNAL_ERROR | RATE_LIMIT_EXCEEDED | NOT_FOUND",
    "message": "Human-readable description",
    "details": [ ... ]
  }
}
```

---

## 1. System Health

### `GET /api/health`
Checks server uptime, status, and active integrations.

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "timestamp": "2026-09-29T16:00:00.000Z",
  "uptimeSeconds": 1420,
  "integrations": {
    "anthropicAi": "configured",
    "googleSheets": "configured"
  }
}
```

---

## 2. Loan Eligibility Analysis

### `POST /api/loan/analyze`
Evaluates borrowing capacity based on Indian banking FOIR heuristics.

**Request Body:**
```json
{
  "age": 30,
  "employmentType": "Salaried",
  "employmentDurationYears": 4,
  "monthlyIncome": 95000,
  "otherMonthlyIncome": 10000,
  "existingEmi": 14000,
  "monthlyExpenses": 32000,
  "creditScore": 765,
  "activeLoansCount": 1,
  "creditCardsCount": 2,
  "requestedLoanAmount": 2500000,
  "preferredTenureMonths": 60,
  "annualInterestRate": 9.5
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "eligibilityStatus": "High estimated eligibility",
    "riskCategory": "Low to Moderate",
    "totalMonthlyIncome": 105000,
    "totalMonthlyObligations": 14000,
    "netDisposableIncome": 59000,
    "dtiRatio": 13,
    "foir": 51,
    "maxEligibleLoanAmount": 2685000,
    "minEligibleLoanAmount": 1879500,
    "estimatedAffordableEmi": 49000,
    "requestedLoanAffordable": true,
    "requestedLoanEmi": 52538,
    "factors": [ ... ],
    "improvementSuggestions": [ ... ],
    "disclaimer": "This estimation is based on rule-based algorithmic heuristics..."
  }
}
```

---

## 3. Credit Score Diagnostics

### `POST /api/credit/analyze`
Soft credit health analysis without bureau hard inquiries.

**Request Body:**
```json
{
  "creditScore": 760,
  "paymentHistoryPercentage": 98,
  "creditUtilizationPercentage": 22,
  "activeAccountsCount": 3,
  "creditAgeYears": 5,
  "recentInquiriesCount": 1,
  "existingDebtAmount": 85000,
  "totalCreditLimit": 350000
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "creditScore": 760,
    "creditHealthCategory": "Excellent",
    "scorePercentile": 86,
    "utilizationPercentage": 22,
    "paymentHistoryRating": "Excellent",
    "creditAgeRating": "Mature",
    "debtBurdenCategory": "Manageable",
    "positiveHighlights": [ ... ],
    "riskIndicators": [ ... ],
    "improvementSuggestions": [ ... ],
    "disclaimer": "Estimated Credit Health Analysis is an educational financial assessment tool..."
  }
}
```

---

## 4. EMI & Amortization Calculator

### `POST /api/emi/calculate`
Computes monthly reducing balance installment and amortization table.

**Request Body:**
```json
{
  "principalAmount": 2000000,
  "annualInterestRate": 9.5,
  "tenureMonths": 60
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "monthlyEmi": 42030,
    "totalInterestPayable": 521800,
    "totalRepaymentAmount": 2521800,
    "principalAmount": 2000000,
    "annualInterestRate": 9.5,
    "tenureMonths": 60,
    "principalPercentage": 79,
    "interestPercentage": 21,
    "yearlyAmortization": [ ... ],
    "monthlyAmortizationSample": [ ... ]
  }
}
```

---

## 5. Claude AI Financial Advice

### `POST /api/ai/financial-advice`
Invokes Anthropic Claude 3.5 Sonnet server-side to generate structured advice.

**Request Body:**
```json
{
  "monthlyIncome": 85000,
  "otherIncome": 5000,
  "monthlyExpenses": 28000,
  "existingEmi": 12000,
  "creditScore": 750,
  "requestedLoanAmount": 1500000,
  "loanTenureMonths": 60,
  "employmentType": "Salaried",
  "dtiRatio": 13,
  "notes": "Planning joint home loan in 6 months"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "summary": "...",
    "riskLevel": "Low to Moderate",
    "loanInsights": [ ... ],
    "creditInsights": [ ... ],
    "spendingObservations": [ ... ],
    "financialTips": [ ... ],
    "warnings": [ ... ],
    "questionsForLenders": [ ... ],
    "disclaimer": "AI-generated information is educational...",
    "generatedAt": "2026-09-29T16:05:00.000Z"
  }
}
```

---

## 6. Financial Records (Google Sheets & Local Store)

### `POST /api/records`
Appends a financial analysis record to Google Sheets and local storage.

### `GET /api/records`
Retrieves all historical calculation records.

### `GET /api/records/:id`
Retrieves a single record by unique ID (e.g. `FIN-MF09A-8K1Z`).
