import React from 'react';
import { PageId } from '../types';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Disclaimer } from '../components/ui/Disclaimer';
import {
  TrendingUp,
  ShieldCheck,
  Calculator,
  Sparkles,
  ArrowRight,
  Shield,
  Lock,
  Cpu,
  CheckCircle2,
  FileSpreadsheet,
  BarChart3,
  Clock,
  Compass,
} from 'lucide-react';

export interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const featureCards = [
    {
      id: 'loan-eligibility' as PageId,
      title: 'Loan Eligibility Checker',
      description:
        'Transparent rule-based algorithm evaluating Debt-to-Income (DTI), FOIR capacity, and eligible loan amounts based on real banking benchmarks.',
      icon: <TrendingUp className="w-6 h-6 text-sky-400" />,
      tag: 'FOIR Engine',
      glow: 'cyan' as const,
    },
    {
      id: 'credit-analyzer' as PageId,
      title: 'Credit Score Analyzer',
      description:
        'Detailed diagnostic of your credit health, utilization ratio, debt burden, and score percentile with actionable steps to reach prime 750+ status.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      tag: 'Health Check',
      glow: 'emerald' as const,
    },
    {
      id: 'emi-calculator' as PageId,
      title: 'EMI Calculator & Amortization',
      description:
        'Instant reducing-balance installment calculations with full principal vs interest breakdowns, zero-interest support, and downloadable schedules.',
      icon: <Calculator className="w-6 h-6 text-amber-400" />,
      tag: 'Real-time',
      glow: 'amber' as const,
    },
    {
      id: 'ai-tips' as PageId,
      title: 'AI Financial Tips',
      description:
        'Claude-powered intelligent financial analysis providing practical spending observations, lender interrogation questions, and tailored debt-reduction tips.',
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      tag: 'Claude 3.5 AI',
      glow: 'purple' as const,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Provide Financial Profile',
      desc: 'Input monthly income, living expenses, existing loan EMIs, and credit score. No bank account logins or passwords required.',
      icon: <Compass className="w-5 h-5 text-sky-400" />,
    },
    {
      number: '02',
      title: 'Algorithmic & AI Processing',
      desc: 'Our dual-core engine runs transparent Indian BFSI regulatory calculations paired with Anthropic Claude for intelligent contextual analysis.',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
    },
    {
      number: '03',
      title: 'Actionable Decision Support',
      desc: 'Receive your estimated eligible loan bracket, affordable monthly EMI limit, DTI breakdown, and lender negotiation questions.',
      icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const benefits = [
    'Strict Zero Bureau Impact: Soft estimation without generating hard inquiry marks on CIBIL or Experian.',
    'Transparent Banking Formulae: Direct implementation of RBI-aligned FOIR and debt-to-income limits.',
    'Server-Isolated Security: All AI keys and Google Sheets credentials are strictly kept backend-side.',
    'Realistic Indian Rupee (INR) Benchmarking: Built specifically for Indian retail lending norms.',
    'Instant Amortization Schedules: Clear year-by-year visibility into interest vs principal amortization.',
    'Google Sheets Integration: Secure cloud storage for persistent record keeping and audit history.',
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4">
        {/* Top AI Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-500/30 text-xs font-semibold text-sky-300 mb-6 shadow-glass">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Next-Generation BFSI Decision Support with Claude AI</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-['Outfit']">
          Smarter Financial Decisions <br className="hidden sm:inline" />
          with <span className="text-gradient-cyan">AI Intelligence</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Analyze loan eligibility, understand credit health, calculate EMIs, and get personalized financial guidance in one place.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            iconRight={<ArrowRight className="w-4 h-4" />}
            onClick={() => onNavigate('loan-eligibility')}
            className="w-full sm:w-auto"
          >
            Check Loan Eligibility
          </Button>
          <Button
            variant="secondary"
            size="lg"
            iconLeft={<Calculator className="w-4 h-4 text-sky-400" />}
            onClick={() => onNavigate('emi-calculator')}
            className="w-full sm:w-auto"
          >
            Explore Tools
          </Button>
        </div>

        {/* Key Guarantee Metrics Banner */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Bureau Impact</p>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">0 Hard Inquiries</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Standard Model</p>
            <p className="text-sm font-bold text-sky-400 mt-0.5">RBI FOIR Norms</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">AI Engine</p>
            <p className="text-sm font-bold text-purple-400 mt-0.5">Claude 3.5 Sonnet</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Database Sync</p>
            <p className="text-sm font-bold text-amber-400 mt-0.5">Google Sheets API</p>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
            Comprehensive Financial Intelligence
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every tool is purpose-built to give you transparent, mathematically rigorous insights before approaching a bank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat) => (
            <GlassCard
              key={feat.id}
              hoverEffect
              glow={feat.glow}
              className="flex flex-col justify-between cursor-pointer group"
              onClick={() => onNavigate(feat.id)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-white/10 group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4">
        <GlassCard className="p-8 sm:p-12 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Workflow Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 font-['Outfit']">
              How FinAI Guides Your Borrowing
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Three streamlined steps from raw figures to institutional-grade borrowing clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, i) => (
              <div key={i} className="relative z-10 flex flex-col items-start p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-white/10">
                    {st.icon}
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-400">{st.number}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{st.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Why FinAI
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 font-['Outfit']">
              Engineered for Prudent Borrowers & Informed Families
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Most online loan portals exist purely as lead-generation brokers that spam your phone. FinAI operates differently: we empower you with transparent mathematical visibility and AI reasoning without capturing sensitive identity credentials.
            </p>

            <div className="mt-6 space-y-3">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('dashboard')}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Go to Financial Dashboard
              </Button>
            </div>
          </div>

          <GlassCard glow="cyan" className="p-6 sm:p-8 space-y-6">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" />
              <span>Enterprise-Grade Security Architecture</span>
            </h4>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <p className="font-semibold text-slate-100">Server-Side Secret Isolation</p>
                <p className="text-slate-400">
                  Anthropic Claude API keys and Google Cloud Service Account credentials never touch the browser. All inferences run through guarded backend proxies.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <p className="font-semibold text-slate-100">No Hard Credit Pulls</p>
                <p className="text-slate-400">
                  FinAI calculates your credit trajectory and percentile based on self-reported variables, ensuring your credit score remains 100% untouched.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <p className="font-semibold text-slate-100">Optional Google Sheets Sync</p>
                <p className="text-slate-400">
                  Save your calculations securely to your own private Google Sheet or rely on encrypted browser-local storage with instant data wipe support.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Regulatory & Educational Disclaimer */}
      <section className="max-w-5xl mx-auto px-4">
        <Disclaimer variant="card" />
      </section>
    </div>
  );
};
