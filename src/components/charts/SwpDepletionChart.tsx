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
import { YearlyBreakdownItem } from '../../types/calculator';
import { formatINR } from '../../utils/formatters';

interface SwpDepletionChartProps {
  data: YearlyBreakdownItem[];
  startingCorpus: number;
  depletionYear: number | null;
}

export const SwpDepletionChart: React.FC<SwpDepletionChartProps> = ({
  data,
  startingCorpus,
  depletionYear,
}) => {
  const chartData = data.map((item) => ({
    year: `Y${item.year}`,
    yearNum: item.year,
    corpus: item.endingBalance,
    withdrawnToDate: item.totalWithdrawnToDate || 0,
    annualWithdrawal: item.annualWithdrawal || 0,
    annualGains: item.annualGains,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1 font-mono">
          <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">
            Year {d.yearNum}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400">Remaining Corpus:</span>
            <span className="font-bold">{formatINR(d.corpus, { compact: false })}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-amber-400">Cumulative Withdrawn:</span>
            <span>{formatINR(d.withdrawnToDate, { compact: false })}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-blue-400">Yearly Growth:</span>
            <span>{formatINR(d.annualGains, { compact: false })}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="swp-depletion-chart" className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="swpCorpusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={depletionYear ? '#f59e0b' : '#059669'} stopOpacity={0.4} />
              <stop offset="95%" stopColor={depletionYear ? '#f59e0b' : '#059669'} stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="withdrawnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
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
          {depletionYear && (
            <ReferenceLine
              x={`Y${depletionYear}`}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                value: 'Depleted',
                fill: '#ef4444',
                fontSize: 11,
                position: 'top',
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="corpus"
            name="Remaining Corpus"
            stroke={depletionYear ? '#f59e0b' : '#059669'}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#swpCorpusGrad)"
          />
          <Area
            type="monotone"
            dataKey="withdrawnToDate"
            name="Total Withdrawn"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#withdrawnGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
