/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateSIP, calculateRequiredSIP } from './sip';
import { calculateSWP, calculateRequiredCorpus, calculateSustainableWithdrawal } from './swp';
import { calculateInflationAdjustedValue, calculateRealReturn } from './inflation';
import { calculateSIPToSWP } from './combined';
import { calculateReturnScenarios } from './scenarios';

export interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  error?: string;
}

export function runCalculationTests(): { results: TestResult[]; allPassed: boolean } {
  const results: TestResult[] = [];

  function assert(name: string, condition: boolean, expected?: string, actual?: string) {
    results.push({
      name,
      passed: condition,
      expected,
      actual,
    });
  }

  try {
    // 1. Standard SIP known math: ₹10,000/mo, 10 years, 12% annual return
    // Standard industry formula: FV = 10000 * [((1+0.01)^120 - 1)/0.01] * (1+0.01)
    // (1.01)^120 = 3.30038689457...
    // FV = 10000 * 230.038689457 * 1.01 = 23,23,391 approx
    const standardSip = calculateSIP({
      monthlyInvestment: 10000,
      durationYears: 10,
      expectedReturnAnnual: 12,
      frequency: 'monthly',
      hasStepUp: false,
      stepUpType: 'percentage',
      stepUpValue: 0,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
    });
    const expectedCorpus = 2323391;
    const diffSip = Math.abs(standardSip.finalCorpus - expectedCorpus);
    assert(
      'Standard SIP (₹10k, 10yr, 12%) matches compound annuity within 0.1%',
      diffSip < 3000,
      `~₹${expectedCorpus.toLocaleString()}`,
      `₹${standardSip.finalCorpus.toLocaleString()}`
    );
    assert(
      'Standard SIP invested amount is exactly ₹12,00,000',
      standardSip.totalInvested === 1200000,
      '1200000',
      String(standardSip.totalInvested)
    );

    // 2. Zero-return edge case (0% return should equal total contributions without division by zero)
    const zeroReturnSip = calculateSIP({
      monthlyInvestment: 5000,
      durationYears: 5,
      expectedReturnAnnual: 0,
      frequency: 'monthly',
      hasStepUp: false,
      stepUpType: 'percentage',
      stepUpValue: 0,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
    });
    assert(
      'Zero Return SIP (0% return) equals total invested amount without NaN or error',
      zeroReturnSip.finalCorpus === 300000 && zeroReturnSip.estimatedGains === 0 && !Number.isNaN(zeroReturnSip.finalCorpus),
      '300000',
      String(zeroReturnSip.finalCorpus)
    );

    // 3. Step-Up SIP: ₹10,000/mo, 10% annual step-up, 10 years, 12% return
    const stepUpSip = calculateSIP({
      monthlyInvestment: 10000,
      durationYears: 10,
      expectedReturnAnnual: 12,
      frequency: 'monthly',
      hasStepUp: true,
      stepUpType: 'percentage',
      stepUpValue: 10,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
    });
    assert(
      'Step-up SIP yields significantly higher corpus than flat SIP',
      stepUpSip.finalCorpus > standardSip.finalCorpus && stepUpSip.totalInvested > standardSip.totalInvested,
      `> ${standardSip.finalCorpus}`,
      String(stepUpSip.finalCorpus)
    );

    // 4. Fixed Step-Up SIP: ₹10,000/mo, ₹1,000 fixed increase per year
    const fixedStepUpSip = calculateSIP({
      monthlyInvestment: 10000,
      durationYears: 5,
      expectedReturnAnnual: 10,
      frequency: 'monthly',
      hasStepUp: true,
      stepUpType: 'fixed',
      stepUpValue: 1000,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
    });
    // Year 1: 10k/mo = 120k; Year 2: 11k/mo = 132k; Year 3: 12k/mo = 144k; Year 4: 13k/mo = 156k; Year 5: 14k/mo = 168k
    // Total invested = 120 + 132 + 144 + 156 + 168 = 720k
    assert(
      'Fixed step-up SIP correctly tallies invested amounts across stepped years',
      fixedStepUpSip.totalInvested === 720000,
      '720000',
      String(fixedStepUpSip.totalInvested)
    );

    // 5. Reverse Goal-Based SIP: Target ₹1 Crore in 15 years at 12% return
    const targetGoal = 10000000;
    const requiredSipCalc = calculateRequiredSIP(targetGoal, 15, 12, 0, 0);
    const testRecomputed = calculateSIP({
      monthlyInvestment: requiredSipCalc.requiredMonthlySIP,
      durationYears: 15,
      expectedReturnAnnual: 12,
      frequency: 'monthly',
      hasStepUp: false,
      stepUpType: 'percentage',
      stepUpValue: 0,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
    });
    const goalDiff = Math.abs(testRecomputed.finalCorpus - targetGoal);
    assert(
      'Goal-based SIP reverses accurately to achieve Target Corpus within 0.5%',
      goalDiff < 50000,
      `~${targetGoal}`,
      String(testRecomputed.finalCorpus)
    );

    // 6. SWP Standard: Corpus ₹50 Lakh, 10% return, ₹30,000/month withdrawal, 20 years
    const swpTest = calculateSWP({
      startingCorpus: 5000000,
      expectedReturnAnnual: 10,
      monthlyWithdrawal: 30000,
      withdrawalDurationYears: 20,
      frequency: 'monthly',
      hasAnnualIncrease: false,
      annualIncreasePercentage: 0,
      isInflationLinked: false,
      expectedInflationRate: 0,
    });
    assert(
      'SWP with healthy corpus sustains 20 years without early depletion',
      !swpTest.isCorpusDepleted && swpTest.finalRemainingCorpus > 0,
      'Survives (> 0)',
      String(swpTest.finalRemainingCorpus)
    );

    // 7. SWP Depletion edge case: High withdrawal rate (₹1,00,000/mo on ₹10 Lakh corpus)
    const swpDepleteTest = calculateSWP({
      startingCorpus: 1000000,
      expectedReturnAnnual: 8,
      monthlyWithdrawal: 100000,
      withdrawalDurationYears: 10,
      frequency: 'monthly',
      hasAnnualIncrease: false,
      annualIncreasePercentage: 0,
      isInflationLinked: false,
      expectedInflationRate: 0,
    });
    assert(
      'SWP correctly detects early depletion and marks depletion year/month',
      swpDepleteTest.isCorpusDepleted && swpDepleteTest.depletionYear !== null && swpDepleteTest.depletionYear <= 2,
      'Depleted within 2 years',
      `Year ${swpDepleteTest.depletionYear} Month ${swpDepleteTest.depletionMonth}`
    );

    // 8. SWP Reverse: calculateRequiredCorpus for ₹50,000/month for 20 years at 8%
    const reqCorpus = calculateRequiredCorpus(50000, 20, 8, 0);
    const swpVerify = calculateSWP({
      startingCorpus: reqCorpus,
      expectedReturnAnnual: 8,
      monthlyWithdrawal: 50000,
      withdrawalDurationYears: 20,
      frequency: 'monthly',
      hasAnnualIncrease: false,
      annualIncreasePercentage: 0,
      isInflationLinked: false,
      expectedInflationRate: 0,
    });
    assert(
      'Reverse SWP required corpus calculation supports target withdrawal duration',
      !swpVerify.isCorpusDepleted || (swpVerify.depletionTotalMonths !== null && swpVerify.depletionTotalMonths >= 239),
      'Sustains ~240 months',
      `Depleted: ${swpVerify.isCorpusDepleted}`
    );

    // 9. Inflation calculation: Today ₹50 Lakh, 6% inflation, 15 years
    // FV = 50,00,000 * (1.06)^15 = 50,00,000 * 2.396558... = 1,19,82,791 approx (~₹1.20 Cr)
    const inflationTest = calculateInflationAdjustedValue(5000000, 6, 15);
    const expectedInflationFV = 11982791;
    assert(
      'Inflation-adjusted future cost calculation matches compounding formula within 0.1%',
      Math.abs(inflationTest.futureRequiredValue - expectedInflationFV) < 10000,
      `~₹${expectedInflationFV.toLocaleString()}`,
      `₹${inflationTest.futureRequiredValue.toLocaleString()}`
    );

    // 10. Real Return: 12% nominal, 6% inflation -> (1.12 / 1.06) - 1 = 5.66%
    const realReturn = calculateRealReturn(12, 6);
    assert(
      'Fisher Equation real return calculation matches exact formula (5.66%)',
      Math.abs(realReturn - 5.66) < 0.05,
      '5.66%',
      `${realReturn}%`
    );

    // 11. SIP to SWP combined flow
    const combinedTest = calculateSIPToSWP({
      sipMonthlyInvestment: 20000,
      sipDurationYears: 15,
      sipExpectedReturnAnnual: 12,
      sipHasStepUp: false,
      sipStepUpPercentage: 0,
      sipInitialInvestment: 0,
      swpExpectedReturnAnnual: 8,
      swpMonthlyWithdrawal: 60000,
      swpDurationYears: 20,
      swpHasAnnualIncrease: false,
      swpAnnualIncreasePercentage: 0,
    });
    assert(
      'Combined SIP -> SWP builds accumulation corpus then passes to withdrawal seamlessly',
      combinedTest.accumulation.finalCorpus > 0 && combinedTest.combinedTimeline.length === 35,
      '35 total timeline years',
      `${combinedTest.combinedTimeline.length} years`
    );

    // 12. Return Scenarios (Conservative < Base < Optimistic)
    const scenarios = calculateReturnScenarios(standardSip.yearlyBreakdown.length > 0 ? {
      monthlyInvestment: 10000,
      durationYears: 10,
      expectedReturnAnnual: 12,
      frequency: 'monthly',
      hasStepUp: false,
      stepUpType: 'percentage',
      stepUpValue: 0,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
    } : {
      monthlyInvestment: 10000,
      durationYears: 10,
      expectedReturnAnnual: 12,
      frequency: 'monthly',
      hasStepUp: false,
      stepUpType: 'percentage',
      stepUpValue: 0,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
    }, 8, 12, 15);
    assert(
      'Return scenarios maintain strict monotonic order: Conservative < Base < Optimistic',
      scenarios.conservative.corpus < scenarios.base.corpus && scenarios.base.corpus < scenarios.optimistic.corpus,
      'Conservative < Base < Optimistic',
      `${scenarios.conservative.corpus} < ${scenarios.base.corpus} < ${scenarios.optimistic.corpus}`
    );

    // 13. End-of-month contribution SIP: Textbook Ordinary Annuity Formula
    // FV = P * [((1 + i)^n - 1) / i]
    // For P = 10,000, n = 120, i = 0.01: FV = 10000 * 230.038689 = 23,00,387
    const endOfMonthSip = calculateSIP({
      monthlyInvestment: 10000,
      durationYears: 10,
      expectedReturnAnnual: 12,
      frequency: 'monthly',
      hasStepUp: false,
      stepUpType: 'percentage',
      stepUpValue: 0,
      stepUpIntervalYears: 1,
      initialInvestment: 0,
      contributionTiming: 'end',
    });
    const expectedEndOfMonthCorpus = 2300387;
    assert(
      'End-of-Month SIP matches ordinary annuity formula within 0.1%',
      Math.abs(endOfMonthSip.finalCorpus - expectedEndOfMonthCorpus) < 2000,
      `~₹${expectedEndOfMonthCorpus.toLocaleString()}`,
      `₹${endOfMonthSip.finalCorpus.toLocaleString()}`
    );

    // 14. Zero-Return SWP: ₹6,00,000 corpus, ₹50,000/mo withdrawal, 0% annual return
    // Exactly depletes in 12 months (1 year)
    const zeroReturnSwp = calculateSWP({
      startingCorpus: 600000,
      expectedReturnAnnual: 0,
      monthlyWithdrawal: 50000,
      withdrawalDurationYears: 5,
      frequency: 'monthly',
      hasAnnualIncrease: false,
      annualIncreasePercentage: 0,
      isInflationLinked: false,
      expectedInflationRate: 0,
    });
    assert(
      'Zero-Return SWP depletes exactly in month 12 with 0 gains and exactly ₹6,00,000 withdrawn',
      zeroReturnSwp.isCorpusDepleted &&
        zeroReturnSwp.depletionTotalMonths === 12 &&
        zeroReturnSwp.totalWithdrawn === 600000 &&
        zeroReturnSwp.totalGainsEarned === 0,
      'Depleted at Month 12, Withdrawn: 600000',
      `Month ${zeroReturnSwp.depletionTotalMonths}, Withdrawn: ${zeroReturnSwp.totalWithdrawn}`
    );

    // 15. Zero Inflation Goal Test: ₹50 Lakh in 10 years at 0% inflation remains ₹50 Lakh
    const zeroInflationGoal = calculateInflationAdjustedValue(5000000, 0, 10);
    assert(
      'Goal Inflation with 0% inflation preserves exact current nominal value',
      zeroInflationGoal.futureRequiredValue === 5000000 && zeroInflationGoal.multiplier === 1,
      '5000000 (1.0x)',
      `${zeroInflationGoal.futureRequiredValue} (${zeroInflationGoal.multiplier}x)`
    );

  } catch (err: any) {
    results.push({
      name: 'Test Execution Exception',
      passed: false,
      error: err?.message || String(err),
    });
  }

  const allPassed = results.length > 0 && results.every((r) => r.passed);
  return { results, allPassed };
}
