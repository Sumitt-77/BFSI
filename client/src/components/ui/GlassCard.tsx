import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glow?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'none';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverEffect = false,
  glow = 'none',
  className,
  ...props
}) => {
  const glowClasses = {
    none: '',
    cyan: 'shadow-[0_0_30px_-5px_rgba(14,165,233,0.18)]',
    emerald: 'shadow-[0_0_30px_-5px_rgba(16,185,129,0.18)]',
    amber: 'shadow-[0_0_30px_-5px_rgba(245,158,11,0.18)]',
    purple: 'shadow-[0_0_30px_-5px_rgba(139,92,246,0.18)]',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
          hoverEffect && 'glass-panel-hover',
          glowClasses[glow],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
