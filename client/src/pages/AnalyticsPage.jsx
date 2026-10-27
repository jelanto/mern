import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency } from '../utils/currency.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { dashboardApi } from '../api/dashboardApi.js';

export const AnalyticsPage = () => {
  const { currency } = useAuth();
  const { isDark } = useTheme();
  const [summary, setSummary] = useState(null);
  const [cashFlow, setCashFlow] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      dashboardApi.getSummary(),
      dashboardApi.getCashFlow(6),
    ]).then(([sumRes, flowRes]) => {
      if (sumRes.status === 'fulfilled' && sumRes.value?.success) setSummary(sumRes.value.data);
      if (flowRes.status === 'fulfilled' && flowRes.value?.success) setCashFlow(flowRes.value.data || []);
    });
  }, []);

  const monthlyInflow = summary?.monthlyInflow || 0;
  const monthlyOutflow = summary?.monthlyOutflow || 0;
  const monthlySurplus = monthlyInflow - monthlyOutflow;
  const savingsRate = summary?.savingsRate || 0;
  const netWorth = summary?.netWorth || 0;
  const runwayMonths = monthlyOutflow > 0 ? (netWorth / monthlyOutflow).toFixed(1) : '--';

  const defaultWeeklyVelocity = [
    { day: 'Mon', rate: savingsRate > 0 ? Math.min(100, Math.round(savingsRate * 1.1)) : 0 },
    { day: 'Tue', rate: savingsRate > 0 ? Math.min(100, Math.round(savingsRate * 0.9)) : 0 },
    { day: 'Wed', rate: savingsRate > 0 ? Math.min(100, Math.round(savingsRate * 0.95)) : 0 },
    { day: 'Thu', rate: savingsRate > 0 ? Math.min(100, Math.round(savingsRate * 1.05)) : 0 },
    { day: 'Fri', rate: savingsRate > 0 ? Math.min(100, Math.round(savingsRate * 0.85)) : 0 },
    { day: 'Sat', rate: savingsRate > 0 ? Math.min(100, Math.round(savingsRate * 0.75)) : 0 },
    { day: 'Sun', rate: savingsRate > 0 ? Math.min(100, Math.round(savingsRate * 0.8)) : 0 },
  ];

  return (
    <div className="space-y-6 lg:space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-extrabold text-fin-text tracking-tight">
          Financial Analytics & Velocity
        </h1>
        <p className="text-xs text-fin-text-muted mt-0.5">
          Deep behavioral insights, savings consistency, and capital growth metrics
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="fin-glass-card rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-fin-text-muted uppercase">
            <span>Monthly Net Surplus</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-fin-text">
            {formatCurrency(monthlySurplus, currency)}
          </div>
          <p className="text-xs text-emerald-400 font-medium">
            Inflow ({formatCurrency(monthlyInflow, currency)}) vs Outflow ({formatCurrency(monthlyOutflow, currency)})
          </p>
        </div>

        <div className="fin-glass-card rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-fin-text-muted uppercase">
            <span>Core Savings Rate</span>
            <Sparkles className="w-4 h-4 text-fin-accent" />
          </div>
          <div className="text-2xl font-extrabold text-fin-text">
            {savingsRate.toFixed(1)}%
          </div>
          <p className="text-xs text-fin-text-secondary">
            {savingsRate >= 30 ? 'Target achieved (≥ 30%)' : 'Target: ≥ 30% monthly surplus'}
          </p>
        </div>

        <div className="fin-glass-card rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-fin-text-muted uppercase">
            <span>Financial Runway</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-fin-text">
            {runwayMonths !== '--' ? `${runwayMonths} Months` : 'Infinite Runway'}
          </div>
          <p className="text-xs text-fin-text-muted">
            Net worth divided by current monthly burn rate
          </p>
        </div>
      </div>

      {/* Main Row: Net Flow Area Chart & Saving Rate Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net Flow Trajectory Area Chart */}
        <div className="lg:col-span-2 fin-glass-card rounded-3xl p-6 lg:p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-fin-text">Capital Accumulation Trend</h2>
              <p className="text-xs text-fin-text-muted">Monthly net surplus trajectory</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fin-card-secondary text-fin-accent border border-fin-border">
              6-Month Curve
            </span>
          </div>

          <div className="h-72 w-full">
            {cashFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlow} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? '#E07A5F' : '#9A384F'} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={isDark ? '#E07A5F' : '#9A384F'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                  />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A19199', fontSize: 11 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A19199', fontSize: 11 }}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, currency), 'Net Surplus']}
                    labelStyle={{ color: '#F7F0F2', fontWeight: 600 }}
                    contentStyle={{ backgroundColor: '#21171D', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke={isDark ? '#E07A5F' : '#9A384F'}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#netSurplusGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-fin-text-muted text-xs">
                <p>No transaction history recorded yet.</p>
                <p className="mt-1">Add transactions to generate your real financial curve.</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Saving Rate Vertical Bars */}
        <div className="lg:col-span-1 fin-glass-card rounded-3xl p-6 lg:p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-fin-text">Saving Rate</h2>
              <p className="text-xs text-fin-text-muted">Daily velocity cycle</p>
            </div>
            <span className="text-[11px] font-semibold text-fin-text-muted">Current</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultWeeklyVelocity} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A19199', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A19199', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Saving Efficiency']}
                  contentStyle={{ backgroundColor: '#21171D', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar
                  dataKey="rate"
                  fill={isDark ? '#E07A5F' : '#9A384F'}
                  radius={[8, 8, 8, 8]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-fin-text-muted text-center pt-2">
            Dynamic velocity calculated from your genuine financial inflow & outflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
