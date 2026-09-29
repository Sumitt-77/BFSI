import React from 'react';
import { clsx } from 'clsx';
import { RiskLevel } from '../../types';

export interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', className }) => {
  const norm = level.toLowerCase();

  let colorClasses = 'bg-slate-500/10 text-slate-300 border-slate-500/30';
  let dotColor = 'bg-slate-400';

  if (norm.includes('low') && !norm.includes('moderate')) {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (norm.includes('low to moderate')) {
    colorClasses = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    dotColor = 'bg-teal-400';
  } else if (norm.includes('moderate') && !norm.includes('high')) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (norm.includes('moderate to high')) {
    colorClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-400';
  } else if (norm.includes('high')) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-400';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium border backdrop-blur-sm select-none',
        colorClasses,
        sizeClasses[size],
        className
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full animate-pulse', dotColor)} />
      <span>{level}</span>
    </span>
  );
};
