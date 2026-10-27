// FinFlow - All demo fallback data removed. Application operates strictly with genuine user data.
export const initialDemoData = {
  summary: {
    netWorth: 0,
    assets: 0,
    liabilities: 0,
    monthlyInflow: 0,
    monthlyOutflow: 0,
    savingsRate: 0,
  },
  cashFlowHistory: [],
  expenseBreakdown: { categories: [], totalOutflow: 0 },
  transactions: [],
  budgets: [],
  goals: [],
  accounts: [],
  user: null,
};

export default initialDemoData;
