import React, { useState } from 'react';
import { Send, Zap, Check, AlertCircle } from 'lucide-react';
import { transactionApi } from '../../api/transactionApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCurrencySymbol } from '../../utils/currency.js';

export const QuickExpenseForm = ({ onSuccess }) => {
  const { currency } = useAuth();
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const categories = [
    'Food & Dining',
    'Shopping',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    if (!merchant.trim()) {
      setErrorMsg('Please enter a merchant or description.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      type: 'expense',
      amount: numAmount,
      title: merchant.trim(),
      merchant: merchant.trim(),
      category,
      paymentMethod,
      transactionDate: new Date().toISOString(),
    };

    try {
      await transactionApi.createTransaction(payload);
      setAmount('');
      setMerchant('');
      setSuccessMsg('Logged successfully to ledger!');
      if (onSuccess) onSuccess();

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fin-glass-card rounded-3xl p-6 lg:p-7 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-fin-accent/15 flex items-center justify-center text-fin-accent">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-fin-text">Express Glass Log</h2>
            <p className="text-[11px] text-fin-text-muted">Instant expense entry & balance sync</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-3.5 h-3.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Amount */}
          <div>
            <label className="block text-[11px] font-semibold text-fin-text-muted mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-fin-accent">
                {getCurrencySymbol(currency)}
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text font-bold focus:border-fin-accent transition-all"
              />
            </div>
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-[11px] font-semibold text-fin-text-muted mb-1">
              Merchant / Item
            </label>
            <input
              type="text"
              placeholder="e.g. Blue Tokai Coffee"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-fin-text-muted mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-fin-card text-fin-text">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[11px] font-semibold text-fin-text-muted mb-1">
              Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent cursor-pointer"
            >
              <option value="UPI" className="bg-fin-card">UPI</option>
              <option value="Credit Card" className="bg-fin-card">Credit Card</option>
              <option value="Debit Card" className="bg-fin-card">Debit Card</option>
              <option value="Cash" className="bg-fin-card">Cash</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Syncing record...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Log Expense Now</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuickExpenseForm;
