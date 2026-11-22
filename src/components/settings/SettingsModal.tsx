/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Coins,
  Shield,
  User,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isCompactCurrency: boolean;
  onToggleCurrencyFormat: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  isCompactCurrency,
  onToggleCurrencyFormat,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.getEnabled());
  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem('wealthflow_profile_name') || 'Investor';
  });
  const [targetFireYear, setTargetFireYear] = useState<number>(() => {
    const val = localStorage.getItem('wealthflow_target_fire_year');
    return val ? Number(val) : 2040;
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('wealthflow_profile_name', profileName);
    localStorage.setItem('wealthflow_target_fire_year', String(targetFireYear));
    sound.playSuccess();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all saved preferences (theme, currency format, and stored inputs) to defaults?')) {
      localStorage.removeItem('wealthflow_theme');
      localStorage.removeItem('wealthflow_currency_compact');
      localStorage.removeItem('wealthflow_sound_enabled');
      localStorage.removeItem('wealthflow_profile_name');
      localStorage.removeItem('wealthflow_target_fire_year');
      window.location.href = window.location.pathname;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-6 p-6">
        {/* Header with WealthFlow Logo */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/wealthflow-logo.jpg"
              alt="WealthFlow"
              className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30 shadow-xs"
            />
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Platform Preferences & Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize audio feedback, themes, and financial targets
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Investor Profile Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1 font-medium">Display Name</label>
                <input
                  id="profile-name-input"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-medium">Target Financial Freedom Year</label>
                <input
                  id="target-fire-year-input"
                  type="number"
                  min={2026}
                  max={2070}
                  value={targetFireYear}
                  onChange={(e) => setTargetFireYear(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                id="save-profile-btn"
                type="submit"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 shadow-xs"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved Profile!' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Toggles */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            UI & Audio Preferences
          </h4>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Tactile Audio Feedback
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Subtle fintech audio synthesizer for slider ticks and actions
                </span>
              </div>
            </div>

            <button
              id="sound-toggle-btn"
              type="button"
              onClick={handleToggleSound}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                soundEnabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Color Theme Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Toggle between high-contrast Dark and crisp Light fintech layouts
                </span>
              </div>
            </div>

            <button
              id="theme-mode-settings-btn"
              type="button"
              onClick={onToggleDarkMode}
              className="text-xs px-3 py-1 rounded-lg font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          {/* Currency Format */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Indian Currency Format
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Switch between compact notation (₹ Lakh / Cr) or exact comma notation
                </span>
              </div>
            </div>

            <button
              id="currency-format-settings-btn"
              type="button"
              onClick={onToggleCurrencyFormat}
              className="text-xs font-mono font-bold px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isCompactCurrency ? '₹ Lakh / Cr' : '₹ 10,00,000'}
            </button>
          </div>
        </div>

        {/* Danger Zone: Reset */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            id="reset-all-preferences-btn"
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Platform Data & Cache</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">v2.0 Production</span>
        </div>
      </div>
    </div>
  );
};
