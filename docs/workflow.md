# FinAI – End-to-End Workflow & Calculation Methodology

## 1. Data Flow Pipeline

Conforming to Section 26 of the FinAI system design:

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Borrower
    participant Client as React 18 Frontend
    participant Server as Express Backend
    participant Rules as Financial Calculation Service
    participant Claude as Anthropic Claude 3.5 AI
    participant Sheets as Google Sheets API

    User->>Client: Enters income, EMI obligations & credit parameters
    Client->>Client: Client-side schema validation (Zod)
    Client->>Server: POST /api/loan/analyze (or /credit/analyze)
    Server->>Server: Server-side validation & rate-limit check
    Server->>Rules: Evaluate FOIR, DTI & Max Sanction Band
    Rules-->>Server: Rule-based eligibility metrics
    Server-->>Client: Returns verified calculation result

    opt User Requests AI Advice
        Client->>Server: POST /api/ai/financial-advice
        Server->>Claude: Invoke with structured financial prompt
        Claude-->>Server: Return structured JSON advice
        Server-->>Client: Render insights, tips & lender questions
    end

    opt User Saves Record
        Client->>Server: POST /api/records
        Server->>Sheets: Append row via Service Account JWT
        Sheets-->>Server: Row successfully written
        Server-->>Client: Confirmation & Record ID
    end
```

---

## 2. Calculation Mechanics

### Debt-to-Income (DTI)
$$\text{DTI} = \left(\frac{\text{Existing Monthly Obligations}}{\text{Total Monthly Income}}\right) \times 100$$

### Fixed Obligation to Income Ratio (FOIR)
$$\text{FOIR} = \left(\frac{\text{Existing Monthly Obligations} + \text{Proposed Loan EMI}}{\text{Total Monthly Income}}\right) \times 100$$

### Standard Reducing-Balance EMI Formula
$$\text{EMI} = P \times r \times \frac{(1 + r)^n}{(1 + r)^n - 1}$$

- $P$ = Principal Loan Amount
- $r$ = Monthly interest rate ($\text{Annual Rate} / 12 / 100$)
- $n$ = Number of installments in months
- For zero-interest loans: $\text{EMI} = P / n$
