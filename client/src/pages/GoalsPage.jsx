import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Calendar,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { goalApi } from '../api/goalApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency, getCurrencySymbol } from '../utils/currency.js';
import { formatDate } from '../utils/date.js';
import initialDemoData from '../data/demoData.js';

export const GoalsPage = () => {
  const { currency, isDemoMode } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Goal Modal state
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Emergency');
  const [formError, setFormError] = useState(null);

  // Contribution Modal state
  const [contributionGoal, setContributionGoal] = useState(null);
  const [contribAmount, setContribAmount] = useState('');
  const [contribType, setContribType] = useState('deposit');
  const [contribNote, setContribNote] = useState('');

  const fetchGoals = async () => {
    if (isDemoMode) {
      setGoals([...initialDemoData.goals]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await goalApi.getGoals();
      if (res.success) {
        setGoals(res.data);
      }
    } catch (err) {
      console.warn('Goals fetch fallback to demo:', err.message);
      setGoals(initialDemoData.goals);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [isDemoMode]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setFormError(null);

    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0) {
      setFormError('Target amount must be a positive number.');
      return;
    }

    if (!targetDate) {
      setFormError('Please select a target completion date.');
      return;
    }

    try {
      if (isDemoMode) {
        const cur = parseFloat(initialAmount) || 0;
        const newGoal = {
          _id: `g-${Date.now()}`,
          title: title.trim(),
          targetAmount: target,
          currentAmount: cur,
          percentage: target > 0 ? Math.round((cur / target) * 100) : 0,
          remaining: Math.max(0, target - cur),
          currency,
          targetDate,
          category,
          color: '#E07A5F',
          status: 'in_progress',
          contributions: cur > 0 ? [{ _id: 'c-new', amount: cur, note: 'Initial deposit', date: new Date().toISOString() }] : [],
        };
        initialDemoData.goals.push(newGoal);
        setGoals([...initialDemoData.goals]);
      } else {
        await goalApi.createGoal({
          title: title.trim(),
          targetAmount: target,
          currentAmount: parseFloat(initialAmount) || 0,
          targetDate,
          category,
        });
        await fetchGoals();
      }

      setIsNewGoalOpen(false);
      setTitle('');
      setTargetAmount('');
      setInitialAmount('');
      setTargetDate('');
    } catch (err) {
      setFormError(err.message || 'Failed to establish goal.');
    }
  };

  const handleContribution = async (e) => {
    e.preventDefault();
    const amt = parseFloat(contribAmount);
    if (isNaN(amt) || amt <= 0) return;

    try {
      if (isDemoMode) {
        const targetG = initialDemoData.goals.find((g) => g._id === contributionGoal._id);
        if (targetG) {
          if (contribType === 'deposit') {
            targetG.currentAmount += amt;
          } else {
            targetG.currentAmount = Math.max(0, targetG.currentAmount - amt);
          }
          targetG.percentage = Math.min(100, Math.round((targetG.currentAmount / targetG.targetAmount) * 100));
          targetG.remaining = Math.max(0, targetG.targetAmount - targetG.currentAmount);
          targetG.contributions.unshift({
            _id: `c-${Date.now()}`,
            amount: amt,
            type: contribType,
            note: contribNote || `${contribType} transfer`,
            date: new Date().toISOString(),
          });
        }
        setGoals([...initialDemoData.goals]);
      } else {
        await goalApi.addContribution(contributionGoal._id, {
          amount: amt,
          type: contribType,
          note: contribNote,
        });
        await fetchGoals();
      }

      setContributionGoal(null);
      setContribAmount('');
      setContribNote('');
    } catch (err) {
      alert(err.message || 'Failed to process contribution');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Delete this savings vault goal?')) return;
    try {
      if (isDemoMode) {
        initialDemoData.goals = initialDemoData.goals.filter((g) => g._id !== id);
        setGoals([...initialDemoData.goals]);
      } else {
        await goalApi.deleteGoal(id);
        await fetchGoals();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete goal');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-7 animate-in fade-in duration-300">
      {/* Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-fin-text tracking-tight">
            Vault Allocations & Targets
          </h1>
          <p className="text-xs text-fin-text-muted mt-0.5">
            Earmark virtual capital for specific milestones without disturbing liquidity
          </p>
        </div>

        <button
          onClick={() => setIsNewGoalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Establish New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-fin-text-muted">Loading vault goals...</div>
      ) : goals.length === 0 ? (
        <div className="fin-glass-card rounded-3xl p-12 text-center text-xs text-fin-text-muted space-y-3">
          <ShieldCheck className="w-10 h-10 mx-auto opacity-40 text-fin-accent" />
          <p className="font-semibold text-fin-text text-sm">No vault goals established yet</p>
          <p>Create dedicated savings targets for emergencies, travel, or assets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => {
            const isCompleted = g.currentAmount >= g.targetAmount;

            return (
              <div
                key={g._id}
                className="fin-glass-card rounded-3xl p-6 flex flex-col justify-between group hover:border-fin-accent/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-bold text-fin-accent uppercase tracking-wider bg-fin-card-secondary px-2.5 py-0.5 rounded-full border border-fin-border">
                      {g.category}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(g._id)}
                      className="p-1.5 text-fin-text-muted hover:text-rose-400 rounded-lg hover:bg-fin-card-secondary transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-fin-text text-base mb-1">{g.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-fin-text-muted mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Target: {formatDate(g.targetDate, 'medium')}</span>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-extrabold text-fin-text">
                      {formatCurrency(g.currentAmount, currency)}
                    </span>
                    <span className="text-xs text-fin-text-muted">
                      of {formatCurrency(g.targetAmount, currency)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="w-full bg-fin-card-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-fin-accent to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, g.percentage)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-fin-text-secondary pt-1">
                      <span>{g.percentage}% funded</span>
                      <span>{formatCurrency(g.remaining, currency)} remaining</span>
                    </div>
                  </div>
                </div>

                {/* Contribution Action Button */}
                <button
                  onClick={() => setContributionGoal(g)}
                  className="w-full py-2 rounded-xl bg-fin-card-secondary hover:bg-fin-card-hover border border-fin-border text-xs font-semibold text-fin-text hover:text-fin-accent transition-colors flex items-center justify-center gap-1.5 mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deposit / Withdraw</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* New Goal Modal */}
      {isNewGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-fin-card border border-fin-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-fin-border">
              <h2 className="text-base font-bold text-fin-text">Establish Vault Allocation Goal</h2>
              <button onClick={() => setIsNewGoalOpen(false)} className="text-fin-text-muted hover:text-fin-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Japan Autumn Discovery"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                    Target ({currency})
                  </label>
                  <input
                    type="number"
                    placeholder="180000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text font-bold focus:border-fin-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                    Initial Deposit
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent cursor-pointer"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Travel">Travel</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Home">Home</option>
                    <option value="Tech">Tech</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewGoalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-fin-text-secondary hover:bg-fin-card-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110"
                >
                  Establish Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit / Withdrawal Modal */}
      {contributionGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-fin-card border border-fin-border rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-fin-border">
              <div>
                <h3 className="font-bold text-fin-text text-sm">Goal Allocation</h3>
                <p className="text-[11px] text-fin-text-muted">{contributionGoal.title}</p>
              </div>
              <button onClick={() => setContributionGoal(null)} className="text-fin-text-muted hover:text-fin-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleContribution} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2 p-1 bg-fin-card-secondary rounded-xl">
                <button
                  type="button"
                  onClick={() => setContribType('deposit')}
                  className={`py-1.5 rounded-lg text-xs font-semibold ${
                    contribType === 'deposit' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-fin-text-secondary'
                  }`}
                >
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => setContribType('withdrawal')}
                  className={`py-1.5 rounded-lg text-xs font-semibold ${
                    contribType === 'withdrawal' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-fin-text-secondary'
                  }`}
                >
                  Withdraw
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Amount ({currency})
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text font-bold focus:border-fin-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Note
                </label>
                <input
                  type="text"
                  placeholder="Monthly savings allocation..."
                  value={contribNote}
                  onChange={(e) => setContribNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setContributionGoal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-fin-text-secondary hover:bg-fin-card-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110"
                >
                  Confirm {contribType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
