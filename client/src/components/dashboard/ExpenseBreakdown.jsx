import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';

const CustomDonutTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-fin-card border border-fin-border p-3 rounded-2xl shadow-2xl text-xs space-y-1">
        <p className="font-bold text-fin-text text-sm">{data.name}</p>
        <p className="text-fin-text-secondary">
          Amount: <span className="font-bold text-fin-text">{formatCurrency(data.value, currency)}</span>
        </p>
        <p className="text-fin-accent font-semibold">{data.percentage}% of total expenses</p>
      </div>
    );
  }
  return null;
};

export const ExpenseBreakdown = ({ breakdownData = {}, currency = 'INR' }) => {
  const { totalExpense = 0, breakdown = [] } = breakdownData;

  const defaultColors = ['#E07A5F', '#C86A78', '#F39C12', '#9F394F', '#D35400', '#2ECC71'];

  return (
    <div className="fin-glass-card rounded-3xl p-6 lg:p-7 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base lg:text-lg font-bold text-fin-text tracking-tight">
            Outflow Anatomy
          </h2>
          <p className="text-xs text-fin-text-muted">Category expenditure distribution</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fin-card-secondary text-fin-text-secondary border border-fin-border">
          Active Month
        </span>
      </div>

      {breakdown.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-fin-text-muted text-xs gap-2">
          <PieIcon className="w-8 h-8 opacity-40 text-fin-accent" />
          <span>No categorized expenses logged yet</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut with Center Total */}
          <div className="relative w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomDonutTooltip currency={currency} />} />
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || defaultColors[index % defaultColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Absolute Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-fin-text-muted uppercase tracking-wider">
                Total
              </span>
              <span className="text-sm font-extrabold text-fin-text tracking-tight">
                {formatCurrency(totalExpense, currency, false)}
              </span>
            </div>
          </div>

          {/* Category Legend & Percentages */}
          <div className="flex-1 w-full space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {breakdown.map((cat, idx) => (
              <div
                key={cat.name || idx}
                className="flex items-center justify-between text-xs p-1.5 rounded-xl hover:bg-fin-card-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || defaultColors[idx % defaultColors.length] }}
                  />
                  <span className="font-semibold text-fin-text truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-fin-text">
                    {formatCurrency(cat.value, currency, false)}
                  </span>
                  <span className="text-[11px] font-medium text-fin-text-muted w-10 text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseBreakdown;
