/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CombinedCalculationResult, CombinedInputs } from '../types/calculator';
import { calculateSIP } from './sip';
import { calculateSWP } from './swp';

/**
 * Simulates complete wealth lifecycle:
 * Phase 1: Wealth Accumulation via SIP with optional step-up
 * Phase 2: Systematic Wealth Distribution via SWP
 */
export function calculateSIPToSWP(inputs: CombinedInputs): CombinedCalculationResult {
  // Phase 1: Accumulate
  const accumulationResult = calculateSIP({
    monthlyInvestment: inputs.sipMonthlyInvestment,
    durationYears: inputs.sipDurationYears,
    expectedReturnAnnual: inputs.sipExpectedReturnAnnual,
    frequency: 'monthly',
    hasStepUp: inputs.sipHasStepUp,
    stepUpType: 'percentage',
    stepUpValue: inputs.sipStepUpPercentage,
    stepUpIntervalYears: 1,
    initialInvestment: inputs.sipInitialInvestment,
  });

  const accumulatedCorpus = accumulationResult.finalCorpus;

  // Phase 2: Withdraw
  const withdrawalResult = calculateSWP({
    startingCorpus: accumulatedCorpus,
    expectedReturnAnnual: inputs.swpExpectedReturnAnnual,
    monthlyWithdrawal: inputs.swpMonthlyWithdrawal,
    withdrawalDurationYears: inputs.swpDurationYears,
    frequency: 'monthly',
    hasAnnualIncrease: inputs.swpHasAnnualIncrease,
    annualIncreasePercentage: inputs.swpAnnualIncreasePercentage,
    isInflationLinked: false,
    expectedInflationRate: 0,
  });

  // Build unified continuous timeline
  const combinedTimeline: Array<{
    year: number;
    phase: 'accumulation' | 'withdrawal';
    corpus: number;
    flow: number;
    gains: number;
  }> = [];

  // Add Phase 1 years
  accumulationResult.yearlyBreakdown.forEach((item) => {
    combinedTimeline.push({
      year: item.year,
      phase: 'accumulation',
      corpus: item.endingBalance,
      flow: item.annualContribution,
      gains: item.annualGains,
    });
  });

  // Add Phase 2 years
  const phase1Duration = inputs.sipDurationYears;
  withdrawalResult.yearlyBreakdown.forEach((item) => {
    combinedTimeline.push({
      year: phase1Duration + item.year,
      phase: 'withdrawal',
      corpus: item.endingBalance,
      flow: -(item.annualWithdrawal || 0),
      gains: item.annualGains,
    });
  });

  const totalInvestedLifetime = accumulationResult.totalInvested;
  const totalWithdrawnLifetime = withdrawalResult.totalWithdrawn;
  const finalCorpusRemaining = withdrawalResult.finalRemainingCorpus;
  const netWealthGenerated =
    totalWithdrawnLifetime + finalCorpusRemaining - totalInvestedLifetime;

  return {
    accumulation: accumulationResult,
    withdrawal: withdrawalResult,
    totalInvestedLifetime,
    totalWithdrawnLifetime,
    netWealthGenerated,
    finalCorpusRemaining,
    isWithdrawalSustainable: !withdrawalResult.isCorpusDepleted,
    combinedTimeline,
  };
}
