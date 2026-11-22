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
} from 'recharts';
import { YearlyBreakdownItem } from '../../types/calculator';
import { formatINR } from '../../utils/formatters';

interface GrowthAreaChartProps {
  data: YearlyBreakdownItem[];
  isCompactCurrency?: boolean;
}

export const GrowthAreaChart: React.FC<GrowthAreaChartProps> = ({
  data,
  isCompactCurrency = true,
}) => {
  const chartData = data.map((item) => ({
    year: `Y${item.year}`,
    yearNum: item.year,
    invested: item.totalInvestedToDate,
    corpus: item.endingBalance,
    gains: item.totalGainsToDate,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1.5 backdrop-blur-xs font-mono">
          <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">
            Year {d.yearNum} Milestone
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400 font-medium">Estimated Corpus:</span>
            <span className="font-bold">{formatINR(d.corpus, { compact: false })}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-blue-400 font-medium">Total Invested:</span>
            <span>{formatINR(d.invested, { compact: false })}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-amber-400 font-medium">Estimated Gains:</span>
            <span>{formatINR(d.gains, { compact: false })}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="growth-area-chart" className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
          <XAxis
            dataKey="year"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
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
          <Area
            type="monotone"
            dataKey="corpus"
            name="Estimated Corpus"
            stroke="#059669"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#corpusGrad)"
          />
          <Area
            type="monotone"
            dataKey="invested"
            name="Total Invested"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#investedGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
