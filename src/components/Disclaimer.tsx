/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <aside aria-label="Financial Disclaimer" className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
        <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
        <span>Important Financial Disclaimer</span>
      </div>
      <p className="leading-relaxed">
        These calculations are illustrative estimates based on the mathematical assumptions entered. Mutual fund investments and equity market assets are subject to market risks. Actual investment returns may vary, are not guaranteed, and past performance is no guarantee of future returns. Please consult a SEBI-registered financial advisor before making any investment or withdrawal decisions.
      </p>
    </aside>
  );
};
