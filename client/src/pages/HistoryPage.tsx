import React, { useState, useMemo } from 'react';
import { FinancialRecord, PageId } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { RiskBadge } from '../components/ui/RiskBadge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { formatINR, formatLakhsCrores } from '../utils/currency';
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface HistoryPageProps {
  records: FinancialRecord[];
  onNavigate: (page: PageId) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ records, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'income' | 'credit'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);

  // Filter & Sort Logic
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        const matchesSearch =
          rec.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.employmentType.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesEligibility =
          eligibilityFilter === 'ALL' ||
          rec.estimatedEligibility.toLowerCase().includes(eligibilityFilter.toLowerCase());

        const matchesRisk =
          riskFilter === 'ALL' ||
          rec.estimatedRisk.toLowerCase() === riskFilter.toLowerCase();

        return matchesSearch && matchesEligibility && matchesRisk;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'date') {
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        } else if (sortField === 'amount') {
          comparison = a.loanAmount - b.loanAmount;
        } else if (sortField === 'income') {
          comparison = a.monthlyIncome - b.monthlyIncome;
        } else if (sortField === 'credit') {
          comparison = a.creditScore - b.creditScore;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [records, searchQuery, eligibilityFilter, riskFilter, sortField, sortOrder]);

  const handleExportCsv = () => {
    if (records.length === 0) return;
    const headers = [
      'Record ID',
      'Timestamp',
      'Borrower Name',
      'Age',
      'Employment Type',
      'Monthly Income (INR)',
      'Monthly Expenses (INR)',
      'Existing EMI (INR)',
      'Credit Score',
      'Requested Loan (INR)',
      'Tenure (Mo)',
      'Estimated Eligibility',
      'DTI (%)',
      'Estimated Risk',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${new Date(r.timestamp).toLocaleDateString('en-IN')}"`,
      `"${r.name || 'Anonymous'}"`,
      r.age,
      `"${r.employmentType}"`,
      r.monthlyIncome,
      r.monthlyExpenses,
      r.existingEmi,
      r.creditScore,
      r.loanAmount,
      r.loanTenure,
      `"${r.estimatedEligibility}"`,
      r.dti,
      `"${r.estimatedRisk}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FinAI_Financial_Records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Calculation Records & History
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {records.length} Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical loan assessments synchronized with Google Sheets and persistent storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            disabled={records.length === 0}
            iconLeft={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('loan-eligibility')}
            iconLeft={<Sparkles className="w-3.5 h-3.5" />}
          >
            New Assessment
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by ID, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <Select
            label=""
            value={eligibilityFilter}
            options={[
              { label: 'All Eligibility Tiers', value: 'ALL' },
              { label: 'High Eligibility', value: 'High' },
              { label: 'Moderate Eligibility', value: 'Moderate' },
              { label: 'Low Eligibility', value: 'Low' },
            ]}
            onChange={(e) => setEligibilityFilter(e.target.value)}
          />

          <Select
            label=""
            value={riskFilter}
            options={[
              { label: 'All Risk Profiles', value: 'ALL' },
              { label: 'Low Risk', value: 'Low' },
              { label: 'Low to Moderate', value: 'Low to Moderate' },
              { label: 'Moderate', value: 'Moderate' },
              { label: 'Moderate to High', value: 'Moderate to High' },
              { label: 'High Risk', value: 'High' },
            ]}
            onChange={(e) => setRiskFilter(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Select
              label=""
              value={sortField}
              options={[
                { label: 'Sort: Date Created', value: 'date' },
                { label: 'Sort: Loan Amount', value: 'amount' },
                { label: 'Sort: Monthly Income', value: 'income' },
                { label: 'Sort: Credit Score', value: 'credit' },
              ]}
              onChange={(e) => setSortField(e.target.value as any)}
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Main Records List / Table */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="No Financial Records Found"
          description={
            records.length === 0
              ? 'You have not evaluated any loan eligibility profiles yet. Run your first check to record insights.'
              : 'No records matched your search query and filter criteria.'
          }
          actionText={records.length === 0 ? 'Check Loan Eligibility' : 'Clear Filters'}
          onAction={
            records.length === 0
              ? () => onNavigate('loan-eligibility')
              : () => {
                  setSearchQuery('');
                  setEligibilityFilter('ALL');
                  setRiskFilter('ALL');
                }
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-glass">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-300 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Borrower</th>
                  <th className="py-3.5 px-4">Requested Loan</th>
                  <th className="py-3.5 px-4">Monthly Income</th>
                  <th className="py-3.5 px-4">Credit Score</th>
                  <th className="py-3.5 px-4">DTI</th>
                  <th className="py-3.5 px-4">Eligibility</th>
                  <th className="py-3.5 px-4">Risk</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/5 transition-colors font-mono">
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(rec.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200 font-sans">{rec.name || 'Anonymous'}</td>
                    <td className="py-3.5 px-4 font-bold text-sky-400">{formatINR(rec.loanAmount)}</td>
                    <td className="py-3.5 px-4 text-slate-300">{formatINR(rec.monthlyIncome)}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">{rec.creditScore}</td>
                    <td className="py-3.5 px-4 text-slate-200">{rec.dti}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 font-sans">
                        {rec.estimatedEligibility.replace(' estimated eligibility', '')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <RiskBadge level={rec.estimatedRisk} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                        title="View Full Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Conforming to Section 13: "On mobile, convert table rows into cards") */}
          <div className="md:hidden space-y-4">
            {filteredRecords.map((rec) => (
              <GlassCard key={rec.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{rec.name || 'Anonymous User'}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {new Date(rec.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <RiskBadge level={rec.estimatedRisk} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-sans">Loan</span>
                    <p className="font-bold text-sky-400">{formatINR(rec.loanAmount)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-sans">Income</span>
                    <p className="text-slate-200">{formatINR(rec.monthlyIncome)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-sans">Credit Score</span>
                    <p className="font-bold text-emerald-400">{rec.creditScore}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-sans">DTI</span>
                    <p className="text-amber-400">{rec.dti}%</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-300">
                    {rec.estimatedEligibility}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedRecord(rec)}
                    iconLeft={<Eye className="w-3.5 h-3.5" />}
                  >
                    Details
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Financial Assessment: ${selectedRecord.id}`}
          subtitle={`Evaluated on ${new Date(selectedRecord.timestamp).toLocaleString('en-IN')}`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/10">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Eligibility Verdict</p>
                <h4 className="text-lg font-black text-white mt-0.5">{selectedRecord.estimatedEligibility}</h4>
              </div>
              <RiskBadge level={selectedRecord.estimatedRisk} size="md" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Monthly Income</span>
                <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                  {formatINR(selectedRecord.monthlyIncome)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Living Expenses</span>
                <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                  {formatINR(selectedRecord.monthlyExpenses)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Existing EMI</span>
                <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                  {formatINR(selectedRecord.existingEmi)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Credit Score</span>
                <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {selectedRecord.creditScore}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Requested Loan</span>
                <p className="text-sm font-bold text-sky-400 font-mono mt-0.5">
                  {formatINR(selectedRecord.loanAmount)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400">Tenure</span>
                <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                  {selectedRecord.loanTenure} Months
                </p>
              </div>
            </div>

            {selectedRecord.aiSummary && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                <span className="text-xs font-semibold text-sky-300">Executive Summary</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedRecord.aiSummary}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedRecord(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
