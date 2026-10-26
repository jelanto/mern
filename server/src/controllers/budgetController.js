import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

export const getBudgets = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const budgets = await Budget.find({ userId });

    // Calculate actual spending for each budget's category in the current month
    const budgetData = await Promise.all(
      budgets.map(async (budget) => {
        const spentAgg = await Transaction.aggregate([
          {
            $match: {
              userId,
              type: 'expense',
              category: budget.category,
              transactionDate: { $gte: startOfMonth, $lte: endOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: '$amount' },
            },
          },
        ]);

        const totalSpent = spentAgg.length > 0 ? spentAgg[0].totalSpent : 0;
        const remaining = Math.max(0, budget.limitAmount - totalSpent);
        const percentageSpent = Math.min(100, Math.round((totalSpent / budget.limitAmount) * 100));
        const isOverBudget = totalSpent > budget.limitAmount;

        return {
          ...budget.toObject(),
          totalSpent: Math.round(totalSpent),
          remaining: Math.round(remaining),
          percentageSpent,
          isOverBudget,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: budgetData,
    });
  } catch (error) {
    next(error);
  }
};

export const createBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, category, limitAmount, period = 'monthly', alertThreshold = 80 } = req.body;

    if (!name || !category || !limitAmount) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and limit amount are required.',
      });
    }

    const budget = await Budget.create({
      userId,
      name,
      category,
      limitAmount: Number(limitAmount),
      currency: req.user.preferredCurrency || 'INR',
      period,
      alertThreshold: Number(alertThreshold),
    });

    res.status(201).json({
      success: true,
      message: 'Budget envelope created successfully.',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const budget = await Budget.findOne({ _id: req.params.id, userId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget envelope not found.',
      });
    }

    const { name, category, limitAmount, period, alertThreshold } = req.body;
    if (name) budget.name = name;
    if (category) budget.category = category;
    if (limitAmount) budget.limitAmount = Number(limitAmount);
    if (period) budget.period = period;
    if (alertThreshold !== undefined) budget.alertThreshold = Number(alertThreshold);

    await budget.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully.',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget envelope deleted.',
    });
  } catch (error) {
    next(error);
  }
};
