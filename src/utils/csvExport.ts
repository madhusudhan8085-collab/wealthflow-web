/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { YearlyBreakdownItem } from '../types/calculator';

export function exportBreakdownToCSV(
  breakdown: YearlyBreakdownItem[],
  filename: string,
  mode: 'sip' | 'swp' | 'combined' = 'sip'
): void {
  if (!breakdown || breakdown.length === 0) return;

  let headers: string[] = [];
  let rows: (string | number)[][] = [];

  if (mode === 'sip') {
    headers = [
      'Year',
      'Starting Balance (INR)',
      'Monthly SIP (INR)',
      'Annual Contribution (INR)',
      'Annual Gains (INR)',
      'Ending Balance (INR)',
      'Total Invested To Date (INR)',
      'Total Gains To Date (INR)',
    ];
    rows = breakdown.map((item) => [
      item.year,
      item.startingBalance,
      item.monthlyContribution || 0,
      item.annualContribution,
      item.annualGains,
      item.endingBalance,
      item.totalInvestedToDate,
      item.totalGainsToDate,
    ]);
  } else if (mode === 'swp') {
    headers = [
      'Year',
      'Starting Corpus (INR)',
      'Monthly Withdrawal (INR)',
      'Annual Withdrawal (INR)',
      'Annual Growth Earned (INR)',
      'Ending Corpus (INR)',
      'Total Withdrawn To Date (INR)',
      'Total Gains To Date (INR)',
    ];
    rows = breakdown.map((item) => [
      item.year,
      item.startingBalance,
      item.monthlyWithdrawal || 0,
      item.annualWithdrawal || 0,
      item.annualGains,
      item.endingBalance,
      item.totalWithdrawnToDate || 0,
      item.totalGainsToDate,
    ]);
  } else {
    headers = [
      'Year',
      'Starting Balance (INR)',
      'Flow / Contribution / Withdrawal (INR)',
      'Gains / Growth (INR)',
      'Ending Balance (INR)',
      'Total Invested (INR)',
      'Total Withdrawn (INR)',
    ];
    rows = breakdown.map((item) => [
      item.year,
      item.startingBalance,
      item.annualContribution > 0 ? item.annualContribution : -(item.annualWithdrawal || 0),
      item.annualGains,
      item.endingBalance,
      item.totalInvestedToDate,
      item.totalWithdrawnToDate || 0,
    ]);
  }

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
