/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { YearlyBreakdownItem } from '../../types/calculator';
import { formatINR } from '../../utils/formatters';
import { exportBreakdownToCSV } from '../../utils/csvExport';

interface YearlyBreakdownTableProps {
  data: YearlyBreakdownItem[];
  mode?: 'sip' | 'swp' | 'combined';
  isCompactCurrency?: boolean;
}

export const YearlyBreakdownTable: React.FC<YearlyBreakdownTableProps> = ({
  data,
  mode = 'sip',
  isCompactCurrency = true,
}) => {
  const [sortAsc, setSortAsc] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayedData = [...data].sort((a, b) => (sortAsc ? a.year - b.year : b.year - a.year));
  const visibleRows = showAll ? displayedData : displayedData.slice(0, 10);

  const handleExportCSV = () => {
    exportBreakdownToCSV(data, `wealthflow_${mode}_breakdown`, (mode || 'sip') as 'sip' | 'swp' | 'combined');
  };

  return (
    <div id="yearly-breakdown-section" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Year-by-Year Schedule
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'sip'
              ? 'Complete schedule of contributions, compounding interest, and portfolio trajectory.'
              : mode === 'swp'
              ? 'Annual withdrawals, remaining corpus, and growth generated.'
              : 'Lifecycle schedule from accumulation to distribution.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="sort-table-btn"
            type="button"
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Oldest First' : 'Newest First'}</span>
          </button>

          <button
            id="export-csv-btn"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 select-none">
              <th className="py-3 px-3 sm:px-4">Year</th>
              <th className="py-3 px-3 sm:px-4 text-right">Start Balance</th>
              {mode === 'sip' && (
                <>
                  <th className="py-3 px-3 sm:px-4 text-right">Monthly SIP</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Annual Invested</th>
                </>
              )}
              {mode === 'swp' && (
                <>
                  <th className="py-3 px-3 sm:px-4 text-right">Monthly W/D</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Annual W/D</th>
                </>
              )}
              <th className="py-3 px-3 sm:px-4 text-right text-emerald-600 dark:text-emerald-400">
                Annual Growth
              </th>
              <th className="py-3 px-3 sm:px-4 text-right font-bold text-slate-900 dark:text-white">
                Closing Balance
              </th>
              <th className="py-3 px-3 sm:px-4 text-right text-slate-500 dark:text-slate-400">
                {mode === 'swp' ? 'Total Withdrawn' : 'Total Invested'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {visibleRows.map((item) => (
              <tr
                key={item.year}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 dark:text-slate-300">
                  Year {item.year}
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right text-slate-600 dark:text-slate-400">
                  {formatINR(item.startingBalance, { compact: isCompactCurrency })}
                </td>
                {mode === 'sip' && (
                  <>
                    <td className="py-2.5 px-3 sm:px-4 text-right text-slate-600 dark:text-slate-400">
                      {formatINR(item.monthlyContribution || 0, { compact: false })}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-right text-blue-600 dark:text-blue-400 font-medium">
                      +{formatINR(item.annualContribution, { compact: isCompactCurrency })}
                    </td>
                  </>
                )}
                {mode === 'swp' && (
                  <>
                    <td className="py-2.5 px-3 sm:px-4 text-right text-slate-600 dark:text-slate-400">
                      {formatINR(item.monthlyWithdrawal || 0, { compact: false })}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-right text-amber-600 dark:text-amber-400 font-medium">
                      -{formatINR(item.annualWithdrawal || 0, { compact: isCompactCurrency })}
                    </td>
                  </>
                )}
                <td className="py-2.5 px-3 sm:px-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                  +{formatINR(item.annualGains, { compact: isCompactCurrency })}
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-slate-900 dark:text-white">
                  {formatINR(item.endingBalance, { compact: isCompactCurrency })}
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right text-slate-500 dark:text-slate-400">
                  {formatINR(
                    mode === 'swp' ? item.totalWithdrawnToDate || 0 : item.totalInvestedToDate,
                    { compact: isCompactCurrency }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedData.length > 10 && (
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            id="toggle-table-rows-btn"
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show Less (First 10 Years)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show All {displayedData.length} Years</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
