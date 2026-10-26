import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coffee,
  Briefcase,
  Zap,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Car,
  HeartPulse,
  MoreHorizontal,
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';
import { formatDate } from '../../utils/date.js';

const getCategoryIcon = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dining') || cat.includes('drink')) return Coffee;
  if (cat.includes('salary') || cat.includes('income')) return Briefcase;
  if (cat.includes('util') || cat.includes('electric') || cat.includes('phone')) return Zap;
  if (cat.includes('shop')) return ShoppingBag;
  if (cat.includes('transport') || cat.includes('uber') || cat.includes('car')) return Car;
  if (cat.includes('health') || cat.includes('gym')) return HeartPulse;
  return Receipt;
};

const getCategoryBadgeStyle = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) {
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }
  if (cat.includes('salary') || cat.includes('income')) {
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  }
  if (cat.includes('util')) {
    return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  }
  if (cat.includes('shop')) {
    return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  }
  return 'bg-fin-card-secondary text-fin-text-secondary border-fin-border';
};

export const RecentTransactions = ({ transactions = [], currency = 'INR' }) => {
  return (
    <div className="fin-glass-card rounded-3xl p-6 lg:p-7 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base lg:text-lg font-bold text-fin-text tracking-tight">
            Live Frosted Ledger
          </h2>
          <p className="text-xs text-fin-text-muted">Real-time synchronized records</p>
        </div>
        <Link
          to="/transactions"
          className="text-xs font-semibold text-fin-accent hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-12 text-center text-fin-text-muted text-xs">
          No recent records in the ledger
        </div>
      ) : (
        <div className="divide-y divide-fin-border/50">
          {transactions.map((tx) => {
            const Icon = getCategoryIcon(tx.category);
            const isIncome = tx.type === 'income';
            const badgeClass = getCategoryBadgeStyle(tx.category);

            return (
              <div
                key={tx._id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-fin-card-secondary/40 px-2 rounded-2xl transition-all"
              >
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-fin-card-secondary text-fin-text-secondary border-fin-border group-hover:border-fin-accent/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-fin-text truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-fin-text-muted truncate">
                        {tx.merchant && tx.merchant !== tx.title ? tx.merchant : formatDate(tx.transactionDate, 'short')}
                      </span>
                      <span className="text-[10px] text-fin-text-muted hidden sm:inline">•</span>
                      <span className="text-[10px] text-fin-text-muted hidden sm:inline">
                        {tx.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Category Badge & Amount */}
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <span
                    className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}
                  >
                    {tx.category}
                  </span>

                  <div>
                    <span
                      className={`text-xs sm:text-sm font-extrabold ${
                        isIncome ? 'text-emerald-400' : 'text-fin-text'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </span>
                    <span className="block text-[10px] text-fin-text-muted sm:hidden">
                      {formatDate(tx.transactionDate, 'short')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
