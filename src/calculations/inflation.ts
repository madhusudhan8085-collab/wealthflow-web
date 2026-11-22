/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates future required value to maintain purchasing power given an inflation rate.
 * Example: ₹50 Lakh in 15 years at 6% inflation.
 */
export function calculateInflationAdjustedValue(
  currentCost: number,
  inflationRate: number,
  durationYears: number
): {
  futureRequiredValue: number;
  multiplier: number;
  purchasingPowerLossPct: number;
} {
  const safeCost = Math.max(0, currentCost);
  const safeRate = Math.max(0, inflationRate) / 100;
  const safeYears = Math.max(0, durationYears);

  const multiplier = Math.pow(1 + safeRate, safeYears);
  const futureRequiredValue = Math.round(safeCost * multiplier);
  const purchasingPowerLossPct = safeCost > 0 ? (1 - 1 / multiplier) * 100 : 0;

  return {
    futureRequiredValue,
    multiplier: Number(multiplier.toFixed(2)),
    purchasingPowerLossPct: Number(purchasingPowerLossPct.toFixed(1)),
  };
}

/**
 * Calculates real purchasing power in today's money of a future nominal amount.
 */
export function calculateTodayPurchasingPower(
  futureAmount: number,
  inflationRate: number,
  durationYears: number
): number {
  const safeAmount = Math.max(0, futureAmount);
  const safeRate = Math.max(0, inflationRate) / 100;
  const safeYears = Math.max(0, durationYears);

  const discountFactor = Math.pow(1 + safeRate, safeYears);
  return discountFactor > 0 ? Math.round(safeAmount / discountFactor) : 0;
}

/**
 * Calculates real rate of return adjusted for inflation using the Fisher Equation:
 * (1 + real) = (1 + nominal) / (1 + inflation)
 */
export function calculateRealReturn(nominalReturnRate: number, inflationRate: number): number {
  const nom = nominalReturnRate / 100;
  const inf = inflationRate / 100;

  if (1 + inf === 0) return nominalReturnRate;
  const realRate = (1 + nom) / (1 + inf) - 1;
  return Number((realRate * 100).toFixed(2));
}
