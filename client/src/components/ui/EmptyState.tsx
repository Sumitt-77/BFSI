import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30">
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 text-sky-400 mb-4 shadow-glass">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h4 className="text-lg font-bold text-slate-200">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mt-1 mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
