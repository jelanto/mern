import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  ArrowDownRight,
  PiggyBank,
  ShieldCheck,
} from 'lucide-react';
import NetWorthCard from '../components/dashboard/NetWorthCard.jsx';
import SummaryCard from '../components/dashboard/SummaryCard.jsx';
import CashFlowChart from '../components/dashboard/CashFlowChart.jsx';
import ExpenseBreakdown from '../components/dashboard/ExpenseBreakdown.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import QuickExpenseForm from '../components/dashboard/QuickExpenseForm.jsx';
import { dashboardApi } from '../api/dashboardApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptySummary = {
  netWorth: 0,
  assets: 0,
  liabilities: 0,
  monthlyInflow: 0,
  monthlyOutflow: 0,
  savingsRate: 0,
  savingsGoal: { current: 0, target: 0, percentage: 0 },
  deltas: { inflow: 0, outflow: 0, savingsRate: 0 },
};

export const DashboardPage = () => {
  const { currency } = useAuth();
  const { refreshTrigger, onTransactionAdded } = useOutletContext() || {};

  const [summary, setSummary] = useState(emptySummary);
  const [cashFlow, setCashFlow] = useState([]);
  const [breakdown, setBreakdown] = useState({ categories: [], totalOutflow: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
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
        setCashFlow(flowRes.value.data || []);
      }
      if (breakRes.status === 'fulfilled' && breakRes.value?.success) {
        setBreakdown(breakRes.value.data || { categories: [], totalOutflow: 0 });
      }
      if (txRes.status === 'fulfilled' && txRes.value?.success) {
        setRecentTransactions(txRes.value.data || []);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
          delta={summary?.deltas?.inflow || 0}
          trend="positive"
          icon={TrendingUp}
        />
        <SummaryCard
          label="Monthly Outflow"
          amount={summary?.monthlyOutflow || 0}
          currency={currency}
          delta={summary?.deltas?.outflow || 0}
          trend="negative"
          icon={ArrowDownRight}
        />
        <SummaryCard
          label="Savings Rate"
          amount={summary?.savingsRate || 0}
          isPercentage={true}
          progress={summary?.savingsRate || 0}
          delta={summary?.deltas?.savingsRate || 0}
          trend="positive"
          icon={PiggyBank}
        />
        <SummaryCard
          label="Vault Allocation"
          amount={summary?.savingsGoal?.current || 0}
          currency={currency}
          subtext={summary?.savingsGoal?.target ? `Target: ${summary.savingsGoal.target.toLocaleString()}` : 'No target set'}
          progress={summary?.savingsGoal?.percentage || 0}
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
              dashboardApi.getCashFlow(months).then((res) => {
                if (res.success) setCashFlow(res.data || []);
              });
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
