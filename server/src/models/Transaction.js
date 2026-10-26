import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'transfer'],
      required: [true, 'Transaction type is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    merchant: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    toAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash', 'Wire', 'Other'],
      default: 'UPI',
    },
    transactionDate: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'completed',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    transferId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high efficiency queries
transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, type: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, category: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
