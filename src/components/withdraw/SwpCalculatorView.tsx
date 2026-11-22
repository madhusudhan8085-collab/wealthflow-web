/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SliderInput } from '../SliderInput';
import { MetricCard } from '../MetricCard';
import { SwpDepletionChart } from '../charts/SwpDepletionChart';
import { BreakdownPieChart } from '../charts/BreakdownPieChart';
import { FinancialInsights } from '../insights/FinancialInsights';
import { YearlyBreakdownTable } from '../tables/YearlyBreakdownTable';
import { SwpInputs } from '../../types/calculator';
import {
  calculateSWP,
  calculateRequiredCorpus,
  calculateSustainableWithdrawal,
} from '../../calculations/swp';
import { formatINR, formatPercent } from '../../utils/formatters';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Calculator,
  Flame,
  ArrowDownCircle,
  HelpCircle,
} from 'lucide-react';

interface SwpCalculatorViewProps {
  inputs: SwpInputs;
  onInputChange: (newInputs: SwpInputs) => void;
  isCompactCurrency: boolean;
}

export const SwpCalculatorView: React.FC<SwpCalculatorViewProps> = ({
  inputs,
  onInputChange,
  isCompactCurrency,
}) => {
  const [swpSubTab, setSwpSubTab] = useState<'forward' | 'reverseCorpus' | 'sustainableWithdrawal'>('forward');

  // Reverse SWP state
  const [targetMonthlyNeed, setTargetMonthlyNeed] = useState(50000);
  const [reverseDuration, setReverseDuration] = useState(20);
  const [reverseReturn, setReverseReturn] = useState(8);
  const [reverseIncrease, setReverseIncrease] = useState(5);

  const result = calculateSWP(inputs);

  const updateField = <K extends keyof SwpInputs>(key: K, value: SwpInputs[K]) => {
    onInputChange({
      ...inputs,
      [key]: value,
    });
  };

  // Reverse calculations
  const requiredCorpusForNeed = calculateRequiredCorpus(
    targetMonthlyNeed,
    reverseDuration,
    reverseReturn,
    reverseIncrease
  );

  const maxSustainableForCorpus = calculateSustainableWithdrawal(
    inputs.startingCorpus,
    inputs.withdrawalDurationYears,
    inputs.expectedReturnAnnual,
    inputs.hasAnnualIncrease ? inputs.annualIncreasePercentage : 0
  );

  return (
    <div id="swp-calculator-view" className="space-y-8">
      {/* Sub-tab navigation: Standard SWP vs Reverse Planning */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl max-w-fit">
        <button
          type="button"
          onClick={() => setSwpSubTab('forward')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            swpSubTab === 'forward'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Corpus Longevity Simulator
        </button>
        <button
          type="button"
          onClick={() => setSwpSubTab('reverseCorpus')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            swpSubTab === 'reverseCorpus'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Reverse: Target Monthly Income
        </button>
        <button
          type="button"
          onClick={() => setSwpSubTab('sustainableWithdrawal')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            swpSubTab === 'sustainableWithdrawal'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Safe Withdrawal Rate
        </button>
      </div>

      {/* Main Forward Mode */}
      {swpSubTab === 'forward' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  SWP Parameters
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Plan systematic retirement cashflows & portfolio longevity
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                Wealth Distribution
              </span>
            </div>

            {/* Starting Corpus */}
            <SliderInput
              id="swp-corpus"
              label="Starting Corpus Balance"
              value={inputs.startingCorpus}
              min={500000}
              max={50000000}
              step={100000}
              prefix="₹"
              isCurrency
              presets={[
                { label: '₹25 Lakh', value: 2500000 },
                { label: '₹50 Lakh', value: 5000000 },
                { label: '₹1 Cr', value: 10000000 },
                { label: '₹2 Cr', value: 20000000 },
              ]}
              tooltip="The accumulated portfolio or retirement lump sum you are drawing cashflows from."
              onChange={(val) => updateField('startingCorpus', val)}
            />

            {/* Monthly Withdrawal */}
            <SliderInput
              id="swp-monthly"
              label="Monthly Withdrawal Need"
              value={inputs.monthlyWithdrawal}
              min={5000}
              max={300000}
              step={2000}
              prefix="₹"
              isCurrency
              presets={[
                { label: '₹25K', value: 25000 },
                { label: '₹40K', value: 40000 },
                { label: '₹60K', value: 60000 },
                { label: '₹1L', value: 100000 },
              ]}
              tooltip="Monthly income transferred to your bank account for living expenses."
              onChange={(val) => updateField('monthlyWithdrawal', val)}
            />

            {/* Withdrawal Duration */}
            <SliderInput
              id="swp-duration"
              label="Withdrawal Duration (Horizon)"
              value={inputs.withdrawalDurationYears}
              min={1}
              max={40}
              step={1}
              unit=" Yrs"
              presets={[
                { label: '10Y', value: 10 },
                { label: '15Y', value: 15 },
                { label: '20Y', value: 20 },
                { label: '25Y', value: 25 },
                { label: '30Y', value: 30 },
              ]}
              tooltip="Number of years you expect the corpus to provide systematic cashflows."
              onChange={(val) => updateField('withdrawalDurationYears', val)}
            />

            {/* Expected Return */}
            <SliderInput
              id="swp-return"
              label="Expected Return (Debt/Conservative Hybrid)"
              value={inputs.expectedReturnAnnual}
              min={1}
              max={20}
              step={0.5}
              unit="%"
              presets={[
                { label: '6% (Debt)', value: 6 },
                { label: '8% (Conservative)', value: 8 },
                { label: '9% (Balanced)', value: 9 },
                { label: '10% (Growth Hybrid)', value: 10 },
              ]}
              tooltip="Expected CAGR earned by the remaining invested corpus during the retirement phase."
              onChange={(val) => updateField('expectedReturnAnnual', val)}
            />

            {/* Annual Increase / Inflation-linked withdrawals */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="swp-stepup-toggle"
                    className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Annual Withdrawal Step-Up (Inflation Hedge)</span>
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Increase monthly withdrawal annually to preserve purchasing power
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="swp-stepup-toggle"
                    type="checkbox"
                    checked={inputs.hasAnnualIncrease}
                    onChange={(e) => updateField('hasAnnualIncrease', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {inputs.hasAnnualIncrease && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <SliderInput
                    id="swp-increase-pct"
                    label="Annual Increase Percentage"
                    value={inputs.annualIncreasePercentage || 5}
                    min={1}
                    max={15}
                    step={0.5}
                    unit="%"
                    presets={[
                      { label: '5% (Moderate)', value: 5 },
                      { label: '6% (Historical CPI)', value: 6 },
                      { label: '8% (Lifestyle)', value: 8 },
                    ]}
                    onChange={(val) => updateField('annualIncreasePercentage', val)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results + Depletion Trajectory + Table */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Banner: Survives vs Depletion Alert */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                result.isCorpusDepleted
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/50 text-amber-900 dark:text-amber-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              <div className="mt-0.5">
                {result.isCorpusDepleted ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm sm:text-base">
                  {result.isCorpusDepleted
                    ? `Corpus Depleted in Year ${result.depletionYear} (Month ${result.depletionMonth})`
                    : result.isSustainableForever
                    ? 'Forever Sustainable: Corpus Growth Exceeds Withdrawals!'
                    : `Corpus Fully Survives Your ${inputs.withdrawalDurationYears}-Year Horizon!`}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {result.isCorpusDepleted
                    ? `At ₹${inputs.monthlyWithdrawal.toLocaleString('en-IN')}/month, the fund exhausts after ${result.depletionTotalMonths} months. Reduce withdrawal to ₹${maxSustainableForCorpus.toLocaleString('en-IN')}/month to survive ${inputs.withdrawalDurationYears} years.`
                    : `Your initial annual withdrawal rate is ${result.safeWithdrawalRate}%. After distributing ${formatINR(result.totalWithdrawn, { compact: true })}, an estimated ${formatINR(result.finalRemainingCorpus, { compact: true })} remains intact.`}
                </p>
              </div>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="sm:col-span-3">
                <MetricCard
                  id="swp-total-withdrawn-metric"
                  title="Total Amount Withdrawn"
                  amount={result.totalWithdrawn}
                  subtitle={`Total cash transferred to your account across ${inputs.withdrawalDurationYears} years.`}
                  badge={{
                    text: result.isCorpusDepleted ? 'Depleted Early' : 'Fully Sustained',
                    type: result.isCorpusDepleted ? 'warning' : 'success',
                  }}
                  isCompact={isCompactCurrency}
                  highlight
                  color="blue"
                />
              </div>

              <MetricCard
                id="swp-remaining-corpus-metric"
                title="Remaining Corpus"
                amount={result.finalRemainingCorpus}
                subtitle="Ending balance available for legacy or emergency"
                badge={{ text: 'Capital Left', type: 'info' }}
                isCompact={isCompactCurrency}
              />

              <MetricCard
                id="swp-growth-earned-metric"
                title="Total Growth Earned"
                amount={result.totalGainsEarned}
                subtitle="Compounding gains generated during withdrawal"
                badge={{ text: 'New Growth', type: 'success' }}
                isCompact={isCompactCurrency}
              />

              <MetricCard
                id="swp-withdrawal-rate-metric"
                title="Year 1 Withdrawal Rate"
                amount={inputs.monthlyWithdrawal * 12}
                subtitle={`${result.safeWithdrawalRate}% of starting corpus`}
                badge={{
                  text: result.safeWithdrawalRate <= 6 ? 'Safe (<6%)' : 'Aggressive (>6%)',
                  type: result.safeWithdrawalRate <= 6 ? 'success' : 'warning',
                }}
                isCompact={isCompactCurrency}
              />
            </div>

            {/* Depletion Trajectory Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Corpus Balance & Cumulative Withdrawals
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tracking capital preservation vs cumulative distributions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8">
                  <SwpDepletionChart
                    data={result.yearlyBreakdown}
                    startingCorpus={inputs.startingCorpus}
                    depletionYear={result.depletionYear}
                  />
                </div>
                <div className="md:col-span-4 flex justify-center">
                  <BreakdownPieChart
                    invested={result.totalWithdrawn}
                    gains={result.finalRemainingCorpus}
                    label1="Total Withdrawn"
                    label2="Remaining Corpus"
                  />
                </div>
              </div>
            </div>

            {/* Financial Insights */}
            <FinancialInsights
              mode="swp"
              invested={inputs.startingCorpus}
              corpus={result.finalRemainingCorpus}
              gains={result.totalGainsEarned}
              durationYears={inputs.withdrawalDurationYears}
              expectedReturn={inputs.expectedReturnAnnual}
              swpSafeRate={result.safeWithdrawalRate}
              isDepleted={result.isCorpusDepleted}
              depletionYear={result.depletionYear}
            />
          </div>
        </div>
      )}

      {/* Reverse Mode: Required Corpus for Target Monthly Income */}
      {swpSubTab === 'reverseCorpus' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Target Retirement Corpus Estimator (Reverse SWP)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate the exact starting lump sum required today to sustain your intended monthly living expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              id="rev-monthly-need"
              label="Desired Monthly Income"
              value={targetMonthlyNeed}
              min={10000}
              max={300000}
              step={5000}
              prefix="₹"
              isCurrency
              presets={[
                { label: '₹30K', value: 30000 },
                { label: '₹50K', value: 50000 },
                { label: '₹75K', value: 75000 },
                { label: '₹1L', value: 100000 },
              ]}
              onChange={setTargetMonthlyNeed}
            />

            <SliderInput
              id="rev-duration"
              label="Retirement Duration"
              value={reverseDuration}
              min={5}
              max={40}
              step={1}
              unit=" Yrs"
              presets={[
                { label: '15Y', value: 15 },
                { label: '20Y', value: 20 },
                { label: '25Y', value: 25 },
                { label: '30Y', value: 30 },
              ]}
              onChange={setReverseDuration}
            />

            <SliderInput
              id="rev-return"
              label="Expected Return during SWP"
              value={reverseReturn}
              min={4}
              max={15}
              step={0.5}
              unit="%"
              onChange={setReverseReturn}
            />

            <SliderInput
              id="rev-increase"
              label="Annual Living Cost Inflation"
              value={reverseIncrease}
              min={0}
              max={10}
              step={0.5}
              unit="%"
              presets={[
                { label: '0%', value: 0 },
                { label: '5%', value: 5 },
                { label: '6%', value: 6 },
              ]}
              onChange={setReverseIncrease}
            />
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Required Starting Retirement Corpus
            </span>
            <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {formatINR(requiredCorpusForNeed, { compact: isCompactCurrency })}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Exact capital needed: <span className="font-mono font-bold text-slate-900 dark:text-white">{formatINR(requiredCorpusForNeed, { compact: false })}</span> to safely withdraw ₹{targetMonthlyNeed.toLocaleString('en-IN')}/month for {reverseDuration} years with {reverseIncrease}% annual increases.
            </p>
          </div>
        </div>
      )}

      {/* Sustainable Withdrawal Tab */}
      {swpSubTab === 'sustainableWithdrawal' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Maximum Sustainable Monthly Withdrawal</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For your current corpus of {formatINR(inputs.startingCorpus, { compact: true })} over {inputs.withdrawalDurationYears} years at {inputs.expectedReturnAnnual}% CAGR.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Zero-Depletion Ceiling (40Y / Infinite)
              </span>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {formatINR(Math.round((inputs.startingCorpus * (inputs.expectedReturnAnnual / 100)) / 12), { compact: false })}/mo
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Withdrawing solely the monthly growth leaves the principal 100% intact forever.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Max Sustainable ({inputs.withdrawalDurationYears} Years)
              </span>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatINR(maxSustainableForCorpus, { compact: false })}/mo
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Maximum monthly amount you can safely withdraw without the corpus exhausting before Year {inputs.withdrawalDurationYears}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Year by Year Table */}
      <YearlyBreakdownTable
        data={result.yearlyBreakdown}
        mode="swp"
        isCompactCurrency={isCompactCurrency}
      />
    </div>
  );
};
