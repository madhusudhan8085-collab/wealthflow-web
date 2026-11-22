/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { SipInputs } from '../../types/calculator';
import { calculateReturnScenarios } from '../../calculations/scenarios';
import { formatINR, formatPercent } from '../../utils/formatters';

interface ScenariosViewProps {
  baseInputs: SipInputs;
  isCompactCurrency?: boolean;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  baseInputs,
  isCompactCurrency = true,
}) => {
  const [conservativeRate, setConservativeRate] = useState(8);
  const [baseRate, setBaseRate] = useState(baseInputs.expectedReturnAnnual || 12);
  const [optimisticRate, setOptimisticRate] = useState(15);

  const scenarios = calculateReturnScenarios(
    baseInputs,
    conservativeRate,
    baseRate,
    optimisticRate
  );

  const maxCorpus = Math.max(
    scenarios.conservative.corpus,
    scenarios.base.corpus,
    scenarios.optimistic.corpus,
    1
  );

  return (
    <div id="scenarios-section" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Multi-Scenario Sensitivity Modeling</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Market returns fluctuate. Review outcomes under conservative, baseline, and optimistic trajectories.
          </p>
        </div>

        {/* Custom Rate Inputs */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Cons:</span>
            <input
              type="number"
              value={conservativeRate}
              onChange={(e) => setConservativeRate(Math.max(1, Math.min(30, Number(e.target.value))))}
              className="w-12 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-bold"
            />
            <span className="text-slate-400">%</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Base:</span>
            <input
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(Math.max(1, Math.min(30, Number(e.target.value))))}
              className="w-12 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-bold"
            />
            <span className="text-slate-400">%</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Opt:</span>
            <input
              type="number"
              value={optimisticRate}
              onChange={(e) => setOptimisticRate(Math.max(1, Math.min(30, Number(e.target.value))))}
              className="w-12 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-bold"
            />
            <span className="text-slate-400">%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Conservative */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Conservative
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {formatPercent(conservativeRate)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Corpus</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {formatINR(scenarios.conservative.corpus, { compact: isCompactCurrency })}
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between font-mono">
            <span>Gains:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              +{formatINR(scenarios.conservative.gains, { compact: isCompactCurrency })}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-500 h-full rounded-full"
              style={{ width: `${(scenarios.conservative.corpus / maxCorpus) * 100}%` }}
            />
          </div>
        </div>

        {/* Base */}
        <div className="rounded-xl border-2 border-emerald-500/40 dark:border-emerald-500/40 p-4 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-2 relative">
          <span className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Baseline
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Expected Base
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
              {formatPercent(baseRate)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Corpus</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatINR(scenarios.base.corpus, { compact: isCompactCurrency })}
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/40 flex justify-between font-mono">
            <span>Gains:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              +{formatINR(scenarios.base.gains, { compact: isCompactCurrency })}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${(scenarios.base.corpus / maxCorpus) * 100}%` }}
            />
          </div>
        </div>

        {/* Optimistic */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Optimistic
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
              {formatPercent(optimisticRate)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Corpus</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {formatINR(scenarios.optimistic.corpus, { compact: isCompactCurrency })}
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between font-mono">
            <span>Gains:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              +{formatINR(scenarios.optimistic.gains, { compact: isCompactCurrency })}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${(scenarios.optimistic.corpus / maxCorpus) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
