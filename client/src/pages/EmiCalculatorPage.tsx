import React, { useState, useMemo } from 'react';
import { EmiCalculationInput } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { ChartCard } from '../components/ui/ChartCard';
import { Disclaimer } from '../components/ui/Disclaimer';
import { calculateLocalEmi } from '../utils/calculations';
import { formatINR, formatLakhsCrores } from '../utils/currency';
import {
  Calculator,
  RotateCcw,
  PieChart as PieIcon,
  Table,
  Printer,
  Calendar,
  Layers,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const EmiCalculatorPage: React.FC = () => {
  const [params, setParams] = useState<EmiCalculationInput>({
    principalAmount: 2500000, // 25 Lakhs
    annualInterestRate: 9.5,   // 9.5% p.a.
    tenureMonths: 60,          // 5 Years
  });

  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');

  // Instant real-time calculation
  const emiResult = useMemo(() => {
    return calculateLocalEmi(params);
  }, [params]);

  const handleReset = () => {
    setParams({
      principalAmount: 1000000,
      annualInterestRate: 9.0,
      tenureMonths: 60,
    });
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  const pieData = [
    { name: 'Principal Loan Amount', value: emiResult.principalAmount, color: '#0ea5e9' },
    { name: 'Total Interest Payable', value: emiResult.totalInterestPayable, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              EMI & Amortization Calculator
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Live Reducing Balance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate monthly installments, interest overhead, and principal liquidation curves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintSchedule}
            iconLeft={<Printer className="w-3.5 h-3.5" />}
          >
            Print Schedule
          </Button>
        </div>
      </div>

      {/* Main Grid: Controls (5 cols) & Visual KPI (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Sliders (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <span>Loan Parameters</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Formula: P × r × (1+r)ⁿ / ((1+r)ⁿ-1)</span>
            </div>

            {/* Principal Amount Input & Slider */}
            <div className="space-y-3">
              <Input
                label="Principal Loan Amount"
                type="number"
                prefixText="₹"
                min={10000}
                max={50000000}
                step={50000}
                value={params.principalAmount}
                onChange={(e) => setParams((prev) => ({ ...prev, principalAmount: Math.max(0, Number(e.target.value)) }))}
              />
              <Slider
                label="Quick Slider Adjustment"
                min={50000}
                max={20000000}
                step={50000}
                value={params.principalAmount}
                formatValue={(v) => formatINR(v)}
                minLabel="₹50k"
                maxLabel="₹2 Cr"
                onChange={(v) => setParams((prev) => ({ ...prev, principalAmount: v }))}
              />
            </div>

            {/* Interest Rate Input & Slider */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <Input
                label="Annual Interest Rate (%)"
                type="number"
                suffixText="% p.a."
                min={0}
                max={36}
                step={0.1}
                value={params.annualInterestRate}
                helperText={params.annualInterestRate === 0 ? 'Zero-interest (0% p.a.) mode active' : undefined}
                onChange={(e) => setParams((prev) => ({ ...prev, annualInterestRate: Math.max(0, Number(e.target.value)) }))}
              />
              <Slider
                label="Interest Rate Tuning"
                min={0}
                max={20}
                step={0.25}
                value={params.annualInterestRate}
                formatValue={(v) => `${v}%`}
                minLabel="0% (Zero Interest)"
                maxLabel="20%"
                onChange={(v) => setParams((prev) => ({ ...prev, annualInterestRate: v }))}
              />
            </div>

            {/* Tenure Input & Slider */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Tenure (Months)"
                  type="number"
                  suffixText="Mo"
                  min={1}
                  max={360}
                  value={params.tenureMonths}
                  onChange={(e) => setParams((prev) => ({ ...prev, tenureMonths: Math.max(1, Number(e.target.value)) }))}
                />
                <Input
                  label="Tenure (Years)"
                  type="number"
                  suffixText="Yrs"
                  min={0.1}
                  max={30}
                  step={0.5}
                  value={Number((params.tenureMonths / 12).toFixed(1))}
                  onChange={(e) => setParams((prev) => ({ ...prev, tenureMonths: Math.round(Math.max(1, Number(e.target.value) * 12)) }))}
                />
              </div>
              <Slider
                label="Tenure Slider"
                min={6}
                max={240}
                step={6}
                value={params.tenureMonths}
                formatValue={(v) => `${v} Mo (${(v / 12).toFixed(1)} Yrs)`}
                minLabel="6 Mo"
                maxLabel="20 Yrs"
                onChange={(v) => setParams((prev) => ({ ...prev, tenureMonths: v }))}
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Computed Results & Charts (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero KPI Card */}
          <GlassCard glow="cyan" className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Monthly Installment (EMI)
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight mt-1 text-gradient-cyan">
                  {formatINR(emiResult.monthlyEmi)}
                </h2>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Repayment</span>
                <p className="text-xl sm:text-2xl font-bold text-slate-200 font-mono mt-0.5">
                  {formatINR(emiResult.totalRepaymentAmount)}
                </p>
              </div>
            </div>

            {/* Principal vs Interest Breakdown Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Principal Amount</p>
                <p className="text-base font-bold text-sky-400 font-mono mt-0.5">
                  {formatINR(emiResult.principalAmount)}
                </p>
                <span className="text-[10px] text-slate-400">{emiResult.principalPercentage}% of total</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Interest</p>
                <p className="text-base font-bold text-amber-400 font-mono mt-0.5">
                  {formatINR(emiResult.totalInterestPayable)}
                </p>
                <span className="text-[10px] text-slate-400">{emiResult.interestPercentage}% of total</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 col-span-2 sm:col-span-1">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Tenure Period</p>
                <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
                  {emiResult.tenureMonths} Months
                </p>
                <span className="text-[10px] text-slate-400">{(emiResult.tenureMonths / 12).toFixed(1)} Years</span>
              </div>
            </div>

            {/* Pie Chart Representation */}
            <div className="h-56 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [formatINR(Number(val)), 'Amount']}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Yearly Amortization Chart */}
      <ChartCard
        title="Yearly Repayment & Amortization Progression"
        subtitle="Principal vs Interest component allocation across each operating year"
      >
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={emiResult.yearlyAmortization}
              margin={{ top: 15, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="#94a3b8" tickFormatter={(y) => `Yr ${y}`} fontSize={11} />
              <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v / 100000}L`} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [formatINR(Number(val)), 'Amount']}
              />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingBottom: '10px' }} />
              <Bar dataKey="principalPaid" name="Principal Paid" fill="#0ea5e9" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="interestPaid" name="Interest Paid" fill="#f59e0b" stackId="a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Amortization Schedule Table */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-sky-400" />
              <span>Amortization Schedule Details</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive breakdown of opening balance, monthly EMI, interest, and closing balance.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setScheduleView('yearly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                scheduleView === 'yearly' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly Summary
            </button>
            <button
              onClick={() => setScheduleView('monthly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                scheduleView === 'monthly' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Sample (36 Mo)
            </button>
          </div>
        </div>

        {scheduleView === 'yearly' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-300 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Principal Repaid</th>
                  <th className="py-3 px-4">Interest Paid</th>
                  <th className="py-3 px-4">Total Paid (Yr)</th>
                  <th className="py-3 px-4">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {emiResult.yearlyAmortization.map((row) => (
                  <tr key={row.year} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-200">Year {row.year}</td>
                    <td className="py-3 px-4 text-sky-400">{formatINR(row.principalPaid)}</td>
                    <td className="py-3 px-4 text-amber-400">{formatINR(row.interestPaid)}</td>
                    <td className="py-3 px-4 text-slate-100">{formatINR(row.principalPaid + row.interestPaid)}</td>
                    <td className="py-3 px-4 text-slate-300">{formatINR(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-300 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Opening Balance</th>
                  <th className="py-3 px-4">EMI</th>
                  <th className="py-3 px-4">Principal Component</th>
                  <th className="py-3 px-4">Interest Component</th>
                  <th className="py-3 px-4">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {emiResult.monthlyAmortizationSample.map((m) => (
                  <tr key={m.month} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-200">Mo {m.month}</td>
                    <td className="py-3 px-4 text-slate-400">{formatINR(m.beginningBalance)}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{formatINR(m.emi)}</td>
                    <td className="py-3 px-4 text-sky-400">{formatINR(m.principal)}</td>
                    <td className="py-3 px-4 text-amber-400">{formatINR(m.interest)}</td>
                    <td className="py-3 px-4 text-slate-300">{formatINR(m.endingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <Disclaimer variant="inline" />
    </div>
  );
};
