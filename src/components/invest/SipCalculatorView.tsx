/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SliderInput } from '../SliderInput';
import { MetricCard } from '../MetricCard';
import { GrowthAreaChart } from '../charts/GrowthAreaChart';
import { BreakdownPieChart } from '../charts/BreakdownPieChart';
import { ScenariosView } from '../scenarios/ScenariosView';
import { SensitivityMatrix } from '../scenarios/SensitivityMatrix';
import { FinancialInsights } from '../insights/FinancialInsights';
import { YearlyBreakdownTable } from '../tables/YearlyBreakdownTable';
import { SipInputs } from '../../types/calculator';
import { calculateSIP } from '../../calculations/sip';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ArrowUpRight, Plus, Sliders, ShieldCheck } from 'lucide-react';

interface SipCalculatorViewProps {
  inputs: SipInputs;
  onInputChange: (newInputs: SipInputs) => void;
  isCompactCurrency: boolean;
}

export const SipCalculatorView: React.FC<SipCalculatorViewProps> = ({
  inputs,
  onInputChange,
  isCompactCurrency,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inflationRate, setInflationRate] = useState(6);

  const result = calculateSIP(inputs);

  const updateField = <K extends keyof SipInputs>(key: K, value: SipInputs[K]) => {
    onInputChange({
      ...inputs,
      [key]: value,
    });
  };

  // Quick presets
  const monthlyPresets = [
    { label: '₹5K', value: 5000 },
    { label: '₹10K', value: 10000 },
    { label: '₹25K', value: 25000 },
    { label: '₹50K', value: 50000 },
    { label: '₹1L', value: 100000 },
  ];

  const durationPresets = [
    { label: '5Y', value: 5 },
    { label: '10Y', value: 10 },
    { label: '15Y', value: 15 },
    { label: '20Y', value: 20 },
    { label: '25Y', value: 25 },
    { label: '30Y', value: 30 },
  ];

  const returnPresets = [
    { label: '8% (Debt/FD)', value: 8 },
    { label: '10% (Hybrid)', value: 10 },
    { label: '12% (Nifty Index)', value: 12 },
    { label: '14% (Active Equity)', value: 14 },
    { label: '15% (Aggressive)', value: 15 },
  ];

  return (
    <div id="sip-calculator-view" className="space-y-8">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Inputs Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Investment Parameters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your periodic systematic contributions
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              Wealth Accumulation
            </span>
          </div>

          {/* Monthly Investment */}
          <SliderInput
            id="sip-monthly"
            label="Monthly Investment (SIP)"
            value={inputs.monthlyInvestment}
            min={500}
            max={200000}
            step={500}
            prefix="₹"
            isCurrency
            presets={monthlyPresets}
            tooltip="The amount you plan to invest every month into mutual funds or index funds."
            onChange={(val) => updateField('monthlyInvestment', val)}
          />

          {/* Duration */}
          <SliderInput
            id="sip-duration"
            label="Investment Duration"
            value={inputs.durationYears}
            min={1}
            max={40}
            step={1}
            unit=" Yrs"
            presets={durationPresets}
            tooltip="Number of years you plan to stay invested."
            onChange={(val) => updateField('durationYears', val)}
          />

          {/* Expected Return */}
          <SliderInput
            id="sip-return"
            label="Expected Annual Return (CAGR)"
            value={inputs.expectedReturnAnnual}
            min={1}
            max={30}
            step={0.5}
            unit="%"
            presets={returnPresets}
            tooltip="Historical broad-market index return benchmark is typically 11-13% in Indian equities."
            onChange={(val) => updateField('expectedReturnAnnual', val)}
          />

          {/* Step-Up SIP Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="stepup-toggle"
                  className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span>Annual Step-Up SIP</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Increase contribution annually as your income rises
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="stepup-toggle"
                  type="checkbox"
                  checked={inputs.hasStepUp}
                  onChange={(e) => updateField('hasStepUp', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {inputs.hasStepUp && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('stepUpType', 'percentage')}
                    className={`text-xs font-semibold px-3 py-1 rounded-md transition-all ${
                      inputs.stepUpType === 'percentage'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Percentage (+% / year)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('stepUpType', 'fixed')}
                    className={`text-xs font-semibold px-3 py-1 rounded-md transition-all ${
                      inputs.stepUpType === 'fixed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Fixed Amount (+₹ / year)
                  </button>
                </div>

                {inputs.stepUpType === 'percentage' ? (
                  <SliderInput
                    id="stepup-pct"
                    label="Annual Increase Percentage"
                    value={inputs.stepUpValue || 10}
                    min={1}
                    max={50}
                    step={1}
                    unit="%"
                    presets={[
                      { label: '5%', value: 5 },
                      { label: '10%', value: 10 },
                      { label: '15%', value: 15 },
                    ]}
                    onChange={(val) => updateField('stepUpValue', val)}
                  />
                ) : (
                  <SliderInput
                    id="stepup-fixed"
                    label="Annual Increase Amount"
                    value={inputs.stepUpValue || 1000}
                    min={500}
                    max={25000}
                    step={500}
                    prefix="₹"
                    isCurrency
                    presets={[
                      { label: '+₹1,000', value: 1000 },
                      { label: '+₹2,500', value: 2500 },
                      { label: '+₹5,000', value: 5000 },
                    ]}
                    onChange={(val) => updateField('stepUpValue', val)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Advanced options accordion: Initial Investment, Frequency, Inflation */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Lump Sum, Frequency)'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Initial Lump Sum */}
                <SliderInput
                  id="sip-initial"
                  label="Initial Lump Sum Investment"
                  value={inputs.initialInvestment}
                  min={0}
                  max={1000000}
                  step={10000}
                  prefix="₹"
                  isCurrency
                  tooltip="Existing portfolio starting balance compounding alongside monthly SIPs."
                  onChange={(val) => updateField('initialInvestment', val)}
                />

                {/* Frequency selection */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Investment Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => updateField('frequency', freq)}
                        className={`text-xs py-1.5 rounded-lg font-semibold capitalize border transition-all ${
                          inputs.frequency === freq
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contribution Timing (Beginning vs End of Month) */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Contribution Timing (Compounding Assumption)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('contributionTiming', 'beginning')}
                      className={`text-xs py-1.5 px-2 rounded-lg font-semibold border transition-all text-left ${
                        inputs.contributionTiming !== 'end'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="block font-bold">Start of Month</span>
                      <span className="text-[10px] opacity-80">MF SIP (Annuity Due)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('contributionTiming', 'end')}
                      className={`text-xs py-1.5 px-2 rounded-lg font-semibold border transition-all text-left ${
                        inputs.contributionTiming === 'end'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="block font-bold">End of Month</span>
                      <span className="text-[10px] opacity-80">Ordinary Annuity</span>
                    </button>
                  </div>
                </div>

                {/* Inflation rate for purchasing power check */}
                <SliderInput
                  id="sip-inflation-rate"
                  label="Benchmark Inflation Rate"
                  value={inflationRate}
                  min={0}
                  max={12}
                  step={0.5}
                  unit="%"
                  tooltip="Assumed consumer inflation rate used for purchasing power reality checks."
                  onChange={(val) => setInflationRate(val)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Results + Charts + Scenarios */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Primary Dominant Card */}
            <div className="sm:col-span-3">
              <MetricCard
                id="final-corpus-metric"
                title="Estimated Final Corpus"
                amount={result.finalCorpus}
                subtitle={`Projected value after ${inputs.durationYears} years at ${inputs.expectedReturnAnnual}% CAGR${
                  inputs.hasStepUp ? ' with annual step-up' : ''
                }.`}
                badge={{ text: `${result.wealthMultiplier}× Growth Multiple`, type: 'success' }}
                isCompact={isCompactCurrency}
                highlight
                color="emerald"
              />
            </div>

            <MetricCard
              id="total-invested-metric"
              title="Total Invested"
              amount={result.totalInvested}
              subtitle="Principal capital deposited over time"
              badge={{ text: 'Principal', type: 'info' }}
              isCompact={isCompactCurrency}
            />

            <MetricCard
              id="estimated-gains-metric"
              title="Estimated Gains"
              amount={result.estimatedGains}
              subtitle="Pure wealth generated from compounding"
              badge={{ text: 'Growth', type: 'success' }}
              isCompact={isCompactCurrency}
            />

            <MetricCard
              id="real-value-metric"
              title="Today's Real Value"
              amount={Math.round(result.finalCorpus / Math.pow(1 + inflationRate / 100, inputs.durationYears))}
              subtitle={`Adjusted for ${inflationRate}% annual inflation`}
              badge={{ text: 'Purchasing Power', type: 'warning' }}
              isCompact={isCompactCurrency}
            />
          </div>

          {/* Charts Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Portfolio Trajectory & Asset Composition
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visual representation of capital accumulation over {inputs.durationYears} years
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <GrowthAreaChart
                  data={result.yearlyBreakdown}
                  isCompactCurrency={isCompactCurrency}
                />
              </div>
              <div className="md:col-span-4 flex justify-center">
                <BreakdownPieChart
                  invested={result.totalInvested}
                  gains={result.estimatedGains}
                  label1="Invested Principal"
                  label2="Estimated Gains"
                />
              </div>
            </div>
          </div>

          {/* Scenarios Analysis */}
          <ScenariosView
            baseInputs={inputs}
            isCompactCurrency={isCompactCurrency}
          />

          {/* Sensitivity Matrix */}
          <SensitivityMatrix
            baseInputs={inputs}
            isCompactCurrency={isCompactCurrency}
          />

          {/* Financial Insights */}
          <FinancialInsights
            mode="sip"
            invested={result.totalInvested}
            corpus={result.finalCorpus}
            gains={result.estimatedGains}
            durationYears={inputs.durationYears}
            expectedReturn={inputs.expectedReturnAnnual}
            inflationRate={inflationRate}
            isStepUp={inputs.hasStepUp}
          />
        </div>
      </div>

      {/* Full Width Year-by-Year Schedule */}
      <YearlyBreakdownTable
        data={result.yearlyBreakdown}
        mode="sip"
        isCompactCurrency={isCompactCurrency}
      />
    </div>
  );
};
