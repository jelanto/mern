import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal'],
      default: 'deposit',
    },
  },
  { _id: true }
);

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [80, 'Title cannot exceed 80 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [1, 'Target amount must be greater than 0'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
    },
    category: {
      type: String,
      enum: ['Emergency', 'Travel', 'Home', 'Vehicle', 'Tech', 'Investment', 'Education', 'Other'],
      default: 'Emergency',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'paused'],
      default: 'in_progress',
    },
    color: {
      type: String,
      default: '#C86A78',
    },
    contributions: [contributionSchema],
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.index({ userId: 1, status: 1 });

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema);
export default SavingsGoal;
