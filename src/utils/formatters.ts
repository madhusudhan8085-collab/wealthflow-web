/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a numeric value into Indian Rupee (INR) currency format.
 * Supports compact representation (Lakhs, Crores) or full comma-separated format.
 */
export function formatINR(
  amount: number,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  }
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const { compact = false, decimals = 2, showSymbol = true } = options || {};
  const symbol = showSymbol ? '₹' : '';
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (compact) {
    if (absAmount >= 10000000) {
      // Crores (1 Cr = 1,00,00,000)
      const crVal = absAmount / 10000000;
      const formatted = crVal % 1 === 0 ? crVal.toString() : crVal.toFixed(decimals);
      return `${sign}${symbol}${formatted} Cr`;
    }
    if (absAmount >= 100000) {
      // Lakhs (1 Lakh = 1,00,000)
      const lakhVal = absAmount / 100000;
      const formatted = lakhVal % 1 === 0 ? lakhVal.toString() : lakhVal.toFixed(decimals);
      return `${sign}${symbol}${formatted} Lakh`;
    }
    if (absAmount >= 1000) {
      // Thousands (1 K = 1,000)
      const kVal = absAmount / 1000;
      const formatted = kVal % 1 === 0 ? kVal.toString() : kVal.toFixed(1);
      return `${sign}${symbol}${formatted} K`;
    }
    return `${sign}${symbol}${Math.round(absAmount).toLocaleString('en-IN')}`;
  }

  // Full Indian number format
  return `${sign}${symbol}${Math.round(absAmount).toLocaleString('en-IN')}`;
}

/**
 * Formats a percentage rate
 */
export function formatPercent(value: number, decimals = 1): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats human-friendly duration
 */
export function formatDuration(years: number): string {
  const roundedYears = Math.floor(years);
  const months = Math.round((years - roundedYears) * 12);
  if (months === 0) {
    return `${roundedYears} ${roundedYears === 1 ? 'year' : 'years'}`;
  }
  return `${roundedYears}y ${months}m`;
}

/**
 * Helper to parse a formatted or raw string into clean numeric value
 */
export function parseNumberInput(value: string, min = 0, max = Infinity): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}
