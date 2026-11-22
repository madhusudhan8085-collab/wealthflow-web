/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScenarioResult, SensitivityMatrixCell, SipInputs } from '../types/calculator';
import { calculateSIP } from './sip';

export function calculateReturnScenarios(
  inputs: SipInputs,
  conservativeRate = 8,
  baseRate = 12,
  optimisticRate = 15
): ScenarioResult {
  const conservativeResult = calculateSIP({
    ...inputs,
    expectedReturnAnnual: conservativeRate,
  });

  const baseResult = calculateSIP({
    ...inputs,
    expectedReturnAnnual: baseRate,
  });

  const optimisticResult = calculateSIP({
    ...inputs,
    expectedReturnAnnual: optimisticRate,
  });

  return {
    conservative: {
      returnRate: conservativeRate,
      corpus: conservativeResult.finalCorpus,
      gains: conservativeResult.estimatedGains,
    },
    base: {
      returnRate: baseRate,
      corpus: baseResult.finalCorpus,
      gains: baseResult.estimatedGains,
    },
    optimistic: {
      returnRate: optimisticRate,
      corpus: optimisticResult.finalCorpus,
      gains: optimisticResult.estimatedGains,
    },
  };
}

export function calculateSensitivityMatrix(
  baseInputs: SipInputs,
  returnRates = [8, 10, 12, 14, 16],
  durations = [5, 10, 15, 20, 25]
): SensitivityMatrixCell[][] {
  return returnRates.map((r) => {
    return durations.map((d) => {
      const res = calculateSIP({
        ...baseInputs,
        expectedReturnAnnual: r,
        durationYears: d,
      });
      return {
        returnRate: r,
        durationYears: d,
        finalCorpus: res.finalCorpus,
        totalInvested: res.totalInvested,
      };
    });
  });
}
