import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  ArrowDownRight,
  PiggyBank,
  ShieldCheck,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import NetWorthCard from '../components/dashboard/NetWorthCard.jsx';
import SummaryCard from '../components/dashboard/SummaryCard.jsx';
import CashFlowChart from '../components/dashboard/CashFlowChart.jsx';
import ExpenseBreakdown from '../components/dashboard/ExpenseBreakdown.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import QuickExpenseForm from '../components/dashboard/QuickExpenseForm.jsx';
import { dashboardApi } from '../api/dashboardApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import initialDemoData from '../data/demoData.js';

export const DashboardPage = () => {
  const { currency, isDemoMode } = useAuth();
  const { refreshTrigger, onTransactionAdded } = useOutletContext() || {};

  const [summary, setSummary] = useState(initialDemoData.summary);
  const [cashFlow, setCashFlow] = useState(initialDemoData.cashFlowHistory);
  const [breakdown, setBreakdown] = useState(initialDemoData.expenseBreakdown);
  const [recentTransactions, setRecentTransactions] = useState(initialDemoData.transactions.slice(0, 6));
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (isDemoMode) {
      setSummary({ ...initialDemoData.summary });
      setCashFlow([...initialDemoData.cashFlowHistory]);
      setBreakdown({ ...initialDemoData.expenseBreakdown });
      setRecentTransactions([...initialDemoData.transactions.slice(0, 6)]);
      return;
    }

    setLoading(true);
    try {
      const [sumRes, flowRes, breakRes, txRes] = await Promise.allSettled([
        dashboardApi.getSummary(),
        dashboardApi.getCashFlow(6),
        dashboardApi.getExpenseBreakdown('this_month'),
        dashboardApi.getRecentTransactions(6),
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value?.success) {
        setSummary(sumRes.value.data);
      }
      if (flowRes.status === 'fulfilled' && flowRes.value?.success) {
        setCashFlow(flowRes.value.data);
      }
      if (breakRes.status === 'fulfilled' && breakRes.value?.success) {
        setBreakdown(breakRes.value.data);
      }
      if (txRes.status === 'fulfilled' && txRes.value?.success) {
        setRecentTransactions(txRes.value.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch fallback to cached/demo:', err);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshTrigger]);

  return (
    <div className="space-y-6 lg:space-y-7 animate-in fade-in duration-300">
      {/* Top Net Worth Card */}
      <NetWorthCard summary={summary} currency={currency} />

      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <SummaryCard
          label="Monthly Inflow"
          amount={summary?.monthlyInflow || 0}
          currency={currency}
          delta={summary?.deltas?.inflow || 8.4}
          trend="positive"
          icon={TrendingUp}
        />
        <SummaryCard
          label="Monthly Outflow"
          amount={summary?.monthlyOutflow || 0}
          currency={currency}
          delta={summary?.deltas?.outflow || -4.2}
          trend="negative"
          icon={ArrowDownRight}
        />
        <SummaryCard
          label="Savings Rate"
          amount={summary?.savingsRate || 0}
          isPercentage={true}
          progress={summary?.savingsRate || 0}
          delta={summary?.deltas?.savingsRate || 6.5}
          trend="positive"
          icon={PiggyBank}
        />
        <SummaryCard
          label="Vault Allocation"
          amount={summary?.savingsGoal?.current || 0}
          currency={currency}
          subtext={`Target: ${summary?.savingsGoal?.target ? `${summary.savingsGoal.target.toLocaleString()}` : '2,50,000'}`}
          progress={summary?.savingsGoal?.percentage || 65}
          icon={ShieldCheck}
        />
      </div>

      {/* Middle Row: Cash Flow Chart + Expense Anatomy Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart
            data={cashFlow}
            currency={currency}
            onPeriodChange={(months) => {
              if (!isDemoMode) {
                dashboardApi.getCashFlow(months).then((res) => {
                  if (res.success) setCashFlow(res.data);
                });
              }
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <ExpenseBreakdown breakdownData={breakdown} currency={currency} />
        </div>
      </div>

      {/* Bottom Row: Live Frosted Ledger + Express Glass Log Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions
            transactions={recentTransactions}
            currency={currency}
          />
        </div>
        <div className="lg:col-span-1">
          <QuickExpenseForm onSuccess={fetchDashboardData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
