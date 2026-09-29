import React from 'react';
import { Button } from './Button';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while processing your financial request. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/20 bg-rose-500/5 ${className}`}>
      <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3 shadow-glass">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-100">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" iconLeft={<RotateCcw className="w-4 h-4" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
