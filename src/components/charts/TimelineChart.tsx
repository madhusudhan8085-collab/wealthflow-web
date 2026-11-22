/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { formatINR } from '../../utils/formatters';

interface TimelineChartProps {
  timeline: Array<{
    year: number;
    phase: 'accumulation' | 'withdrawal';
    corpus: number;
    flow: number;
    gains: number;
  }>;
  sipYears: number;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ timeline, sipYears }) => {
  const chartData = timeline.map((item) => ({
    year: `Y${item.year}`,
    yearNum: item.year,
    phase: item.phase,
    corpus: item.corpus,
    accumulationCorpus: item.phase === 'accumulation' ? item.corpus : null,
    withdrawalCorpus: item.phase === 'withdrawal' ? item.corpus : null,
    flow: item.flow,
    gains: item.gains,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const isAccum = d.phase === 'accumulation';
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1 font-mono">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1">
            <span className="font-bold text-slate-200">Year {d.yearNum}</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isAccum ? 'bg-emerald-900/60 text-emerald-300' : 'bg-blue-900/60 text-blue-300'
              }`}
            >
              {isAccum ? 'Accumulation Phase' : 'Distribution Phase'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-emerald-400">Corpus Value:</span>
            <span className="font-bold">{formatINR(d.corpus, { compact: false })}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">{isAccum ? 'Annual Contribution:' : 'Annual Withdrawal:'}</span>
            <span>{formatINR(Math.abs(d.flow), { compact: false })}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-amber-400">Growth That Year:</span>
            <span>{formatINR(d.gains, { compact: false })}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="timeline-lifecycle-chart" className="w-full h-72 sm:h-84">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="timelineAccumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="timelineWithdrawGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatINR(val, { compact: true, showSymbol: true })}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <ReferenceLine
            x={`Y${sipYears}`}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{
              value: `SWP Begins (Year ${sipYears})`,
              fill: '#f59e0b',
              fontSize: 11,
              position: 'top',
            }}
          />
          <Area
            type="monotone"
            dataKey="corpus"
            name="Portfolio Value"
            stroke="#059669"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#timelineAccumGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
