import React from 'react';
import { GlassCard } from './GlassCard';
import { clsx } from 'clsx';

export interface FinancialMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose';
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'cyan',
  trend,
}) => {
  const iconBgStyles = {
    cyan: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <GlassCard hoverEffect glow={variant === 'cyan' ? 'cyan' : variant === 'emerald' ? 'emerald' : 'none'}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-100 mt-1 font-mono tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={clsx(
                  'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                  trend.isPositive
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                )}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={clsx('p-3 rounded-xl border shrink-0', iconBgStyles[variant])}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
};
