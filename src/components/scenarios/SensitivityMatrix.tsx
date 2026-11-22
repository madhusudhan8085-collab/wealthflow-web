/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Grid, TableProperties } from 'lucide-react';
import { SipInputs } from '../../types/calculator';
import { calculateSensitivityMatrix } from '../../calculations/scenarios';
import { formatINR } from '../../utils/formatters';

interface SensitivityMatrixProps {
  baseInputs: SipInputs;
  isCompactCurrency?: boolean;
}

export const SensitivityMatrix: React.FC<SensitivityMatrixProps> = ({
  baseInputs,
  isCompactCurrency = true,
}) => {
  const [returnRates] = useState([8, 10, 12, 14, 16]);
  const [durations] = useState([5, 10, 15, 20, 25]);

  const matrix = calculateSensitivityMatrix(baseInputs, returnRates, durations);

  return (
    <div id="sensitivity-matrix-card" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-emerald-600" />
            <span>Sensitivity Matrix: Expected Return vs Investment Duration</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cross-tabulation of final estimated corpus across diverse market horizons and annualized returns.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <th className="py-2.5 px-3 text-left">Annual Return</th>
              {durations.map((d) => (
                <th key={d} className="py-2.5 px-3">
                  {d} Years
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {matrix.map((row, idx) => {
              const returnRate = returnRates[idx];
              const isBaseRate = returnRate === baseInputs.expectedReturnAnnual;
              return (
                <tr
                  key={returnRate}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    isBaseRate ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-bold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-left font-bold text-slate-800 dark:text-slate-200">
                    {returnRate}% p.a.
                    {isBaseRate && (
                      <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-sans">
                        (current)
                      </span>
                    )}
                  </td>
                  {row.map((cell) => {
                    const isCurrentCell =
                      isBaseRate && cell.durationYears === baseInputs.durationYears;
                    return (
                      <td
                        key={cell.durationYears}
                        className={`py-2.5 px-3 ${
                          isCurrentCell
                            ? 'bg-emerald-600 text-white rounded font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {formatINR(cell.finalCorpus, { compact: isCompactCurrency })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
