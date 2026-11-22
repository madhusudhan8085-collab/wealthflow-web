/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Compass,
  TrendingUp,
  Layers,
  HelpCircle,
  CheckCircle2,
  PieChart as PieIcon,
  Info,
  Calendar,
  Zap,
} from 'lucide-react';
import { MetricCard } from '../MetricCard';
import { sound } from '../../utils/sound';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high';
export type Horizon = 'under1y' | '1to3y' | '3to5y' | '5to7y' | 'over7y';
export type GoalObjective = 'emergency' | 'shortTerm' | 'wealthCreation' | 'retirement' | 'taxSaving';

interface CategoryRecommendation {
  categoryName: string;
  subType: string;
  sebiMandate: string;
  assetAllocation: { equity: number; debt: number; cash: number };
  idealHorizon: string;
  volatilityRating: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  taxationSummary: string;
  suitabilityRationale: string;
  keyRisks: string[];
  bestPractices: string[];
}

export const MutualFundFinderView: React.FC = () => {
  const [horizon, setHorizon] = useState<Horizon>('5to7y');
  const [risk, setRisk] = useState<RiskLevel>('moderate');
  const [objective, setObjective] = useState<GoalObjective>('wealthCreation');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(10000);

  const handleHorizonChange = (h: Horizon) => {
    sound.playClick();
    setHorizon(h);
  };

  const handleRiskChange = (r: RiskLevel) => {
    sound.playClick();
    setRisk(r);
  };

  const handleObjectiveChange = (o: GoalObjective) => {
    sound.playClick();
    setObjective(o);
  };

  // Evaluate suitability & detect risk mismatches
  const isHorizonEquityMismatch =
    (horizon === 'under1y' || horizon === '1to3y') &&
    (risk === 'high' || risk === 'very-high' || objective === 'wealthCreation');

  const getRecommendations = (): {
    primary: CategoryRecommendation;
    secondary?: CategoryRecommendation;
    allocation: { equity: number; debt: number; gold: number };
    warning?: string;
  } => {
    // 1. Under 1 Year: Liquid / Ultra Short Duration Debt only
    if (horizon === 'under1y') {
      return {
        primary: {
          categoryName: 'Liquid / Overnight Funds',
          subType: 'Debt Mutual Fund',
          sebiMandate: 'Invests exclusively in debt securities and money market instruments with maturity up to 91 days.',
          assetAllocation: { equity: 0, debt: 90, cash: 10 },
          idealHorizon: '1 day to 12 months',
          volatilityRating: 'Very Low',
          taxationSummary: 'Gains taxed at investor’s applicable marginal income tax slab.',
          suitabilityRationale: 'For horizons under 1 year, preserving capital and instant liquidity takes priority over compounding. Eliminates equity drawdown risk.',
          keyRisks: ['Interest rate risk is negligible, credit risk controlled by top-rated sovereign/AAA papers.'],
          bestPractices: ['Maintain 3–6 months of living expenses here for emergency reserves.', 'Choose Direct Growth plans.'],
        },
        allocation: { equity: 0, debt: 95, gold: 5 },
        warning:
          risk === 'high' || risk === 'very-high'
            ? 'Risk Warning: Even though you indicated high risk tolerance, equity investments are statistically unsuitable for horizons under 1 year due to short-term market volatility.'
            : undefined,
      };
    }

    // 2. 1 to 3 Years: Short Duration / Banking & PSU / Arbitrage Funds
    if (horizon === '1to3y') {
      if (objective === 'emergency') {
        return {
          primary: {
            categoryName: 'Low Duration / Money Market Funds',
            subType: 'Debt Mutual Fund',
            sebiMandate: 'Macaulay duration between 6 to 12 months in government and high-grade corporate bonds.',
            assetAllocation: { equity: 0, debt: 95, cash: 5 },
            idealHorizon: '1 to 2 years',
            volatilityRating: 'Low',
            taxationSummary: 'Taxed at investor’s marginal tax rate.',
            suitabilityRationale: 'Provides superior tax-adjusted yield stability compared to traditional savings accounts without lock-in penalties.',
            keyRisks: ['Minor mark-to-market interest rate fluctuations when RBI policy rates shift.'],
            bestPractices: ['Pick funds with >85% sovereign and AAA-rated securities.'],
          },
          allocation: { equity: 0, debt: 100, gold: 0 },
        };
      }

      return {
        primary: {
          categoryName: 'Conservative Hybrid or Arbitrage Funds',
          subType: 'Hybrid / Capital Preservation',
          sebiMandate: 'Conservative Hybrid: 75–90% in debt securities, 10–25% in equity equity-related instruments.',
          assetAllocation: { equity: 20, debt: 75, cash: 5 },
          idealHorizon: '2 to 3 years',
          volatilityRating: 'Low',
          taxationSummary: 'Arbitrage enjoys equity taxation (12.5% LTCG after 1 yr); Conservative hybrid taxed at slab.',
          suitabilityRationale: 'Gives a minor equity kicker to outpace inflation while protecting downside capital over 1 to 3 years.',
          keyRisks: ['Equity portion may experience minor temporary drawdown during broader market corrections.'],
          bestPractices: ['Ideal for near-term milestones like a car down payment or higher education fees.'],
        },
        allocation: { equity: 20, debt: 75, gold: 5 },
        warning:
          risk === 'very-high'
            ? 'Caution: A 1-to-3 year horizon is too brief for pure equity or small-cap funds. Capital preservation must be prioritized.'
            : undefined,
      };
    }

    // 3. 3 to 5 Years: Balanced Advantage / Dynamic Asset Allocation / Large-Cap Index
    if (horizon === '3to5y') {
      if (risk === 'low') {
        return {
          primary: {
            categoryName: 'Balanced Advantage Funds (Dynamic Asset Allocation)',
            subType: 'Hybrid Mutual Fund',
            sebiMandate: 'Dynamically shifts allocation between 30% to 80% equity based on market valuation metrics (P/E, P/B).',
            assetAllocation: { equity: 45, debt: 50, cash: 5 },
            idealHorizon: '3 to 5 years',
            volatilityRating: 'Moderate',
            taxationSummary: 'Structured to retain Equity taxation status (12.5% LTCG over ₹1.25 Lakh after 1 year).',
            suitabilityRationale: 'Built-in asset allocation dampens market volatility, automatically booking equity profits when markets are expensive and buying dips.',
            keyRisks: ['Model risk: Counter-trend market momentum can occasionally lag pure bull runs.'],
            bestPractices: ['Best for first-time equity entrants who fear market crashes.'],
          },
          allocation: { equity: 45, debt: 50, gold: 5 },
        };
      }

      return {
        primary: {
          categoryName: 'Aggressive Hybrid or Large Cap Index Funds',
          subType: 'Equity-Oriented Fund',
          sebiMandate: 'Aggressive Hybrid holds 65–80% in equities and 20–35% in debt. Index funds track Nifty 50 or Sensex.',
          assetAllocation: { equity: 70, debt: 25, cash: 5 },
          idealHorizon: '3 to 5 years',
          volatilityRating: 'Moderate',
          taxationSummary: 'Equity taxation: 12.5% LTCG for gains exceeding ₹1.25 Lakh/financial year; 20% STCG.',
          suitabilityRationale: 'Captures broader economic expansion through India’s top 50–100 corporations with an active fixed-income shock absorber.',
          keyRisks: ['Economic cycle drawdowns lasting 12–18 months.'],
          bestPractices: ['Invest strictly via monthly SIP to rupee-cost average across market cycles.'],
        },
        allocation: { equity: 70, debt: 25, gold: 5 },
      };
    }

    // 4. 5 to 7 Years: Flexi Cap & Multi Cap Funds
    if (horizon === '5to7y') {
      if (objective === 'taxSaving') {
        return {
          primary: {
            categoryName: 'ELSS (Equity Linked Savings Scheme)',
            subType: 'Tax-Saving Equity Fund',
            sebiMandate: 'Invests minimum 80% in equities with a mandatory 3-year statutory lock-in period.',
            assetAllocation: { equity: 95, debt: 0, cash: 5 },
            idealHorizon: '5 years minimum',
            volatilityRating: 'High',
            taxationSummary: 'Qualifies for deduction up to ₹1.5 Lakh under Section 80C (Old Tax Regime). 12.5% LTCG above ₹1.25 Lakh.',
            suitabilityRationale: 'Lowest lock-in (3 years) among all Section 80C tax-saving options with superior long-term inflation-beating potential.',
            keyRisks: ['Mandatory 3-year lock-in per SIP installment; high equity market volatility.'],
            bestPractices: ['Do not redeem immediately after the 3-year lock-in; let compounding continue.'],
          },
          allocation: { equity: 80, debt: 15, gold: 5 },
        };
      }

      return {
        primary: {
          categoryName: 'Flexi Cap Funds / Nifty 500 Index',
          subType: 'Diversified Broad-Market Equity',
          sebiMandate: 'Invests minimum 65% in equities with freedom to allocate across Large, Mid, and Small Cap stocks dynamically.',
          assetAllocation: { equity: 80, debt: 15, cash: 5 },
          idealHorizon: '5 to 7 years',
          volatilityRating: 'High',
          taxationSummary: 'Equity taxation (12.5% LTCG after 12 months; 20% STCG).',
          suitabilityRationale: 'Allows seasoned fund managers to rotate capital into high-growth mid-sized companies while anchoring with stable large-cap leaders.',
          keyRisks: ['Mid-cap volatility during liquidity squeezes or global rate hikes.'],
          bestPractices: ['Maintain continuous SIP discipline without pausing during market corrections.'],
        },
        secondary: {
          categoryName: 'Short-Duration Debt or Arbitrage (Shock Absorber)',
          subType: 'Fixed Income Allocation',
          sebiMandate: 'Provides rebalancing ammunition during steep market dips.',
          assetAllocation: { equity: 0, debt: 95, cash: 5 },
          idealHorizon: '3+ years',
          volatilityRating: 'Low',
          taxationSummary: 'Taxed at marginal slab rate.',
          suitabilityRationale: 'Holding 15–20% in debt allows systematic rebalancing during bear market corrections.',
          keyRisks: ['Modest nominal returns.'],
          bestPractices: ['Rebalance portfolio once annually.'],
        },
        allocation: { equity: 80, debt: 15, gold: 5 },
      };
    }

    // 5. 7+ Years (Very Long Term): Aggressive Growth / Multi-Cap / Mid-Cap Blend
    return {
      primary: {
        categoryName: 'Multi Cap & Mid Cap Fund Blend',
        subType: 'Aggressive Capital Appreciation',
        sebiMandate: 'Multi-Cap requires strictly 25% Large, 25% Mid, and 25% Small Cap at all times. Mid-cap invests 65%+ in stocks ranked 101–250 by market cap.',
        assetAllocation: { equity: 85, debt: 10, cash: 5 },
        idealHorizon: '7 to 10+ years',
        volatilityRating: 'Very High',
        taxationSummary: 'Equity taxation: 12.5% LTCG after 12 months on profits over ₹1.25 Lakh/yr.',
        suitabilityRationale: 'Over 7+ year horizons, interim volatility smooths out, allowing the superior earnings growth rates of mid and emerging companies to compound aggressively.',
        keyRisks: ['Drawdowns of 25–35% during bear markets are common and require psychological resilience.'],
        bestPractices: ['Pair with an annual Step-Up SIP (+10%) to accelerate financial independence.'],
      },
      secondary: {
        categoryName: 'Nifty 50 Equal Weight / Large Cap Index',
        subType: 'Core Market Anchor',
        sebiMandate: 'Tracks India’s leading corporate bellwethers with low expense ratios.',
        assetAllocation: { equity: 95, debt: 0, cash: 5 },
        idealHorizon: '7+ years',
        volatilityRating: 'High',
        taxationSummary: 'Equity taxation (12.5% LTCG).',
        suitabilityRationale: 'Provides steady core ballast to protect portfolio integrity alongside higher-beta mid-cap holdings.',
        keyRisks: ['Broader economic stagnation risk.'],
        bestPractices: ['Opt for Direct-Growth plan to eliminate distributor commission drag (~0.7% to 1.2% per year).'],
      },
      allocation: { equity: 85, debt: 10, gold: 5 },
    };
  };

  const rec = getRecommendations();

  return (
    <div id="mutual-fund-finder-view" className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-slate-900 to-teal-900/90 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> SEBI-Aligned Category Suitability Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Objective Mutual Fund Category Suitability
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Determine the mathematically and regulatory suitable mutual fund categories for your investment horizon and risk profile. WealthFlow never manufactures fabricated ratings, performance, or NAV data.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono space-y-0.5">
            <span className="text-emerald-300 font-bold block flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Direct Growth Advocacy
            </span>
            <span className="text-slate-300 text-[11px]">Zero distributor commissions</span>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Input Profiler */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Investment Profiling
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Answer 3 objective suitability criteria
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              Risk Profiler
            </span>
          </div>

          {/* 1. Time Horizon */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Investment Time Horizon</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'under1y', label: '< 1 Year', sub: 'Liquid / Very Short' },
                { id: '1to3y', label: '1 to 3 Years', sub: 'Short Term' },
                { id: '3to5y', label: '3 to 5 Years', sub: 'Medium Term' },
                { id: '5to7y', label: '5 to 7 Years', sub: 'Long Term' },
                { id: 'over7y', label: '7+ Years', sub: 'Wealth Compounding' },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`horizon-btn-${item.id}`}
                  type="button"
                  onClick={() => handleHorizonChange(item.id as Horizon)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    horizon === item.id
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Risk Appetite */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Risk Tolerance Capacity</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'low', label: 'Conservative', desc: 'No capital erosion' },
                { id: 'moderate', label: 'Moderate', desc: 'Balanced swings' },
                { id: 'high', label: 'High Growth', desc: 'Accepts volatility' },
                { id: 'very-high', label: 'Aggressive', desc: 'Max return focus' },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`risk-btn-${item.id}`}
                  type="button"
                  onClick={() => handleRiskChange(item.id as RiskLevel)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    risk === item.id
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Primary Goal */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Primary Financial Objective
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'emergency', label: 'Emergency Fund', sub: 'Instant liquidity' },
                { id: 'shortTerm', label: 'Target Milestone', sub: 'Down payment / Fees' },
                { id: 'wealthCreation', label: 'Wealth Compounding', sub: 'Outpace inflation' },
                { id: 'retirement', label: 'Retirement Corpus', sub: 'Long-term freedom' },
                { id: 'taxSaving', label: 'Tax Saving (80C)', sub: 'ELSS 3Y lock-in' },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`goal-btn-${item.id}`}
                  type="button"
                  onClick={() => handleObjectiveChange(item.id as GoalObjective)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    objective === item.id
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Suitability Results & SEBI Category Mandate */}
        <div className="lg:col-span-7 space-y-6">
          {/* Warning Banner if Mismatch exists */}
          {rec.warning && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-sm mb-0.5">Asset Allocation Suitability Warning</strong>
                <p className="leading-relaxed opacity-95">{rec.warning}</p>
              </div>
            </div>
          )}

          {/* Primary Recommended Category */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/40 p-5 sm:p-6 shadow-xs space-y-5 relative">
            <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Primary Suitable Category
            </span>

            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    {rec.primary.subType}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {rec.primary.categoryName}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                    Ideal: {rec.primary.idealHorizon}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Risk: {rec.primary.volatilityRating}
                  </span>
                </div>
              </div>
            </div>

            {/* SEBI Mandate & Definition */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>SEBI Categorization & Investment Mandate</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {rec.primary.sebiMandate}
              </p>
            </div>

            {/* Suitability Rationale */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Why This Category Fits Your Profile</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {rec.primary.suitabilityRationale}
              </p>
            </div>

            {/* Recommended Target Asset Split */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Asset Allocation Model</span>
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {rec.allocation.equity}% Equity / {rec.allocation.debt}% Debt / {rec.allocation.gold}% Cash-Gold
                </span>
              </div>

              {/* Multi-colored Allocation Bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
                <div
                  className="bg-emerald-600 transition-all duration-500"
                  style={{ width: `${rec.allocation.equity}%` }}
                  title={`Equity: ${rec.allocation.equity}%`}
                />
                <div
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${rec.allocation.debt}%` }}
                  title={`Debt: ${rec.allocation.debt}%`}
                />
                <div
                  className="bg-amber-400 transition-all duration-500"
                  style={{ width: `${rec.allocation.gold}%` }}
                  title={`Gold/Cash: ${rec.allocation.gold}%`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  Equity ({rec.allocation.equity}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  Debt / Fixed Income ({rec.allocation.debt}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  Gold / Reserve ({rec.allocation.gold}%)
                </span>
              </div>
            </div>

            {/* Taxation & Best Practices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Applicable Indian Taxation (Budget 2024+)
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {rec.primary.taxationSummary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Investor Execution Advice
                </span>
                <ul className="text-slate-600 dark:text-slate-400 text-[11px] list-disc list-inside space-y-0.5">
                  {rec.primary.bestPractices.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Secondary / Companion Category if available */}
          {rec.secondary && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Companion Diversifier ({rec.secondary.subType})
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {rec.secondary.categoryName}
                  </h4>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {rec.secondary.volatilityRating} Volatility
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {rec.secondary.suitabilityRationale}
              </p>
            </div>
          )}

          {/* Regulatory Transparency Note */}
          <div className="p-3.5 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              <strong>Regulatory Integrity:</strong> WealthFlow does not distribute specific fund houses (AMCs), receive referral commissions, or endorse individual scheme star ratings. Investors should choose low-cost <strong>Direct Plans</strong> with reputable asset management companies registered with SEBI.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
