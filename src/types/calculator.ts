/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CalculationMode =
  | 'sip'
  | 'swp'
  | 'combined'
  | 'goal'
  | 'compare'
  | 'whatif'
  | 'funds'
  | 'learning';

export type Frequency = 'monthly' | 'quarterly' | 'yearly';

export type StepUpType = 'percentage' | 'fixed';

export type ContributionTiming = 'beginning' | 'end';

export interface SipInputs {
  monthlyInvestment: number;
  durationYears: number;
  expectedReturnAnnual: number;
  frequency: Frequency;
  hasStepUp: boolean;
  stepUpType: StepUpType;
  stepUpValue: number; // percentage (e.g. 10) or fixed rupee amount (e.g. 1000)
  stepUpIntervalYears: number; // usually 1 year
  initialInvestment: number; // lump sum at start
  targetCorpus?: number;
  contributionTiming?: ContributionTiming;
}

export interface SwpInputs {
  startingCorpus: number;
  expectedReturnAnnual: number;
  monthlyWithdrawal: number;
  withdrawalDurationYears: number;
  frequency: Frequency;
  hasAnnualIncrease: boolean;
  annualIncreasePercentage: number;
  isInflationLinked?: boolean;
  expectedInflationRate?: number;
}

export interface CombinedInputs {
  // Phase 1: Accumulation
  sipMonthlyInvestment: number;
  sipDurationYears: number;
  sipExpectedReturnAnnual: number;
  sipHasStepUp: boolean;
  sipStepUpPercentage: number;
  sipInitialInvestment: number;

  // Phase 2: Withdrawal
  swpExpectedReturnAnnual: number;
  swpMonthlyWithdrawal: number;
  swpDurationYears: number;
  swpHasAnnualIncrease: boolean;
  swpAnnualIncreasePercentage: number;
}

export interface GoalInputs {
  targetAmount: number; // Today's money or future money
  isTargetInCurrentValue: boolean; // if true, adjust for inflation
  inflationRate: number;
  durationYears: number;
  expectedReturnAnnual: number;
  hasStepUp: boolean;
  stepUpPercentage: number;
  initialInvestment: number;
}

export interface YearlyBreakdownItem {
  year: number;
  startingBalance: number;
  annualContribution: number;
  annualWithdrawal?: number;
  annualGains: number;
  endingBalance: number;
  totalInvestedToDate: number;
  totalWithdrawnToDate?: number;
  totalGainsToDate: number;
  monthlyContribution?: number;
  monthlyWithdrawal?: number;
}

export interface SipCalculationResult {
  totalInvested: number;
  estimatedGains: number;
  finalCorpus: number;
  wealthMultiplier: number;
  yearlyBreakdown: YearlyBreakdownItem[];
  realValueAfterInflation?: number;
  effectiveAnnualReturn: number;
}

export interface SwpCalculationResult {
  startingCorpus: number;
  totalWithdrawn: number;
  finalRemainingCorpus: number;
  totalGainsEarned: number;
  isCorpusDepleted: boolean;
  depletionYear: number | null;
  depletionMonth: number | null;
  depletionTotalMonths: number | null;
  yearlyBreakdown: YearlyBreakdownItem[];
  isSustainableForever: boolean;
  safeWithdrawalRate: number; // percentage of initial corpus
}

export interface CombinedCalculationResult {
  accumulation: SipCalculationResult;
  withdrawal: SwpCalculationResult;
  totalInvestedLifetime: number;
  totalWithdrawnLifetime: number;
  netWealthGenerated: number;
  finalCorpusRemaining: number;
  isWithdrawalSustainable: boolean;
  combinedTimeline: Array<{
    year: number;
    phase: 'accumulation' | 'withdrawal';
    corpus: number;
    flow: number; // positive = invested, negative = withdrawn
    gains: number;
  }>;
}

export interface ScenarioResult {
  conservative: { returnRate: number; corpus: number; gains: number };
  base: { returnRate: number; corpus: number; gains: number };
  optimistic: { returnRate: number; corpus: number; gains: number };
}

export interface SensitivityMatrixCell {
  returnRate: number;
  durationYears: number;
  finalCorpus: number;
  totalInvested: number;
}

export interface PlanComparison {
  planA: {
    title: string;
    inputs: SipInputs;
    result: SipCalculationResult;
  };
  planB: {
    title: string;
    inputs: SipInputs;
    result: SipCalculationResult;
  };
  deltaCorpus: number;
  deltaInvested: number;
  deltaGains: number;
  betterPlan: 'A' | 'B' | 'Equal';
}
