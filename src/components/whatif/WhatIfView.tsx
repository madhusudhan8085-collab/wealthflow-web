/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SliderInput } from '../SliderInput';
import { MetricCard } from '../MetricCard';
import { SipInputs } from '../../types/calculator';
import { calculateWhatIfScenarios } from '../../calculations/whatIf';
import { calculateSIP } from '../../calculations/sip';
import { formatINR } from '../../utils/formatters';
import {
  Sparkles,
  ArrowUpRight,
  Clock,
  PlusCircle,
  TrendingUp,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface WhatIfViewProps {
  baseInputs: SipInputs;
  isCompactCurrency: boolean;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({ baseInputs, isCompactCurrency }) => {
  // Custom What-If interactive slider state
  const [deltaMonthlySIP, setDeltaMonthlySIP] = useState(5000);
  const [deltaDurationYears, setDeltaDurationYears] = useState(5);
  const [deltaReturnPct, setDeltaReturnPct] = useState(2);
  const [delayYears, setDelayYears] = useState(3);

  const baseResult = calculateSIP(baseInputs);

  // Custom What-If recomputation
  const customSipInputs = {
    ...baseInputs,
    monthlyInvestment: baseInputs.monthlyInvestment + deltaMonthlySIP,
  };
  const customSipResult = calculateSIP(customSipInputs);
  const customDeltaCorpus = customSipResult.finalCorpus - baseResult.finalCorpus;
  const customDeltaInvested = customSipResult.totalInvested - baseResult.totalInvested;

  // Custom Duration recomputation
  const customDurationInputs = {
    ...baseInputs,
    durationYears: baseInputs.durationYears + deltaDurationYears,
  };
  const customDurationResult = calculateSIP(customDurationInputs);
  const customDurationDeltaCorpus = customDurationResult.finalCorpus - baseResult.finalCorpus;

  // Delay calculation
  const safeDelay = Math.min(delayYears, Math.max(1, baseInputs.durationYears - 1));
  const delayedInputs = {
    ...baseInputs,
    durationYears: Math.max(1, baseInputs.durationYears - safeDelay),
  };
  const delayedResult = calculateSIP(delayedInputs);
  const costOfDelayCorpus = baseResult.finalCorpus - delayedResult.finalCorpus;

  const quickScenarios = calculateWhatIfScenarios(baseInputs);

  return (
    <div id="whatif-simulator-view" className="space-y-8">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            &quot;What-If?&quot; Compound Levers Simulator
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Small behavioral shifts in your monthly contribution or duration create disproportionately massive shifts in terminal wealth.
        </p>
      </div>

      {/* 4 Interactive What-If Levers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lever 1: Increase SIP */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                What if I increase my SIP?
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +{formatINR(customDeltaCorpus, { compact: isCompactCurrency })}
            </span>
          </div>

          <SliderInput
            id="whatif-add-sip"
            label="Additional Monthly Contribution"
            value={deltaMonthlySIP}
            min={1000}
            max={50000}
            step={1000}
            prefix="+₹"
            isCurrency
            presets={[
              { label: '+₹2,000', value: 2000 },
              { label: '+₹5,000', value: 5000 },
              { label: '+₹10,000', value: 10000 },
            ]}
            onChange={setDeltaMonthlySIP}
          />

          <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">New Monthly SIP:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatINR(baseInputs.monthlyInvestment + deltaMonthlySIP, { compact: false })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Extra Out-of-Pocket:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                +{formatINR(customDeltaInvested, { compact: isCompactCurrency })}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-emerald-200/50 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 font-bold">
              <span>Extra Final Wealth Created:</span>
              <span>+{formatINR(customDeltaCorpus, { compact: isCompactCurrency })}</span>
            </div>
          </div>
        </div>

        {/* Lever 2: Increase Duration */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                What if I invest longer?
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              +{formatINR(customDurationDeltaCorpus, { compact: isCompactCurrency })}
            </span>
          </div>

          <SliderInput
            id="whatif-add-duration"
            label="Additional Years Invested"
            value={deltaDurationYears}
            min={1}
            max={15}
            step={1}
            unit=" Yrs"
            presets={[
              { label: '+3 Yrs', value: 3 },
              { label: '+5 Yrs', value: 5 },
              { label: '+10 Yrs', value: 10 },
            ]}
            onChange={setDeltaDurationYears}
          />

          <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/40 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Total Horizon:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {baseInputs.durationYears + deltaDurationYears} Years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">New Terminal Corpus:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatINR(customDurationResult.finalCorpus, { compact: isCompactCurrency })}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-blue-200/50 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 font-bold">
              <span>Surge from Compounding:</span>
              <span>+{formatINR(customDurationDeltaCorpus, { compact: isCompactCurrency })}</span>
            </div>
          </div>
        </div>

        {/* Lever 3: Cost of Delay (Penalty of Procrastination) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Cost of Delay (The Procrastination Tax)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  What happens to your wealth if you wait before starting your SIP?
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              Lost: -{formatINR(costOfDelayCorpus, { compact: isCompactCurrency })}
            </span>
          </div>

          <SliderInput
            id="whatif-delay"
            label="Years Delayed Before Starting"
            value={delayYears}
            min={1}
            max={Math.max(2, baseInputs.durationYears - 1)}
            step={1}
            unit=" Yrs"
            presets={[
              { label: '1 Year Delay', value: 1 },
              { label: '3 Year Delay', value: 3 },
              { label: '5 Year Delay', value: 5 },
            ]}
            onChange={setDelayYears}
          />

          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Delaying {safeDelay} years reduces final corpus from{' '}
                <span className="font-mono text-slate-900 dark:text-white">
                  {formatINR(baseResult.finalCorpus, { compact: true })}
                </span>{' '}
                to{' '}
                <span className="font-mono text-slate-900 dark:text-white">
                  {formatINR(delayedResult.finalCorpus, { compact: true })}
                </span>
                .
              </p>
              <p className="text-amber-800 dark:text-amber-300">
                Even though you &quot;saved&quot; depositing ₹{(baseInputs.monthlyInvestment * 12 * safeDelay).toLocaleString('en-IN')}, you lost{' '}
                <strong>{formatINR(costOfDelayCorpus, { compact: false })}</strong> in exponential compounding gains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
