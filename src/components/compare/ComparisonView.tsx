/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SliderInput } from '../SliderInput';
import { MetricCard } from '../MetricCard';
import { SipInputs } from '../../types/calculator';
import { calculateSIP } from '../../calculations/sip';
import { formatINR, formatPercent } from '../../utils/formatters';
import { Scale, ArrowRight, TrendingUp, CheckCircle, Award } from 'lucide-react';

interface ComparisonViewProps {
  isCompactCurrency: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ isCompactCurrency }) => {
  const [planA, setPlanA] = useState<SipInputs>({
    monthlyInvestment: 10000,
    durationYears: 15,
    expectedReturnAnnual: 12,
    frequency: 'monthly',
    hasStepUp: false,
    stepUpType: 'percentage',
    stepUpValue: 0,
    stepUpIntervalYears: 1,
    initialInvestment: 0,
  });

  const [planB, setPlanB] = useState<SipInputs>({
    monthlyInvestment: 15000,
    durationYears: 15,
    expectedReturnAnnual: 12,
    frequency: 'monthly',
    hasStepUp: true,
    stepUpType: 'percentage',
    stepUpValue: 10,
    stepUpIntervalYears: 1,
    initialInvestment: 0,
  });

  const resA = calculateSIP(planA);
  const resB = calculateSIP(planB);

  const deltaCorpus = resB.finalCorpus - resA.finalCorpus;
  const deltaInvested = resB.totalInvested - resA.totalInvested;
  const deltaGains = resB.estimatedGains - resA.estimatedGains;

  const maxCorpus = Math.max(resA.finalCorpus, resB.finalCorpus, 1);

  return (
    <div id="comparison-view" className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Smart Strategy Comparison: Plan A vs Plan B</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compare contrasting monthly contributions, step-ups, horizons, or return assumptions side-by-side.
          </p>
        </div>

        {/* Delta Callout Badge */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl text-xs font-mono">
          <span className="text-emerald-800 dark:text-emerald-300 font-bold block">
            Plan B creates +{formatINR(deltaCorpus, { compact: isCompactCurrency })} more wealth
          </span>
          <span className="text-slate-500 text-[11px]">
            Extra invested: +{formatINR(deltaInvested, { compact: isCompactCurrency })} | Extra gains: +{formatINR(deltaGains, { compact: isCompactCurrency })}
          </span>
        </div>
      </div>

      {/* Side-by-Side Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan A */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                A
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Plan A (Conservative / Baseline)
              </h3>
            </div>
            <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
              {formatINR(resA.finalCorpus, { compact: true })}
            </span>
          </div>

          <SliderInput
            id="plan-a-monthly"
            label="Monthly SIP"
            value={planA.monthlyInvestment}
            min={1000}
            max={100000}
            step={1000}
            prefix="₹"
            isCurrency
            onChange={(val) => setPlanA({ ...planA, monthlyInvestment: val })}
          />

          <SliderInput
            id="plan-a-duration"
            label="Duration"
            value={planA.durationYears}
            min={1}
            max={35}
            step={1}
            unit=" Yrs"
            onChange={(val) => setPlanA({ ...planA, durationYears: val })}
          />

          <SliderInput
            id="plan-a-return"
            label="Expected Return"
            value={planA.expectedReturnAnnual}
            min={4}
            max={20}
            step={0.5}
            unit="%"
            onChange={(val) => setPlanA({ ...planA, expectedReturnAnnual: val })}
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Annual Step-Up</span>
            <button
              type="button"
              onClick={() => setPlanA({ ...planA, hasStepUp: !planA.hasStepUp, stepUpValue: 10 })}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                planA.hasStepUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {planA.hasStepUp ? `+${planA.stepUpValue}% / yr` : 'None (Flat)'}
            </button>
          </div>

          {/* Plan A Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-500 block">Total Invested</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatINR(resA.totalInvested, { compact: isCompactCurrency })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-500 block">Estimated Gains</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                +{formatINR(resA.estimatedGains, { compact: isCompactCurrency })}
              </span>
            </div>
          </div>
        </div>

        {/* Plan B */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/40 p-5 sm:p-6 shadow-xs space-y-5 relative">
          <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            Optimized
          </span>

          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                B
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Plan B (Step-Up / Accelerated)
              </h3>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatINR(resB.finalCorpus, { compact: true })}
            </span>
          </div>

          <SliderInput
            id="plan-b-monthly"
            label="Monthly SIP"
            value={planB.monthlyInvestment}
            min={1000}
            max={100000}
            step={1000}
            prefix="₹"
            isCurrency
            onChange={(val) => setPlanB({ ...planB, monthlyInvestment: val })}
          />

          <SliderInput
            id="plan-b-duration"
            label="Duration"
            value={planB.durationYears}
            min={1}
            max={35}
            step={1}
            unit=" Yrs"
            onChange={(val) => setPlanB({ ...planB, durationYears: val })}
          />

          <SliderInput
            id="plan-b-return"
            label="Expected Return"
            value={planB.expectedReturnAnnual}
            min={4}
            max={20}
            step={0.5}
            unit="%"
            onChange={(val) => setPlanB({ ...planB, expectedReturnAnnual: val })}
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Annual Step-Up</span>
            <button
              type="button"
              onClick={() => setPlanB({ ...planB, hasStepUp: !planB.hasStepUp, stepUpValue: 10 })}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                planB.hasStepUp
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {planB.hasStepUp ? `+${planB.stepUpValue}% / yr` : 'None (Flat)'}
            </button>
          </div>

          {/* Plan B Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-500 block">Total Invested</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatINR(resB.totalInvested, { compact: isCompactCurrency })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] text-slate-500 block">Estimated Gains</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                +{formatINR(resB.estimatedGains, { compact: isCompactCurrency })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Comparison Bars */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Visual Wealth Outcome Comparison
        </h3>

        <div className="space-y-4 font-mono text-xs">
          {/* Plan A bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-blue-600 dark:text-blue-400">Plan A Corpus</span>
              <span className="text-slate-900 dark:text-white">{formatINR(resA.finalCorpus, { compact: isCompactCurrency })}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(resA.finalCorpus / maxCorpus) * 100}%` }}
              />
            </div>
          </div>

          {/* Plan B bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">Plan B Corpus</span>
              <span className="text-slate-900 dark:text-white">{formatINR(resB.finalCorpus, { compact: isCompactCurrency })}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(resB.finalCorpus / maxCorpus) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
