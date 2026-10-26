/**
 * FinFlow Financial Calculation Service
 * Centralizes all mathematical and aggregation rules for financial analytics,
 * cash flow velocity, expense anatomy, and net worth calculations.
 */

export class FinancialCalculationService {
  /**
   * Calculate Savings Rate safely
   * Formula: ((Total Inflow - Total Outflow) / Total Inflow) * 100
   * Handles 0 or negative income gracefully without NaN or Infinity.
   */
  static calculateSavingsRate(inflow, outflow) {
    if (!inflow || inflow <= 0) {
      return 0;
    }
    const netSavings = inflow - outflow;
    if (netSavings <= 0) return 0;
    const rate = (netSavings / inflow) * 100;
    return Math.min(100, Math.max(0, Math.round(rate * 10) / 10));
  }

  /**
   * Compute Net Worth = Assets (Bank balances, Cash, Investments, Savings) - Liabilities (Credit card debt, loans)
   */
  static computeNetWorth(accounts = []) {
    let assets = 0;
    let liabilities = 0;

    for (const acc of accounts) {
      const balance = Number(acc.balance) || 0;
      if (acc.type === 'credit') {
        if (balance < 0) {
          liabilities += Math.abs(balance);
        } else {
          // positive credit balance means available credit or overpaid
          assets += balance;
        }
      } else {
        if (balance >= 0) {
          assets += balance;
        } else {
          liabilities += Math.abs(balance);
        }
      }
    }

    return {
      assets: Math.round(assets * 100) / 100,
      liabilities: Math.round(liabilities * 100) / 100,
      netWorth: Math.round((assets - liabilities) * 100) / 100,
    };
  }

  /**
   * Group transactions into monthly cash flow velocity (Inflow vs Outflow)
   * Transfers are excluded to prevent artificial inflation.
   */
  static groupCashVelocityByMonth(transactions = [], monthsBack = 6) {
    const months = [];
    const now = new Date();

    // Prepare chronological list of last N months
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const shortLabel = d.toLocaleString('en-US', { month: 'short' });
      months.push({
        key,
        month: shortLabel,
        year: d.getFullYear(),
        income: 0,
        expense: 0,
        net: 0,
      });
    }

    const monthMap = new Map();
    months.forEach((m) => monthMap.set(m.key, m));

    for (const t of transactions) {
      if (t.type === 'transfer') continue; // transfers don't change net flow
      const date = new Date(t.transactionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthMap.has(key)) {
        const entry = monthMap.get(key);
        const amt = Number(t.amount) || 0;
        if (t.type === 'income') {
          entry.income += amt;
        } else if (t.type === 'expense') {
          entry.expense += amt;
        }
      }
    }

    return months.map((m) => ({
      ...m,
      income: Math.round(m.income),
      expense: Math.round(m.expense),
      net: Math.round(m.income - m.expense),
    }));
  }

  /**
   * Calculate Spending Breakdown / Outflow Anatomy by Category
   * Ensures percentages sum cleanly to 100% and avoids divide-by-zero.
   */
  static computeExpenseBreakdown(transactions = []) {
    const categoryTotals = new Map();
    let totalExpense = 0;

    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      const amt = Number(t.amount) || 0;
      const cat = t.category || 'Other';
      categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + amt);
      totalExpense += amt;
    }

    if (totalExpense === 0) {
      return {
        totalExpense: 0,
        breakdown: [],
      };
    }

    const categoryColors = {
      'Food & Dining': '#E07A5F',
      'Housing & Rent': '#C86A78',
      'Transportation': '#F39C12',
      'Shopping': '#D35400',
      'Utilities': '#E67E22',
      'Entertainment': '#9F394F',
      'Healthcare': '#2ECC71',
      'Personal Care': '#1ABC9C',
      'Education': '#3498DB',
      'Travel': '#9B59B6',
      'Investments': '#34495E',
      'Other': '#7F8C8D',
    };

    const breakdown = Array.from(categoryTotals.entries())
      .map(([name, value]) => {
        const percentage = Math.round((value / totalExpense) * 1000) / 10;
        return {
          name,
          value: Math.round(value),
          percentage,
          color: categoryColors[name] || '#C86A78',
        };
      })
      .sort((a, b) => b.value - a.value);

    return {
      totalExpense: Math.round(totalExpense),
      breakdown,
    };
  }

  /**
   * Calculate percentage delta between current and previous period
   */
  static calculatePercentageDelta(current, previous) {
    if (!previous || previous === 0) {
      return current > 0 ? 100 : 0;
    }
    const delta = ((current - previous) / previous) * 100;
    return Math.round(delta * 10) / 10;
  }
}

export default FinancialCalculationService;
