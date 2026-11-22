/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatINR } from '../../utils/formatters';

interface BreakdownPieChartProps {
  invested: number;
  gains: number;
  label1?: string;
  label2?: string;
}

export const BreakdownPieChart: React.FC<BreakdownPieChartProps> = ({
  invested,
  gains,
  label1 = 'Invested Principal',
  label2 = 'Estimated Gains',
}) => {
  const total = invested + gains;
  const gainsPct = total > 0 ? ((gains / total) * 100).toFixed(0) : '0';
  const investedPct = total > 0 ? ((invested / total) * 100).toFixed(0) : '0';

  const data = [
    { name: label1, value: invested, color: '#3b82f6', pct: investedPct },
    { name: label2, value: gains, color: '#059669', pct: gainsPct },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      return (
        <div className="bg-slate-900/95 text-white p-2.5 rounded-lg shadow-xl border border-slate-700 text-xs font-mono">
          <p className="font-semibold text-slate-300">{d.name}</p>
          <p className="font-bold text-base mt-0.5">{formatINR(d.value, { compact: false })}</p>
          <p className="text-slate-400 text-[11px]">{d.payload.pct}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="breakdown-pie-chart" className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius="68%"
              outerRadius="90%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Gains Ratio</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {gainsPct}%
          </span>
          <span className="text-[11px] text-slate-400">of final value</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {label1} ({investedPct}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-600" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {label2} ({gainsPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};
