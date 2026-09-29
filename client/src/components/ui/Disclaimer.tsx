import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { clsx } from 'clsx';

export interface DisclaimerProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
  customText?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  variant = 'card',
  className,
  customText,
}) => {
  const standardText =
    customText ||
    'This platform provides estimates and educational financial information. Results are not guaranteed loan approvals, official credit scores, or professional financial advice. Actual lending decisions depend on individual lender underwriting, physical document verification, and applicable credit policies.';

  if (variant === 'banner') {
    return (
      <div className={clsx('bg-sky-950/40 border-y border-sky-500/20 py-2.5 px-4 text-xs text-sky-200/90 flex items-center justify-center gap-2 text-center', className)}>
        <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
        <span>{standardText}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <p className={clsx('text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed', className)}>
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>{standardText}</span>
      </p>
    );
  }

  return (
    <div
      className={clsx(
        'p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 flex items-start gap-3 backdrop-blur-md shadow-glass',
        className
      )}
    >
      <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0 mt-0.5">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <span className="font-semibold text-slate-300 block">Regulatory & Educational Notice</span>
        <p className="leading-relaxed">{standardText}</p>
      </div>
    </div>
  );
};
