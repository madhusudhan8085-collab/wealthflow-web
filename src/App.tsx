/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { SipCalculatorView } from './components/invest/SipCalculatorView';
import { SwpCalculatorView } from './components/withdraw/SwpCalculatorView';
import { CombinedCalculatorView } from './components/combined/CombinedCalculatorView';
import { GoalCalculatorView } from './components/goal/GoalCalculatorView';
import { ComparisonView } from './components/compare/ComparisonView';
import { WhatIfView } from './components/whatif/WhatIfView';
import { MutualFundFinderView } from './components/fund/MutualFundFinderView';
import { LearningHubView } from './components/learning/LearningHubView';
import { SettingsModal } from './components/settings/SettingsModal';
import { CalculationMode, SipInputs, SwpInputs, CombinedInputs } from './types/calculator';
import { decodeStateFromURL, encodeStateToURL } from './utils/urlState';
import { ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  // Theme state (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wealthflow_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Currency format preference: compact (e.g. ₹1.25 Cr) vs exact (₹1,25,00,000)
  const [isCompactCurrency, setIsCompactCurrency] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wealthflow_currency_compact');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  // Settings modal open state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Calculation Mode
  const [currentMode, setCurrentMode] = useState<CalculationMode>(() => {
    const urlState = decodeStateFromURL();
    return urlState.mode || 'sip';
  });

  // SIP Inputs State
  const [sipInputs, setSipInputs] = useState<SipInputs>(() => {
    const urlState = decodeStateFromURL();
    return (
      urlState.sip || {
        monthlyInvestment: 10000,
        durationYears: 15,
        expectedReturnAnnual: 12,
        frequency: 'monthly',
        hasStepUp: true,
        stepUpType: 'percentage',
        stepUpValue: 10,
        stepUpIntervalYears: 1,
        initialInvestment: 0,
        contributionTiming: 'beginning',
      }
    );
  });

  // SWP Inputs State
  const [swpInputs, setSwpInputs] = useState<SwpInputs>(() => {
    const urlState = decodeStateFromURL();
    return (
      urlState.swp || {
        startingCorpus: 10000000, // 1 Crore
        monthlyWithdrawal: 50000,
        withdrawalDurationYears: 20,
        expectedReturnAnnual: 8,
        frequency: 'monthly',
        hasAnnualIncrease: true,
        annualIncreasePercentage: 5,
      }
    );
  });

  // Combined Inputs State
  const [combinedInputs, setCombinedInputs] = useState<CombinedInputs>(() => {
    const urlState = decodeStateFromURL();
    return (
      urlState.combined || {
        sipMonthlyInvestment: 15000,
        sipDurationYears: 15,
        sipExpectedReturnAnnual: 12,
        sipHasStepUp: true,
        sipStepUpPercentage: 10,
        sipInitialInvestment: 0,
        swpMonthlyWithdrawal: 60000,
        swpDurationYears: 20,
        swpExpectedReturnAnnual: 8,
        swpHasAnnualIncrease: true,
        swpAnnualIncreasePercentage: 5,
      }
    );
  });

  // Sync theme changes to document DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wealthflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wealthflow_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist compact currency format preference
  useEffect(() => {
    localStorage.setItem('wealthflow_currency_compact', String(isCompactCurrency));
  }, [isCompactCurrency]);

  // Sync state to URL without reloading page
  useEffect(() => {
    encodeStateToURL({
      mode: currentMode,
      sip: sipInputs,
      swp: swpInputs,
      combined: combinedInputs,
    });
  }, [currentMode, sipInputs, swpInputs, combinedInputs]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Sticky Header */}
      <Header
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        isCompactCurrency={isCompactCurrency}
        onToggleCurrencyFormat={() => setIsCompactCurrency(!isCompactCurrency)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {currentMode === 'sip' && (
          <SipCalculatorView
            inputs={sipInputs}
            onInputChange={setSipInputs}
            isCompactCurrency={isCompactCurrency}
          />
        )}

        {currentMode === 'swp' && (
          <SwpCalculatorView
            inputs={swpInputs}
            onInputChange={setSwpInputs}
            isCompactCurrency={isCompactCurrency}
          />
        )}

        {currentMode === 'combined' && (
          <CombinedCalculatorView
            inputs={combinedInputs}
            onInputChange={setCombinedInputs}
            isCompactCurrency={isCompactCurrency}
          />
        )}

        {currentMode === 'goal' && (
          <GoalCalculatorView isCompactCurrency={isCompactCurrency} />
        )}

        {currentMode === 'compare' && (
          <ComparisonView isCompactCurrency={isCompactCurrency} />
        )}

        {currentMode === 'whatif' && (
          <WhatIfView
            baseInputs={sipInputs}
            isCompactCurrency={isCompactCurrency}
          />
        )}

        {currentMode === 'funds' && <MutualFundFinderView />}

        {currentMode === 'learning' && <LearningHubView />}

        {/* Regulatory & Risk Disclaimer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <Disclaimer />
        </div>
      </main>

      {/* Settings & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isCompactCurrency={isCompactCurrency}
        onToggleCurrencyFormat={() => setIsCompactCurrency(!isCompactCurrency)}
      />

      {/* Upgraded Professional Fintech Footer with Official Logo Integration */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Brand + Logo Column */}
            <div className="flex items-center gap-3.5">
              <img
                src="/wealthflow-logo.jpg"
                alt="WealthFlow"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                    WealthFlow
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    v2.0 Production
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Plan today. Understand tomorrow.
                </p>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setCurrentMode('sip')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                SIP Calculator
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode('swp')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                SWP Longevity
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode('combined')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                SIP to SWP Journey
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode('goal')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Goal Planner
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode('funds')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                MF Category Finder
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode('learning')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Learning Hub
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Preferences
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} WealthFlow. Deterministic financial planning with Indian number formatting (Lakh / Crore) and monthly discrete compounding.
            </p>
            <div className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SEBI Suitability Principles Aligned</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
