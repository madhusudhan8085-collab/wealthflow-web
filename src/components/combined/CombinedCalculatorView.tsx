/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SliderInput } from '../SliderInput';
import { MetricCard } from '../MetricCard';
import { TimelineChart } from '../charts/TimelineChart';
import { BreakdownPieChart } from '../charts/BreakdownPieChart';
import { CombinedInputs } from '../../types/calculator';
import { calculateSIPToSWP } from '../../calculations/combined';
import { formatINR } from '../../utils/formatters';
import {
  TrendingUp,
  ArrowDownCircle,
  GitMerge,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface CombinedCalculatorViewProps {
  inputs: CombinedInputs;
  onInputChange: (newInputs: CombinedInputs) => void;
  isCompactCurrency: boolean;
}

export const CombinedCalculatorView: React.FC<CombinedCalculatorViewProps> = ({
  inputs,
  onInputChange,
  isCompactCurrency,
}) => {
  const result = calculateSIPToSWP(inputs);

  const updateField = <K extends keyof CombinedInputs>(key: K, value: CombinedInputs[K]) => {
    onInputChange({
      ...inputs,
      [key]: value,
    });
  };

  const totalYears = inputs.sipDurationYears + inputs.swpDurationYears;
  const isSurviving = !result.withdrawal.isCorpusDepleted;

  return (
    <div id="combined-calculator-view" className="space-y-8">
      {/* Lifecycle Banner */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-slate-900 to-blue-900/90 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <GitMerge className="w-4 h-4" /> Full Wealth Lifecycle Journey
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Phase 1: Accumulate for {inputs.sipDurationYears} Years → Phase 2: Distribute for {inputs.swpDurationYears} Years
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Invest regularly to build your financial independence corpus, then systematically withdraw guaranteed living expenses without selling assets at distress.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Lifecycle</span>
              <span className="font-bold text-sm">{totalYears} Years</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="text-slate-400 block text-[10px]">Corpus Status</span>
              <span className={`font-bold text-sm ${isSurviving ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isSurviving ? 'Fully Sustained' : 'Exhausted Early'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs in 2 Columns: Phase 1 (Accumulation) & Phase 2 (Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase 1: Accumulation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/30 p-5 sm:p-6 shadow-xs space-y-5 relative">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Phase 1: Wealth Accumulation (SIP)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Building your retirement corpus
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              Yields {formatINR(result.accumulation.finalCorpus, { compact: true })}
            </span>
          </div>

          <SliderInput
            id="comb-sip-monthly"
            label="Monthly SIP Amount"
            value={inputs.sipMonthlyInvestment}
            min={2000}
            max={200000}
            step={1000}
            prefix="₹"
            isCurrency
            presets={[
              { label: '₹10K', value: 10000 },
              { label: '₹25K', value: 25000 },
              { label: '₹50K', value: 50000 },
              { label: '₹1L', value: 100000 },
            ]}
            onChange={(val) => updateField('sipMonthlyInvestment', val)}
          />

          <SliderInput
            id="comb-sip-duration"
            label="Accumulation Horizon"
            value={inputs.sipDurationYears}
            min={1}
            max={35}
            step={1}
            unit=" Yrs"
            presets={[
              { label: '10Y', value: 10 },
              { label: '15Y', value: 15 },
              { label: '20Y', value: 20 },
              { label: '25Y', value: 25 },
            ]}
            onChange={(val) => updateField('sipDurationYears', val)}
          />

          <SliderInput
            id="comb-sip-return"
            label="Phase 1 Expected Return (CAGR)"
            value={inputs.sipExpectedReturnAnnual}
            min={6}
            max={20}
            step={0.5}
            unit="%"
            onChange={(val) => updateField('sipExpectedReturnAnnual', val)}
          />

          <SliderInput
            id="comb-sip-stepup"
            label="Annual SIP Step-Up"
            value={inputs.sipStepUpPercentage}
            min={0}
            max={25}
            step={1}
            unit="%"
            presets={[
              { label: '0%', value: 0 },
              { label: '5%', value: 5 },
              { label: '10%', value: 10 },
            ]}
            onChange={(val) => {
              updateField('sipStepUpPercentage', val);
              updateField('sipHasStepUp', val > 0);
            }}
          />
        </div>

        {/* Phase 2: Withdrawal */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-500/30 dark:border-blue-500/30 p-5 sm:p-6 shadow-xs space-y-5 relative">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Phase 2: Systematic Withdrawal (SWP)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Drawing regular cashflows from Year {inputs.sipDurationYears + 1}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              Starts with {formatINR(result.accumulation.finalCorpus, { compact: true })}
            </span>
          </div>

          <SliderInput
            id="comb-swp-monthly"
            label="Monthly Withdrawal Amount"
            value={inputs.swpMonthlyWithdrawal}
            min={5000}
            max={300000}
            step={2000}
            prefix="₹"
            isCurrency
            presets={[
              { label: '₹30K', value: 30000 },
              { label: '₹50K', value: 50000 },
              { label: '₹80K', value: 80000 },
              { label: '₹1.2L', value: 120000 },
            ]}
            onChange={(val) => updateField('swpMonthlyWithdrawal', val)}
          />

          <SliderInput
            id="comb-swp-duration"
            label="Withdrawal Horizon"
            value={inputs.swpDurationYears}
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
            onChange={(val) => updateField('swpDurationYears', val)}
          />

          <SliderInput
            id="comb-swp-return"
            label="Phase 2 Expected Return (CAGR)"
            value={inputs.swpExpectedReturnAnnual}
            min={4}
            max={15}
            step={0.5}
            unit="%"
            onChange={(val) => updateField('swpExpectedReturnAnnual', val)}
          />

          <SliderInput
            id="comb-swp-increase"
            label="Annual Withdrawal Step-Up (Inflation)"
            value={inputs.swpAnnualIncreasePercentage}
            min={0}
            max={12}
            step={0.5}
            unit="%"
            presets={[
              { label: '0%', value: 0 },
              { label: '4%', value: 4 },
              { label: '6%', value: 6 },
            ]}
            onChange={(val) => {
              updateField('swpAnnualIncreasePercentage', val);
              updateField('swpHasAnnualIncrease', val > 0);
            }}
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="comb-accumulated-corpus"
          title="Peak Corpus Accumulated"
          amount={result.accumulation.finalCorpus}
          subtitle={`At Year ${inputs.sipDurationYears} milestone`}
          badge={{ text: 'Phase 1 Peak', type: 'success' }}
          isCompact={isCompactCurrency}
          highlight
          color="emerald"
        />

        <MetricCard
          id="comb-total-invested"
          title="Total Lifetime Invested"
          amount={result.totalInvestedLifetime}
          subtitle="Your actual out-of-pocket contributions"
          badge={{ text: 'Invested', type: 'info' }}
          isCompact={isCompactCurrency}
        />

        <MetricCard
          id="comb-total-withdrawn"
          title="Total Lifetime Withdrawn"
          amount={result.totalWithdrawnLifetime}
          subtitle="Systematic income transferred to you"
          badge={{ text: 'Distributed', type: 'info' }}
          isCompact={isCompactCurrency}
        />

        <MetricCard
          id="comb-final-remaining"
          title="Legacy Balance Remaining"
          amount={result.finalCorpusRemaining}
          subtitle={`Corpus left after ${inputs.swpDurationYears} years of withdrawals`}
          badge={{
            text: isSurviving ? 'Surplus Intact' : 'Exhausted',
            type: isSurviving ? 'success' : 'warning',
          }}
          isCompact={isCompactCurrency}
          highlight
          color="blue"
        />
      </div>

      {/* Status callout if depleted */}
      {result.withdrawal.isCorpusDepleted && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Depletion Note:</strong> The accumulated corpus exhausted during the withdrawal phase at Year {inputs.sipDurationYears + (result.withdrawal.depletionYear || 0)}. To make this plan last the full {inputs.swpDurationYears} years, either increase Phase 1 SIP or adjust monthly withdrawal down.
          </span>
        </div>
      )}

      {/* Timeline Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Continuous Portfolio Lifecycle Curve
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualizing the transition from accumulation (Years 1–{inputs.sipDurationYears}) to systematic distribution (Years {inputs.sipDurationYears + 1}–{totalYears})
            </p>
          </div>
        </div>

        <TimelineChart
          timeline={result.combinedTimeline}
          sipYears={inputs.sipDurationYears}
        />
      </div>
    </div>
  );
};
