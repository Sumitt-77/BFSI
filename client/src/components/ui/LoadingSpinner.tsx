import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  subtext?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  subtext,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute w-16 h-16 rounded-full bg-sky-500/20 animate-ping opacity-60 pointer-events-none" />
        <div className="relative p-3 rounded-2xl bg-slate-900 border border-sky-500/30 shadow-glow">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-sky-400`} />
        </div>
      </div>
      {text && <p className="text-base font-semibold text-slate-100">{text}</p>}
      {subtext && <p className="text-xs text-slate-400 max-w-sm">{subtext}</p>}
    </div>
  );
};
