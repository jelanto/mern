import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { transactionApi } from '../../api/transactionApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCurrencySymbol } from '../../utils/currency.js';

const CATEGORIES = {
  expense: [
    'Food & Dining',
    'Housing & Rent',
    'Transportation',
    'Shopping',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Travel',
    'Personal Care',
    'Other',
  ],
  income: ['Salary', 'Freelance & Consulting', 'Investments', 'Dividends', 'Rental Income', 'Other Income'],
  transfer: ['Savings Allocation', 'Credit Card Payment', 'Investment Transfer', 'Internal Transfer'],
};

export const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const { currency } = useAuth();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please provide a valid positive amount.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a description or title for the record.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      type,
      amount: numAmount,
      title: title.trim(),
      merchant: merchant.trim() || title.trim(),
      category,
      paymentMethod,
      transactionDate: new Date(transactionDate).toISOString(),
      notes: notes.trim(),
    };

    try {
      await transactionApi.createTransaction(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-fin-card border border-fin-border rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-fin-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-fin-text">Record Financial Entry</h2>
            <p className="text-xs text-fin-text-muted">Direct ledger sync with portfolio balance</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-fin-text-secondary hover:text-fin-text hover:bg-fin-card-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-fin-card-secondary rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 shadow-sm border border-rose-500/30'
                  : 'text-fin-text-secondary hover:text-fin-text'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30'
                  : 'text-fin-text-secondary hover:text-fin-text'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Income</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('transfer')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                type === 'transfer'
                  ? 'bg-blue-500/20 text-blue-400 shadow-sm border border-blue-500/30'
                  : 'text-fin-text-secondary hover:text-fin-text'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Transfer</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-fin-accent">
                {getCurrencySymbol(currency)}
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-fin-card-secondary border border-fin-border text-fin-text text-lg font-bold placeholder-fin-text-muted/40 focus:border-fin-accent transition-all"
              />
            </div>
          </div>

          {/* Title & Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Title / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Starbucks Reserve"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text placeholder-fin-text-muted focus:border-fin-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Merchant / Entity
              </label>
              <input
                type="text"
                placeholder="e.g. Starbucks Coffee"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text placeholder-fin-text-muted focus:border-fin-accent transition-all"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent transition-all cursor-pointer"
              >
                {CATEGORIES[type].map((cat) => (
                  <option key={cat} value={cat} className="bg-fin-card text-fin-text">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent transition-all cursor-pointer"
              >
                <option value="UPI" className="bg-fin-card">UPI</option>
                <option value="Credit Card" className="bg-fin-card">Credit Card</option>
                <option value="Debit Card" className="bg-fin-card">Debit Card</option>
                <option value="Net Banking" className="bg-fin-card">Net Banking</option>
                <option value="Cash" className="bg-fin-card">Cash</option>
                <option value="Wire" className="bg-fin-card">Wire</option>
              </select>
            </div>
          </div>

          {/* Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Personal notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text placeholder-fin-text-muted focus:border-fin-accent transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-fin-text-secondary hover:text-fin-text hover:bg-fin-card-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Recording...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
