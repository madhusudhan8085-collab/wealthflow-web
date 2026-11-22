/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SipInputs } from '../types/calculator';
import { calculateSIP } from './sip';

export interface WhatIfDeltaResult {
  title: string;
  description: string;
  currentCorpus: number;
  newCorpus: number;
  deltaCorpus: number;
  currentInvested: number;
  newInvested: number;
  deltaInvested: number;
  extraWealthRatio: number;
}

export function calculateWhatIfScenarios(baseInputs: SipInputs): {
  increaseSIP5k: WhatIfDeltaResult;
  add5Years: WhatIfDeltaResult;
  increaseReturn2Pct: WhatIfDeltaResult;
  enable10PctStepUp: WhatIfDeltaResult;
  costOfDelay3Years: {
    delayedCorpus: number;
    lostWealth: number;
    missedInvestment: number;
    description: string;
  };
} {
  const current = calculateSIP(baseInputs);

  // 1. Increase monthly SIP by ₹5,000
  const plus5kInputs = { ...baseInputs, monthlyInvestment: baseInputs.monthlyInvestment + 5000 };
  const plus5kResult = calculateSIP(plus5kInputs);
  const deltaCorpus5k = plus5kResult.finalCorpus - current.finalCorpus;
  const deltaInvested5k = plus5kResult.totalInvested - current.totalInvested;

  // 2. Extend duration by 5 years
  const plus5YearsInputs = { ...baseInputs, durationYears: baseInputs.durationYears + 5 };
  const plus5YearsResult = calculateSIP(plus5YearsInputs);
  const deltaCorpus5Y = plus5YearsResult.finalCorpus - current.finalCorpus;
  const deltaInvested5Y = plus5YearsResult.totalInvested - current.totalInvested;

  // 3. Expected return +2%
  const plus2PctInputs = { ...baseInputs, expectedReturnAnnual: baseInputs.expectedReturnAnnual + 2 };
  const plus2PctResult = calculateSIP(plus2PctInputs);
  const deltaCorpus2Pct = plus2PctResult.finalCorpus - current.finalCorpus;
  const deltaInvested2Pct = plus2PctResult.totalInvested - current.totalInvested;

  // 4. Enable 10% Step-Up if not already enabled, or add 5%
  const stepUpVal = baseInputs.hasStepUp ? baseInputs.stepUpValue + 5 : 10;
  const stepUpInputs: SipInputs = {
    ...baseInputs,
    hasStepUp: true,
    stepUpType: 'percentage',
    stepUpValue: stepUpVal,
  };
  const stepUpResult = calculateSIP(stepUpInputs);
  const deltaCorpusStepUp = stepUpResult.finalCorpus - current.finalCorpus;
  const deltaInvestedStepUp = stepUpResult.totalInvested - current.totalInvested;

  // 5. Cost of 3-Year Delay
  // Delaying 3 years means investing for (duration - 3) years
  const delayYears = Math.min(3, Math.max(1, baseInputs.durationYears - 1));
  const delayedInputs = {
    ...baseInputs,
    durationYears: Math.max(1, baseInputs.durationYears - delayYears),
  };
  const delayedResult = calculateSIP(delayedInputs);
  const lostWealth = current.finalCorpus - delayedResult.finalCorpus;
  const missedInvestment = current.totalInvested - delayedResult.totalInvested;

  return {
    increaseSIP5k: {
      title: 'Increase SIP by ₹5,000/mo',
      description: 'See the power of adding just ₹5,000 each month to your regular contributions.',
      currentCorpus: current.finalCorpus,
      newCorpus: plus5kResult.finalCorpus,
      deltaCorpus: deltaCorpus5k,
      currentInvested: current.totalInvested,
      newInvested: plus5kResult.totalInvested,
      deltaInvested: deltaInvested5k,
      extraWealthRatio: deltaInvested5k > 0 ? Number((deltaCorpus5k / deltaInvested5k).toFixed(2)) : 1,
    },
    add5Years: {
      title: 'Stay Invested 5 Years Longer',
      description: 'The final 5 years of an investment journey usually produce the highest compounding surge.',
      currentCorpus: current.finalCorpus,
      newCorpus: plus5YearsResult.finalCorpus,
      deltaCorpus: deltaCorpus5Y,
      currentInvested: current.totalInvested,
      newInvested: plus5YearsResult.totalInvested,
      deltaInvested: deltaInvested5Y,
      extraWealthRatio: deltaInvested5Y > 0 ? Number((deltaCorpus5Y / deltaInvested5Y).toFixed(2)) : 1,
    },
    increaseReturn2Pct: {
      title: 'Boost Return by +2%',
      description: 'Asset allocation optimization or lower expense ratios yielding an extra 2% annual return.',
      currentCorpus: current.finalCorpus,
      newCorpus: plus2PctResult.finalCorpus,
      deltaCorpus: deltaCorpus2Pct,
      currentInvested: current.totalInvested,
      newInvested: plus2PctResult.totalInvested,
      deltaInvested: deltaInvested2Pct,
      extraWealthRatio: deltaInvested2Pct === 0 ? Infinity : 1,
    },
    enable10PctStepUp: {
      title: `Step-Up SIP (+${stepUpVal}%/yr)`,
      description: 'Increasing your monthly contribution every year alongside salary raises.',
      currentCorpus: current.finalCorpus,
      newCorpus: stepUpResult.finalCorpus,
      deltaCorpus: deltaCorpusStepUp,
      currentInvested: current.totalInvested,
      newInvested: stepUpResult.totalInvested,
      deltaInvested: deltaInvestedStepUp,
      extraWealthRatio: deltaInvestedStepUp > 0 ? Number((deltaCorpusStepUp / deltaInvestedStepUp).toFixed(2)) : 1,
    },
    costOfDelay3Years: {
      delayedCorpus: delayedResult.finalCorpus,
      lostWealth,
      missedInvestment,
      description: `Waiting ${delayYears} years to start investing could reduce your final corpus by ₹${lostWealth.toLocaleString('en-IN')}.`,
    },
  };
}
