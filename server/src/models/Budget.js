import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Budget name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    limitAmount: {
      type: Number,
      required: [true, 'Limit amount is required'],
      min: [1, 'Limit must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    period: {
      type: String,
      enum: ['monthly', 'weekly', 'yearly'],
      default: 'monthly',
    },
    alertThreshold: {
      type: Number,
      default: 80, // Alert at 80% spending
      min: 10,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ userId: 1, category: 1 });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
