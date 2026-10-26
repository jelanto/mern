import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['bank', 'cash', 'credit', 'investment', 'savings', 'wallet'],
      default: 'bank',
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    institution: {
      type: String,
      trim: true,
      default: 'Primary Bank',
    },
    accountNumberLast4: {
      type: String,
      default: '8492',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#C86A78',
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ userId: 1, name: 1 }, { unique: true });

const Account = mongoose.model('Account', accountSchema);
export default Account;
