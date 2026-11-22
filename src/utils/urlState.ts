/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculationMode, SipInputs, SwpInputs, CombinedInputs } from '../types/calculator';

export interface AppStatePayload {
  mode?: CalculationMode;
  sip?: SipInputs;
  swp?: SwpInputs;
  combined?: CombinedInputs;
}

export function encodeStateToURL(state: AppStatePayload): void {
  try {
    const searchParams = new URLSearchParams();
    if (state.mode) {
      searchParams.set('mode', state.mode);
    }
    if (state.sip) {
      searchParams.set('sip_m', String(state.sip.monthlyInvestment));
      searchParams.set('sip_y', String(state.sip.durationYears));
      searchParams.set('sip_r', String(state.sip.expectedReturnAnnual));
      searchParams.set('sip_su', state.sip.hasStepUp ? '1' : '0');
      if (state.sip.hasStepUp && state.sip.stepUpValue) {
        searchParams.set('sip_suv', String(state.sip.stepUpValue));
      }
      if (state.sip.contributionTiming) {
        searchParams.set('sip_tim', state.sip.contributionTiming);
      }
    }
    if (state.swp) {
      searchParams.set('swp_c', String(state.swp.startingCorpus));
      searchParams.set('swp_w', String(state.swp.monthlyWithdrawal));
      searchParams.set('swp_y', String(state.swp.withdrawalDurationYears));
      searchParams.set('swp_r', String(state.swp.expectedReturnAnnual));
      searchParams.set('swp_inc', state.swp.hasAnnualIncrease ? '1' : '0');
    }
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  } catch {
    // Ignore history replace errors
  }
}

export function decodeStateFromURL(): AppStatePayload {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode') as CalculationMode | null;

    const payload: AppStatePayload = {};
    if (mode) {
      payload.mode = mode;
    }

    const sipM = searchParams.get('sip_m');
    const sipY = searchParams.get('sip_y');
    const sipR = searchParams.get('sip_r');
    const sipSu = searchParams.get('sip_su');
    const sipSuv = searchParams.get('sip_suv');
    const sipTim = searchParams.get('sip_tim') as 'beginning' | 'end' | null;

    if (sipM && sipY && sipR) {
      payload.sip = {
        monthlyInvestment: Number(sipM) || 10000,
        durationYears: Number(sipY) || 15,
        expectedReturnAnnual: Number(sipR) || 12,
        frequency: 'monthly',
        hasStepUp: sipSu === '1',
        stepUpType: 'percentage',
        stepUpValue: Number(sipSuv) || 10,
        stepUpIntervalYears: 1,
        initialInvestment: 0,
        contributionTiming: sipTim === 'end' ? 'end' : 'beginning',
      };
    }

    const swpC = searchParams.get('swp_c');
    const swpW = searchParams.get('swp_w');
    const swpY = searchParams.get('swp_y');
    const swpR = searchParams.get('swp_r');
    const swpInc = searchParams.get('swp_inc');

    if (swpC && swpW && swpY && swpR) {
      payload.swp = {
        startingCorpus: Number(swpC) || 10000000,
        monthlyWithdrawal: Number(swpW) || 50000,
        withdrawalDurationYears: Number(swpY) || 20,
        expectedReturnAnnual: Number(swpR) || 8,
        frequency: 'monthly',
        hasAnnualIncrease: swpInc === '1',
        annualIncreasePercentage: 5,
      };
    }

    return payload;
  } catch {
    return {};
  }
}

export function copyShareLink(): Promise<boolean> {
  return navigator.clipboard
    .writeText(window.location.href)
    .then(() => true)
    .catch(() => false);
}
