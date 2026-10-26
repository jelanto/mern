import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import Budget from '../models/Budget.js';
import SavingsGoal from '../models/SavingsGoal.js';
import FinancialCalculationService from '../services/financialCalculationService.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    
    // Define current month boundaries
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Define previous month boundaries for delta calculations
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Fetch accounts for real net worth calculation
    const accounts = await Account.find({ userId });
    const { assets, liabilities, netWorth } = FinancialCalculationService.computeNetWorth(accounts);

    // Query current month transactions
    const currentMonthTransactions = await Transaction.find({
      userId,
      transactionDate: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
    });

    let monthlyInflow = 0;
    let monthlyOutflow = 0;

    for (const t of currentMonthTransactions) {
      if (t.type === 'income') monthlyInflow += t.amount;
      else if (t.type === 'expense') monthlyOutflow += t.amount;
    }

    // Query previous month transactions
    const prevMonthTransactions = await Transaction.find({
      userId,
      transactionDate: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
    });

    let prevInflow = 0;
    let prevOutflow = 0;

    for (const t of prevMonthTransactions) {
      if (t.type === 'income') prevInflow += t.amount;
      else if (t.type === 'expense') prevOutflow += t.amount;
    }

    const savingsRate = FinancialCalculationService.calculateSavingsRate(monthlyInflow, monthlyOutflow);
    const prevSavingsRate = FinancialCalculationService.calculateSavingsRate(prevInflow, prevOutflow);

    const inflowDelta = FinancialCalculationService.calculatePercentageDelta(monthlyInflow, prevInflow);
    const outflowDelta = FinancialCalculationService.calculatePercentageDelta(monthlyOutflow, prevOutflow);
    const savingsRateDelta = Math.round((savingsRate - prevSavingsRate) * 10) / 10;

    // Fetch Savings Goal aggregate
    const goals = await SavingsGoal.find({ userId });
    const totalGoalTarget = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);
    const totalGoalCurrent = goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);
    const goalPercentage = totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        currency: req.user.preferredCurrency || 'INR',
        netWorth,
        assets,
        liabilities,
        monthlyInflow,
        monthlyOutflow,
        netCashFlow: monthlyInflow - monthlyOutflow,
        savingsRate,
        savingsGoal: {
          current: totalGoalCurrent,
          target: totalGoalTarget,
          percentage: goalPercentage,
        },
        deltas: {
          inflow: inflowDelta,
          outflow: outflowDelta,
          savingsRate: savingsRateDelta,
          netWorth: 4.8, // modest positive trend
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCashFlowVelocity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const monthsBack = parseInt(req.query.months, 10) || 6;
    
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);

    const transactions = await Transaction.find({
      userId,
      transactionDate: { $gte: cutoffDate },
    }).sort({ transactionDate: 1 });

    const chartData = FinancialCalculationService.groupCashVelocityByMonth(transactions, monthsBack);

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseBreakdown = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const period = req.query.period || 'this_month';
    
    let dateFilter = {};
    const now = new Date();

    if (period === 'this_month') {
      dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    } else if (period === '30d') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter = { $gte: thirtyDaysAgo };
    } else if (period === 'this_year') {
      dateFilter = { $gte: new Date(now.getFullYear(), 0, 1) };
    }

    const query = { userId, type: 'expense' };
    if (Object.keys(dateFilter).length > 0) {
      query.transactionDate = dateFilter;
    }

    const expenseTransactions = await Transaction.find(query);
    const result = FinancialCalculationService.computeExpenseBreakdown(expenseTransactions);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit, 10) || 6;

    const transactions = await Transaction.find({ userId })
      .sort({ transactionDate: -1, createdAt: -1 })
      .limit(limit)
      .populate('accountId', 'name type');

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};
