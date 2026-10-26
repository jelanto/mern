import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';
import { useTheme } from '../../context/ThemeContext.jsx';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-fin-card border border-fin-border p-3.5 rounded-2xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
        <p className="font-bold text-fin-text text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-fin-text-secondary capitalize">{entry.name}:</span>
            </div>
            <span className="font-bold text-fin-text">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CashFlowChart = ({ data = [], currency = 'INR', onPeriodChange }) => {
  const { isDark } = useTheme();
  const [activeRange, setActiveRange] = useState('6M');

  const handleRangeChange = (range) => {
    setActiveRange(range);
    if (onPeriodChange) {
      onPeriodChange(range === '12M' ? 12 : 6);
    }
  };

  // Color tokens tailored to the dark chocolate/burgundy Stitch aesthetic
  const incomeColor = isDark ? '#E07A5F' : '#9A384F'; // amber-coral / burgundy
  const expenseColor = isDark ? '#5C3843' : '#D1C4C9'; // deep muted plum / soft mauve

  return (
    <div className="fin-glass-card rounded-3xl p-6 lg:p-7 relative overflow-hidden flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base lg:text-lg font-bold text-fin-text tracking-tight">
              Volumetric Cash Velocity
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-fin-card-secondary text-fin-accent border border-fin-border">
              Flow Analysis
            </span>
          </div>
          <p className="text-xs text-fin-text-muted mt-0.5">
            Comparative analysis of Monthly Inflow vs Outflow
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center p-1 bg-fin-card-secondary rounded-xl border border-fin-border shrink-0 self-start sm:self-auto">
          <button
            onClick={() => handleRangeChange('6M')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeRange === '6M'
                ? 'bg-fin-accent text-white shadow-sm'
                : 'text-fin-text-secondary hover:text-fin-text'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => handleRangeChange('12M')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeRange === '12M'
                ? 'bg-fin-accent text-white shadow-sm'
                : 'text-fin-text-secondary hover:text-fin-text'
            }`}
          >
            12 Months
          </button>
        </div>
      </div>

      {/* Chart Visual Container */}
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-fin-text-muted text-xs gap-2">
            <BarChart2 className="w-8 h-8 opacity-40 text-fin-accent" />
            <span>No transaction activity for this period yet</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#A19199' : '#7D6F75', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#A19199' : '#7D6F75', fontSize: 11 }}
                tickFormatter={(val) => {
                  if (val >= 100000) return `${val / 100000}L`;
                  if (val >= 1000) return `${val / 1000}k`;
                  return val;
                }}
              />
              <Tooltip content={<CustomTooltip currency={currency} />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
              />
              <Bar
                name="Inflow (Income)"
                dataKey="income"
                fill={incomeColor}
                radius={[8, 8, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                name="Outflow (Expenses)"
                dataKey="expense"
                fill={expenseColor}
                radius={[8, 8, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CashFlowChart;
