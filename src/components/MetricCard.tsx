/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { formatINR } from '../utils/formatters';

interface MetricCardProps {
  id: string;
  title: string;
  amount: number;
  subtitle?: string;
  badge?: {
    text: string;
    type?: 'success' | 'info' | 'warning' | 'neutral';
  };
  isCompact?: boolean;
  highlight?: boolean;
  color?: 'emerald' | 'blue' | 'amber' | 'indigo';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  amount,
  subtitle,
  badge,
  isCompact = true,
  highlight = false,
  color = 'emerald',
}) => {
  const formattedCompact = formatINR(amount, { compact: true });
  const formattedExact = formatINR(amount, { compact: false });

  const badgeColorMap = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const highlightBorder = highlight
    ? color === 'emerald'
      ? 'border-emerald-500/30 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm'
      : 'border-blue-500/30 dark:border-blue-500/30 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm'
    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900';

  return (
    <div
      id={id}
      className={`rounded-xl p-4 sm:p-5 border transition-all ${highlightBorder}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {badge && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              badgeColorMap[badge.type || 'neutral']
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 flex-wrap" title={`Exact: ${formattedExact}`}>
        <span
          className={`font-mono font-extrabold tracking-tight ${
            highlight
              ? 'text-2xl sm:text-3xl lg:text-4xl text-emerald-600 dark:text-emerald-400'
              : 'text-xl sm:text-2xl text-slate-900 dark:text-white'
          }`}
        >
          {isCompact ? formattedCompact : formattedExact}
        </span>
        {isCompact && (
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
            ({formattedExact})
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
