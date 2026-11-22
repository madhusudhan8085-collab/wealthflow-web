/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Share2,
  Printer,
  Sun,
  Moon,
  Check,
  ArrowDownCircle,
  GitMerge,
  Target,
  Scale,
  Sparkles,
  Compass,
  GraduationCap,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CalculationMode } from '../types/calculator';
import { copyShareLink } from '../utils/urlState';
import { sound } from '../utils/sound';

interface HeaderProps {
  currentMode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
  isCompactCurrency: boolean;
  onToggleCurrencyFormat: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  isCompactCurrency,
  onToggleCurrencyFormat,
  isDarkMode,
  onToggleDarkMode,
  onOpenSettings,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(!sound.getEnabled());

  const handleShare = async () => {
    sound.playSuccess();
    const success = await copyShareLink();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleModeSelect = (mode: CalculationMode) => {
    sound.playTabSwitch();
    onModeChange(mode);
  };

  const handleToggleSoundQuick = () => {
    const next = !sound.getEnabled();
    sound.setEnabled(next);
    setIsSoundMuted(!next);
  };

  const navItems: Array<{
    id: CalculationMode;
    label: string;
    icon: React.ReactNode;
  }> = [
      { id: 'sip', label: 'SIP (Invest)', icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: 'swp', label: 'SWP (Withdraw)', icon: <ArrowDownCircle className="w-3.5 h-3.5" /> },
      { id: 'combined', label: 'SIP → SWP', icon: <GitMerge className="w-3.5 h-3.5" /> },
      { id: 'goal', label: 'Goal Planning', icon: <Target className="w-3.5 h-3.5" /> },
      { id: 'compare', label: 'Compare', icon: <Scale className="w-3.5 h-3.5" /> },
      { id: 'whatif', label: 'What-If?', icon: <Sparkles className="w-3.5 h-3.5" /> },
      { id: 'funds', label: 'MF Finder', icon: <Compass className="w-3.5 h-3.5" /> },
      { id: 'learning', label: 'Learning Hub', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand + Controls */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand with Official WealthFlow Logo */}
          <div
            onClick={() => handleModeSelect('sip')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <img
                src="/wealthflow-logo.jpg"
                alt="WealthFlow"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-emerald-500/40 shadow-md shadow-emerald-500/10 group-hover:scale-105 group-hover:border-emerald-400 transition-all duration-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-emerald-700 dark:from-white dark:via-slate-100 dark:to-emerald-400 bg-clip-text text-transparent">
                  WealthFlow
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider border border-emerald-300/80 dark:border-emerald-700/60">
                  Pro Engine
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block tracking-wide">
                Plan today. Understand tomorrow.
              </p>
            </div>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Currency Format Toggle */}
            <button
              id="toggle-currency-btn"
              type="button"
              onClick={() => {
                sound.playClick();
                onToggleCurrencyFormat();
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-mono"
              title="Toggle format between Lakh/Cr and full comma notation"
            >
              <span>{isCompactCurrency ? '₹ Lakh / Cr' : '₹ 10,00,000'}</span>
            </button>

            {/* Quick Sound Toggle */}
            <button
              id="sound-quick-toggle-btn"
              type="button"
              onClick={handleToggleSoundQuick}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hidden sm:inline-flex"
              title={isSoundMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
              aria-label="Toggle sound feedback"
            >
              {isSoundMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* Share Link */}
            <button
              id="share-plan-btn"
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              title="Share this calculation plan via URL permalink"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'Link Copied!' : 'Share Plan'}</span>
            </button>

            {/* Print / PDF */}
            <button
              id="print-export-btn"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Print / PDF</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={() => {
                sound.playClick();
                onToggleDarkMode();
              }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Settings & Profile Modal Button */}
            <button
              id="open-settings-btn"
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              title="Settings & Profile"
              aria-label="Open settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (8 Modes) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-2.5 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          {navItems.map((tab) => {
            const isActive = currentMode === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                type="button"
                onClick={() => handleModeSelect(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${isActive
                    ? 'bg-emerald-600 text-white shadow-xs scale-100 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
