import SavingsGoal from '../models/SavingsGoal.js';

export const getGoals = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const goals = await SavingsGoal.find({ userId }).sort({ createdAt: -1 });

    const formattedGoals = goals.map((goal) => {
      const percentage = goal.targetAmount > 0 
        ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
        : 0;
      const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

      return {
        ...goal.toObject(),
        percentage,
        remaining,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedGoals,
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, targetAmount, currentAmount = 0, targetDate, category = 'Emergency', color = '#C86A78' } = req.body;

    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, target amount, and target date are required.',
      });
    }

    const goal = await SavingsGoal.create({
      userId,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      currency: req.user.preferredCurrency || 'INR',
      targetDate: new Date(targetDate),
      category,
      color,
      contributions: currentAmount > 0 ? [{ amount: Number(currentAmount), note: 'Initial allocation' }] : [],
    });

    res.status(201).json({
      success: true,
      message: 'Vault allocation goal established.',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
      });
    }

    const { title, targetAmount, targetDate, category, status, color } = req.body;
    if (title) goal.title = title;
    if (targetAmount) goal.targetAmount = Number(targetAmount);
    if (targetDate) goal.targetDate = new Date(targetDate);
    if (category) goal.category = category;
    if (status) goal.status = status;
    if (color) goal.color = color;

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully.',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const addContribution = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { amount, type = 'deposit', note = '' } = req.body;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Contribution amount must be greater than zero.',
      });
    }

    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId });
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found.',
      });
    }

    if (type === 'deposit') {
      goal.currentAmount += numAmount;
    } else if (type === 'withdrawal') {
      if (goal.currentAmount < numAmount) {
        return res.status(400).json({
          success: false,
          message: 'Withdrawal amount exceeds available allocation in this goal.',
        });
      }
      goal.currentAmount -= numAmount;
    }

    // Check if goal reached
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    goal.contributions.push({
      amount: numAmount,
      type,
      note,
      date: new Date(),
    });

    await goal.save();

    res.status(200).json({
      success: true,
      message: `Successfully recorded ${type} of ${goal.currency} ${numAmount}.`,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted.',
    });
  } catch (error) {
    next(error);
  }
};
