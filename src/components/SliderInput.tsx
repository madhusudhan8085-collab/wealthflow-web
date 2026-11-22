/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface Preset {
  label: string;
  value: number;
}

interface SliderInputProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  isCurrency?: boolean;
  tooltip?: string;
  presets?: Preset[];
  onChange: (val: number) => void;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  prefix = '',
  isCurrency = false,
  tooltip,
  presets,
  onChange,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      onChange(Math.min(max * 2, Math.max(0, num)));
    } else if (rawVal === '') {
      onChange(0);
    }
  };

  return (
    <div id={`container-${id}`} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <label htmlFor={`input-${id}`}>{label}</label>
          {tooltip && (
            <span title={tooltip} className="cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <div className="flex items-center">
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-lg px-2.5 py-1 border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all">
            {prefix && <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm mr-0.5">{prefix}</span>}
            <input
              id={`input-${id}`}
              type="text"
              value={isCurrency ? (value > 0 ? value.toLocaleString('en-IN') : '0') : value}
              onChange={handleInputChange}
              className="w-24 sm:w-28 text-right bg-transparent text-sm sm:text-base font-bold text-slate-900 dark:text-white focus:outline-none font-mono"
            />
            {unit && <span className="text-slate-500 dark:text-slate-400 font-medium text-xs ml-1">{unit}</span>}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative py-1">
        <input
          id={`range-${id}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(max, Math.max(min, value))}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          style={{
            background: `linear-gradient(to right, #059669 0%, #059669 ${percentage}%, var(--tw-slate-200, #e2e8f0) ${percentage}%, var(--tw-slate-200, #e2e8f0) 100%)`,
          }}
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1">
          <span>{isCurrency ? formatINR(min, { compact: true }) : `${min}${unit}`}</span>
          <span>{isCurrency ? formatINR(max, { compact: true }) : `${max}${unit}`}</span>
        </div>
      </div>

      {/* Quick Presets */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {presets.map((preset) => (
            <button
              key={preset.label}
              id={`preset-${id}-${preset.label}`}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${
                value === preset.value
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
