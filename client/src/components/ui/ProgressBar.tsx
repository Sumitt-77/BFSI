import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  valueLabel?: string;
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'gradient';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  valueLabel,
  variant = 'cyan',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    cyan: 'bg-gradient-to-r from-sky-500 to-cyan-400',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    rose: 'bg-gradient-to-r from-rose-500 to-red-400',
    gradient: 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500',
  };

  return (
    <div className={twMerge('w-full flex flex-col space-y-1.5', className)}>
      {(label || valueLabel) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-semibold text-slate-300">{label}</span>}
          {valueLabel ? (
            <span className="font-mono font-medium text-slate-200">{valueLabel}</span>
          ) : (
            <span className="font-mono font-medium text-slate-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
