import React, { useState, useEffect } from 'react';
import { Plus, PiggyBank, AlertTriangle, CheckCircle2, Trash2, X, AlertCircle } from 'lucide-react';
import { budgetApi } from '../api/budgetApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency, getCurrencySymbol } from '../utils/currency.js';


export const BudgetsPage = () => {
  const { currency } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New budget form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [limitAmount, setLimitAmount] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [formError, setFormError] = useState(null);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await budgetApi.getBudgets();
      if (res.success) {
        setBudgets(res.data || []);
      }
    } catch (err) {
      console.warn('Budget fetch error:', err.message);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setFormError(null);

    const limit = parseFloat(limitAmount);
    if (isNaN(limit) || limit <= 0) {
      setFormError('Please enter a valid monthly limit amount.');
      return;
    }

    try {
      await budgetApi.createBudget({
        name: name.trim(),
        category,
        limitAmount: limit,
        alertThreshold,
      });
      await fetchBudgets();
      setIsModalOpen(false);
      setName('');
      setLimitAmount('');
    } catch (err) {
      setFormError(err.message || 'Failed to create budget.');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget envelope?')) return;
    try {
      await budgetApi.deleteBudget(id);
      await fetchBudgets();
    } catch (err) {
      alert(err.message || 'Failed to delete budget');
    }
  };

  const categories = [
    'Food & Dining',
    'Housing & Rent',
    'Transportation',
    'Shopping',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Travel',
    'Other',
  ];

  return (
    <div className="space-y-6 lg:space-y-7 animate-in fade-in duration-300">
      {/* Title & Create Envelope Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-fin-text tracking-tight">
            Monthly Budget Envelopes
          </h1>
          <p className="text-xs text-fin-text-muted mt-0.5">
            Set deliberate caps by category to safeguard your monthly capital flow
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>New Budget Envelope</span>
        </button>
      </div>

      {/* Grid of Budget Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-fin-text-muted">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <div className="fin-glass-card rounded-3xl p-12 text-center text-xs text-fin-text-muted space-y-3">
          <PiggyBank className="w-10 h-10 mx-auto opacity-40 text-fin-accent" />
          <p className="font-semibold text-fin-text text-sm">No budget envelopes established</p>
          <p>Create your first budget to start tracking category spending caps.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {budgets.map((b) => {
            const isWarning = b.percentageSpent >= (b.alertThreshold || 80);
            const isOver = b.isOverBudget || b.totalSpent > b.limitAmount;

            let barColor = 'from-emerald-400 to-emerald-500';
            if (isOver) {
              barColor = 'from-rose-500 to-rose-600';
            } else if (isWarning) {
              barColor = 'from-amber-400 to-amber-500';
            }

            return (
              <div
                key={b._id}
                className="fin-glass-card rounded-3xl p-6 relative overflow-hidden group hover:border-fin-accent/40 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-fin-text text-base">{b.name}</h3>
                    <span className="text-[11px] font-semibold text-fin-accent bg-fin-card-secondary px-2.5 py-0.5 rounded-full border border-fin-border mt-1 inline-block">
                      {b.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(b._id)}
                    className="p-1.5 text-fin-text-muted hover:text-rose-400 rounded-lg hover:bg-fin-card-secondary transition-colors"
                    title="Delete budget"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amount Figures */}
                <div className="grid grid-cols-2 gap-4 my-4 p-3.5 bg-fin-card-secondary/60 rounded-2xl border border-fin-border">
                  <div>
                    <span className="text-[11px] font-semibold text-fin-text-muted uppercase">
                      Spent
                    </span>
                    <p className="text-base font-extrabold text-fin-text mt-0.5">
                      {formatCurrency(b.totalSpent || 0, currency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-fin-text-muted uppercase">
                      Limit
                    </span>
                    <p className="text-base font-extrabold text-fin-text mt-0.5">
                      {formatCurrency(b.limitAmount, currency)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fin-text-muted">
                      {isOver ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Over budget by {formatCurrency(b.totalSpent - b.limitAmount, currency)}
                        </span>
                      ) : (
                        <span>{formatCurrency(b.remaining, currency)} remaining</span>
                      )}
                    </span>
                    <span className="font-bold text-fin-text">{b.percentageSpent}%</span>
                  </div>
                  <div className="w-full bg-fin-card-secondary h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, b.percentageSpent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-fin-card border border-fin-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-fin-border">
              <h2 className="text-base font-bold text-fin-text">Create Budget Envelope</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-fin-text-muted hover:text-fin-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateBudget} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Envelope Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dining & Cafes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-fin-card">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Monthly Limit ({currency})
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="15000"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-fin-text-secondary hover:bg-fin-card-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110"
                >
                  Create Envelope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsPage;
