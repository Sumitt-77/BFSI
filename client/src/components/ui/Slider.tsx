import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue?: (val: number) => string;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  onChange,
  minLabel,
  maxLabel,
  className,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={twMerge('w-full flex flex-col space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
        <span className="text-sm font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-lg border border-sky-500/20 font-mono">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>

      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer outline-none transition-all"
          style={{
            background: `linear-gradient(to right, #0ea5e9 0%, #6366f1 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
          }}
          {...props}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 select-none">
        <span>{minLabel || (formatValue ? formatValue(min) : min)}</span>
        <span>{maxLabel || (formatValue ? formatValue(max) : max)}</span>
      </div>
    </div>
  );
};
