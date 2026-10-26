# FinAI – AI Loan & Financial Advisor

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Anthropic Claude](https://img.shields.io/badge/Claude%203.5-Sonnet-purple.svg)](https://www.anthropic.com/)
[![Google Sheets API](https://img.shields.io/badge/Google%20Sheets-v4-brightgreen.svg)](https://developers.google.com/sheets/api)

> **FinAI** is a production-ready, full-stack, AI-powered BFSI financial decision-support platform that helps users analyze loan eligibility, understand credit health, calculate EMIs, evaluate financial risk, and obtain personalized financial guidance in one unified application.

[![Demo Video](https://img.shields.io/badge/Demo_Video-Google_Drive-FF5722?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1oNazplMDmEHeW9vD0qp8puDXo6AYmetw)
[![Project Documentation](https://img.shields.io/badge/Project_Document-Google_Drive-4285F4?style=for-the-badge&logo=googledocs&logoColor=white)](https://drive.google.com/drive/folders/1oNazplMDmEHeW9vD0qp8puDXo6AYmetw)

---

> [!NOTE]
> **Educational & Regulatory Disclaimer:**
> This platform provides estimates and educational financial information. Results are not guaranteed loan approvals, official credit bureau scores, or professional financial advice. Actual lending decisions depend on individual lender underwriting, document verification, and applicable credit policies.

---

## Table of Contents
1. [Features](#1-features)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Project Structure](#4-project-structure)
5. [Installation & Setup](#5-installation--setup)
6. [Environment Variables](#6-environment-variables)
7. [Running Locally](#7-running-locally)
8. [Anthropic Claude Integration](#8-anthropic-claude-integration)
9. [Google Sheets Integration](#9-google-sheets-integration)
10. [Testing Suite](#10-testing-suite)
11. [Deployment (Vercel & Netlify)](#11-deployment-vercel--netlify)
12. [Security & Privacy](#12-security--privacy)
13. [Future Enhancement Roadmap](#13-future-enhancement-roadmap)

---

## 1. Features

- **Fintech Landing Page:** High-conversion landing page with hero, workflow steps, 4 core feature cards, security architecture, and regulatory disclosures.
- **Financial Overview Dashboard:** Real-time financial hub displaying estimated eligibility, credit health, current DTI, monthly surplus, and 4 Recharts visualizations:
  1. Monthly Cash Flow Allocation (Income vs. Expenses vs. Debt vs. Surplus)
  2. Debt-to-Income (DTI) & Safe Margin Donut Chart
  3. Credit Health Multi-Vector Radar Chart
  4. Loan Affordability Curve across tenures
- **Loan Eligibility Checker:** Transparent rule-based FOIR/DTI algorithm evaluating borrowing limits, affordable EMI caps, key factors, improvement suggestions, and celebratory confetti on high eligibility.
- **Credit Score Analyzer:** Soft estimation of credit health category (Prime to Subprime), utilization ratio diagnostics, debt burden, and score percentile with zero bureau inquiry marks.
- **EMI & Amortization Calculator:** Real-time reducing-balance installment calculations, 0% interest handling, pie breakdown, yearly bar charts, and a printable amortization table.
- **Claude AI Financial Advisor:** Secure server-side Anthropic Claude 3.5 Sonnet integration producing structured financial observations, practical savings tips, and questions to ask lenders.
- **Financial Profile Manager:** Centralized borrower baseline with automatic cross-tool synchronization and local storage persistence.
- **Historical Records & CSV Export:** Searchable, filterable, and sortable calculation history with mobile card views and one-click CSV download.
- **Indian Rupee (INR) Formatting:** Standard Indian numbering system formatting throughout (`₹50,000`, `₹5,00,000`, `₹12,50,000`, Lakhs, Crores).

---

## 2. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Canvas Confetti.
- **Backend:** Node.js, Express.js, TypeScript, Zod, Rate Limiter.
- **AI Engine:** Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`) with high-fidelity BFSI algorithmic fallback.
- **Database / Data Storage:** Google Sheets API v4 (`googleapis` JWT) with fail-safe local JSON storage (`server/data/records.json`).
- **Testing:** Vitest for mathematical calculation and schema validation tests.

---

## 3. Architecture

FinAI utilizes a layered architecture separating concerns across client interfaces, backend routers, controllers, domain services, and configuration thresholds.

```mermaid
graph LR
    User([User]) --> Client[React 18 + Vite]
    Client -->|/api/loan/analyze| Server[Express Server API]
    Client -->|/api/credit/analyze| Server
    Client -->|/api/emi/calculate| Server
    Client -->|/api/ai/financial-advice| Server
    Client -->|/api/records| Server
    Server -->|Banking Heuristics| RulesEngine[FOIR / DTI Engine]
    Server -->|Secure API Key| Claude[Anthropic Claude AI]
    Server -->|Service Account JWT| Sheets[(Google Sheets)]
```

---

## 4. Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Sidebar, Footer, MobileNav
│   │   │   └── ui/           # GlassCard, Button, Input, Select, Slider, Modal, Toast, etc.
│   │   ├── pages/            # 9 major pages (Landing, Dashboard, Loan, Credit, EMI, etc.)
│   │   ├── services/         # api.ts (backend API calls + fallback)
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # currency.ts, calculations.ts
│   │   ├── App.tsx
│   │   ├── index.css         # Glassmorphic fintech tokens
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── __tests__/        # vitest calculation and schema tests
│   │   ├── config/           # thresholds.ts (configurable banking limits), env.ts
│   │   ├── controllers/      # loan, credit, emi, ai, records controllers
│   │   ├── middleware/       # errorHandler, rateLimiter, validate
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # eligibility, credit, emi, claude, sheets services
│   │   ├── types/            # TypeScript backend models
│   │   ├── validators/       # Zod schemas
│   │   └── server.ts         # Express entrypoint
│   ├── package.json
│   └── tsconfig.json
├── docs/                     # architecture.md, api.md, workflow.md
├── .env.example
├── package.json              # Root orchestration
├── vercel.json               # Vercel deployment configuration
└── README.md
```

---

## 5. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/finai-advisor.git
   cd finai-advisor
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

---

## 6. Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend port | `5000` |
| `NODE_ENV` | Runtime environment | `development` / `production` |
| `CORS_ORIGIN` | Allowed client origin | `http://localhost:3000` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | `sk-ant-api03-...` |
| `GOOGLE_CLIENT_EMAIL` | Google Service Account Email | `finai-sa@...iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Google Service Account Private Key | `"-----BEGIN PRIVATE KEY-----\n..."` |
| `GOOGLE_SHEET_ID` | Target Google Spreadsheet ID | `1BxiMVs0XRA5...` |

> **Graceful Fallbacks:** The platform is immediately functional even without API keys:
> - If `ANTHROPIC_API_KEY` is empty, FinAI runs its built-in rule-based BFSI intelligence engine.
> - If Google credentials are empty, records are safely stored in local persistent JSON storage.

---

## 7. Running Locally

Run both frontend and backend concurrently with a single command:
```bash
npm run dev
```

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

---

## 8. Anthropic Claude Integration

- FinAI integrates with Anthropic Claude 3.5 Sonnet to provide personalized borrowing prudence observations and actionable tips.
- **Security:** The API key is strictly maintained server-side in `server/src/config/env.ts` and called through `POST /api/ai/financial-advice`. The key is never exposed to the frontend browser bundle.

---

## 9. Google Sheets Integration

To connect real-time calculation records to your private Google Sheet:
1. In the Google Cloud Console, enable the **Google Sheets API**.
2. Create a **Service Account** and download its JSON key.
3. Create a blank Google Sheet, copy its ID from the URL (`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`).
4. Share the sheet with your Service Account's email address as **Editor**.
5. Set `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID` in your `.env`.

FinAI will automatically initialize the sheet headers and append records whenever you click "Save to Records".

---

## 10. Testing Suite

Run the automated mathematical and validation test suite:
```bash
npm test
```

### Test Coverage:
- Standard home loan EMI reduction calculations.
- Zero-interest (0% p.a.) boundary calculations without division-by-zero.
- Multi-crore high-tenure stability tests.
- High, Moderate, and Low loan eligibility scenarios under varying DTIs and credit tiers.
- Credit score health mappings and inquiry risk detection.
- Zod schema validations for negative values, out-of-range scores, and invalid inputs.

---

## 11. Deployment (Vercel & Netlify)

### Deploying to Vercel (Recommended)
The repository includes a ready-to-use `vercel.json` configuration:
1. Push the codebase to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. In **Settings > Environment Variables**, add `ANTHROPIC_API_KEY`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID`.
4. Deploy!

### Deploying to Netlify
1. Set the build command to `npm run build:client` and publish directory to `client/dist`.
2. Deploy the Express backend to Render, Railway, or AWS ECS, and set `VITE_API_URL` to point to your live backend.

---

## 12. Security & Privacy

- **Zero Hard Inquiries:** All diagnostics are calculated using self-reported figures with 0 bureau footprint.
- **Server-Side Secret Isolation:** No API keys in client-side code or HTML.
- **Rate Limiting:** Sliding-window limiter on all API routes to mitigate brute force.
- **One-Click Local Data Purge:** Users can wipe all cached local profiles and calculations instantly from the About & Disclaimer page.

---

## 13. Future Enhancement Roadmap

Documented future capabilities (conforming to Section 30):
- User authentication with OTP and biometric verification.
- Account Aggregator (AA) and Open Banking framework integration for verified bank statement analysis.
- Live credit bureau integration (CIBIL / Experian API) with borrower consent.
- Automated PDF report generator for offline financial planning.
- WhatsApp and email notification channels for payment reminders.
- Multi-lender comparison engine with live interest rate scraping.
