/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Frequency, SwpCalculationResult, SwpInputs, YearlyBreakdownItem } from '../types/calculator';

/**
 * Calculates SWP (Systematic Withdrawal Plan).
 *
 * Sequence of events per month:
 * 1. Balance at start of month B.
 * 2. Withdrawal W is deducted at the start of the month (for living expenses).
 *    If B < W, the withdrawal is capped to remaining balance B, and corpus depletes.
 * 3. Remaining balance (B - W) stays invested and earns monthly interest:
 *    Interest = (B - W) * (expectedAnnualReturn / 100 / 12).
 * 4. Ending balance = (B - W) + Interest.
 *
 * Supports:
 * - Annual withdrawal increase (percentage or inflation linked).
 * - Exact depletion month and year detection.
 * - Safe withdrawal rate calculation.
 */
export function calculateSWP(inputs: SwpInputs): SwpCalculationResult {
  const {
    startingCorpus = 0,
    expectedReturnAnnual = 8,
    monthlyWithdrawal = 0,
    withdrawalDurationYears = 20,
    frequency = 'monthly',
    hasAnnualIncrease = false,
    annualIncreasePercentage = 0,
    isInflationLinked = false,
    expectedInflationRate = 6,
  } = inputs;

  const validDuration = Math.max(1, Math.min(50, Math.floor(withdrawalDurationYears)));
  const totalMonths = validDuration * 12;
  const safeReturn = Math.max(0, expectedReturnAnnual);
  const monthlyRate = safeReturn / 100 / 12;

  let currentCorpus = Math.max(0, startingCorpus);
  let totalWithdrawn = 0;
  let totalGainsEarned = 0;
  let isDepleted = false;
  let depletionYear: number | null = null;
  let depletionMonth: number | null = null;
  let depletionTotalMonths: number | null = null;

  const yearlyBreakdown: YearlyBreakdownItem[] = [];

  // Effective annual increase percentage
  const annualStepUpPct = isInflationLinked
    ? expectedInflationRate
    : hasAnnualIncrease
      ? annualIncreasePercentage
      : 0;

  let currentMonthlyWithdrawal = Math.max(0, monthlyWithdrawal);

  let globalMonthCounter = 0;

  for (let year = 1; year <= validDuration; year++) {
    const yearStartCorpus = currentCorpus;
    let yearWithdrawn = 0;
    let yearGains = 0;

    // Apply annual step-up to withdrawal starting from year 2
    if (year > 1 && annualStepUpPct > 0) {
      currentMonthlyWithdrawal = monthlyWithdrawal * Math.pow(1 + annualStepUpPct / 100, year - 1);
    }

    for (let month = 1; month <= 12; month++) {
      globalMonthCounter++;

      if (currentCorpus <= 0) {
        if (!isDepleted) {
          isDepleted = true;
          depletionYear = year;
          depletionMonth = month;
          depletionTotalMonths = globalMonthCounter - 1;
        }
        continue;
      }

      let plannedWithdrawalThisMonth = 0;

      if (frequency === 'monthly') {
        plannedWithdrawalThisMonth = currentMonthlyWithdrawal;
      } else if (frequency === 'quarterly') {
        if ((month - 1) % 3 === 0) {
          plannedWithdrawalThisMonth = currentMonthlyWithdrawal * 3;
        }
      } else if (frequency === 'yearly') {
        if (month === 1) {
          plannedWithdrawalThisMonth = currentMonthlyWithdrawal * 12;
        }
      }

      // Deduct withdrawal
      const actualWithdrawal = Math.min(currentCorpus, plannedWithdrawalThisMonth);
      totalWithdrawn += actualWithdrawal;
      yearWithdrawn += actualWithdrawal;
      currentCorpus -= actualWithdrawal;

      if (currentCorpus <= 0 && !isDepleted) {
        isDepleted = true;
        depletionYear = year;
        depletionMonth = month;
        depletionTotalMonths = globalMonthCounter;
      }

      // Earn interest on remaining corpus
      const monthGain = currentCorpus * monthlyRate;
      currentCorpus += monthGain;
      yearGains += monthGain;
      totalGainsEarned += monthGain;
    }

    yearlyBreakdown.push({
      year,
      startingBalance: Math.round(yearStartCorpus),
      annualContribution: 0,
      annualWithdrawal: Math.round(yearWithdrawn),
      annualGains: Math.round(yearGains),
      endingBalance: Math.round(currentCorpus),
      totalInvestedToDate: Math.round(startingCorpus),
      totalWithdrawnToDate: Math.round(totalWithdrawn),
      totalGainsToDate: Math.round(totalGainsEarned),
      monthlyWithdrawal: Math.round(currentMonthlyWithdrawal),
    });
  }

  // Safe withdrawal rate (% of starting corpus withdrawn in Year 1)
  const annualWithdrawalYear1 = monthlyWithdrawal * 12;
  const safeWithdrawalRate = startingCorpus > 0 ? (annualWithdrawalYear1 / startingCorpus) * 100 : 0;

  // Check perpetual sustainability:
  // If annual growth on starting corpus exceeds annual withdrawal (and no annual increase that overtakes it)
  // and corpus at end of duration is greater than or equal to starting corpus
  const isSustainableForever = !isDepleted && currentCorpus >= startingCorpus;

  return {
    startingCorpus: Math.round(startingCorpus),
    totalWithdrawn: Math.round(totalWithdrawn),
    finalRemainingCorpus: Math.round(currentCorpus),
    totalGainsEarned: Math.round(totalGainsEarned),
    isCorpusDepleted: isDepleted,
    depletionYear,
    depletionMonth,
    depletionTotalMonths,
    yearlyBreakdown,
    isSustainableForever,
    safeWithdrawalRate: Number(safeWithdrawalRate.toFixed(2)),
  };
}

/**
 * Calculates the required initial corpus needed to support a monthly withdrawal for N years.
 * Uses binary search / annuity inversion for exact match considering interest and step-up.
 */
export function calculateRequiredCorpus(
  monthlyWithdrawal: number,
  durationYears: number,
  expectedReturnAnnual: number,
  annualIncreasePercentage = 0
): number {
  if (monthlyWithdrawal <= 0 || durationYears <= 0) return 0;

  let low = 0;
  let high = monthlyWithdrawal * 12 * durationYears * 3; // safe upper bound
  let best = high;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const sim = calculateSWP({
      startingCorpus: mid,
      expectedReturnAnnual,
      monthlyWithdrawal,
      withdrawalDurationYears: durationYears,
      frequency: 'monthly',
      hasAnnualIncrease: annualIncreasePercentage > 0,
      annualIncreasePercentage,
      isInflationLinked: false,
      expectedInflationRate: 0,
    });

    if (!sim.isCorpusDepleted && sim.finalRemainingCorpus >= 0) {
      best = mid;
      high = mid; // Try smaller corpus
    } else {
      low = mid;
    }
  }

  return Math.round(best);
}

/**
 * Calculates maximum sustainable monthly withdrawal for a given starting corpus and duration,
 * leaving a minimum target remaining balance (default 0).
 */
export function calculateSustainableWithdrawal(
  startingCorpus: number,
  durationYears: number,
  expectedReturnAnnual: number,
  annualIncreasePercentage = 0
): number {
  if (startingCorpus <= 0 || durationYears <= 0) return 0;

  let low = 0;
  let high = startingCorpus; // safe upper bound for monthly withdrawal
  let best = 0;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const sim = calculateSWP({
      startingCorpus,
      expectedReturnAnnual,
      monthlyWithdrawal: mid,
      withdrawalDurationYears: durationYears,
      frequency: 'monthly',
      hasAnnualIncrease: annualIncreasePercentage > 0,
      annualIncreasePercentage,
      isInflationLinked: false,
      expectedInflationRate: 0,
    });

    if (!sim.isCorpusDepleted) {
      best = mid;
      low = mid; // Try higher withdrawal
    } else {
      high = mid;
    }
  }

  return Math.round(best);
}
