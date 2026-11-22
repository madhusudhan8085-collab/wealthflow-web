/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SliderInput } from '../SliderInput';
import { MetricCard } from '../MetricCard';
import { GrowthAreaChart } from '../charts/GrowthAreaChart';
import { BreakdownPieChart } from '../charts/BreakdownPieChart';
import { YearlyBreakdownTable } from '../tables/YearlyBreakdownTable';
import { GoalInputs } from '../../types/calculator';
import { calculateRequiredSIP } from '../../calculations/sip';
import { calculateInflationAdjustedValue } from '../../calculations/inflation';
import { formatINR, formatPercent } from '../../utils/formatters';
import { Target, Sparkles, TrendingUp, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface GoalCalculatorViewProps {
  isCompactCurrency: boolean;
}

export const GoalCalculatorView: React.FC<GoalCalculatorViewProps> = ({
  isCompactCurrency,
}) => {
  const [targetAmount, setTargetAmount] = useState(10000000); // 1 Crore default
  const [durationYears, setDurationYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUpPercentage, setStepUpPercentage] = useState(10);
  const [hasStepUp, setHasStepUp] = useState(true);
  const [initialInvestment, setInitialInvestment] = useState(0);

  // Inflation toggle
  const [isTodayMoney, setIsTodayMoney] = useState(true);
  const [inflationRate, setInflationRate] = useState(6);

  // Inflation adjustments
  const inflationCalc = calculateInflationAdjustedValue(
    targetAmount,
    inflationRate,
    durationYears
  );

  // Effective target that the SIP must actually hit
  const effectiveTarget = isTodayMoney ? inflationCalc.futureRequiredValue : targetAmount;

  // Compute required monthly SIP
  const requiredSipResult = calculateRequiredSIP(
    effectiveTarget,
    durationYears,
    expectedReturn,
    hasStepUp ? stepUpPercentage : 0,
    initialInvestment
  );

  // Compare with Flat SIP (0% step-up) for comparison
  const flatSipResult = calculateRequiredSIP(
    effectiveTarget,
    durationYears,
    expectedReturn,
    0,
    initialInvestment
  );

  return (
    <div id="goal-calculator-view" className="space-y-8">
      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Goal Parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Target Goal Parameters</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Determine the exact monthly SIP required to reach your target
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              Reverse SIP
            </span>
          </div>

          {/* Target Amount */}
          <SliderInput
            id="goal-target"
            label="Target Goal Amount"
            value={targetAmount}
            min={1000000}
            max={50000000}
            step={500000}
            prefix="₹"
            isCurrency
            presets={[
              { label: '₹25 Lakh (Child Edu)', value: 2500000 },
              { label: '₹50 Lakh (House)', value: 5000000 },
              { label: '₹1 Cr (Financial Freedom)', value: 10000000 },
              { label: '₹2.5 Cr (Retirement)', value: 25000000 },
            ]}
            tooltip="The financial milestone you want to achieve (e.g. ₹1 Crore)."
            onChange={setTargetAmount}
          />

          {/* Inflation Toggle & Rate */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Is this goal in today&apos;s money?
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Automatically adjust for inflation over {durationYears} years
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTodayMoney(!isTodayMoney)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                  isTodayMoney
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isTodayMoney ? 'Yes (Inflation-Adjusted)' : 'No (Nominal Future)'}
              </button>
            </div>

            {isTodayMoney && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <SliderInput
                  id="goal-inflation"
                  label="Expected Inflation Rate"
                  value={inflationRate}
                  min={2}
                  max={12}
                  step={0.5}
                  unit="%"
                  presets={[
                    { label: '5%', value: 5 },
                    { label: '6% (Average)', value: 6 },
                    { label: '7%', value: 7 },
                  ]}
                  onChange={setInflationRate}
                />
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed border border-emerald-200 dark:border-emerald-800/40">
                  Today&apos;s <strong>{formatINR(targetAmount, { compact: true })}</strong> will require approximately{' '}
                  <strong className="text-emerald-700 dark:text-emerald-300">
                    {formatINR(inflationCalc.futureRequiredValue, { compact: true })}
                  </strong>{' '}
                  in {durationYears} years ({inflationCalc.multiplier}× due to {inflationRate}% inflation).
                </div>
              </div>
            )}
          </div>

          {/* Horizon */}
          <SliderInput
            id="goal-duration"
            label="Years Until Goal"
            value={durationYears}
            min={1}
            max={35}
            step={1}
            unit=" Yrs"
            presets={[
              { label: '5Y', value: 5 },
              { label: '10Y', value: 10 },
              { label: '15Y', value: 15 },
              { label: '20Y', value: 20 },
            ]}
            onChange={setDurationYears}
          />

          {/* Expected Return */}
          <SliderInput
            id="goal-return"
            label="Expected Annual Return"
            value={expectedReturn}
            min={4}
            max={20}
            step={0.5}
            unit="%"
            presets={[
              { label: '10% (Hybrid)', value: 10 },
              { label: '12% (Equity Index)', value: 12 },
              { label: '14% (Growth)', value: 14 },
            ]}
            onChange={setExpectedReturn}
          />

          {/* Step-Up Option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Enable Annual Step-Up
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Reduces required starting monthly SIP by stepping up contributions annually
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasStepUp}
                  onChange={(e) => setHasStepUp(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {hasStepUp && (
              <SliderInput
                id="goal-stepup-pct"
                label="Annual Step-Up Percentage"
                value={stepUpPercentage}
                min={2}
                max={25}
                step={1}
                unit="%"
                presets={[
                  { label: '5%', value: 5 },
                  { label: '10%', value: 10 },
                  { label: '15%', value: 15 },
                ]}
                onChange={setStepUpPercentage}
              />
            )}
          </div>
        </div>

        {/* Right: Results + Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dominant Result: Required Monthly SIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-3">
              <MetricCard
                id="required-monthly-sip-card"
                title="Required Monthly Investment"
                amount={requiredSipResult.requiredMonthlySIP}
                subtitle={`Starting monthly contribution needed to reach ${formatINR(effectiveTarget, { compact: true })} in ${durationYears} years at ${expectedReturn}% return${
                  hasStepUp ? ` (+${stepUpPercentage}% step-up/yr)` : ''
                }.`}
                badge={{ text: 'Required Starting SIP', type: 'success' }}
                isCompact={false}
                highlight
                color="emerald"
              />
            </div>

            <MetricCard
              id="goal-effective-target"
              title="Effective Future Target"
              amount={effectiveTarget}
              subtitle={isTodayMoney ? `Adjusted for ${inflationRate}% annual inflation` : 'Nominal future milestone'}
              badge={{ text: isTodayMoney ? 'Inflation Adjusted' : 'Nominal', type: 'info' }}
              isCompact={isCompactCurrency}
            />

            <MetricCard
              id="goal-total-invested"
              title="Total Out-of-Pocket Invested"
              amount={requiredSipResult.totalInvested}
              subtitle="Principal capital contributed over time"
              badge={{ text: 'Your Capital', type: 'neutral' }}
              isCompact={isCompactCurrency}
            />

            <MetricCard
              id="goal-estimated-gains"
              title="Estimated Compounding Gains"
              amount={requiredSipResult.estimatedGains}
              subtitle="Wealth generated by market growth"
              badge={{ text: 'Market Gains', type: 'success' }}
              isCompact={isCompactCurrency}
            />
          </div>

          {/* Comparison: Step-Up vs Flat SIP */}
          {hasStepUp && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>The Power of Step-Up: Starting Lower Today</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-1">
                  <span className="text-slate-500 font-medium">Flat SIP (0% Step-Up):</span>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {formatINR(flatSipResult.requiredMonthlySIP, { compact: false })}/month
                  </p>
                  <p className="text-slate-500 text-[11px]">Requires higher immediate cash outflow every month from Day 1.</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">With {stepUpPercentage}% Annual Step-Up:</span>
                  <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatINR(requiredSipResult.requiredMonthlySIP, { compact: false })}/month
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-300 text-[11px]">
                    You can start with{' '}
                    <strong>
                      {formatINR(flatSipResult.requiredMonthlySIP - requiredSipResult.requiredMonthlySIP, { compact: false })} less
                    </strong>{' '}
                    today and gradually scale as your career progresses!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trajectory Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Target Accumulation Trajectory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reaching {formatINR(effectiveTarget, { compact: true })} by Year {durationYears}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <GrowthAreaChart
                  data={requiredSipResult.breakdown}
                  isCompactCurrency={isCompactCurrency}
                />
              </div>
              <div className="md:col-span-4 flex justify-center">
                <BreakdownPieChart
                  invested={requiredSipResult.totalInvested}
                  gains={requiredSipResult.estimatedGains}
                  label1="Total Invested"
                  label2="Estimated Gains"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Table */}
      <YearlyBreakdownTable
        data={requiredSipResult.breakdown}
        mode="sip"
        isCompactCurrency={isCompactCurrency}
      />
    </div>
  );
};
