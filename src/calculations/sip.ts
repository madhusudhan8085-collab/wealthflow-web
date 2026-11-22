/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Frequency, SipCalculationResult, SipInputs, StepUpType, YearlyBreakdownItem } from '../types/calculator';

/**
 * Calculates SIP with optional step-up (percentage or fixed amount),
 * flexible contribution frequencies (monthly, quarterly, yearly),
 * and initial lump-sum balance.
 *
 * Compounding methodology:
 * Standard mutual fund SIP assumes investment is made at the beginning of each frequency period.
 * Monthly interest rate r = (annualReturn / 100) / 12.
 * Handled sequentially month-by-month for exact compounding without formula approximation error.
 */
export function calculateSIP(inputs: SipInputs): SipCalculationResult {
  const {
    monthlyInvestment = 0,
    durationYears = 1,
    expectedReturnAnnual = 12,
    frequency = 'monthly',
    hasStepUp = false,
    stepUpType = 'percentage',
    stepUpValue = 0,
    stepUpIntervalYears = 1,
    initialInvestment = 0,
    contributionTiming = 'beginning',
  } = inputs;

  const validDuration = Math.max(1, Math.min(60, Math.floor(durationYears)));
  const totalMonths = validDuration * 12;
  const safeReturn = Math.max(0, expectedReturnAnnual);
  const monthlyRate = safeReturn / 100 / 12;

  // Track state
  let currentBalance = Math.max(0, initialInvestment);
  let totalInvested = Math.max(0, initialInvestment);
  let totalGains = 0;

  const yearlyBreakdown: YearlyBreakdownItem[] = [];

  // Determine base contribution per month
  let baseMonthlyContribution = Math.max(0, monthlyInvestment);

  for (let year = 1; year <= validDuration; year++) {
    const yearStartBalance = currentBalance;
    let yearContribution = 0;
    let yearGains = 0;

    // Calculate current year's monthly contribution if step-up applies
    if (hasStepUp && year > 1 && stepUpValue > 0) {
      const stepPeriods = Math.floor((year - 1) / Math.max(1, stepUpIntervalYears));
      if (stepPeriods > 0) {
        if (stepUpType === 'percentage') {
          // Compound percentage step-up: base * (1 + pct/100)^periods
          baseMonthlyContribution = monthlyInvestment * Math.pow(1 + stepUpValue / 100, stepPeriods);
        } else {
          // Fixed rupee step-up: base + fixed * periods
          baseMonthlyContribution = monthlyInvestment + stepUpValue * stepPeriods;
        }
      }
    }

    const currentMonthlyRateContribution = baseMonthlyContribution;

    // Run 12 months for this year
    for (let month = 1; month <= 12; month++) {
      let monthContribution = 0;

      if (frequency === 'monthly') {
        monthContribution = currentMonthlyRateContribution;
      } else if (frequency === 'quarterly') {
        // Contribute on month 1, 4, 7, 10
        if ((month - 1) % 3 === 0) {
          monthContribution = currentMonthlyRateContribution * 3;
        }
      } else if (frequency === 'yearly') {
        // Contribute on month 1
        if (month === 1) {
          monthContribution = currentMonthlyRateContribution * 12;
        }
      }

      totalInvested += monthContribution;
      yearContribution += monthContribution;

      if (contributionTiming === 'end') {
        // End-of-month contribution: Interest accrues on existing balance first, then deposit is added
        const monthGain = currentBalance * monthlyRate;
        currentBalance += monthGain;
        currentBalance += monthContribution;
        yearGains += monthGain;
        totalGains += monthGain;
      } else {
        // Beginning-of-month contribution (standard MF SIP): Deposit is made first, then whole balance earns interest
        currentBalance += monthContribution;
        const monthGain = currentBalance * monthlyRate;
        currentBalance += monthGain;
        yearGains += monthGain;
        totalGains += monthGain;
      }
    }

    yearlyBreakdown.push({
      year,
      startingBalance: Math.round(yearStartBalance),
      annualContribution: Math.round(yearContribution),
      annualGains: Math.round(yearGains),
      endingBalance: Math.round(currentBalance),
      totalInvestedToDate: Math.round(totalInvested),
      totalGainsToDate: Math.round(totalGains),
      monthlyContribution: Math.round(currentMonthlyRateContribution),
    });
  }

  const finalCorpus = Math.round(currentBalance);
  const roundedInvested = Math.round(totalInvested);
  const estimatedGains = Math.max(0, finalCorpus - roundedInvested);
  const wealthMultiplier = roundedInvested > 0 ? Number((finalCorpus / roundedInvested).toFixed(2)) : 1;

  return {
    totalInvested: roundedInvested,
    estimatedGains,
    finalCorpus,
    wealthMultiplier,
    yearlyBreakdown,
    effectiveAnnualReturn: expectedReturnAnnual,
  };
}

/**
 * Calculates the required monthly SIP to achieve a target corpus.
 * Solves using exact numerical simulation scaling:
 * Since final corpus is linear with respect to the initial contribution amount (with or without step-up),
 * we simulate with base = 10,000 and calculate exact scale factor.
 */
export function calculateRequiredSIP(
  targetCorpus: number,
  durationYears: number,
  expectedReturnAnnual: number,
  stepUpPercentage = 0,
  initialInvestment = 0,
  frequency: Frequency = 'monthly'
): {
  requiredMonthlySIP: number;
  totalInvested: number;
  estimatedGains: number;
  finalCorpus: number;
  breakdown: YearlyBreakdownItem[];
} {
  if (targetCorpus <= 0) {
    return {
      requiredMonthlySIP: 0,
      totalInvested: 0,
      estimatedGains: 0,
      finalCorpus: 0,
      breakdown: [],
    };
  }

  // Future value of initial lump sum alone
  const lumpSumSim = calculateSIP({
    monthlyInvestment: 0,
    durationYears,
    expectedReturnAnnual,
    frequency,
    hasStepUp: false,
    stepUpType: 'percentage',
    stepUpValue: 0,
    stepUpIntervalYears: 1,
    initialInvestment,
  });

  const remainingTarget = Math.max(0, targetCorpus - lumpSumSim.finalCorpus);

  if (remainingTarget <= 0) {
    return {
      requiredMonthlySIP: 0,
      totalInvested: lumpSumSim.totalInvested,
      estimatedGains: lumpSumSim.estimatedGains,
      finalCorpus: lumpSumSim.finalCorpus,
      breakdown: lumpSumSim.yearlyBreakdown,
    };
  }

  // Run unit test simulation with 10,000 monthly SIP
  const unitMonthlySIP = 10000;
  const unitSim = calculateSIP({
    monthlyInvestment: unitMonthlySIP,
    durationYears,
    expectedReturnAnnual,
    frequency,
    hasStepUp: stepUpPercentage > 0,
    stepUpType: 'percentage',
    stepUpValue: stepUpPercentage,
    stepUpIntervalYears: 1,
    initialInvestment: 0,
  });

  const unitFinalCorpus = unitSim.finalCorpus;
  const scale = unitFinalCorpus > 0 ? remainingTarget / unitFinalCorpus : 0;
  const requiredMonthlySIP = Math.round(unitMonthlySIP * scale);

  // Re-run with exact computed monthly SIP + initial investment
  const exactResult = calculateSIP({
    monthlyInvestment: requiredMonthlySIP,
    durationYears,
    expectedReturnAnnual,
    frequency,
    hasStepUp: stepUpPercentage > 0,
    stepUpType: 'percentage',
    stepUpValue: stepUpPercentage,
    stepUpIntervalYears: 1,
    initialInvestment,
  });

  return {
    requiredMonthlySIP,
    totalInvested: exactResult.totalInvested,
    estimatedGains: exactResult.estimatedGains,
    finalCorpus: exactResult.finalCorpus,
    breakdown: exactResult.yearlyBreakdown,
  };
}
