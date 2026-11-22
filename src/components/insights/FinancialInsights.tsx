/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Clock, TrendingUp, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';
import { formatINR, formatPercent } from '../../utils/formatters';

interface FinancialInsightsProps {
  mode: 'sip' | 'swp' | 'combined' | 'goal';
  invested: number;
  corpus: number;
  gains: number;
  durationYears: number;
  expectedReturn: number;
  inflationRate?: number;
  isStepUp?: boolean;
  swpSafeRate?: number;
  isDepleted?: boolean;
  depletionYear?: number | null;
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({
  mode,
  invested,
  corpus,
  gains,
  durationYears,
  expectedReturn,
  inflationRate = 6,
  isStepUp = false,
  swpSafeRate,
  isDepleted = false,
  depletionYear,
}) => {
  const gainsPct = corpus > 0 ? Math.round((gains / corpus) * 100) : 0;
  const multiplier = invested > 0 ? (corpus / invested).toFixed(1) : '1.0';
  const doublingYears = expectedReturn > 0 ? (72 / expectedReturn).toFixed(1) : 'N/A';

  // Purchasing power of corpus after duration at inflationRate
  const discountFactor = Math.pow(1 + inflationRate / 100, durationYears);
  const realPurchasingPower = Math.round(corpus / discountFactor);

  return (
    <div id="financial-insights-card" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Smart Financial Insights & Mathematical Analysis
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deterministic observations derived from your compounding parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {/* Insight 1: Wealth Multiplier & Gains Ratio */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Wealth Multiplier</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Your principal grows <strong className="text-slate-900 dark:text-white">{multiplier}×</strong>. Gains represent <strong className="text-emerald-600 dark:text-emerald-400">{gainsPct}%</strong> of your total final value ({formatINR(gains, { compact: true })} generated purely from compounding).
          </p>
        </div>

        {/* Insight 2: Rule of 72 Doubling Time */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Rule of 72 (Doubling Velocity)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            At an annualized return of {formatPercent(expectedReturn)}, your accumulated invested corpus is estimated to double approximately every <strong className="text-slate-900 dark:text-white">{doublingYears} years</strong>.
          </p>
        </div>

        {/* Insight 3: Inflation Reality Check */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Purchasing Power Reality Check</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Factoring a {inflationRate}% annual inflation rate over {durationYears} years, your estimated future corpus of {formatINR(corpus, { compact: true })} equals approximately <strong className="text-slate-900 dark:text-white">{formatINR(realPurchasingPower, { compact: true })}</strong> in today&apos;s purchasing power.
          </p>
        </div>

        {/* Insight 4: Mode specific - SWP Safe Withdrawal Rate or Step-Up impact */}
        {mode === 'swp' ? (
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-1 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldAlert className={`w-3.5 h-3.5 ${isDepleted ? 'text-amber-500' : 'text-emerald-600'}`} />
              <span>Corpus Longevity & Sustainability Status</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {isDepleted ? (
                <>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Corpus Depletion Warning: </span>
                  At current withdrawal and return rates, the corpus exhausts around Year {depletionYear}. To extend longevity, consider reducing monthly withdrawals or boosting portfolio yield.
                </>
              ) : (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Healthy Sustainable Withdrawal: </span>
                  Your initial annual withdrawal rate is <strong className="text-slate-900 dark:text-white">{swpSafeRate}%</strong>. Financial planners generally regard initial withdrawal rates below 6% as resilient for multi-decade horizons.
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-1 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>Compounding Acceleration in Later Years</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              In compounding investments, over 50% of the total accumulated wealth is typically generated in the final 25% of the investment duration. Staying invested and disciplined avoids the severe mathematical penalty of early redemptions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
